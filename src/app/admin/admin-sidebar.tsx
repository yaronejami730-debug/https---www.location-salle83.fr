"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "./login/actions";

const adminNav = [
  { label: "Demandes", href: "/admin", icon: "📩" },
  { label: "Pages & SEO", href: "/admin/pages", icon: "🏠" },
  { label: "Photos", href: "/admin/photos", icon: "🖼️" },
  { label: "Avis", href: "/admin/avis", icon: "💬" },
  { label: "FAQ", href: "/admin/faq", icon: "❓" },
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
              <span className="text-base leading-none">{item.icon}</span>
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
