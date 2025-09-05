import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getHighScores, saveHighScore } from '../shared/storage';

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const answers = state.answers || [];
  const total = state.total || answers.length;
  const score = state.score ?? answers.filter(a => a.isCorrect).length;
  const durationMs = state.durationMs;
  const [highScores, setHighScores] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (total > 0) {
      const updated = saveHighScore({ score, total });
      setHighScores(updated);
    } else {
      setHighScores(getHighScores());
    }
  }, [score, total]);

  const best = useMemo(() => {
    if (!highScores.length) return null;
    return highScores[0];
  }, [highScores]);

  function formatDuration(ms) {
    if (!ms && ms !== 0) return '—';
    const s = Math.floor(ms / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  function handleRestart() {
    navigate('/quiz', { replace: true });
  }

  if (!answers.length) {
    return (
      <div className="container">
        <div className="card">
          <p>No results to show.</p>
          <button onClick={handleRestart}>Start Quiz</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>🎯 You scored {score}/{total}</h2>
        <div style={{ color: 'var(--muted)', marginBottom: 12 }}>Duration: {formatDuration(durationMs)}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleRestart}>Restart Quiz</button>
        </div>
      </div>

      {best && (
        <div className="card" id="best">
          <h3>🏆 Best score so far</h3>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{best.score}/{best.total}</div>
          <div style={{ color: 'var(--muted)' }}>{best.createdAt ? new Date(best.createdAt).toLocaleString() : ''}</div>
          <div style={{ marginTop: 10 }}>
            <button className="secondary" onClick={() => setShowHistory(s => !s)}>{showHistory ? 'Hide' : 'Show'} history</button>
          </div>
          {showHistory && (
            <div style={{ marginTop: 10 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>#</th>
                    <th style={{ textAlign: 'left' }}>Score</th>
                    <th style={{ textAlign: 'left' }}>When</th>
                  </tr>
                </thead>
                <tbody>
                  {highScores.map((h, i) => (
                    <tr key={h.createdAt || i}>
                      <td>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                      <td>{h.score}/{h.total}</td>
                      <td>{h.createdAt ? new Date(h.createdAt).toLocaleString() : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h3>🧾 Summary</h3>
        <ul className="list">
          {answers.map((a, idx) => {
            const correctText = a.options[a.correctIndex];
            const selectedText = a.selectedIndex >= 0 ? a.options[a.selectedIndex] : 'No selection';
            return (
              <li key={a.questionId} className={`list-item ${a.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="q">{a.isCorrect ? '✅' : '❌'} {idx + 1}. {a.question}</div>
                <div className="detail"><strong>Your answer:</strong> {selectedText}</div>
                <div className="detail"><strong>Correct answer:</strong> {correctText}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}


