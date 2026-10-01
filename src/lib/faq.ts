import { supabasePublic } from "./supabase-public";
import { supabaseAdmin } from "./supabase-admin";

export type FaqEntry = {
  id: string;
  category: string;
  question: string;
  answer: string;
  /** Comma-separated search keywords (used by the public FAQ search box). */
  keywords: string;
  sort_order: number;
  published: boolean;
};

export async function getFaqEntries(opts?: { publishedOnly?: boolean }): Promise<FaqEntry[]> {
  const publishedOnly = opts?.publishedOnly ?? true;
  // RLS only lets the anon key read published=true rows; an admin listing
  // that explicitly wants drafts too needs the service role.
  const supabase = publishedOnly ? supabasePublic() : supabaseAdmin();
  let query = supabase.from("faq_entries").select("*").order("sort_order", { ascending: true });
  if (publishedOnly) query = query.eq("published", true);
  const { data } = await query;
  return (data as FaqEntry[]) ?? [];
}
