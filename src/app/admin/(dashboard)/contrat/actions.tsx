"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { renderToBuffer } from "@react-pdf/renderer";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { computeQuote, getPricingBrackets, getChapiteauUnitPrice, getExtraOptions } from "@/lib/pricing";
import { ContractPdfDocument } from "@/lib/contract-pdf";
import { resolveClauses, resolveClause1, hasPageBreak } from "@/lib/contract-template";

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
  const [pricingBrackets, chapiteauUnitPrice, extraOptions] = await Promise.all([getPricingBrackets(), getChapiteauUnitPrice(), getExtraOptions()]);
  const sampleExtra = extraOptions[0];
  const bracket = pricingBrackets[Math.min(2, pricingBrackets.length - 1)];
  const quote = computeQuote(
    { guestCount: bracket.maxGuests, lendemain: true, piscine: true, vaisselle: true, cuisine: true, chapiteauCount: 1, extraIds: sampleExtra ? [sampleExtra.id] : [] },
    pricingBrackets,
    chapiteauUnitPrice,
    extraOptions,
  )!;
  const clause1 = resolveClause1(content);

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
      allBrackets={pricingBrackets}
      lineItems={[
        { label: "Accès le lendemain", amount: bracket.lendemain },
        { label: "Accès piscine", amount: bracket.piscine },
        { label: "Vaisselle complète", amount: bracket.vaisselle },
        { label: "Cuisine professionnelle", amount: bracket.cuisine },
        { label: "Chapiteau x1", amount: chapiteauUnitPrice },
        ...(sampleExtra ? [{ label: sampleExtra.label, amount: sampleExtra.price }] : []),
      ]}
      total={quote.total}
      arrhes={quote.arrhes}
      logoDataUri={logoDataUri}
      qrCodeDataUri={null}
      options={{ lendemain: true, piscine: true, vaisselle: true, cuisine: true, chapiteauCount: 1 }}
      chapiteauUnitPrice={chapiteauUnitPrice}
      extraOptions={extraOptions}
      extraIds={sampleExtra ? [sampleExtra.id] : []}
      clause1Title={clause1.title}
      clause1Intro={clause1.intro}
      clauses={resolveClauses(content)}
      clause1PageBreak={hasPageBreak(content, "clause1")}
      signaturePageBreak={hasPageBreak(content, "signature")}
    />,
  );

  return buffer.toString("base64");
}
