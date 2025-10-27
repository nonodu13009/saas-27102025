"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DollarSign, TrendingUp, FileText, Award, Plus } from "lucide-react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { calculateKPI } from "@/lib/utils/kpi";
import Image from "next/image";
import { toast } from "sonner";
import { Act } from "@/types";

export default function DashboardPage() {
  const [acts, setActs] = useState<Act[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );

  useEffect(() => {
    loadActs();
  }, [selectedMonth]);

  const loadActs = async () => {
    setIsLoading(true);
    try {
      // Pour l'instant, on utilise des données mockées
      const mockActs: Act[] = [
        {
          id: "1",
          userId: "user1",
          kind: "AN",
          clientNom: "Dupont Jean",
          numeroContrat: "CT001",
          contratType: "AUTO_MOTO",
          compagnie: "Allianz",
          dateEffet: new Date("2025-01-15"),
          dateSaisie: new Date(),
          primeAnnuelle: 500,
          commissionPotentielle: 10,
          moisKey: "2025-01",
        },
      ];
      setActs(mockActs);
    } catch {
      toast.error("Erreur lors du chargement des actes");
    } finally {
      setIsLoading(false);
    }
  };

  const kpi = calculateKPI(acts);

  const timelineDays = generateTimeline(selectedMonth);

  return (
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
            <h1 className="text-xl font-bold">Dashboard Commercial</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Sélecteur mensuel */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Label htmlFor="month">Mois</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[200px]" id="month">
                <SelectValue placeholder="Sélectionnez un mois" />
              </SelectTrigger>
              <SelectContent>
                {generateMonthOptions().map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-[#00529B] hover:bg-[#003d73]">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel acte
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="CA Mensuel"
            value={`${kpi.caMensuel.toFixed(2)} €`}
            icon={DollarSign}
          />
          <KPICard
            title="CA Auto"
            value={`${kpi.caAuto.toFixed(2)} €`}
            subtitle={`${kpi.caAutres.toFixed(2)} € autres`}
            icon={TrendingUp}
          />
          <KPICard
            title="Ratio"
            value={`${kpi.ratio.toFixed(1)}%`}
            icon={FileText}
          />
          <KPICard
            title="Commissions"
            value={`${kpi.commissionsPotentielles.toFixed(2)} €`}
            subtitle={kpi.commissionValidee ? "Validées" : "Potentielles"}
            icon={Award}
            trend={kpi.commissionValidee ? "up" : "neutral"}
          />
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>
              Visualisation des actes sur le mois sélectionné
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {timelineDays.map((day, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center p-3 rounded-lg min-w-[80px] ${
                      day.isSaturday ? "bg-orange-100 dark:bg-orange-900/20" :
                      day.isSunday ? "bg-red-100 dark:bg-red-900/20" :
                      "bg-muted"
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {format(day.date, "EEE", { locale: fr }).substring(0, 3)}
                    </span>
                    <span className="text-2xl font-bold">
                      {format(day.date, "d")}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {day.acts.length} acte{day.acts.length > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des actes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Actes commerciaux</CardTitle>
            <CardDescription>
              Liste de tous les actes du mois sélectionné
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Chargement...</p>
            ) : acts.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Aucun acte pour ce mois</p>
            ) : (
              <div className="space-y-2">
                {acts.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{act.clientNom}</p>
                      <p className="text-sm text-muted-foreground">
                        {act.contratType} - {act.compagnie}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{act.commissionPotentielle.toFixed(2)} €</p>
                      <p className="text-sm text-muted-foreground">
                        {format(act.dateEffet, "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function generateTimeline(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const timelineDays = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const isSaturday = dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;

    timelineDays.push({
      date,
      isSaturday,
      isSunday,
      acts: [], // À remplir avec les actes réels
    });
  }

  return timelineDays;
}

function generateMonthOptions() {
  const months = [];
  const now = new Date();
  
  for (let i = -6; i <= 0; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push({
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy", { locale: fr }),
    });
  }

  return months;
}

