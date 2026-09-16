"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { watermarkImage } from "@/lib/watermark";

export async function uploadPhoto(formData: FormData) {
  const file = formData.get("file") as File | null;
  const page = String(formData.get("page") ?? "galerie");
  if (!file || file.size === 0) return;

  const supabase = supabaseAdmin();
  const path = `${page}/${crypto.randomUUID()}.jpg`;
  const watermarked = await watermarkImage(Buffer.from(await file.arrayBuffer()));

  const { error } = await supabase.storage.from("media").upload(path, watermarked, {
    contentType: "image/jpeg",
  });
  if (error) throw error;

  const { data: existing } = await supabase
    .from("media")
    .select("sort_order")
    .eq("page", page)
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  await supabase.from("media").insert({ storage_path: path, page, alt: file.name, sort_order: nextOrder });
  revalidatePath("/", "layout");
}

export async function reorderPhoto(id: string, page: string, direction: "up" | "down") {
  const supabase = supabaseAdmin();
  const { data: items } = await supabase
    .from("media")
    .select("id, sort_order")
    .eq("page", page)
    .order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const target = items[swapIndex];

  await supabase.from("media").update({ sort_order: target.sort_order }).eq("id", current.id);
  await supabase.from("media").update({ sort_order: current.sort_order }).eq("id", target.id);

  revalidatePath("/", "layout");
}

export async function reorderPhotos(page: string, orderedIds: string[]) {
  const supabase = supabaseAdmin();
  await Promise.all(orderedIds.map((id, index) => supabase.from("media").update({ sort_order: index }).eq("id", id)));
  revalidatePath("/", "layout");
}

export async function deletePhoto(id: string, storagePath: string) {
  const supabase = supabaseAdmin();
  await supabase.storage.from("media").remove([storagePath]);
  await supabase.from("media").delete().eq("id", id);
  revalidatePath("/", "layout");
}

export async function replacePhoto(id: string, oldStoragePath: string, page: string, formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return;

  const supabase = supabaseAdmin();
  const newPath = `${page}/${crypto.randomUUID()}.jpg`;
  const watermarked = await watermarkImage(Buffer.from(await file.arrayBuffer()));

  const { error } = await supabase.storage.from("media").upload(newPath, watermarked, { contentType: "image/jpeg" });
  if (error) throw error;

  await supabase.from("media").update({ storage_path: newPath, alt: file.name }).eq("id", id);
  await supabase.storage.from("media").remove([oldStoragePath]);

  revalidatePath("/", "layout");
}
