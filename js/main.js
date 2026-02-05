/**
 * Aqwarium: точка входа. Загрузка спрайтов, инициализация аквариума и игрового цикла.
 */

import { loadSpritesheet } from './aquarium.js';
import {
  initAquarium,
  renderAquarium,
  updateFishPositions,
  createFishView,
  getCanvasSize,
} from './aquarium.js';
import {
  createGameState,
  startRound,
  advancePhase,
  getCurrentPhase,
  getPhaseLabel,
  getQuestionDisplayGarbled,
  getRoundTimeLeft,
  getLeaderboard,
  getEliminated,
  getAnswersForOverlay,
  runAnswerPhase,
  PHASES,
} from './game.js';
import { getAgentsConfig } from './agents.js';
import { encodeToGarbled } from './cipher.js';

let gameState;
let fishViews = [];
let lastAnswerPhaseRun = false;

/* Ники в стиле molt69xt, m0lty 303, molt_x — базы и приписки */
const MOLT_BASES = ['m0lt', 'molt', 'm0lty', 'molty', 'm0lt', 'molt'];
const MOLT_SUFFIXES = [
  '69xt', ' 303', '_x', 'y2k', '42', '1337', '00', '07', '13', '_7', '_q', 'nx', '404', '69', '2k', ' 69', '_z', 'x7', 'n0',
  '1', '5', '7', 'y', 'x', 'q', 'z', '_nx', '07x', '13x', '69x', '303x', 'n1', '0x', '1n', '5t', '7y', '_0', '4d', '8t'
];
const MOLT_READYMADE = [
  'molt69xt', 'm0lty 303', 'molt_x', 'm0lty2k', 'molt42', 'm0lt1337', 'molty 69', 'm0lt_nx', 'molt07x', 'm0lty2k',
  'molt_n0', 'm0lt404', 'molty13', 'm0lt_z', 'molt69x', 'm0lty07', 'molt_7', 'm0lt2k', 'moltn1', 'm0lt0x'
];

function getRandomMoltNick(used, seed) {
  const all = MOLT_READYMADE.length + MOLT_BASES.length * MOLT_SUFFIXES.length;
  for (let t = 0; t < all; t++) {
    const nick = t < MOLT_READYMADE.length
      ? MOLT_READYMADE[(seed + t) % MOLT_READYMADE.length]
      : MOLT_BASES[(seed + t * 17) % MOLT_BASES.length] + MOLT_SUFFIXES[(seed + t * 31 + 7) % MOLT_SUFFIXES.length];
    if (!used.has(nick)) return nick;
  }
  return `m0lt_${seed}`;
}

function getCanvas() {
  return document.getElementById('aquarium');
}

function initFishViews() {
  const { width, height } = getCanvasSize();
  const agents = getAgentsConfig();
  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2 - 80;
  const ry = height / 2 - 80;
  fishViews = agents.map((a, i) => {
    const angle = (i / agents.length) * Math.PI * 1.2 - Math.PI * 0.4;
    const x = cx + Math.cos(angle) * rx * 0.6;
    const y = cy + Math.sin(angle) * ry * 0.5;
    const goRight = i % 2 === 0;
    const f = createFishView(i, i, x, y, goRight ? 1 : -1);
    f.displayName = a.displayName || a.name;
    f.vx = (goRight ? 1 : -1) * (0.28 + Math.random() * 0.2);
    f.vy = (Math.random() - 0.5) * 0.06;
    return f;
  });
}

function syncFishViewsToState() {
  const agents = getAgentsConfig();
  const phase = getCurrentPhase(gameState);
  gameState.agents.forEach((agent, i) => {
    if (!fishViews[i]) return;
    fishViews[i].dead = agent.dead;
    fishViews[i].foodReserve = agent.foodReserve ?? 0;
    fishViews[i].votes = gameState.votes[agent.id] ?? 0;
    fishViews[i].displayName = agents[i]?.displayName || agent.name;
    if (phase === PHASES.THINK || phase === PHASES.QUESTION) {
      fishViews[i].statusLabel = 'thinking';
    } else if (phase === PHASES.ANSWER || phase === PHASES.VOTE || phase === PHASES.FEED) {
      fishViews[i].statusLabel = gameState.answers[agent.id] != null ? 'answered' : 'thinking';
    } else {
      fishViews[i].statusLabel = null;
    }
  });
}

