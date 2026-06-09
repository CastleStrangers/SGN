import { prisma } from "@/lib/db";

export type Permission =
  | "news.create" | "news.edit" | "news.delete" | "news.publish" | "news.feature"
  | "events.create" | "events.edit" | "events.delete" | "events.publish"
  | "tasks.create" | "tasks.edit" | "tasks.delete" | "tasks.assign"
  | "comments.approve" | "comments.delete" | "comments.manage"
  | "ads.create" | "ads.edit" | "ads.delete"
  | "surveys.create" | "surveys.edit" | "surveys.delete" | "surveys.view_results"
  | "media.upload" | "media.delete"
  | "pages.create" | "pages.edit" | "pages.delete" | "pages.publish"
  | "users.view" | "users.edit_role" | "users.delete"
  | "settings.view" | "settings.edit"
  | "roles.manage"
  | "volunteers.view" | "volunteers.manage"
  | "subscribers.view" | "subscribers.export"
  | "landing.create" | "landing.edit" | "landing.delete" | "landing.publish";

export const ALL_PERMISSIONS: Permission[] = [
  "news.create", "news.edit", "news.delete", "news.publish", "news.feature",
  "events.create", "events.edit", "events.delete", "events.publish",
  "tasks.create", "tasks.edit", "tasks.delete", "tasks.assign",
  "comments.approve", "comments.delete", "comments.manage",
  "ads.create", "ads.edit", "ads.delete",
  "surveys.create", "surveys.edit", "surveys.delete", "surveys.view_results",
  "media.upload", "media.delete",
  "pages.create", "pages.edit", "pages.delete", "pages.publish",
  "users.view", "users.edit_role", "users.delete",
  "settings.view", "settings.edit",
  "roles.manage",
  "volunteers.view", "volunteers.manage",
  "subscribers.view", "subscribers.export",
  "landing.create", "landing.edit", "landing.delete", "landing.publish",
];

export const ROLE_DEFAULTS: Record<string, Permission[]> = {
  admin: [...ALL_PERMISSIONS],
  editor: [
    "news.create", "news.edit", "news.publish", "news.feature",
    "events.create", "events.edit", "events.publish",
    "tasks.create", "tasks.edit", "tasks.assign",
    "comments.approve",
    "media.upload", "media.delete",
    "pages.create", "pages.edit", "pages.publish",
    "volunteers.view",
    "subscribers.view",
    "landing.publish",
  ],
  moderator: [
    "comments.approve", "comments.delete", "comments.manage",
    "news.edit",
    "events.edit",
    "volunteers.view",
  ],
  contributor: [
    "news.create", "news.edit",
    "events.create", "events.edit",
  ],
  member: [],
};

export function getRolePermissions(role: string): Permission[] {
  return ROLE_DEFAULTS[role] || [];
}

export function hasPermission(role: string, userPermissions: string[], permission: Permission): boolean {
  if (role === "admin") return true;
  if (userPermissions.includes(permission)) return true;
  return getRolePermissions(role).includes(permission);
}

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

export const PERMISSION_GROUPS: { module: string; label: string; permissions: Permission[] }[] = [
  {
    module: "news",
    label: "الأخبار",
    permissions: ["news.create", "news.edit", "news.delete", "news.publish", "news.feature"],
  },
  {
    module: "events",
    label: "الفعاليات",
    permissions: ["events.create", "events.edit", "events.delete", "events.publish"],
  },
  {
    module: "tasks",
    label: "المهام",
    permissions: ["tasks.create", "tasks.edit", "tasks.delete", "tasks.assign"],
  },
  {
    module: "comments",
    label: "التعليقات",
    permissions: ["comments.approve", "comments.delete", "comments.manage"],
  },
  {
    module: "ads",
    label: "الإعلانات",
    permissions: ["ads.create", "ads.edit", "ads.delete"],
  },
  {
    module: "surveys",
    label: "التصويت",
    permissions: ["surveys.create", "surveys.edit", "surveys.delete", "surveys.view_results"],
  },
  {
    module: "media",
    label: "الوسائط",
    permissions: ["media.upload", "media.delete"],
  },
  {
    module: "pages",
    label: "الصفحات",
    permissions: ["pages.create", "pages.edit", "pages.delete", "pages.publish"],
  },
  {
    module: "users",
    label: "المستخدمين",
    permissions: ["users.view", "users.edit_role", "users.delete"],
  },
  {
    module: "settings",
    label: "الإعدادات",
    permissions: ["settings.view", "settings.edit"],
  },
  {
    module: "roles",
    label: "الأدوار",
    permissions: ["roles.manage"],
  },
  {
    module: "volunteers",
    label: "المتطوعون",
    permissions: ["volunteers.view", "volunteers.manage"],
  },
  {
    module: "subscribers",
    label: "المشتركين",
    permissions: ["subscribers.view", "subscribers.export"],
  },
  {
    module: "landing",
    label: "صفحات الهبوط",
    permissions: ["landing.create", "landing.edit", "landing.delete", "landing.publish"],
  },
];
