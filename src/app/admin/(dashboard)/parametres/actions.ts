"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function saveSettings(formData: FormData) {
  const supabase = supabaseAdmin();

  // Read-merge-write: this "global" row also holds fields saved elsewhere
  // (slideshow_audio_path from the Photos/Galerie admin) — overwriting it
  // wholesale here silently deletes those. This exact bug shipped once
  // already; never repeat it on this row.
  const { data: row } = await supabase.from("pages").select("content").eq("slug", "global").maybeSingle();
  const content = {
    ...(row?.content as Record<string, string> | undefined),
    tagline: String(formData.get("tagline") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    cta_title: String(formData.get("cta_title") ?? "").trim(),
    cta_text: String(formData.get("cta_text") ?? "").trim(),
    cta_button: String(formData.get("cta_button") ?? "").trim(),
  };

  await supabase.from("pages").upsert({
    slug: "global",
    content,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/parametres");
}
