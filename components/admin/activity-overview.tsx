"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, FileText as FileTextIcon, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CommercialsRanking } from "./commercials-ranking";
import { ContractTypeRanking } from "./contract-type-ranking";

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
      const convertedActs = actsData.map((act) => {
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
        } as unknown as Act;
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

  // Convertir les Timestamp en Date pour calculateKPI
  const actsForKPI = acts.map(act => ({
    ...act,
    dateSaisie: act.dateSaisie instanceof Timestamp ? act.dateSaisie.toDate() : act.dateSaisie,
    dateEffet: act.dateEffet instanceof Timestamp ? act.dateEffet.toDate() : act.dateEffet,
  }));
  
  const kpi = calculateKPI(actsForKPI as any);

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

      {/* Section 1 : Activité Générale */}
      <Card className="border-l-4 border-l-blue-500 relative">
        <div className="absolute -top-1 left-0 right-0 h-1 bg-blue-500 rounded-t-lg z-10" />
        <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20">
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <ClipboardCheck className="h-5 w-5" />
            Activité Générale
            <span className="ml-2 text-xs font-normal px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
              Vue d&apos;ensemble
            </span>
          </CardTitle>
          <CardDescription>
            Timeline et liste complète des actes du mois
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-400">Timeline</h3>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {generateTimeline(selectedMonth, acts).map((day, index) => (
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
          </div>

          {/* Séparateur */}
          <div className="border-t border-blue-200 dark:border-blue-800" />

          {/* Tableau des actes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-400">Actes commerciaux</h3>
            </div>
            {acts.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Aucun acte pour ce mois</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-center p-3 font-semibold text-sm border-b w-12"></th>
                      <th className="text-center p-3 font-semibold text-sm border-b">Date de saisie</th>
                      <th className="text-center p-3 font-semibold text-sm border-b">Type</th>
                      <th className="text-center p-3 font-semibold text-sm border-b">Client</th>
                      <th className="text-center p-3 font-semibold text-sm border-b">N° Contrat</th>
                      <th className="text-center p-3 font-semibold text-sm border-b">Type Contrat</th>
                      <th className="text-center p-3 font-semibold text-sm border-b">Compagnie</th>
                      <th className="text-center p-3 font-semibold text-sm border-b">Date d&apos;effet</th>
                      <th className="text-center p-3 font-semibold text-sm border-b">Prime annuelle</th>
                      <th className="text-center p-3 font-semibold text-sm border-b">Commission</th>
                      <th className="text-center p-3 font-semibold text-sm border-b w-20">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acts.map((act) => {
                      const isProcess = act.kind === "M+3" || act.kind === "PRETERME_AUTO" || act.kind === "PRETERME_IRD";
                      const isLocked = isActLocked(act);
                      
                      // Convertir Timestamp en Date si nécessaire
                      const dateSaisie = act.dateSaisie instanceof Timestamp ? act.dateSaisie.toDate() : act.dateSaisie;
                      const dateEffet = act.dateEffet instanceof Timestamp ? act.dateEffet.toDate() : act.dateEffet;
                      
                      return (
                        <tr
                          key={act.id}
                          className={`border-b hover:bg-muted/30 transition-colors ${
                            isLocked ? "opacity-60 bg-muted/20" : ""
                          }`}
                        >
                          <td className="p-3 text-center align-middle">
                            {act.note ? (
                              <span className="inline-flex items-center justify-center w-6 h-6">
                                <FileTextIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="p-3 text-sm text-center align-middle">{format(dateSaisie, "dd/MM/yyyy")}</td>
                          <td className="p-3 text-sm text-center align-middle">{act.kind}</td>
                          <td className="p-3 text-sm font-medium text-center align-middle">{act.clientNom}</td>
                          <td className="p-3 text-sm text-center align-middle">{isProcess ? "-" : act.numeroContrat}</td>
                          <td className="p-3 text-sm text-center align-middle">{isProcess ? "-" : act.contratType}</td>
                          <td className="p-3 text-sm text-center align-middle">{isProcess ? "-" : act.compagnie}</td>
                          <td className="p-3 text-sm text-center align-middle">{format(dateEffet, "dd/MM/yyyy")}</td>
                          <td className="p-3 text-sm text-center align-middle">
                            {act.primeAnnuelle ? formatCurrency(act.primeAnnuelle) : "-"}
                          </td>
                          <td className="p-3 text-sm text-center font-semibold align-middle">
                            {formatCurrency(act.commissionPotentielle)}
                          </td>
                          <td className="p-3 text-center align-middle">
                            {isLocked ? (
                              <div className="flex items-center justify-center" title="Bloqué">
                                <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center" title="Débloqué">
                                <Unlock className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2 : Classement des commerciaux */}
      <CommercialsRanking monthKey={selectedMonth} />
      
      {/* Section 3 : Classement par type de contrat */}
      <ContractTypeRanking monthKey={selectedMonth} />
    </div>
  );
}

// Fonction pour générer la timeline
function generateTimeline(monthKey: string, acts: Act[] = []) {
  const [year, month] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const timelineDays = [];

  // Créer un map des actes par jour (basé sur la date de saisie)
  const actsByDay = new Map<string, Act[]>();
  
  acts.forEach((act) => {
    // Convertir Timestamp en Date si nécessaire
    const dateSaisie = act.dateSaisie instanceof Timestamp ? act.dateSaisie.toDate() : act.dateSaisie;
    const actDate = new Date(dateSaisie);
    const dayKey = `${actDate.getFullYear()}-${actDate.getMonth() + 1}-${actDate.getDate()}`;
    
    if (!actsByDay.has(dayKey)) {
      actsByDay.set(dayKey, []);
    }
    actsByDay.get(dayKey)!.push(act);
  });

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const isSaturday = dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;
    
    const dayKey = `${year}-${month}-${day}`;
    const dayActs = actsByDay.get(dayKey) || [];

    timelineDays.push({
      date,
      isSaturday,
      isSunday,
      acts: dayActs,
    });
  }

  return timelineDays;
}

// Fonction pour vérifier si un acte est bloqué
function isActLocked(act: Act): boolean {
  const now = new Date();
  const today = now.getDate();
  
  // Convertir Timestamp en Date si nécessaire
  const dateSaisie = act.dateSaisie instanceof Timestamp ? act.dateSaisie.toDate() : act.dateSaisie;
  const actDate = new Date(dateSaisie);
  
  if (today >= 15) {
    const actYear = actDate.getFullYear();
    const actMonth = actDate.getMonth();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    
    if (actYear === nowYear && actMonth < nowMonth) {
      return true;
    }
    if (actYear < nowYear) {
      return true;
    }
  }
  
  return false;
}

