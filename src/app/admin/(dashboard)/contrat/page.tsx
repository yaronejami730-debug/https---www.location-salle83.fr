import { supabaseAdmin } from "@/lib/supabase-admin";
import { ContractEditor } from "./contract-editor";

export default async function AdminContratPage() {
  const supabase = supabaseAdmin();
  const { data: row } = await supabase.from("pages").select("content").eq("slug", "contrat").maybeSingle();
  const content = (row?.content as Record<string, string>) ?? {};

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">Contrat de location</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">
        Texte des clauses du PDF envoyé aux clients. Le tableau de tarifs, les informations client et la signature restent calculés
        automatiquement — seul le texte ci-dessous est modifiable. Utilisez « Mettre à jour l&apos;aperçu » pour voir le résultat
        avant d&apos;enregistrer (l&apos;aperçu utilise un dossier d&apos;exemple, pas un vrai client).
      </p>

      <ContractEditor initialContent={content} />
    </div>
  );
}
