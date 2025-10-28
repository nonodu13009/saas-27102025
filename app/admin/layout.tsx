"use client";

export const dynamic = 'force-dynamic';

import Image from "next/image";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { RouteGuard } from "@/components/auth/route-guard";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      router.push("/login");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <RouteGuard allowedRoles={["ADMINISTRATEUR"]}>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <AdminSidebar onLogout={handleLogout} />

        {/* Main content */}
        <div className="ml-64">
          {/* Header */}
          <header className="border-b bg-card sticky top-0 z-30">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/allianz.svg"
                  alt="Allianz"
                  width={100}
                  height={26}
                  className="h-6 w-auto brightness-0 dark:brightness-100"
                />
                <h1 className="text-xl font-bold">Dashboard Administrateur</h1>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="container mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}

