import Link from "next/link";
import { pageSchemas } from "@/lib/page-schemas";

export default function AdminPagesIndex() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">Pages & SEO</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">
        Cliquez sur une page pour l&apos;éditer directement, comme sur le site.
      </p>

      <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
        {pageSchemas.map((s) => (
          <Link
            key={s.slug}
            href={`/admin/pages/${s.slug}`}
            className="rounded-2xl border border-black/5 bg-[var(--background)] p-6 transition-colors hover:border-[var(--accent)]/40"
          >
            <p className="font-serif text-lg text-[var(--foreground)]">{s.label}</p>
            <p className="mt-1 text-xs text-[var(--foreground)]/50">{s.fields.length} champs éditables →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
