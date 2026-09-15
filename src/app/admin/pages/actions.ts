"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getSchema } from "@/lib/page-schemas";

export async function savePage(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const schema = getSchema(slug);
  if (!slug || !schema) return;

  const content: Record<string, string> = {};
  for (const field of schema.fields) {
    const value = String(formData.get(field.key) ?? "").trim();
    if (value) content[field.key] = value;
  }

  const supabase = supabaseAdmin();
  await supabase.from("pages").upsert({
    slug,
    content,
    seo_title: String(formData.get("seo_title") ?? "").trim() || null,
    seo_description: String(formData.get("seo_description") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/admin/pages");
  revalidatePath(slug === "home" ? "/" : `/${slug}`);
}
