import { AdminSidebar } from "./admin-sidebar";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--background-muted)]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden p-10">{children}</main>
    </div>
  );
}
