export default function Logo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" stroke="url(#g)" strokeWidth="2.5" fill="none" />
      <path d="M20.5 21.5c-1.8 1.6-4.6 1.6-6.4 0-1.8-1.6-1.8-4.2 0-5.8 1.8-1.6 4.6-1.6 6.4 0" stroke="url(#g)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="24.5" cy="24.5" r="3" fill="url(#g)" />
    </svg>
  );
}