function updateUI(now) {
  const phaseLabel = document.getElementById('phase-label');
  const questionText = document.getElementById('question-text');
  const roundTimer = document.getElementById('round-timer');
  const leaderboardEl = document.getElementById('leaderboard');

  if (phaseLabel) phaseLabel.textContent = getPhaseLabel(gameState);
  if (questionText) questionText.textContent = getQuestionDisplayGarbled(gameState);
  const sec = getRoundTimeLeft(gameState, now);
  if (roundTimer) roundTimer.textContent = sec > 0 ? `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}` : '—';

  const leaderboard = getLeaderboard(gameState);
  if (leaderboardEl) {
    leaderboardEl.innerHTML = leaderboard
      .map(
        (e) =>
          `<li class="${e.dead ? 'dead' : ''}"><span class="leader-name">${e.displayName}</span><span class="leader-votes">${e.votes}</span></li>`
      )
      .join('');
  }

  const eliminatedEl = document.getElementById('eliminated-list');
  const eliminated = getEliminated(gameState);
  if (eliminatedEl) {
    const slots = 5;
    const list = eliminated.slice(0, slots).map((e) => `<li class="eliminated-nick">${e.displayName}</li>`);
    const used = new Set(eliminated.map((e) => e.displayName));
    while (list.length < slots) {
      const nick = getRandomMoltNick(used, gameState.roundIndex + list.length);
      used.add(nick);
      list.push(`<li class="eliminated-nick">${nick}</li>`);
    }
    eliminatedEl.innerHTML = list.join('');
  }

  const answersListEl = document.getElementById('answers-list');
  if (answersListEl) {
    const answers = getAnswersForOverlay(gameState);
    answersListEl.innerHTML = answers
      .map((a) => `<li class="answer-item"><span class="answer-garbled">${encodeToGarbled(a.text)}</span> <span class="answer-votes">${a.votes} votes</span></li>`)
      .join('');
  }

  const gamesPlayedEl = document.getElementById('games-played');
  if (gamesPlayedEl) gamesPlayedEl.textContent = `Games: ${gameState.roundIndex}`;

  const usaTimeEl = document.getElementById('usa-time');
  if (usaTimeEl) {
    const usa = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    usaTimeEl.textContent = `USA: ${usa}`;
  }

  const sessionTimerEl = document.getElementById('session-timer');
  if (sessionTimerEl && gameState.startedAt) {
    const sec = Math.floor((now - gameState.startedAt) / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    sessionTimerEl.textContent = `Time: ${m}:${String(s).padStart(2, '0')}`;
  }
}

function gameLoop(now = 0) {
  if (!gameState) {
    requestAnimationFrame(gameLoop);
    return;
  }

  advancePhase(gameState, now);

  if (gameState.phase === PHASES.ANSWER && !lastAnswerPhaseRun) {
    lastAnswerPhaseRun = true;
    runAnswerPhase(gameState).then(() => {});
  }
  if (gameState.phase !== PHASES.ANSWER) {
    lastAnswerPhaseRun = false;
  }

  if (gameState.phase === PHASES.IDLE && gameState.nextRoundAt && now >= gameState.nextRoundAt) {
    startRound(gameState, now);
  }
  if (gameState.phase === PHASES.IDLE && !gameState.nextRoundAt && gameState.roundIndex === 0) {
    startRound(gameState, now);
  }

  syncFishViewsToState();
  updateFishPositions(fishViews, 1);
  renderAquarium({ fishViews, gameState });
  updateUI(now);

  requestAnimationFrame(gameLoop);
}

async function main() {
  const canvas = getCanvas();
  if (!canvas) return;

  await loadSpritesheet();
  initAquarium(canvas);
  initFishViews();
  gameState = createGameState();

  gameLoop(0);
}

main().catch(console.error);
