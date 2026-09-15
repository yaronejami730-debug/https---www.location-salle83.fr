"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function addFaq(formData: FormData) {
  const supabase = supabaseAdmin();
  await supabase.from("faqs").insert({
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    page: String(formData.get("page") ?? "home"),
  });
  revalidatePath("/admin/faq");
  revalidatePath("/");
}

export async function deleteFaq(id: string) {
  const supabase = supabaseAdmin();
  await supabase.from("faqs").delete().eq("id", id);
  revalidatePath("/admin/faq");
  revalidatePath("/");
}

export async function toggleFaqPublished(id: string, published: boolean) {
  const supabase = supabaseAdmin();
  await supabase.from("faqs").update({ published }).eq("id", id);
  revalidatePath("/admin/faq");
  revalidatePath("/");
}
