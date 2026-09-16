import { supabaseAdmin } from "@/lib/supabase-admin";
import { leadReference } from "@/lib/lead-reference";
import { LeadStatusSelect } from "./lead-status-select";
import { GenerateContractButton } from "./generate-contract-button";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = supabaseAdmin();
  const { data: allLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const query = (q ?? "").trim().toLowerCase();
  const leads = query
    ? (allLeads ?? []).filter(
        (lead) =>
          leadReference(lead.id).toLowerCase().includes(query) ||
          lead.full_name?.toLowerCase().includes(query) ||
          lead.email?.toLowerCase().includes(query) ||
          lead.phone?.toLowerCase().includes(query),
      )
    : allLeads ?? [];

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">Demandes</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">{leads.length} demande(s) reçue(s)</p>

      <form className="mt-4 max-w-sm">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Rechercher par n° de demande, nom, email, téléphone…"
          className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm"
        />
      </form>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-black/5 bg-[var(--background)]">
        <table className="w-full min-w-[1000px] text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-[var(--foreground)]/60">
              <th className="px-4 py-3 font-medium">N°</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Événement</th>
              <th className="px-4 py-3 font-medium">Invités</th>
              <th className="px-4 py-3 font-medium">Options</th>
              <th className="px-4 py-3 font-medium">Estimation</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Contrat</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-black/5 last:border-0 align-top">
                <td className="px-4 py-3 font-mono text-xs text-[var(--foreground)]/70">{leadReference(lead.id)}</td>
                <td className="px-4 py-3 text-[var(--foreground)]/70">
                  {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 capitalize">{lead.event_type}</td>
                <td className="px-4 py-3">{lead.full_name}</td>
                <td className="px-4 py-3 text-[var(--foreground)]/70">
                  <div>{lead.email}</div>
                  <div>{lead.phone}</div>
                </td>
                <td className="px-4 py-3 text-[var(--foreground)]/70">{lead.event_date ?? "—"}</td>
                <td className="px-4 py-3 text-[var(--foreground)]/70">{lead.guest_count ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-[var(--foreground)]/70">
                  {[
                    lead.option_lendemain && "Lendemain",
                    lead.option_piscine && "Piscine",
                    lead.option_vaisselle && "Vaisselle",
                    lead.option_cuisine && "Cuisine",
                    lead.option_chapiteau_count > 0 && `${lead.option_chapiteau_count} chapiteau(x)`,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </td>
                <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                  {lead.estimated_total ? `${lead.estimated_total} €` : "—"}
                </td>
                <td className="px-4 py-3">
                  <LeadStatusSelect id={lead.id} status={lead.status} />
                </td>
                <td className="px-4 py-3">
                  <GenerateContractButton leadId={lead.id} />
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center text-[var(--foreground)]/50">
                  Aucune demande pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
