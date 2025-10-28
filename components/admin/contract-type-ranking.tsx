"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, BarChart3 } from "lucide-react";
import { getActsByMonth, type Act } from "@/lib/firebase/acts";
import { getAllCommercials } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";

interface CommercialRankingByContract {
  id: string;
  email: string;
  nbContrats: number;
  caTotal: number;
  commissions: number;
  percentage: number;
}

interface ContractTypeRankingProps {
  monthKey: string;
}

const CONTRACT_TYPES = [
  { value: "AUTO_MOTO", label: "Auto / Moto" },
  { value: "IRD_PART", label: "IRD Particulier" },
  { value: "IRD_PRO", label: "IRD Professionnel" },
  { value: "PJ", label: "Protection Juridique" },
  { value: "GAV", label: "GAV (Garantie Accident Vie)" },
  { value: "NOP_50_EUR", label: "NOP 50 euros" },
  { value: "SANTE_PREV", label: "Santé / Prévoyance" },
  { value: "VIE_PP", label: "Vie PP (Epargne ou Retraite)" },
  { value: "VIE_PU", label: "Vie PU (Versement libre)" },
];

export function ContractTypeRanking({ monthKey }: ContractTypeRankingProps) {
  const [selectedContractType, setSelectedContractType] = useState<string>("AUTO_MOTO");
  const [rankings, setRankings] = useState<CommercialRankingByContract[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger et calculer les données des commerciaux par type de contrat
  useEffect(() => {
    const loadRankings = async () => {
      setLoading(true);
      try {
        // Récupérer tous les commerciaux
        const commercials = await getAllCommercials();
        
        // Récupérer les actes de tous les commerciaux pour le mois
        const allActs = await getActsByMonth(null, monthKey);
        
        // Calculer les données par commercial pour le type de contrat sélectionné
        const commercialData: CommercialRankingByContract[] = commercials.map((commercial) => {
          const commercialActs = allActs.filter(act => act.userId === commercial.id);
          
          // Filtrer par type de contrat
          const contractsByType = commercialActs.filter(
            act => act.contratType === selectedContractType
          );
          
          const nbContrats = contractsByType.length;
          
          const caTotal = contractsByType.reduce((sum, act) => {
            const ca = (act.primeAnnuelle || 0) + (act.montantVersement || 0);
            return sum + ca;
          }, 0);
          
          const commissions = contractsByType.reduce((sum, act) => {
            return sum + (act.commissionPotentielle || 0);
          }, 0);
          
          return {
            id: commercial.id,
            email: commercial.email,
            nbContrats,
            caTotal,
            commissions,
            percentage: 0, // Calculé plus bas
          };
        }).filter(commercial => commercial.nbContrats > 0); // Garder seulement ceux qui ont des contrats
        
        // Calculer les pourcentages
        const maxCa = commercialData.length > 0 
          ? Math.max(...commercialData.map(c => c.caTotal)) 
          : 1;
        
        const rankingsWithPercentage = commercialData.map(commercial => ({
          ...commercial,
          percentage: maxCa > 0 ? (commercial.caTotal / maxCa) * 100 : 0,
        }));
        
        // Trier par CA décroissant
        const sortedRankings = [...rankingsWithPercentage].sort((a, b) => b.caTotal - a.caTotal);
        
        setRankings(sortedRankings);
        
      } catch (error) {
        console.error("Erreur lors du chargement des classements par type:", error);
        toast.error("Impossible de charger les classements par type de contrat");
      } finally {
        setLoading(false);
      }
    };

    if (monthKey) {
      loadRankings();
    }
  }, [monthKey, selectedContractType]);

  const getBarColor = (index: number, total: number) => {
    const percentage = ((index + 1) / total) * 100;
    if (percentage <= 20) return "bg-green-600";
    if (percentage <= 40) return "bg-green-500";
    if (percentage <= 60) return "bg-yellow-500";
    if (percentage <= 80) return "bg-orange-500";
    return "bg-red-500";
  };

  const getContractTypeLabel = (value: string) => {
    return CONTRACT_TYPES.find(type => type.value === value)?.label || value;
  };

  return (
    <Card className="border-l-4 border-l-purple-500 relative">
      <div className="absolute -top-1 left-0 right-0 h-1 bg-purple-500 rounded-t-lg" />
      <div className="absolute -left-1 top-0 bottom-0 w-1 bg-purple-500 rounded-l-lg" />
      
      <CardHeader className="bg-purple-50/50 dark:bg-purple-950/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
            <BarChart3 className="h-5 w-5" />
            Classement par type de contrat
            <span className="ml-2 text-xs font-normal px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">
              Spécialisé
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="contract-type-select">Type :</Label>
            <Select value={selectedContractType} onValueChange={setSelectedContractType}>
              <SelectTrigger id="contract-type-select" className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTRACT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8 text-muted-foreground">Chargement...</p>
        ) : rankings.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            Aucune donnée pour ce type de contrat ce mois-ci
          </p>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-lg mb-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Type :</span> {getContractTypeLabel(selectedContractType)}
                </div>
                <div>
                  <span className="font-semibold">Total contrats :</span> {rankings.reduce((sum, r) => sum + r.nbContrats, 0)}
                </div>
                <div>
                  <span className="font-semibold">CA total :</span> {formatCurrency(rankings.reduce((sum, r) => sum + r.caTotal, 0))}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {rankings.map((commercial, index) => (
                <div key={commercial.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{commercial.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {commercial.nbContrats} contrat{commercial.nbContrats > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(commercial.caTotal)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(commercial.commissions)} commissions
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progression</span>
                      <span>{commercial.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${getBarColor(index, rankings.length)}`}
                        style={{ width: `${commercial.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

