const common = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons: Record<string, React.ReactNode> = {
  wifi: (
    <svg {...common}>
      <path d="M3.5 8.5a13 13 0 0 1 17 0" />
      <path d="M6.5 12a9 9 0 0 1 11 0" />
      <path d="M9.5 15.5a5 5 0 0 1 5 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  parking: (
    <svg {...common}>
      <rect x="4.5" y="3" width="15" height="18" rx="2.5" />
      <path d="M9.5 16.5V7h3a2.75 2.75 0 0 1 0 5.5H9.5" />
    </svg>
  ),
  pool: (
    <svg {...common}>
      <path d="M4 8h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z" />
      <path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8" />
      <path d="M2.5 19c1 .7 2 .7 3 0s2-.7 3 0 2 .7 3 0 2-.7 3 0 2 .7 3 0 2-.7 3 0" />
    </svg>
  ),
  paw: (
    <svg {...common}>
      <ellipse cx="12" cy="16.2" rx="4.2" ry="3.4" />
      <ellipse cx="6.2" cy="10.5" rx="1.7" ry="2.1" transform="rotate(-20 6.2 10.5)" />
      <ellipse cx="10" cy="7.2" rx="1.7" ry="2.1" transform="rotate(-6 10 7.2)" />
      <ellipse cx="14" cy="7.2" rx="1.7" ry="2.1" transform="rotate(6 14 7.2)" />
      <ellipse cx="17.8" cy="10.5" rx="1.7" ry="2.1" transform="rotate(20 17.8 10.5)" />
    </svg>
  ),
  child: (
    <svg {...common}>
      <circle cx="9" cy="6" r="2" />
      <path d="M5 19v-5.5L3.5 10a1.2 1.2 0 0 1 2.2-1l1.5 3h3.6l1.5-3a1.2 1.2 0 0 1 2.2 1L13 13.5V19" />
      <path d="M7 19v-3h4v3" />
      <circle cx="18" cy="15" r="2.5" />
      <path d="M18 12.5V8" />
    </svg>
  ),
  restaurant: (
    <svg {...common}>
      <path d="M7 2.5v8.5M5 2.5v5.5a2 2 0 0 0 4 0V2.5" />
      <path d="M7 11v11" />
      <path d="M17 2.5c-1.4 0-2.5 1.8-2.5 5s1.1 5 2.5 5V22" />
    </svg>
  ),
  kitchen: (
    <svg {...common}>
      <path d="M4 21V10L12 3l8 7v11" />
      <path d="M4 13h16" />
      <circle cx="8.5" cy="17" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="17" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  fitness: (
    <svg {...common}>
      <rect x="2.5" y="10" width="3" height="4" rx="0.8" />
      <rect x="18.5" y="10" width="3" height="4" rx="0.8" />
      <path d="M5.5 12h13" />
      <rect x="5" y="9" width="1.6" height="6" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="17.4" y="9" width="1.6" height="6" rx="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
};

export function AmenityIcon({ name }: { name: keyof typeof icons }) {
  return icons[name] ?? null;
}
