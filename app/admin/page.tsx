"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Settings, TrendingUp, Award } from "lucide-react";

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bienvenue</h2>
        <p className="text-muted-foreground">
          Gestion de l&apos;application Allianz
        </p>
      </div>

      {/* Cards de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compagnies
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Compagnies système actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Gestion à venir
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Performances
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Statistiques à venir
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Guide rapide */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Gérer les différents aspects de l&apos;application
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Gérer les compagnies</h3>
              <p className="text-sm text-muted-foreground">
                Ajouter, modifier ou supprimer des compagnies
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
