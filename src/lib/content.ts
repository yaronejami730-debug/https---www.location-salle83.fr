import { supabasePublic } from "./supabase-public";

export async function getPageContent(slug: string) {
  const supabase = supabasePublic();
  const { data } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
  return data as {
    hero_title: string | null;
    hero_description: string | null;
    seo_title: string | null;
    seo_description: string | null;
    content: Record<string, string> | null;
  } | null;
}

export async function getFaqs(page = "home") {
  const supabase = supabasePublic();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("page", page)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getReviews() {
  const supabase = supabasePublic();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getMedia(page: string) {
  const supabase = supabasePublic();
  const { data } = await supabase
    .from("media")
    .select("*")
    .eq("page", page)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return data ?? [];
}
