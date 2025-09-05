import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../shared/QuestionCard';

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function normalizeQuestion(raw) {
  const incorrect = raw.incorrect_answers.map(decodeHtml);
  const correct = decodeHtml(raw.correct_answer);
  const allOptions = [...incorrect, correct].sort(() => Math.random() - 0.5);
  const correctIndex = allOptions.indexOf(correct);
  return {
    id: `${raw.category}-${raw.question}`,
    category: raw.category,
    difficulty: raw.difficulty,
    question: decodeHtml(raw.question),
    options: allOptions,
    correctIndex,
  };
}

export default function QuizPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answers, setAnswers] = useState([]); // per-index entries: { questionId, selectedIndex, correctIndex, isCorrect, question, options }
  const [timeLeft, setTimeLeft] = useState(30);
  const totalTime = 30;
  const [quizStartAt, setQuizStartAt] = useState(null);
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem('quiz_difficulty_v1') || 'any');

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);
  const timerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setError('');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const url = difficulty === 'any' ? API_URL : `${API_URL}&difficulty=${difficulty}`;
        const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        if (!data || !Array.isArray(data.results) || data.results.length === 0) {
          throw new Error('No questions available');
        }
        const normalized = data.results.map(normalizeQuestion);
        if (isMounted) {
          setQuestions(normalized);
          setCurrentIndex(0);
          setSelectedIndex(null);
          setAnswers(new Array(normalized.length).fill(null));
          setTimeLeft(30);
          setQuizStartAt(Date.now());
        }
      } catch (e) {
        if (isMounted) setError(e.name === 'AbortError' ? 'Request timed out' : (e.message || 'Unknown error'));
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [difficulty]);

  useEffect(() => {
    if (!currentQuestion) return;
    clearInterval(timerRef.current);
    setTimeLeft(totalTime);
    setTimeLeft(totalTime);
    // Restore selection if previously answered
    const existing = answers[currentIndex];
    setSelectedIndex(existing && typeof existing.selectedIndex === 'number' && existing.selectedIndex >= 0 ? existing.selectedIndex : null);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoLockAndNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentQuestion]);

  const [isAdvancing, setIsAdvancing] = useState(false);

  function lockAnswer(selectedIndexToLock) {
    const lockedIndex = selectedIndexToLock == null ? -1 : selectedIndexToLock;
    const isCorrect = lockedIndex === currentQuestion.correctIndex;
    return {
      questionId: currentQuestion.id,
      selectedIndex: lockedIndex,
      correctIndex: currentQuestion.correctIndex,
      isCorrect,
      question: currentQuestion.question,
      options: currentQuestion.options,
    };
  }

  function handleLockAndNext() {
    if (isAdvancing) return;
    setIsAdvancing(true);
    if (!currentQuestion) return;
    const entry = lockAnswer(selectedIndex);
    setAnswers(prev => {
      const next = [...prev];
      next[currentIndex] = entry;
      return next;
    });
    setSelectedIndex(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setIsAdvancing(false);
    } else {
      const finalized = [...answers];
      finalized[currentIndex] = entry;
      const compact = finalized.filter(Boolean);
      const score = compact.reduce((acc, a) => acc + (a.isCorrect ? 1 : 0), 0);
      const durationMs = quizStartAt ? Date.now() - quizStartAt : null;
      navigate('/results', { state: { answers: compact, total: questions.length, score, durationMs } });
    }
  }

  function handleAutoLockAndNext() {
    if (!currentQuestion) return;
    const entry = lockAnswer(selectedIndex);
    setAnswers(prev => {
      const next = [...prev];
      next[currentIndex] = entry;
      return next;
    });
    setSelectedIndex(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const compact = [...answers];
      compact[currentIndex] = entry;
      const filtered = compact.filter(Boolean);
      const score = filtered.reduce((acc, a) => acc + (a.isCorrect ? 1 : 0), 0);
      const durationMs = quizStartAt ? Date.now() - quizStartAt : null;
      navigate('/results', { state: { answers: filtered, total: questions.length, score, durationMs } });
    }
  }

  function handleSkip() {
    if (!currentQuestion) return;
    const entry = lockAnswer(-1);
    setAnswers(prev => {
      const next = [...prev];
      next[currentIndex] = entry;
      return next;
    });
    setSelectedIndex(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const compact = [...answers];
      compact[currentIndex] = entry;
      const filtered = compact.filter(Boolean);
      const score = filtered.reduce((acc, a) => acc + (a.isCorrect ? 1 : 0), 0);
      navigate('/results', { state: { answers: filtered, total: questions.length, score } });
    }
  }

  function handleRestart() {
    // simple page reload to reset state and re-fetch
    window.location.href = '/quiz';
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="skeleton" style={{ height: 22, width: '70%', marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 48, marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 48, marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 48, marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 48 }} />
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <div className="skeleton" style={{ height: 40, width: 88 }} />
            <div className="skeleton" style={{ height: 40, width: 88 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="toast">
          <span>Failed to load: {error}</span>
          <button className="secondary" style={{ marginLeft: 8 }} onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div>Question {currentIndex + 1} of {questions.length}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Time left:</span>
          <div
            className="timer-ring"
            role="status"
            aria-label="time remaining"
            style={{
              '--pct': `${(timeLeft / totalTime) * 100}`,
              '--ring': timeLeft <= 5 ? 'var(--danger)' : 'var(--primary)'
            }}
          >
            <span>{timeLeft}s</span>
          </div>
          <select
            aria-label="select difficulty"
            value={difficulty}
            onChange={(e) => { const v = e.target.value; setDifficulty(v); try { localStorage.setItem('quiz_difficulty_v1', v); } catch {} }}
            className="secondary"
            style={{ padding: '6px 10px', borderRadius: 8 }}
          >
            <option value="any">Any</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
      <div className="progress" aria-label="progress" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={currentIndex + 1} role="progressbar">
        <span style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
      </div>
      <QuestionCard
        question={currentQuestion.question}
        options={currentQuestion.options}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />
      <div className="actions">
        <button
          onClick={handleLockAndNext}
          disabled={selectedIndex == null || isAdvancing}
        >
          {currentIndex + 1 === questions.length ? 'Submit' : 'Next'}
        </button>
        <button className="secondary" onClick={handleSkip}>Skip</button>
        <button className="secondary" onClick={handleRestart}>Restart</button>
      </div>
    </div>
  );
}


