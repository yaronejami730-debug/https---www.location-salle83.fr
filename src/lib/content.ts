import { supabasePublic } from "./supabase-public";
import { siteConfig } from "./site";

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

export async function getSiteSettings() {
  const supabase = supabasePublic();
  const { data } = await supabase.from("pages").select("content").eq("slug", "global").maybeSingle();
  const content = (data?.content as Record<string, string>) ?? {};
  return {
    tagline: content.tagline || siteConfig.tagline,
    phone: content.phone || siteConfig.phone,
    email: content.email || siteConfig.email,
  };
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
