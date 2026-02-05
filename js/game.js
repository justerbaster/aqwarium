/**
 * Игровой цикл: вопрос каждые 5 минут, фазы (вопрос → раздумие → ответы в хаосе → голосование → еда).
 * Здоровье: запас раундов; смерть после 2 раундов подряд без еды.
 */

import { getAgentsConfig, getAgentAnswer, runVoting } from './agents.js';
import { encodeToGlyphBlocks, encodeToGarbled } from './cipher.js';

// Обратный таймер 2 минуты до следующего раунда
const ROUND_INTERVAL_MS = 2 * 60 * 1000;
const PHASE_QUESTION_MS = 2000;
const PHASE_THINK_MS = 2500;
const PHASE_ANSWER_MS = 6000;
const PHASE_VOTE_MS = 4000;
const PHASE_FEED_MS = 2500;

export const PHASES = {
  QUESTION: 'question',
  THINK: 'think',
  ANSWER: 'answer',
  VOTE: 'vote',
  FEED: 'feed',
  IDLE: 'idle',
};

const QUESTIONS = [
  'What is water?',
  'Why do fish swim?',
  'What is the meaning of the aquarium?',
  'Is there life outside the tank?',
  'What do you fear most?',
];

/** Порции за место: 1-е = запас 2 раунда, 2-е = 2 порции, 3–5 = 1 порция, 0 голосов = 0 */
function getFoodForPlace(place, totalAgents) {
  if (place === 0) return 2; // запас на 2 раунда
  if (place === 1) return 2;
  return 1;
}

export function createGameState() {
  const agents = getAgentsConfig().map((a, i) => ({
    id: a.id,
    name: a.name,
    foodReserve: 2, // стартовый запас: 2 раунда
    dead: false,
    spriteIndex: i,
  }));
  return {
    phase: PHASES.IDLE,
    phaseEndAt: 0,
    roundIndex: 0,
    startedAt: Date.now(),
    question: '',
    questionEncoded: '',
    questionEncodedGarbled: '',
    answers: {},
    answerOrder: [],
    votes: {},
    foodResult: {},
    agents,
    nextRoundAt: 0,
  };
}

function getAliveAgentIds(state) {
  return state.agents.filter(a => !a.dead).map(a => a.id);
}

function placeByVotes(state) {
  const alive = getAliveAgentIds(state);
  return [...alive].sort((a, b) => (state.votes[b] || 0) - (state.votes[a] || 0));
}

export function getCurrentPhase(state) {
  return state.phase;
}

export function getPhaseLabel(state) {
  const labels = {
    [PHASES.QUESTION]: 'Question',
    [PHASES.THINK]: 'Thinking',
    [PHASES.ANSWER]: 'Answers',
    [PHASES.VOTE]: 'Voting',
    [PHASES.FEED]: 'Feed',
    [PHASES.IDLE]: '—',
  };
  return labels[state.phase] || '—';
}

export function getQuestionDisplay(state) {
  return state.questionEncoded || '';
}

export function getQuestionDisplayGarbled(state) {
  return state.questionEncodedGarbled || state.questionEncoded || '';
}

export function getRoundTimeLeft(state, now = Date.now()) {
  if (state.phase === PHASES.IDLE && state.nextRoundAt) {
    return Math.max(0, Math.ceil((state.nextRoundAt - now) / 1000));
  }
  if (state.phaseEndAt) {
    return Math.max(0, Math.ceil((state.phaseEndAt - now) / 1000));
  }
  return 0;
}

/** Запуск раунда: показать вопрос */
export function startRound(state, now = Date.now()) {
  const alive = getAliveAgentIds(state);
  if (alive.length < 2) {
    state.phase = PHASES.IDLE;
    state.nextRoundAt = now + 10000;
    return state;
  }
  state.roundIndex += 1;
  state.question = QUESTIONS[(state.roundIndex - 1) % QUESTIONS.length];
  state.questionEncoded = encodeToGlyphBlocks(state.question);
  state.questionEncodedGarbled = encodeToGarbled(state.question);
  state.answers = {};
  state.answerOrder = [];
  state.votes = {};
  state.foodResult = {};
  state.phase = PHASES.QUESTION;
  state.phaseEndAt = now + PHASE_QUESTION_MS;
  return state;
}

