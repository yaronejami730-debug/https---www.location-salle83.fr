"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getSchema } from "@/lib/page-schemas";
import { sanitizeRichText } from "@/lib/sanitize-html";
import type { PricingBracket } from "@/lib/pricing";

export async function savePageContent(
  slug: string,
  content: Record<string, string>,
  seo: { title: string; description: string },
) {
  const schema = getSchema(slug);
  if (!schema) return;

  const supabase = supabaseAdmin();
  // Read-merge-write: a client that loaded the page before a field existed in
  // this schema (stale tab, concurrent editor) never has that key in `content`
  // at all — skip it instead of wiping it out, same fix as the Paramètres
  // data-loss bug. Only a key the submitting client actually has is touched.
  const { data: existingRow } = await supabase.from("pages").select("content").eq("slug", slug).maybeSingle();
  const merged: Record<string, string> = { ...((existingRow?.content as Record<string, string> | null) ?? {}) };
  for (const field of schema.fields) {
    if (!(field.key in content)) continue;
    const value = sanitizeRichText((content[field.key] ?? "").trim());
    if (value) merged[field.key] = value;
    else delete merged[field.key];
  }

  const { error } = await supabase.from("pages").upsert({
    slug,
    content: merged,
    seo_title: seo.title.trim() || null,
    seo_description: seo.description.trim() || null,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`Échec de l'enregistrement : ${error.message}`);

  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${slug}`);
  revalidatePath(slug === "home" ? "/" : `/${slug}`);
}

export async function savePricingBrackets(brackets: PricingBracket[]) {
  const supabase = supabaseAdmin();

  const rows = brackets
    .filter((b) => b.label.trim() && b.maxGuests > 0)
    .map((b, i) => ({
      key: b.key || String(b.maxGuests),
      label: b.label.trim(),
      max_guests: b.maxGuests,
      salle: b.salle,
      lendemain: b.lendemain,
      piscine: b.piscine,
      vaisselle: b.vaisselle,
      cuisine: b.cuisine,
      sort_order: i,
    }));

  const { error: deleteError } = await supabase.from("pricing_brackets").delete().not("id", "is", null);
  if (deleteError) throw new Error(`Échec de l'enregistrement de la grille tarifaire : ${deleteError.message}`);

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("pricing_brackets").insert(rows);
    if (insertError) throw new Error(`Échec de l'enregistrement de la grille tarifaire : ${insertError.message}`);
  }

  revalidatePath("/admin/pages/seminaire");
  revalidatePath("/seminaire");
  revalidatePath("/contact");
}
