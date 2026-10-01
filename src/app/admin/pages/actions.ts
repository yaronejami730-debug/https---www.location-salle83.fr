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

  const cleaned: Record<string, string> = {};
  for (const field of schema.fields) {
    const value = sanitizeRichText((content[field.key] ?? "").trim());
    if (value) cleaned[field.key] = value;
  }

  const supabase = supabaseAdmin();
  await supabase.from("pages").upsert({
    slug,
    content: cleaned,
    seo_title: seo.title.trim() || null,
    seo_description: seo.description.trim() || null,
    updated_at: new Date().toISOString(),
  });

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

  await supabase.from("pricing_brackets").delete().not("id", "is", null);
  if (rows.length > 0) await supabase.from("pricing_brackets").insert(rows);

  revalidatePath("/admin/pages/seminaire");
  revalidatePath("/seminaire");
  revalidatePath("/contact");
}
