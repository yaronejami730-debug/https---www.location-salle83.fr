import { loginAction } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background-muted)] px-6">
      <form action={loginAction} className="w-full max-w-sm rounded-2xl border border-black/5 bg-[var(--background)] p-8">
        <h1 className="font-serif text-2xl text-[var(--foreground)]">Back-office</h1>
        <p className="mt-1 text-sm text-[var(--foreground)]/60">Domaine de la Bégude</p>

        <label className="mt-6 block text-sm text-[var(--foreground)]/80">Mot de passe</label>
        <input
          type="password"
          name="password"
          autoFocus
          className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 text-sm"
        />

        {error && <p className="mt-3 text-sm text-red-600">Mot de passe incorrect.</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm text-white hover:opacity-90"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
