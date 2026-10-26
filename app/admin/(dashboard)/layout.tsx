import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth/admin-guard";
import { Logo } from "@/components/brand/Logo";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogOut, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-dvh flex flex-col bg-[#090909] text-white">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[#141414] transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#1c1c1c] px-3 py-1 text-xs text-[#0099ff] font-medium">
              <Shield className="h-3 w-3" />
              <span>Admin Desk</span>
            </span>

            {/* Navigation Links */}
            <AdminNav />
          </div>

          {/* Right Profile & Logout */}
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-xs text-[#999999]">
              {session.email}
            </span>

            <form action="/api/admin/auth/logout" method="POST">
              <button
                type="submit"
                className="btn-secondary !px-3.5 !py-1.5 text-xs text-[#999999] hover:text-white"
                title="Sign out of admin session"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Admin View */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

