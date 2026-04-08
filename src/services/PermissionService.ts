import type { UserRole } from "@/context/AuthContext";

export type Permission =
  | "qoshish"
  | "tahrirlash"
  | "ochirish"
  | "yakunlash"
  | "export"
  | "audit_log"
  | "yakunlangan_ishlar";

export type Module = "uylar" | "fuqarolar" | "arizalar" | "shartnomalar" | "monitoring" | "hisobotlar" | "xabarnomalar" | "sozlamalar" | "amallar_tarixi" | "nazorat_paneli";

// Role → Module → allowed permissions
const ROLE_PERMISSIONS: Record<UserRole, Record<string, Permission[]>> = {
  hokim: {
    uylar: ["qoshish", "tahrirlash", "ochirish", "yakunlash", "export"],
    fuqarolar: ["qoshish", "tahrirlash", "ochirish", "yakunlash", "export"],
    arizalar: ["qoshish", "tahrirlash", "ochirish", "yakunlash", "export"],
    shartnomalar: ["qoshish", "tahrirlash", "ochirish", "yakunlash", "export"],
    audit_log: ["audit_log"],
    yakunlangan_ishlar: ["yakunlangan_ishlar"],
    monitoring: ["export"],
    hisobotlar: ["export"],
    sozlamalar: ["tahrirlash"],
    nazorat_paneli: ["audit_log"],
    amallar_tarixi: ["audit_log"],
  },
  uy_joy: {
    uylar: ["qoshish", "tahrirlash", "ochirish", "yakunlash", "export"],
    fuqarolar: ["qoshish", "tahrirlash", "yakunlash", "export"],
    arizalar: ["qoshish", "tahrirlash", "yakunlash", "export"],
    shartnomalar: ["qoshish", "tahrirlash", "export"],
    xabarnomalar: [],
  },
  ayollar: {
    fuqarolar: ["qoshish", "tahrirlash", "ochirish", "yakunlash", "export"],
    arizalar: ["qoshish", "tahrirlash", "ochirish", "yakunlash", "export"],
    xabarnomalar: [],
  },
};

export const PermissionService = {
  hasPermission(role: UserRole, module: Module | string, permission: Permission): boolean {
    const rolePerms = ROLE_PERMISSIONS[role];
    if (!rolePerms) return false;
    const modulePerms = rolePerms[module];
    if (!modulePerms) return false;
    return modulePerms.includes(permission);
  },

  canAdd(role: UserRole, module: string): boolean {
    return this.hasPermission(role, module, "qoshish");
  },

  canEdit(role: UserRole, module: string): boolean {
    return this.hasPermission(role, module, "tahrirlash");
  },

  canDelete(role: UserRole, module: string): boolean {
    return this.hasPermission(role, module, "ochirish");
  },

  canFinish(role: UserRole, module: string): boolean {
    return this.hasPermission(role, module, "yakunlash");
  },

  canExport(role: UserRole, module: string): boolean {
    return this.hasPermission(role, module, "export");
  },

  canViewAuditLog(role: UserRole): boolean {
    return role === "hokim";
  },

  canViewYakunlangan(role: UserRole): boolean {
    return role === "hokim";
  },

  // Hokim does hard delete, others do soft delete (arxivlash)
  isHardDelete(role: UserRole): boolean {
    return role === "hokim";
  },
};
