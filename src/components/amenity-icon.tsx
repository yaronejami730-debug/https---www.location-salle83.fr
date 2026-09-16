const common = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons: Record<string, React.ReactNode> = {
  wifi: (
    <svg {...common}>
      <path d="M2 8.5a16 16 0 0 1 20 0" />
      <path d="M5.5 12.5a11 11 0 0 1 13 0" />
      <path d="M9 16.3a5.5 5.5 0 0 1 6 0" />
      <path d="M12 20h.01" />
    </svg>
  ),
  parking: (
    <svg {...common}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9.5 16V7.5h3.2a2.5 2.5 0 1 1 0 5H9.5" />
    </svg>
  ),
  pool: (
    <svg {...common}>
      <path d="M3 17.5c1.2-1 2.4-1 3.6 0s2.4 1 3.6 0 2.4-1 3.6 0 2.4 1 3.6 0 2.4-1 3.6 0" />
      <path d="M7 13V6a2 2 0 0 1 2-2h2l6 6" />
      <path d="M7 13h10" />
    </svg>
  ),
  paw: (
    <svg {...common}>
      <circle cx="7" cy="9" r="1.6" />
      <circle cx="12" cy="6.5" r="1.6" />
      <circle cx="17" cy="9" r="1.6" />
      <path d="M8 15c-2 0-3 1.6-3 3.2 0 1.4 1.1 2.3 2.5 2.3.9 0 1.6-.4 2.5-.4s1.6.4 2.5.4c.9 0 1.6-.4 2.5-.4s1.6.9 2.5.4c1.4 0 2.5-.9 2.5-2.3 0-1.6-1-3.2-3-3.2-1.6 0-2-.8-4-.8s-2.4.8-4 .8Z" />
    </svg>
  ),
  child: (
    <svg {...common}>
      <circle cx="12" cy="5" r="2" />
      <path d="M7 21v-6H5l2.5-6.5A2 2 0 0 1 9.4 7h5.2a2 2 0 0 1 1.9 1.5L19 15h-2v6" />
      <path d="M9 15v6" />
      <path d="M15 15v6" />
    </svg>
  ),
  restaurant: (
    <svg {...common}>
      <path d="M6 3v7a2 2 0 0 0 2 2v9" />
      <path d="M6 3v4M9 3v4" />
      <path d="M17 3c-1.5 0-2.5 1.5-2.5 4s1 4 2.5 4v10" />
    </svg>
  ),
  kitchen: (
    <svg {...common}>
      <path d="M4 21V9l4-6h8l4 6v12" />
      <path d="M4 12h16" />
      <path d="M9 16h.01M13 16h.01" />
    </svg>
  ),
  fitness: (
    <svg {...common}>
      <path d="M6.5 8v8M17.5 8v8" />
      <path d="M4 10v4M20 10v4" />
      <path d="M6.5 12h11" />
    </svg>
  ),
};

export function AmenityIcon({ name }: { name: keyof typeof icons }) {
  return icons[name] ?? null;
}
