"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "./login/actions";

function Icon({ name }: { name: string }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (name) {
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="m21 15-5-5L6 20" />
        </svg>
      );
    case "message":
      return (
        <svg {...common}>
          <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "help":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.3a2.5 2.5 0 0 1 4.8 1c0 1.7-2.3 2-2.3 3.5" />
          <path d="M12 17.5h.01" />
        </svg>
      );
    default:
      return null;
  }
}

const adminNav = [
  { label: "Demandes", href: "/admin", icon: "mail" },
  { label: "Pages & SEO", href: "/admin/pages", icon: "home" },
  { label: "Photos", href: "/admin/photos", icon: "image" },
  { label: "Avis", href: "/admin/avis", icon: "message" },
  { label: "FAQ", href: "/admin/faq", icon: "help" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-black/5 bg-[var(--background)] p-6">
      <div>
        <p className="font-serif text-lg leading-tight text-[var(--foreground)]">Domaine de la Bégude</p>
        <p className="mt-0.5 text-xs uppercase tracking-wide text-[var(--foreground)]/40">Back-office</p>
      </div>

      <nav className="mt-8 flex flex-col gap-0.5">
        {adminNav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-[var(--accent)]/10 font-medium text-[var(--accent)]"
                  : "text-[var(--foreground)]/75 hover:bg-black/5"
              }`}
            >
              <span className={active ? "text-[var(--accent)]" : "text-[var(--foreground)]/40"}>
                <Icon name={item.icon} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-black/5 pt-5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-[var(--foreground)]/60 hover:text-[var(--accent)]"
        >
          ↗ Voir le site
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-[var(--foreground)]/40 hover:text-[var(--foreground)]">
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}
