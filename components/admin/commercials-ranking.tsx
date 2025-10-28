"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Medal, Award } from "lucide-react";

interface CommercialRanking {
  id: string;
  email: string;
  value: number;
  percentage: number;
}

interface CommercialsRankingProps {
  monthKey: string;
}

export function CommercialsRanking({ monthKey }: CommercialsRankingProps) {
  const [selectedCriterion, setSelectedCriterion] = useState<string>("commissionReelle");

  // TODO: Récupérer les données des commerciaux pour le mois
  const rankings: CommercialRanking[] = [
    // Exemple de données statiques pour le prototype
  ];

  const criterionOptions = [
    { value: "commissionReelle", label: "Commissions réelles" },
    { value: "caTotal", label: "CA total" },
    { value: "caNonAuto", label: "CA non auto" },
    { value: "nbActes", label: "Nombre total d'actes" },
    { value: "commissionPotentielle", label: "Commissions potentielles" },
    { value: "nbContratsAuto", label: "Nombre contrats auto" },
    { value: "nbContratsAutres", label: "Nombre contrats autres" },
    { value: "ratio", label: "Ratio CA auto / CA autres" },
    { value: "nbProcess", label: "Nombre de process" },
  ];

  const getBarColor = (index: number, total: number) => {
    const percentage = ((index + 1) / total) * 100;
    if (percentage <= 20) return "bg-green-600";
    if (percentage <= 40) return "bg-green-500";
    if (percentage <= 60) return "bg-yellow-500";
    if (percentage <= 80) return "bg-orange-500";
    return "bg-red-500";
  };

  const getMedal = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-orange-600" />;
    return <span className="text-sm text-muted-foreground">#{index + 1}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Classement des commerciaux</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="criterion-select">Critère :</Label>
            <Select value={selectedCriterion} onValueChange={setSelectedCriterion}>
              <SelectTrigger id="criterion-select" className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {criterionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {rankings.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            Aucune donnée disponible pour ce mois
          </p>
        ) : (
          <div className="space-y-3">
            {rankings.map((commercial, index) => (
              <div key={commercial.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex items-center gap-2 w-32">
                  {getMedal(index)}
                  <span className="text-sm font-medium truncate">
                    {commercial.email}
                  </span>
                </div>
                <div className="flex-1">
                  <div 
                    className={`h-8 rounded transition-all ${getBarColor(index, rankings.length)}`}
                    style={{ width: `${commercial.percentage}%` }}
                  />
                </div>
                <div className="text-right w-24">
                  <span className="font-semibold">{commercial.value.toLocaleString('fr-FR')}</span>
                  <span className="text-sm text-muted-foreground"> {selectedCriterion === "ratio" ? "%" : "€"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

