const HIGHSCORES_KEY = 'quiz_highscores_v1';

export function getHighScores() {
  try {
    const raw = localStorage.getItem(HIGHSCORES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    return [];
  }
}

export function saveHighScore(entry) {
  const list = getHighScores();
  const withNew = [...list, { ...entry, createdAt: Date.now() }];
  withNew.sort((a, b) => b.score - a.score || a.total - b.total || a.createdAt - b.createdAt);
  const top = withNew.slice(0, 10);
  try {
    localStorage.setItem(HIGHSCORES_KEY, JSON.stringify(top));
  } catch {}
  return top;
}


