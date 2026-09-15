"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function addReview(formData: FormData) {
  const supabase = supabaseAdmin();
  await supabase.from("reviews").insert({
    author: String(formData.get("author") ?? "").trim(),
    rating: Number(formData.get("rating") ?? 5),
    text: String(formData.get("text") ?? "").trim(),
  });
  revalidatePath("/admin/avis");
  revalidatePath("/");
}

export async function deleteReview(id: string) {
  const supabase = supabaseAdmin();
  await supabase.from("reviews").delete().eq("id", id);
  revalidatePath("/admin/avis");
  revalidatePath("/");
}

export async function toggleReviewPublished(id: string, published: boolean) {
  const supabase = supabaseAdmin();
  await supabase.from("reviews").update({ published }).eq("id", id);
  revalidatePath("/admin/avis");
  revalidatePath("/");
}
