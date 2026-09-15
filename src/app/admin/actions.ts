"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function updateLeadStatus(id: string, status: string) {
  const supabase = supabaseAdmin();
  await supabase.from("leads").update({ status }).eq("id", id);
  revalidatePath("/admin");
}
