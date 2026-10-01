"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { FaqEntry } from "@/lib/faq";

export async function saveFaqEntries(entries: FaqEntry[]) {
  const supabase = supabaseAdmin();

  const rows = entries
    .filter((e) => e.question.trim())
    .map((e, i) => ({
      category: e.category.trim() || "Général",
      question: e.question.trim(),
      answer: e.answer.trim(),
      keywords: e.keywords.trim(),
      published: e.published,
      sort_order: i,
    }));

  const { error: deleteError } = await supabase.from("faq_entries").delete().not("id", "is", null);
  if (deleteError) throw new Error(`Échec de l'enregistrement des FAQ : ${deleteError.message}`);

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("faq_entries").insert(rows);
    if (insertError) throw new Error(`Échec de l'enregistrement des FAQ : ${insertError.message}`);
  }

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  revalidatePath("/");
}
