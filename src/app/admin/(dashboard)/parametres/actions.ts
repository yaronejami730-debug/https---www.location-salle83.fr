"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function saveSettings(formData: FormData) {
  const supabase = supabaseAdmin();
  const content = {
    tagline: String(formData.get("tagline") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
  };

  await supabase.from("pages").upsert({
    slug: "global",
    content,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/parametres");
}
