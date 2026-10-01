"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { renderToBuffer } from "@react-pdf/renderer";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { computeQuote, getPricingBrackets, getChapiteauUnitPrice } from "@/lib/pricing";
import { ContractPdfDocument } from "@/lib/contract-pdf";
import { resolveClauses, hasPageBreak } from "@/lib/contract-template";

export async function saveContractContent(content: Record<string, string>) {
  const supabase = supabaseAdmin();
  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(content)) {
    const trimmed = value.trim();
    if (trimmed) cleaned[key] = trimmed;
  }

  const { error } = await supabase.from("pages").upsert({ slug: "contrat", content: cleaned, updated_at: new Date().toISOString() });
  if (error) throw new Error(`Échec de l'enregistrement : ${error.message}`);
  revalidatePath("/admin/contrat");
}

/** Renders a preview PDF against sample lead data — this editor has no real lead attached, it's the template. */
export async function previewContractPdf(content: Record<string, string>): Promise<string> {
  const [pricingBrackets, chapiteauUnitPrice] = await Promise.all([getPricingBrackets(), getChapiteauUnitPrice()]);
  const bracket = pricingBrackets[Math.min(2, pricingBrackets.length - 1)];
  const quote = computeQuote(
    { guestCount: bracket.maxGuests, lendemain: true, piscine: true, vaisselle: true, cuisine: true, chapiteauCount: 1 },
    pricingBrackets,
    chapiteauUnitPrice,
  )!;

  let logoDataUri: string | null = null;
  try {
    const logoBuffer = await readFile(path.join(process.cwd(), "public/images/logo.png"));
    logoDataUri = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch {
    logoDataUri = null;
  }

  const buffer = await renderToBuffer(
    <ContractPdfDocument
      reference="APERCU-0000"
      civility="Monsieur"
      fullName="Jean Dupont (exemple)"
      address="12 rue des Oliviers, 83440 Fayence"
      phone="+33 6 12 34 56 78"
      email="jean.dupont@exemple.fr"
      eventDate="15/06/2026"
      guestCount={bracket.maxGuests}
      bracket={bracket}
      lineItems={[
        { label: "Accès le lendemain", amount: bracket.lendemain },
        { label: "Accès piscine", amount: bracket.piscine },
        { label: "Vaisselle complète", amount: bracket.vaisselle },
        { label: "Cuisine professionnelle", amount: bracket.cuisine },
        { label: "Chapiteau x1", amount: chapiteauUnitPrice },
      ]}
      total={quote.total}
      arrhes={quote.arrhes}
      logoDataUri={logoDataUri}
      qrCodeDataUri={null}
      options={{ lendemain: true, piscine: true, vaisselle: true, cuisine: true, chapiteauCount: 1 }}
      chapiteauUnitPrice={chapiteauUnitPrice}
      clauses={resolveClauses(content)}
      clause1PageBreak={hasPageBreak(content, "clause1")}
      signaturePageBreak={hasPageBreak(content, "signature")}
    />,
  );

  return buffer.toString("base64");
}
