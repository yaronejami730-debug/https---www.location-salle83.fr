import "server-only";
import { createClient } from "@supabase/supabase-js";

// See supabase-public.ts for why: Next.js caches fetch() GETs by default, including
// supabase-js's, in a way revalidatePath() doesn't reach from a Server Action.
const noStoreFetch: typeof fetch = (input, init) => fetch(input, { ...init, cache: "no-store" });

export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false }, global: { fetch: noStoreFetch } },
  );
}
