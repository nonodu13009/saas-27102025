"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KPICard } from "@/components/dashboard/kpi-card";
import { DollarSign, FileText, ClipboardCheck, Car, Building2, Scale, Target, Coins } from "lucide-react";
import { calculateKPI } from "@/lib/utils/kpi";
import { formatCurrency } from "@/lib/utils";
import { getActsByMonth, type Act } from "@/lib/firebase/acts";
import { getAllCommercials, type UserData } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";

interface ActivityOverviewProps {
  initialMonth?: string;
}

export function ActivityOverview({ initialMonth }: ActivityOverviewProps) {
  const [acts, setActs] = useState<Act[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    initialMonth || format(new Date(), "yyyy-MM")
  );
  const [selectedCommercial, setSelectedCommercial] = useState<string>("all");
  const [commerciaux, setCommerciaux] = useState<UserData[]>([]);

  // Charger les commerciaux
  useEffect(() => {
    const loadCommerciaux = async () => {
      try {
        const commercials = await getAllCommercials();
        setCommerciaux(commercials);
      } catch (error) {
        console.error("Erreur chargement commerciaux:", error);
        toast.error("Erreur lors du chargement des commerciaux");
      }
    };
    loadCommerciaux();
  }, []);

  // Charger les actes
  const loadActs = async () => {
    setIsLoading(true);
    try {
      const userId = selectedCommercial === "all" ? null : selectedCommercial;
      const actsData = await getActsByMonth(userId, selectedMonth);
      
      // Convertir les Timestamp en Date
      const convertedActs: Act[] = actsData.map((act) => {
        const dateEffet = (act as unknown as { dateEffet: Timestamp | Date }).dateEffet instanceof Timestamp 
          ? (act as unknown as { dateEffet: Timestamp }).dateEffet.toDate() 
          : (act as unknown as { dateEffet: Date }).dateEffet;
          
        const dateSaisie = (act as unknown as { dateSaisie: Timestamp | Date }).dateSaisie instanceof Timestamp 
          ? (act as unknown as { dateSaisie: Timestamp }).dateSaisie.toDate() 
          : (act as unknown as { dateSaisie: Date }).dateSaisie;
        
        return {
          ...act,
          dateEffet,
          dateSaisie,
        };
      });
      
      setActs(convertedActs);
    } catch (error) {
      console.error("Erreur chargement actes:", error);
      toast.error("Erreur lors du chargement des actes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedCommercial]);

  const previousMonth = () => {
    const date = new Date(selectedMonth + "-01");
    date.setMonth(date.getMonth() - 1);
    setSelectedMonth(format(date, "yyyy-MM"));
  };

  const nextMonth = () => {
    const date = new Date(selectedMonth + "-01");
    date.setMonth(date.getMonth() + 1);
    setSelectedMonth(format(date, "yyyy-MM"));
  };

  const kpi = calculateKPI(acts);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation mensuelle + Filtre */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold min-w-[140px] text-center">
                {format(new Date(selectedMonth + "-01"), "MMMM yyyy", { locale: fr })}
              </span>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="commercial-filter">Voir :</Label>
              <Select value={selectedCommercial} onValueChange={setSelectedCommercial}>
                <SelectTrigger id="commercial-filter" className="w-[200px]">
                  <SelectValue placeholder="Sélectionner un commercial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les commerciaux</SelectItem>
                  {commerciaux.map((com) => (
                    <SelectItem key={com.id} value={com.id}>
                      {com.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="CA Mensuel"
          value={formatCurrency(kpi.caMensuel)}
          icon={DollarSign}
          colorScheme="green"
        />
        <KPICard
          title="CA Auto / Moto"
          value={formatCurrency(kpi.caAuto)}
          icon={Car}
          colorScheme="blue"
        />
        <KPICard
          title="CA Autres"
          value={formatCurrency(kpi.caAutres)}
          icon={Building2}
          colorScheme="purple"
        />
        <KPICard
          title="Nombre de contrats"
          value={kpi.nbContrats.toString()}
          icon={ClipboardCheck}
          colorScheme="indigo"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Contrats Auto / Moto"
          value={kpi.nbContratsAuto.toString()}
          icon={Car}
          colorScheme="teal"
        />
        <KPICard
          title="Contrats Autres"
          value={kpi.nbContratsAutres.toString()}
          icon={Building2}
          colorScheme="orange"
        />
        <KPICard
          title="Ratio"
          value={`${kpi.ratio.toFixed(1)}%`}
          subtitle="Objectif ≥ 100%"
          icon={Scale}
          trend={kpi.ratio >= 100 ? "up" : "down"}
          colorScheme={kpi.ratio >= 100 ? "green" : "red"}
        />
        <KPICard
          title="Nombre de process"
          value={kpi.nbProcess.toString()}
          icon={Target}
          colorScheme="pink"
        />
      </div>

      {/* Section à compléter : Timeline + Tableau */}
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Timeline et tableau à implémenter
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

