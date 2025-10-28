"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, UserX, UserCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RouteGuard } from "@/components/auth/route-guard";

interface User {
  uid: string;
  email: string;
  role: "ADMINISTRATEUR" | "CDC_COMMERCIAL";
  active: boolean;
  createdAt: string;
  emailVerified: boolean;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "CDC_COMMERCIAL" as "ADMINISTRATEUR" | "CDC_COMMERCIAL",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur inconnue" }));
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Utilisateurs chargés:", data.users);
      setUsers(data.users || []);
    } catch (error: any) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      toast.error(error.message || "Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur création utilisateur");
      }

      toast.success("Utilisateur créé avec succès");
      setIsDialogOpen(false);
      setFormData({ email: "", password: "", role: "CDC_COMMERCIAL" });
      loadUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          active: !user.active,
        }),
      });

      if (!response.ok) throw new Error("Erreur mise à jour");
      
      toast.success(`Utilisateur ${!user.active ? "activé" : "désactivé"}`);
      loadUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdateRole = async (user: User, newRole: "ADMINISTRATEUR" | "CDC_COMMERCIAL") => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          role: newRole,
        }),
      });

      if (!response.ok) throw new Error("Erreur mise à jour");
      
      toast.success(`Rôle mis à jour : ${newRole}`);
      loadUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users?uid=${selectedUser.uid}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur suppression");
      
      toast.success("Utilisateur supprimé");
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <RouteGuard allowedRoles={["ADMINISTRATEUR"]}>
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestion des Utilisateurs</CardTitle>
                  <CardDescription>
                    Créer, modifier et supprimer les utilisateurs
                  </CardDescription>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel utilisateur
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun utilisateur trouvé
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-semibold text-sm border-b">Email</th>
                        <th className="text-center p-3 font-semibold text-sm border-b">Rôle</th>
                        <th className="text-center p-3 font-semibold text-sm border-b">Statut</th>
                        <th className="text-center p-3 font-semibold text-sm border-b">Email vérifié</th>
                        <th className="text-center p-3 font-semibold text-sm border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.uid} className="border-b hover:bg-muted/30">
                          <td className="p-3 font-medium">{user.email}</td>
                          <td className="p-3 text-center">
                            <Select
                              value={user.role}
                              onValueChange={(value: "ADMINISTRATEUR" | "CDC_COMMERCIAL") =>
                                handleUpdateRole(user, value)
                              }
                            >
                              <SelectTrigger className="w-[180px] mx-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ADMINISTRATEUR">Administrateur</SelectItem>
                                <SelectItem value="CDC_COMMERCIAL">CDC Commercial</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant={user.active ? "default" : "secondary"}>
                              {user.active ? "Actif" : "Inactif"}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant={user.emailVerified ? "default" : "outline"}>
                              {user.emailVerified ? "Vérifié" : "Non vérifié"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleActive(user)}
                                title={user.active ? "Désactiver" : "Activer"}
                              >
                                {user.active ? (
                                  <UserX className="h-4 w-4" />
                                ) : (
                                  <UserCheck className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsDeleteDialogOpen(true);
                                }}
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
            </CardContent>
          </Card>

          {/* Dialog création utilisateur */}
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Nouvel utilisateur</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@allianz-nogaro.fr"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <PasswordInput
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 6 caractères"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "ADMINISTRATEUR" | "CDC_COMMERCIAL") =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMINISTRATEUR">Administrateur</SelectItem>
                      <SelectItem value="CDC_COMMERCIAL">CDC Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleCreateUser}>Créer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Dialog suppression */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer {selectedUser?.email} ? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteUser} 
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </RouteGuard>
  );
}

