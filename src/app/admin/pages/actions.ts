"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function savePage(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;

  const supabase = supabaseAdmin();
  await supabase.from("pages").upsert({
    slug,
    hero_title: String(formData.get("hero_title") ?? "").trim() || null,
    hero_description: String(formData.get("hero_description") ?? "").trim() || null,
    seo_title: String(formData.get("seo_title") ?? "").trim() || null,
    seo_description: String(formData.get("seo_description") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/admin/pages");
  revalidatePath(slug === "home" ? "/" : `/${slug}`);
}
