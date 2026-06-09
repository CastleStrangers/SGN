import { authorize as permAuthorize, hasPermission, getRolePermissions, type Permission } from "./permissions";

export function isAdmin(role: string | undefined | null): boolean {
  return role === "admin";
}

export function isEditor(role: string | undefined | null): boolean {
  return role === "admin" || role === "editor";
}

export async function requireAuthorize(
  userId: string | undefined,
  permission: Permission
): Promise<boolean> {
  if (!userId) return false;
  return permAuthorize(userId, permission);
}

export function checkPermission(
  role: string,
  userPermissions: string[],
  permission: Permission
): boolean {
  return hasPermission(role, userPermissions, permission);
}
