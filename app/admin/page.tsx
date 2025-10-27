"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2, Settings } from "lucide-react";
import { RouteGuard } from "@/components/auth/route-guard";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminPage() {
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
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/allianz.svg"
                alt="Allianz"
                width={100}
                height={26}
                className="h-6 w-auto"
              />
              <h1 className="text-xl font-bold">Dashboard Administrateur</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={handleLogout}
                size="sm"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="companies">
              <Building2 className="mr-2 h-4 w-4" />
              Compagnies
            </TabsTrigger>
            <TabsTrigger value="rules">
              <Settings className="mr-2 h-4 w-4" />
              Règles de commissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Activer, désactiver ou modifier les rôles des utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Liste des utilisateurs à implémenter
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des compagnies</CardTitle>
                <CardDescription>
                  Ajouter, modifier ou supprimer des compagnies d'assurance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Liste des compagnies à implémenter
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Règles de commissions</CardTitle>
                <CardDescription>
                  Gérer les règles de calcul des commissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Configuration des règles à implémenter
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      </div>
    </RouteGuard>
  );
}

