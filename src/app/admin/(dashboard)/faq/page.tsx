import { getFaqEntries } from "@/lib/faq";
import { FaqEditor } from "./faq-editor";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const entries = await getFaqEntries({ publishedOnly: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">FAQ</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">
        Les questions affichées sur la page Faq du site — modifiez, recatégorisez, ajoutez ou retirez-en librement.
      </p>

      <FaqEditor initialEntries={entries} />
    </div>
  );
}
