import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import { useEffect } from 'react';
import Navbar from './components/Navbar';

function App() {
  useEffect(() => {
    const saved = localStorage.getItem('theme_pref_v1');
    const initial = saved || 'light';
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/quiz" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
