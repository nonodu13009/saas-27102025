export interface User {
  id: string;
  email: string;
  role: "ADMINISTRATEUR" | "CDC_COMMERCIAL";
  active: boolean;
  createdAt: Date;
}

export interface Act {
  id: string;
  userId: string;
  kind: "AN" | "M+3" | "PRETERME_AUTO" | "PRETERME_IRD";
  clientNom: string;
  numeroContrat: string;
  contratType: string;
  compagnie: string;
  dateEffet: Date;
  dateSaisie: Date;
  primeAnnuelle?: number;
  montantVersement?: number;
  commissionPotentielle: number;
  commissionReelle?: number;
  moisKey: string;
}

export interface Company {
  id: string;
  name: string;
  active: boolean;
  createdAt: Date;
}

export interface KPI {
  caMensuel: number;
  caAuto: number;
  caAutres: number;
  nbContrats: number;
  nbContratsAuto: number;
  nbContratsAutres: number;
  ratio: number;
  nbProcess: number;
  commissionsPotentielles: number;
  commissionsReelles: number;
  commissionValidee: boolean;
}

export interface TimelineDay {
  date: Date;
  isSaturday: boolean;
  isSunday: boolean;
  acts: Act[];
}

