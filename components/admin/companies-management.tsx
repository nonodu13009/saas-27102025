"use client";

import { useState, useEffect } from "react";
import { Building2, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getCompanies, createCompany, updateCompany, deleteCompany, type Company, isSystemCompany } from "@/lib/firebase/companies";

export function CompaniesManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [newCompanyName, setNewCompanyName] = useState("");
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);

  // Charger les compagnies
  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des compagnies");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // Ajouter une compagnie
  const handleAddCompany = async () => {
    if (!newCompanyName.trim()) {
      toast.error("Nom requis", {
        description: "Veuillez saisir un nom de compagnie",
      });
      return;
    }

    const trimmedName = newCompanyName.trim();
    
    // Vérifier si c'est une compagnie système
    if (isSystemCompany(trimmedName)) {
      toast.error("Nom réservé", {
        description: "Ce nom est réservé pour une compagnie système",
      });
      return;
    }
    
    if (companies.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error("Compagnie déjà existante", {
        description: "Une compagnie avec ce nom existe déjà",
      });
      return;
    }

    try {
      await createCompany(trimmedName);
      toast.success("Compagnie ajoutée", {
        description: `La compagnie "${trimmedName}" a été ajoutée avec succès`,
      });
      setIsAddDialogOpen(false);
      setNewCompanyName("");
      loadCompanies();
    } catch (error) {
      toast.error("Erreur lors de l'ajout", {
        description: (error as Error).message || "Une erreur est survenue. Veuillez réessayer.",
      });
      console.error(error);
    }
  };

  // Ouvrir le dialogue d'édition
  const handleOpenEditDialog = (company: Company) => {
    setEditingCompany(company);
    setEditingName(company.name);
    setIsEditDialogOpen(true);
  };

  // Modifier une compagnie
  const handleUpdateCompany = async () => {
    if (!editingCompany || !editingName.trim()) {
      toast.error("Nom requis", {
        description: "Veuillez saisir un nom de compagnie",
      });
      return;
    }

    // Vérifier si c'est une compagnie système
    if (isSystemCompany(editingCompany.name)) {
      toast.error("Compagnie système", {
        description: "Impossible de modifier une compagnie système",
      });
      return;
    }

    const trimmedName = editingName.trim();
    if (trimmedName === editingCompany.name) {
      setIsEditDialogOpen(false);
      setEditingCompany(null);
      setEditingName("");
      return;
    }

    if (companies.some(c => c.id !== editingCompany.id && c.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error("Nom déjà utilisé", {
        description: "Une compagnie avec ce nom existe déjà",
      });
      return;
    }

    try {
      await updateCompany(editingCompany.id, {
        name: trimmedName,
      });
      toast.success("Compagnie modifiée", {
        description: `La compagnie "${trimmedName}" a été modifiée avec succès`,
      });
      setIsEditDialogOpen(false);
      setEditingCompany(null);
      setEditingName("");
      loadCompanies();
    } catch (error) {
      toast.error("Erreur lors de la modification", {
        description: (error as Error).message || "Une erreur est survenue. Veuillez réessayer.",
      });
      console.error(error);
    }
  };

  // Toggle le statut actif/inactif
  const handleToggleActive = async (company: Company) => {
    if (isSystemCompany(company.name)) {
      toast.error("Compagnie système", {
        description: "Impossible de modifier le statut d'une compagnie système",
      });
      return;
    }

    try {
      await updateCompany(company.id, {
        active: !company.active,
      });
      toast.success(
        `Compagnie ${!company.active ? "activée" : "désactivée"}`,
        {
          description: `La compagnie "${company.name}" est maintenant ${!company.active ? "active" : "inactive"}`,
        }
      );
      loadCompanies();
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de modifier le statut. Veuillez réessayer.",
      });
      console.error(error);
    }
  };

  // Ouvrir le dialogue de suppression
  const handleOpenDeleteDialog = (companyId: string) => {
    setDeletingCompanyId(companyId);
    setIsDeleteDialogOpen(true);
  };

  // Supprimer une compagnie
  const handleDeleteCompany = async () => {
    if (!deletingCompanyId) return;

    const companyToDelete = companies.find((c) => c.id === deletingCompanyId);

    // Vérifier si c'est une compagnie système
    if (companyToDelete && isSystemCompany(companyToDelete.name)) {
      toast.error("Compagnie système", {
        description: "Impossible de supprimer une compagnie système",
      });
      setIsDeleteDialogOpen(false);
      setDeletingCompanyId(null);
      return;
    }

    try {
      await deleteCompany(deletingCompanyId);
      toast.success("Compagnie supprimée", {
        description: companyToDelete 
          ? `La compagnie "${companyToDelete.name}" a été supprimée et remplacée par "Courtage" dans les anciens actes`
          : "La compagnie a été supprimée avec succès",
      });
      setIsDeleteDialogOpen(false);
      setDeletingCompanyId(null);
      loadCompanies();
    } catch (error) {
      toast.error("Erreur lors de la suppression", {
        description: (error as Error).message || "Une erreur est survenue. Veuillez réessayer.",
      });
      console.error(error);
    }
  };

  const deletingCompany = companies.find((c) => c.id === deletingCompanyId);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeCompanies = companies.filter(c => c.active).length;
  const totalCompanies = companies.length;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Gestion des compagnies
              </CardTitle>
              <CardDescription className="mt-2">
                {totalCompanies > 0 
                  ? `${totalCompanies} compagnie${totalCompanies > 1 ? 's' : ''} enregistrée${totalCompanies > 1 ? 's' : ''} dont ${activeCompanies} active${activeCompanies > 1 ? 's' : ''}`
                  : "Ajouter, modifier ou supprimer des compagnies d'assurance utilisées lors de la saisie des actes"}
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une compagnie
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Aucune compagnie enregistrée
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Ajoutez votre première compagnie pour commencer
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une compagnie
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Compagnies système */}
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-blue-50 dark:bg-blue-950/30 px-4 py-2 border-b">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    Compagnies système
                  </h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Nom</th>
                      <th className="text-center p-4 font-semibold">Statut</th>
                      <th className="text-center p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies
                      .filter(c => isSystemCompany(c.name))
                      .sort((a, b) => {
                        if (a.name.toLowerCase() === 'allianz') return -1;
                        if (b.name.toLowerCase() === 'allianz') return 1;
                        return a.name.localeCompare(b.name);
                      })
                      .map((company, index, array) => (
                        <tr 
                          key={company.id} 
                          className="border-b transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Building2 className="h-4 w-4 text-blue-700 dark:text-blue-300 shrink-0" />
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-blue-900 dark:text-blue-100">{company.name}</span>
                                <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 dark:text-blue-300">
                                  Système
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="default" className="capitalize">
                              Active
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-xs text-muted-foreground italic">
                              Compagnie système
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Compagnies personnalisées */}
              {companies.filter(c => !isSystemCompany(c.name)).length > 0 && (
                <div className="rounded-lg border overflow-hidden">
                  <div className="bg-muted/50 px-4 py-2 border-b">
                    <h3 className="text-sm font-semibold">
                      Compagnies personnalisées
                    </h3>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-semibold">Nom</th>
                        <th className="text-center p-4 font-semibold">Statut</th>
                        <th className="text-center p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies
                        .filter(c => !isSystemCompany(c.name))
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((company, index, array) => (
                          <tr 
                            key={company.id} 
                            className={`border-b transition-colors hover:bg-accent/50 ${index === array.length - 1 ? 'border-b-0' : ''}`}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="font-medium">{company.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <Badge 
                                variant={company.active ? "default" : "secondary"}
                                className="capitalize"
                              >
                                {company.active ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleActive(company)}
                                >
                                  {company.active ? "Désactiver" : "Activer"}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenEditDialog(company)}
                                  title="Modifier"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDeleteDialog(company.id)}
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'ajout */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une compagnie</DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle compagnie d'assurance qui sera disponible lors de la saisie des actes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-company-name">Nom de la compagnie</Label>
              <Input
                id="new-company-name"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Ex: Allianz, AXA, Groupama..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddCompany();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddCompany}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la compagnie</DialogTitle>
            <DialogDescription>
              Modifiez le nom de la compagnie.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-company-name">Nom de la compagnie</Label>
              <Input
                id="edit-company-name"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Ex: Allianz, AXA, Groupama..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateCompany();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateCompany}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la compagnie "{deletingCompany?.name}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Annuler</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={handleDeleteCompany}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

