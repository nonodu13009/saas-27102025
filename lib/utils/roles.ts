import { UserData } from "@/lib/firebase/auth";

export type UserRole = "ADMINISTRATEUR" | "CDC_COMMERCIAL";

export const ROLES = {
  ADMINISTRATEUR: "ADMINISTRATEUR",
  CDC_COMMERCIAL: "CDC_COMMERCIAL",
} as const;

/**
 * Vérifie si l'utilisateur est un administrateur
 */
export function isAdmin(userData: UserData | null): boolean {
  return userData?.role === ROLES.ADMINISTRATEUR && userData?.active === true;
}

/**
 * Vérifie si l'utilisateur est un CDC Commercial
 */
export function isCommercial(userData: UserData | null): boolean {
  return userData?.role === ROLES.CDC_COMMERCIAL && userData?.active === true;
}

/**
 * Vérifie si l'utilisateur a accès à une fonctionnalité
 */
export function hasAccess(
  userData: UserData | null,
  requiredRole: UserRole
): boolean {
  if (!userData || !userData.active) {
    return false;
  }

  // L'administrateur a accès à tout
  if (userData.role === ROLES.ADMINISTRATEUR) {
    return true;
  }

  return userData.role === requiredRole;
}

/**
 * Retourne le libellé du rôle
 */
export function getRoleLabel(role: UserRole): string {
  const labels = {
    ADMINISTRATEUR: "Administrateur",
    CDC_COMMERCIAL: "CDC Commercial",
  };
  return labels[role] || role;
}

/**
 * Vérifie si l'utilisateur peut accéder à l'interface admin
 */
export function canAccessAdmin(userData: UserData | null): boolean {
  return isAdmin(userData);
}

/**
 * Vérifie si l'utilisateur peut accéder au dashboard commercial
 */
export function canAccessDashboard(userData: UserData | null): boolean {
  return isAdmin(userData) || isCommercial(userData);
}
