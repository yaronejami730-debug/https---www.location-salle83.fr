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

export const CTA_DEFAULTS = {
  ctaTitle: "Parlons de votre projet",
  ctaText: "Recevez une proposition personnalisée sous 48h.",
  ctaButton: "Parlons de votre projet",
};

export async function getSiteSettings() {
  const supabase = supabasePublic();
  const { data } = await supabase.from("pages").select("content").eq("slug", "global").maybeSingle();
  const content = (data?.content as Record<string, string>) ?? {};
  return {
    tagline: content.tagline || siteConfig.tagline,
    phone: content.phone || siteConfig.phone,
    email: content.email || siteConfig.email,
    ctaTitle: content.cta_title || CTA_DEFAULTS.ctaTitle,
    ctaText: content.cta_text || CTA_DEFAULTS.ctaText,
    ctaButton: content.cta_button || CTA_DEFAULTS.ctaButton,
  };
}

export const THEME_DEFAULTS = {
  background: "#fefdfb",
  backgroundMuted: "#eef0e5",
  foreground: "#2b2a26",
  accent: "#6b7d5f",
  accentWarm: "#b17a4a",
};

export async function getThemeColors() {
  const supabase = supabasePublic();
  const { data } = await supabase.from("pages").select("content").eq("slug", "theme").maybeSingle();
  const content = (data?.content as Record<string, string>) ?? {};
  return {
    background: content.background || THEME_DEFAULTS.background,
    backgroundMuted: content.backgroundMuted || THEME_DEFAULTS.backgroundMuted,
    foreground: content.foreground || THEME_DEFAULTS.foreground,
    accent: content.accent || THEME_DEFAULTS.accent,
    accentWarm: content.accentWarm || THEME_DEFAULTS.accentWarm,
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
