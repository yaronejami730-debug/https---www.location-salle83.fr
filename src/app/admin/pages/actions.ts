"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getSchema } from "@/lib/page-schemas";

export async function savePageContent(
  slug: string,
  content: Record<string, string>,
  seo: { title: string; description: string },
) {
  const schema = getSchema(slug);
  if (!schema) return;

  const cleaned: Record<string, string> = {};
  for (const field of schema.fields) {
    const value = (content[field.key] ?? "").trim();
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
