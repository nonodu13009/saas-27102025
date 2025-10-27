"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createAct } from "@/lib/firebase/acts";
import { Act } from "@/types";
import { useAuth } from "@/lib/firebase/use-auth";

interface NewActDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CONTRACT_TYPES = [
  { value: "AUTO_MOTO", label: "Auto / Moto" },
  { value: "IRD_PART", label: "IRD Particulier" },
  { value: "IRD_PRO", label: "IRD Professionnel" },
  { value: "PJ", label: "Protection Juridique" },
  { value: "GAV", label: "GAV (Garantie Accident Vie)" },
  { value: "NOP_50_EUR", label: "NO Promise 50€" },
  { value: "SANTE_PREV", label: "Santé / Prévoyance" },
  { value: "VIE_PP", label: "Vie en Préparation" },
  { value: "VIE_PU", label: "Vie en Publication" },
];

const ACT_KINDS = [
  { value: "AN", label: "AN - Apport Nouveau" },
  { value: "M+3", label: "M+3 - Bilan client" },
  { value: "PRETERME_AUTO", label: "Préterme Auto" },
  { value: "PRETERME_IRD", label: "Préterme IRD" },
];

const COMPANIES = [
  { value: "ALLIANZ", label: "Allianz" },
  { value: "AUTRE", label: "Autre compagnie" },
];

export function NewActDialog({ open, onOpenChange, onSuccess }: NewActDialogProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // Nouvelle gestion des étapes
  
  const [kind, setKind] = useState<"AN" | "M+3" | "PRETERME_AUTO" | "PRETERME_IRD">("AN");
  const [clientNom, setClientNom] = useState("");
  const [numeroContrat, setNumeroContrat] = useState("");
  const [contratType, setContratType] = useState("");
  const [compagnie, setCompagnie] = useState("ALLIANZ");
  const [dateEffet, setDateEffet] = useState<Date | undefined>();
  const [dateEffetOpen, setDateEffetOpen] = useState(false);
  const [primeAnnuelle, setPrimeAnnuelle] = useState<number | undefined>();
  const [montantVersement, setMontantVersement] = useState<number | undefined>();

  const resetForm = () => {
    setStep(1);
    setKind("AN");
    setClientNom("");
    setNumeroContrat("");
    setContratType("");
    setCompagnie("ALLIANZ");
    setDateEffet(undefined);
    setPrimeAnnuelle(undefined);
    setMontantVersement(undefined);
  };

  const handleKindSelect = (selectedKind: "AN" | "M+3" | "PRETERME_AUTO" | "PRETERME_IRD") => {
    setKind(selectedKind);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    if (!clientNom || !numeroContrat || !contratType || !dateEffet) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);

    try {
      await createAct({
        userId: user.uid,
        kind,
        clientNom,
        numeroContrat,
        contratType,
        compagnie,
        dateEffet,
        primeAnnuelle,
        montantVersement,
      });

      toast.success("Acte créé avec succès");
      resetForm();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création de l'acte:", error);
      toast.error("Erreur lors de la création de l'acte");
    } finally {
      setIsLoading(false);
    }
  };

  const showPrimeAnnuelle = contratType && ["AUTO_MOTO", "IRD_PART", "IRD_PRO", "PJ", "GAV", "NOP_50_EUR", "SANTE_PREV", "VIE_PP"].includes(contratType);
  const showMontantVersement = contratType === "VIE_PU";

  // Étape 1 : Sélection du type d'acte
  const renderStep1 = () => (
    <>
      <DialogHeader>
        <DialogTitle>Nouvel acte commercial - Étape 1</DialogTitle>
      </DialogHeader>

      <div className="py-6">
        <Label className="text-lg mb-4 block">Sélectionnez le type d'acte :</Label>
        <div className="grid gap-3">
          {ACT_KINDS.map((actKind) => (
            <Button
              key={actKind.value}
              variant="outline"
              className="justify-start h-auto py-4 px-6"
              onClick={() => handleKindSelect(actKind.value as any)}
            >
              <div className="text-left">
                <div className="font-semibold text-base">{actKind.label}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Annuler
        </Button>
      </DialogFooter>
    </>
  );

  // Étape 2 : Formulaire selon le type d'acte sélectionné
  const renderStep2 = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(1)}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          Nouvel acte - {ACT_KINDS.find(a => a.value === kind)?.label}
        </DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        {/* Nom du client */}
        <div className="grid gap-2">
          <Label htmlFor="clientNom">Nom du client *</Label>
          <Input
            id="clientNom"
            value={clientNom}
            onChange={(e) => setClientNom(e.target.value)}
            placeholder="Ex: Dupont Jean"
          />
        </div>

        {/* Numéro de contrat */}
        <div className="grid gap-2">
          <Label htmlFor="numeroContrat">Numéro de contrat *</Label>
          <Input
            id="numeroContrat"
            value={numeroContrat}
            onChange={(e) => setNumeroContrat(e.target.value)}
            placeholder="Ex: CT001234"
          />
        </div>

        {/* Type de contrat */}
        <div className="grid gap-2">
          <Label htmlFor="contratType">Type de contrat *</Label>
          <Select value={contratType} onValueChange={setContratType}>
            <SelectTrigger id="contratType">
              <SelectValue placeholder="Sélectionnez un type de contrat" />
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

        {/* Compagnie */}
        <div className="grid gap-2">
          <Label htmlFor="compagnie">Compagnie *</Label>
          <Select value={compagnie} onValueChange={setCompagnie}>
            <SelectTrigger id="compagnie">
              <SelectValue placeholder="Sélectionnez une compagnie" />
            </SelectTrigger>
            <SelectContent>
              {COMPANIES.map((comp) => (
                <SelectItem key={comp.value} value={comp.value}>
                  {comp.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date d'effet */}
        <div className="grid gap-2">
          <Label>Date d'effet *</Label>
          <Popover open={dateEffetOpen} onOpenChange={setDateEffetOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateEffet && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateEffet ? format(dateEffet, "PPP", { locale: fr }) : "Sélectionnez une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateEffet}
                onSelect={(date) => {
                  setDateEffet(date);
                  setDateEffetOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Prime annuelle (conditionnelle) */}
        {showPrimeAnnuelle && (
          <div className="grid gap-2">
            <Label htmlFor="primeAnnuelle">Prime annuelle (€)</Label>
            <Input
              id="primeAnnuelle"
              type="number"
              step="0.01"
              value={primeAnnuelle || ""}
              onChange={(e) => setPrimeAnnuelle(e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Ex: 500.00"
            />
          </div>
        )}

        {/* Montant versé (conditionnel) */}
        {showMontantVersement && (
          <div className="grid gap-2">
            <Label htmlFor="montantVersement">Montant versé (€) *</Label>
            <Input
              id="montantVersement"
              type="number"
              step="0.01"
              value={montantVersement || ""}
              onChange={(e) => setMontantVersement(e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Ex: 1000.00"
            />
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} className="bg-[#00529B] hover:bg-[#003d73]">
          {isLoading ? "Création..." : "Créer l'acte"}
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 1 ? renderStep1() : renderStep2()}
      </DialogContent>
    </Dialog>
  );
}

