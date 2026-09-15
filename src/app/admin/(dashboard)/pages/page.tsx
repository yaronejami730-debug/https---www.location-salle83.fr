import Link from "next/link";
import { pageSchemas } from "@/lib/page-schemas";

export default function AdminPagesIndex() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">Pages & SEO</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">
        Cliquez sur une page pour l&apos;éditer directement, comme sur le site.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {pageSchemas.map((s) => (
          <Link
            key={s.slug}
            href={`/admin/pages/${s.slug}`}
            className="group flex aspect-square flex-col justify-between rounded-2xl border border-black/5 bg-[var(--background)] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:shadow-md"
          >
            <div>
              <p className="font-serif text-xl leading-tight text-[var(--foreground)]">{s.label}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.fields.slice(0, 3).map((f) => (
                  <span key={f.key} className="rounded-full bg-[var(--background-muted)] px-2 py-0.5 text-[10px] text-[var(--foreground)]/60">
                    {f.label}
                  </span>
                ))}
                {s.fields.length > 3 && (
                  <span className="rounded-full bg-[var(--background-muted)] px-2 py-0.5 text-[10px] text-[var(--foreground)]/40">
                    +{s.fields.length - 3}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--foreground)]/50">{s.fields.length} champs éditables</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--background-muted)] text-[var(--foreground)]/50 transition-colors group-hover:bg-[var(--accent)] group-hover:text-white">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
