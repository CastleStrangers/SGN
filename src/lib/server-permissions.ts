import { prisma } from "@/lib/db";
import type { Permission } from "./permissions";
import { hasPermission } from "./permissions";

export async function authorize(
  userId: string | undefined,
  permission: Permission
): Promise<boolean> {
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      permissions: { where: { granted: true }, select: { permission: true } },
    },
  });

  if (!user) return false;
  if (user.role === "admin") return true;

  const explicitPerms = user.permissions.map((p: { permission: string }) => p.permission);
  return hasPermission(user.role, explicitPerms, permission);
}

export function getModuleFromPermission(perm: Permission): string {
  return perm.split(".")[0];
}
