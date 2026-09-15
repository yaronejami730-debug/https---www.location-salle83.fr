import { supabaseAdmin } from "@/lib/supabase-admin";
import { addFaq } from "./actions";
import { FaqRow } from "./faq-row";

export default async function AdminFaqPage() {
  const supabase = supabaseAdmin();
  const { data: faqs } = await supabase.from("faqs").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">FAQ</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">Affichée sur la page d&apos;accueil et utilisée par le chatbot.</p>

      <form action={addFaq} className="mt-8 max-w-xl space-y-4 rounded-2xl border border-black/5 bg-[var(--background)] p-6">
        <input type="hidden" name="page" value="home" />
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Question</label>
          <input name="question" required className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Réponse</label>
          <textarea name="answer" required rows={3} className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm" />
        </div>
        <button type="submit" className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm text-white hover:opacity-90">
          Ajouter
        </button>
      </form>

      <div className="mt-8 max-w-xl space-y-3">
        {(faqs ?? []).map((faq) => (
          <FaqRow key={faq.id} faq={faq} />
        ))}
        {(faqs ?? []).length === 0 && <p className="text-sm text-[var(--foreground)]/50">Aucune question pour le moment.</p>}
      </div>
    </div>
  );
}
