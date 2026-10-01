import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { PostEditor } from "./post-editor";

export const dynamic = "force-dynamic";

export default async function AdminBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = supabaseAdmin();

  const [{ data: post }, { data: media }] = await Promise.all([
    supabase.from("blog_posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("media").select("*").eq("page", `blog-${id}`).order("sort_order", { ascending: true }),
  ]);

  if (!post) notFound();

  return <PostEditor post={post} media={media ?? []} />;
}
