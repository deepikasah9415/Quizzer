export default function ThemeToggle() {
  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme_pref_v1', next); } catch {}
  }
  const label = (document.documentElement.getAttribute('data-theme') || 'light') === 'light' ? 'Dark' : 'Light';
  return (
    <button className="secondary" onClick={toggle} aria-label="Toggle theme">{label} mode</button>
  );
}


