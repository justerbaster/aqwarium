/**
 * 5 агентов (рыб): один LLM, разные промпты/роли/стратегии.
 * Пока — mock-ответы; позже подключить бесплатную открытую LLM.
 */

const AGENT_CONFIG = [
  { id: 0, name: 'blue', displayName: 'm0lt1', role: 'Философ', strategy: 'кратко и абстрактно' },
  { id: 1, name: 'brown', displayName: 'molt5', role: 'Учёный', strategy: 'факты и логика' },
  { id: 2, name: 'green', displayName: 'm0lt69xt', role: 'Поэт', strategy: 'образно и метафорично' },
  { id: 3, name: 'orange', displayName: 'molt404', role: 'Практик', strategy: 'конкретно и по делу' },
  { id: 4, name: 'pink', displayName: 'm0lt 303', role: 'Скептик', strategy: 'критично и с вопросами' },
];

const MOCK_ANSWERS = [
  'Вода держит нас. Без неё — пустота.',
  'Кислород и водород. Два атома и один. Наука.',
  'Как река, что течёт сквозь сны.',
  'Плавать, пить, жить. Вот что важно.',
  'А кто сказал, что мы не сон этой воды?',
];

/** Возвращает конфиг всех агентов */
export function getAgentsConfig() {
  return AGENT_CONFIG;
}

/** Генерирует ответ агента на вопрос. Пока mock — случайный из набора или по индексу. */
export async function getAgentAnswer(agentId, question, _allAnswersSoFar = []) {
  await new Promise(r => setTimeout(r, 300 + Math.random() * 400)); // имитация "раздумия"
  const config = AGENT_CONFIG[agentId];
  const base = MOCK_ANSWERS[agentId % MOCK_ANSWERS.length];
  return `${base} [${config.role}]`;
}

/** Голосование: каждый агент выбирает лучший ответ (не свой). Возвращает { agentId: countVotes } */
export function runVoting(agentIds, answers) {
  const votes = {};
  agentIds.forEach(id => { votes[id] = 0; });
  agentIds.forEach(voterId => {
    const others = agentIds.filter(id => id !== voterId);
    if (others.length === 0) return;
    const choice = others[Math.floor(Math.random() * others.length)];
    votes[choice] = (votes[choice] || 0) + 1;
  });
  return votes;
}

/** Детерминированное голосование на основе «качества» (для теста можно заменить на вызов LLM). */
export function runVotingByQuality(agentIds, answers, question) {
  const votes = {};
  agentIds.forEach(id => { votes[id] = 0; });
  agentIds.forEach(voterId => {
    const others = agentIds.filter(id => id !== voterId);
    if (others.length === 0) return;
    const sorted = [...others].sort((a, b) => (answers[b]?.length || 0) - (answers[a]?.length || 0));
    const choice = sorted[0];
    votes[choice] = (votes[choice] || 0) + 1;
  });
  return votes;
}
