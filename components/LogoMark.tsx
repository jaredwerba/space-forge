export default function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="lmMoon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8ebf2" />
          <stop offset="1" stopColor="#8a909e" />
        </linearGradient>
      </defs>
      <rect
        width="32"
        height="32"
        rx="7"
        fill="#0c0f1a"
        stroke="rgba(154,165,196,0.35)"
      />
      <circle cx="13.5" cy="19.5" r="7.5" fill="url(#lmMoon)" />
      <circle cx="11.5" cy="17.5" r="1.6" fill="#7d8595" />
      <circle cx="16" cy="21.5" r="1.1" fill="#7d8595" />
      <line
        x1="26"
        y1="5"
        x2="14.5"
        y2="18.5"
        stroke="#5ee6ff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="14" cy="19" r="2" fill="#ff9a3d" />
    </svg>
  );
}
