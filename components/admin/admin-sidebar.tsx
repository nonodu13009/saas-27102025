"use client";

import { Home, Building2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  onLogout: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin",
      label: "Accueil",
      icon: Home,
      exact: true,
    },
    {
      href: "/admin/companies",
      label: "Compagnies",
      icon: Building2,
    },
  ];

  return (
    <aside className="w-64 border-r bg-card h-screen fixed left-0 top-0 z-40">
      <div className="flex flex-col h-full">
        {/* Logo et titre */}
        <div className="p-6 border-b shrink-0">
          <h2 className="text-lg font-bold text-foreground">Dashboard Admin</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? pathname === item.href
              : pathname?.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-primary/10 hover:bg-primary/20"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Déconnexion */}
        <div className="mt-auto p-4 border-t shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </div>
    </aside>
  );
}