/** Переход фазы по таймеру */
export function advancePhase(state, now = Date.now()) {
  if (state.phase !== PHASES.IDLE && state.phaseEndAt && now < state.phaseEndAt) {
    return state;
  }

  const alive = getAliveAgentIds(state);

  switch (state.phase) {
    case PHASES.QUESTION:
      state.phase = PHASES.THINK;
      state.phaseEndAt = now + PHASE_THINK_MS;
      break;
    case PHASES.THINK:
      state.phase = PHASES.ANSWER;
      state.phaseEndAt = now + PHASE_ANSWER_MS;
      state.answerOrder = [...alive].sort(() => Math.random() - 0.5);
      break;
    case PHASES.ANSWER:
      state.phase = PHASES.VOTE;
      state.phaseEndAt = now + PHASE_VOTE_MS;
      if (Object.keys(state.answers).length === 0) {
        state.votes = {};
        alive.forEach(id => { state.votes[id] = 0; });
      } else {
        state.votes = runVoting(alive, state.answers);
      }
      break;
    case PHASES.VOTE:
      state.phase = PHASES.FEED;
      state.phaseEndAt = now + PHASE_FEED_MS;
      const order = placeByVotes(state);
      order.forEach((agentId, place) => {
        const portions = getFoodForPlace(place, alive.length);
        state.foodResult[agentId] = portions;
        const agent = state.agents.find(a => a.id === agentId);
        if (agent) agent.foodReserve = (agent.foodReserve || 0) + portions;
      });
      state.agents.forEach(agent => {
        if (agent.dead) return;
        const got = state.foodResult[agent.id] ?? 0;
        if (got === 0) {
          agent.foodReserve = (agent.foodReserve || 1) - 1;
          if (agent.foodReserve <= 0) agent.dead = true;
        }
      });
      break;
    case PHASES.FEED:
      state.phase = PHASES.IDLE;
      state.nextRoundAt = now + ROUND_INTERVAL_MS;
      state.phaseEndAt = 0;
      break;
    default:
      if (state.nextRoundAt && now >= state.nextRoundAt) {
        startRound(state, now);
      }
      break;
  }
  return state;
}

/** Вызвать когда агент должен отправить ответ (в фазе ANSWER) */
export async function submitAnswer(state, agentId, answerText) {
  if (state.phase !== PHASES.ANSWER) return state;
  state.answers[agentId] = answerText;
  return state;
}

/** Запуск генерации ответов всеми живыми агентами в хаотичном порядке */
export async function runAnswerPhase(state) {
  const order = state.answerOrder || getAliveAgentIds(state).sort(() => Math.random() - 0.5);
  for (const agentId of order) {
    const agent = state.agents.find(a => a.id === agentId);
    if (!agent || agent.dead) continue;
    const answer = await getAgentAnswer(agentId, state.question);
    state.answers[agentId] = answer;
  }
  return state;
}

export function getAnswersForOverlay(state) {
  const list = [];
  const agents = getAgentsConfig();
  (state.answerOrder || Object.keys(state.answers)).forEach(agentId => {
    const text = state.answers[agentId];
    if (text == null) return;
    const agent = agents[agentId];
    list.push({
      agentId: Number(agentId),
      name: agent?.name ?? agentId,
      text,
      encoded: encodeToGlyphBlocks(text),
      votes: state.votes[agentId] ?? 0,
    });
  });
  return list;
}

export function getFishStatusForHud(state) {
  return state.agents.map(a => ({
    id: a.id,
    name: a.name,
    dead: a.dead,
    foodReserve: a.foodReserve ?? 0,
  }));
}

/** Никнейм в стиле m0lt / molt с цифрами (displayName из конфига). */
function getDisplayName(agentsConfig, agentId) {
  const c = agentsConfig[agentId];
  return c?.displayName ?? c?.name ?? String(agentId);
}

/** Лидерборд: живые по убыванию голосов (с никами), затем мёртвые. */
export function getLeaderboard(state) {
  const agents = getAgentsConfig();
  const aliveOrder = placeByVotes(state);
  const deadIds = state.agents.filter(a => a.dead).map(a => a.id);
  const list = aliveOrder.map((agentId, index) => ({
    place: index + 1,
    id: agentId,
    displayName: getDisplayName(agents, agentId),
    votes: state.votes[agentId] ?? 0,
    dead: false,
  }));
  deadIds.forEach((agentId) => {
    list.push({
      place: list.length + 1,
      id: agentId,
      displayName: getDisplayName(agents, agentId),
      votes: state.votes[agentId] ?? 0,
      dead: true,
    });
  });
  return list;
}

/** Выбывшие агенты: только мёртвые, с никами в стиле m0lt. */
export function getEliminated(state) {
  const agents = getAgentsConfig();
  return state.agents
    .filter(a => a.dead)
    .map(a => ({ id: a.id, displayName: getDisplayName(agents, a.id) }));
}
