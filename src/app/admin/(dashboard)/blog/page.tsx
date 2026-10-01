import { getBlogPosts } from "@/lib/blog";
import { NewPostForm } from "./new-post-form";
import { PostList } from "./post-list";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts({ publishedOnly: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">Blog</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">
        Un article n&apos;est visible sur le site tant qu&apos;il n&apos;est pas publié.
      </p>

      <div className="mt-8 max-w-xl">
        <NewPostForm />
      </div>

      <div className="mt-8 max-w-xl">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
