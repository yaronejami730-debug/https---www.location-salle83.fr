import { supabasePublic } from "./supabase-public";
import { supabaseAdmin } from "./supabase-admin";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  body: string; // sanitized rich HTML, same convention as other page content fields
  color: string; // hex string e.g. "#8a6d3b"
  published: boolean;
  sort_order: number;
  created_at: string;
};

export async function getBlogPosts(opts?: { publishedOnly?: boolean }): Promise<BlogPost[]> {
  const publishedOnly = opts?.publishedOnly ?? true;
  // RLS only lets the anon key read published=true rows, so an explicit
  // publishedOnly:false (admin use, to see drafts too) needs the service role.
  const supabase = publishedOnly ? supabasePublic() : supabaseAdmin();
  let query = supabase.from("blog_posts").select("*").order("sort_order", { ascending: true });
  if (publishedOnly) query = query.eq("published", true);
  const { data } = await query;
  return (data as BlogPost[]) ?? [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = supabasePublic();
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  return (data as BlogPost | null) ?? null;
}
