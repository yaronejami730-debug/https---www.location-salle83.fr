"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sanitizeRichText } from "@/lib/sanitize-html";

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(supabase: ReturnType<typeof supabaseAdmin>, base: string, excludeId?: string): Promise<string> {
  const root = base || "article";
  let candidate = root;
  let n = 2;
  for (;;) {
    let query = supabase.from("blog_posts").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    candidate = `${root}-${n}`;
    n++;
  }
}

export async function createPost(title: string) {
  const supabase = supabaseAdmin();
  const trimmedTitle = title.trim() || "Nouvel article";
  const base = slugify(trimmedTitle) || "article";
  const slug = await uniqueSlug(supabase, base);

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ title: trimmedTitle, slug, body: "", color: "#8a6d3b", published: false, sort_order: nextOrder })
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("Échec de la création de l'article");

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect(`/admin/blog/${data.id}`);
}

export async function updatePost(
  id: string,
  patch: { title?: string; body?: string; color?: string; slug?: string },
) {
  const supabase = supabaseAdmin();
  const { data: before } = await supabase.from("blog_posts").select("slug").eq("id", id).maybeSingle();

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.title !== undefined) {
    const title = patch.title.trim();
    if (title) update.title = title;
  }
  if (patch.body !== undefined) update.body = sanitizeRichText(patch.body);
  if (patch.color !== undefined) update.color = patch.color;
  if (patch.slug !== undefined) {
    const slug = patch.slug.trim().toLowerCase();
    if (!slug || !SLUG_RE.test(slug)) {
      throw new Error("Le slug doit être non vide et composé uniquement de lettres minuscules, chiffres et tirets.");
    }
    update.slug = slug;
  }

  const { error } = await supabase.from("blog_posts").update(update).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
  if (before?.slug) revalidatePath(`/blog/${before.slug}`);
  if (typeof update.slug === "string") revalidatePath(`/blog/${update.slug}`);
}

export async function deletePost(id: string) {
  const supabase = supabaseAdmin();
  const { data: post } = await supabase.from("blog_posts").select("slug").eq("id", id).maybeSingle();

  const page = `blog-${id}`;
  const { data: mediaRows } = await supabase.from("media").select("id, storage_path").eq("page", page);
  if (mediaRows && mediaRows.length > 0) {
    await supabase.storage.from("media").remove(mediaRows.map((m) => m.storage_path));
    await supabase.from("media").delete().eq("page", page);
  }

  await supabase.from("blog_posts").delete().eq("id", id);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (post?.slug) revalidatePath(`/blog/${post.slug}`);
}

export async function togglePublished(id: string, published: boolean) {
  const supabase = supabaseAdmin();
  const { data: post } = await supabase.from("blog_posts").select("slug").eq("id", id).maybeSingle();

  await supabase.from("blog_posts").update({ published }).eq("id", id);

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
  if (post?.slug) revalidatePath(`/blog/${post.slug}`);
}

export async function reorderPosts(ids: string[]) {
  const supabase = supabaseAdmin();
  await Promise.all(ids.map((id, index) => supabase.from("blog_posts").update({ sort_order: index }).eq("id", id)));
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
