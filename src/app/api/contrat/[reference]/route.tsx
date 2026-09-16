import { supabaseAdmin } from "@/lib/supabase-admin";
import { leadReference } from "@/lib/lead-reference";
import { generateContractPdf } from "@/app/admin/(dashboard)/actions";

export async function GET(_req: Request, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const supabase = supabaseAdmin();
  const { data: leads } = await supabase.from("leads").select("id");
  const match = (leads ?? []).find((l) => leadReference(l.id).toLowerCase() === reference.toLowerCase());
  if (!match) return new Response("Contrat introuvable", { status: 404 });

  const { base64, filename } = await generateContractPdf(match.id);
  const buffer = Buffer.from(base64, "base64");

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
