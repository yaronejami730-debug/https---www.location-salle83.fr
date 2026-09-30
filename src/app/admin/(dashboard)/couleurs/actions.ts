"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { THEME_DEFAULTS } from "@/lib/content";

const HEX = /^#[0-9a-fA-F]{6}$/;

export async function saveTheme(formData: FormData) {
  const supabase = supabaseAdmin();

  const content: Record<string, string> = {};
  for (const key of Object.keys(THEME_DEFAULTS)) {
    const value = String(formData.get(key) ?? "").trim();
    content[key] = HEX.test(value) ? value : THEME_DEFAULTS[key as keyof typeof THEME_DEFAULTS];
  }

  await supabase.from("pages").upsert({
    slug: "theme",
    content,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/couleurs");
}

export async function resetTheme() {
  const supabase = supabaseAdmin();

  await supabase.from("pages").upsert({
    slug: "theme",
    content: THEME_DEFAULTS,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/couleurs");
}
