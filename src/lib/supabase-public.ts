import { createClient } from "@supabase/supabase-js";

// Next.js patches the global fetch() to cache GET requests by default — including
// ones made by supabase-js under the hood. That caching isn't scoped to a page
// route, so calls made from a Server Action (e.g. the contract PDF preview) never
// get invalidated by revalidatePath() and can serve stale data indefinitely.
// Opting every request out of that cache keeps reads live.
const noStoreFetch: typeof fetch = (input, init) => fetch(input, { ...init, cache: "no-store" });

export function supabasePublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false }, global: { fetch: noStoreFetch } },
  );
}

export function mediaUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;
}
