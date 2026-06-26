import { describe, it, expect } from "vitest";
import {
  ALL_PERMISSIONS,
  ROLE_DEFAULTS,
  getRolePermissions,
  hasPermission,
  PERMISSION_GROUPS,
} from "../permissions";
import { getModuleFromPermission } from "../server-permissions";

describe("ALL_PERMISSIONS", () => {
  it("includes all permissions (admin gets all)", () => {
    expect(ALL_PERMISSIONS.length).toBeGreaterThan(30);
    expect(ROLE_DEFAULTS.admin).toEqual(ALL_PERMISSIONS);
  });

  it("includes permissions for each module", () => {
    const modules = ALL_PERMISSIONS.map((p) => p.split(".")[0]);
    const uniqueModules = [...new Set(modules)];
    expect(uniqueModules).toContain("news");
    expect(uniqueModules).toContain("events");
    expect(uniqueModules).toContain("tasks");
    expect(uniqueModules).toContain("users");
    expect(uniqueModules).toContain("landing");
  });
});

describe("ROLE_DEFAULTS", () => {
  it("admin has all permissions", () => {
    expect(ROLE_DEFAULTS.admin).toEqual(ALL_PERMISSIONS);
  });

  it("member has no permissions", () => {
    expect(ROLE_DEFAULTS.member).toEqual([]);
  });

  it("editor has publish-related permissions", () => {
    expect(ROLE_DEFAULTS.editor).toContain("news.publish");
    expect(ROLE_DEFAULTS.editor).toContain("news.create");
    expect(ROLE_DEFAULTS.editor).not.toContain("users.delete");
  });

  it("moderator has comment management permissions", () => {
    expect(ROLE_DEFAULTS.moderator).toContain("comments.approve");
    expect(ROLE_DEFAULTS.moderator).toContain("comments.delete");
    expect(ROLE_DEFAULTS.moderator).toContain("news.edit");
    expect(ROLE_DEFAULTS.moderator).not.toContain("news.create");
  });

  it("contributor has news and events create/edit", () => {
    expect(ROLE_DEFAULTS.contributor).toContain("news.create");
    expect(ROLE_DEFAULTS.contributor).toContain("events.edit");
    expect(ROLE_DEFAULTS.contributor).not.toContain("users.view");
  });
});

describe("getRolePermissions", () => {
  it("returns all permissions for admin", () => {
    expect(getRolePermissions("admin")).toEqual(ALL_PERMISSIONS);
  });

  it("returns empty for unknown role", () => {
    expect(getRolePermissions("unknown_role")).toEqual([]);
  });
});

describe("hasPermission", () => {
  it("admin always has permission regardless of explicit perms", () => {
    expect(hasPermission("admin", [], "news.create")).toBe(true);
    expect(hasPermission("admin", [], "users.delete")).toBe(true);
  });

  it("editor has permissions defined in defaults", () => {
    expect(hasPermission("editor", [], "news.create")).toBe(true);
    expect(hasPermission("editor", [], "events.create")).toBe(true);
  });

  it("editor does not have permissions outside defaults", () => {
    expect(hasPermission("editor", [], "users.delete")).toBe(false);
  });

  it("user with explicit permission has access", () => {
    expect(hasPermission("member", ["news.create"], "news.create")).toBe(true);
  });

  it("user without permission and outside defaults cannot access", () => {
    expect(hasPermission("member", [], "news.create")).toBe(false);
  });
});

describe("getModuleFromPermission", () => {
  it("extracts module from permission string", () => {
    expect(getModuleFromPermission("news.create")).toBe("news");
    expect(getModuleFromPermission("events.publish")).toBe("events");
    expect(getModuleFromPermission("users.edit_role")).toBe("users");
  });
});

describe("PERMISSION_GROUPS", () => {
  it("has 15 modules", () => {
    expect(PERMISSION_GROUPS.length).toBe(15);
  });

  it("each group has module, label, and permissions", () => {
    PERMISSION_GROUPS.forEach((group) => {
      expect(group).toHaveProperty("module");
      expect(group).toHaveProperty("permissions");
      expect(Array.isArray(group.permissions)).toBe(true);
      expect(group.permissions.length).toBeGreaterThan(0);
    });
  });

  it("all group permissions exist in ALL_PERMISSIONS", () => {
    const allPerms = new Set(ALL_PERMISSIONS);
    PERMISSION_GROUPS.forEach((group) => {
      group.permissions.forEach((p) => {
        expect(allPerms.has(p)).toBe(true);
      });
    });
  });
});
