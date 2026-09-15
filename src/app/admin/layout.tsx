import { AdminSidebar } from "./admin-sidebar";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--background-muted)]">
      <AdminSidebar />
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
