"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { pricingBrackets, CHAPITEAU_UNIT_PRICE } from "@/lib/pricing";
import { leadReference } from "@/lib/lead-reference";
import { siteConfig } from "@/lib/site";
import { ContractPdfDocument } from "@/lib/contract-pdf";

export async function updateLeadStatus(id: string, status: string) {
  const supabase = supabaseAdmin();
  await supabase.from("leads").update({ status }).eq("id", id);
  revalidatePath("/admin");
}

export async function generateContractPdf(leadId: string, extra: { eventDateOverride: string } = { eventDateOverride: "" }) {
  const supabase = supabaseAdmin();
  const { data: lead, error } = await supabase.from("leads").select("*").eq("id", leadId).single();
  if (error || !lead) throw new Error("lead_not_found");

  const bracket = pricingBrackets.find((b) => b.key === lead.pricing_bracket) ?? pricingBrackets[0];

  const lineItems: { label: string; amount: number }[] = [];
  if (lead.option_lendemain) lineItems.push({ label: "Accès le lendemain", amount: bracket.lendemain });
  if (lead.option_piscine) lineItems.push({ label: "Accès piscine", amount: bracket.piscine });
  if (lead.option_vaisselle) lineItems.push({ label: "Vaisselle complète", amount: bracket.vaisselle });
  if (lead.option_cuisine) lineItems.push({ label: "Cuisine professionnelle", amount: bracket.cuisine });
  if (lead.option_chapiteau_count > 0) {
    lineItems.push({
      label: `Chapiteau x${lead.option_chapiteau_count}`,
      amount: lead.option_chapiteau_count * CHAPITEAU_UNIT_PRICE,
    });
  }

  const total = lead.estimated_total ?? bracket.salle;
  const arrhes = Math.round(total * 0.5);

  let logoDataUri: string | null = null;
  try {
    const logoBuffer = await readFile(path.join(process.cwd(), "public/images/logo.png"));
    logoDataUri = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch {
    logoDataUri = null;
  }

  const reference = leadReference(lead.id);
  let qrCodeDataUri: string | null = null;
  try {
    qrCodeDataUri = await QRCode.toDataURL(`${siteConfig.appUrl}/api/contrat/${reference}`, { margin: 1, width: 200 });
  } catch {
    qrCodeDataUri = null;
  }

  const buffer = await renderToBuffer(
    <ContractPdfDocument
      reference={reference}
      civility={lead.civility ? lead.civility.charAt(0).toUpperCase() + lead.civility.slice(1) : ""}
      fullName={lead.full_name}
      address={lead.address ?? ""}
      phone={lead.phone}
      email={lead.email}
      eventDate={extra.eventDateOverride || lead.event_date || ""}
      guestCount={lead.guest_count ?? 0}
      bracket={bracket}
      lineItems={lineItems}
      total={total}
      arrhes={arrhes}
      logoDataUri={logoDataUri}
      qrCodeDataUri={qrCodeDataUri}
      options={{
        lendemain: lead.option_lendemain,
        piscine: lead.option_piscine,
        vaisselle: lead.option_vaisselle,
        cuisine: lead.option_cuisine,
        chapiteauCount: lead.option_chapiteau_count ?? 0,
      }}
    />,
  );

  return { base64: buffer.toString("base64"), filename: `contrat-${reference}.pdf` };
}
