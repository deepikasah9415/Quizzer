export default function QuestionCard({ question, options, selectedIndex, onSelect }) {
  function handleKeyDown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = selectedIndex == null ? 0 : (selectedIndex + 1) % options.length;
      onSelect(next);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = selectedIndex == null ? options.length - 1 : (selectedIndex - 1 + options.length) % options.length;
      onSelect(prev);
    } else if (e.key === 'Enter' && selectedIndex != null) {
      // no-op: selection is already updated, submit handled by parent
    }
  }
  return (
    <div className="card">
      <div className="question" aria-live="polite">{question}</div>
      <div className="divider" />
      <div className="options" role="listbox" aria-label="answer options" tabIndex={0} onKeyDown={handleKeyDown}>
        {options.map((opt, idx) => (
          <button
            key={idx}
            role="option"
            aria-selected={selectedIndex === idx}
            className={`option ${selectedIndex === idx ? 'selected' : ''}`}
            onClick={() => onSelect(idx)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}


