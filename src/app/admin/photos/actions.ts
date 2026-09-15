"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function uploadPhoto(formData: FormData) {
  const file = formData.get("file") as File | null;
  const page = String(formData.get("page") ?? "galerie");
  if (!file || file.size === 0) return;

  const supabase = supabaseAdmin();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${page}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
  });
  if (error) throw error;

  await supabase.from("media").insert({ storage_path: path, page, alt: file.name });
  revalidatePath("/admin/photos");
  revalidatePath("/galerie");
  revalidatePath("/");
}

export async function deletePhoto(id: string, storagePath: string) {
  const supabase = supabaseAdmin();
  await supabase.storage.from("media").remove([storagePath]);
  await supabase.from("media").delete().eq("id", id);
  revalidatePath("/admin/photos");
  revalidatePath("/galerie");
  revalidatePath("/");
}
