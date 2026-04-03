export interface AuditLog {
  id: string;
  foydalanuvchi: string;
  amal: "qoshish" | "tahrirlash" | "ochirish";
  bolim: string;
  malumot: string;
  tafsilot: string;
  sana: string;
  vaqt: string;
}

const STORAGE_KEY = "ijtimoiy_audit_logs";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs: AuditLog[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export const AuditService = {
  log(entry: Omit<AuditLog, "id" | "sana" | "vaqt">): AuditLog {
    const now = new Date();
    const log: AuditLog = {
      ...entry,
      id: generateId(),
      sana: now.toISOString().split("T")[0],
      vaqt: now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
    };
    const logs = [log, ...getLogs()].slice(0, 500);
    saveLogs(logs);
    window.dispatchEvent(new CustomEvent("audit-log-added", { detail: log }));
    return log;
  },

  getAll(): AuditLog[] {
    return getLogs();
  },

  getByBolim(bolim: string): AuditLog[] {
    return getLogs().filter((l) => l.bolim === bolim);
  },

  getBugungi(): AuditLog[] {
    const bugun = new Date().toISOString().split("T")[0];
    return getLogs().filter((l) => l.sana === bugun);
  },

  getHaftalik(): AuditLog[] {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    return getLogs().filter((l) => l.sana >= weekAgo);
  },

  getOylik(): AuditLog[] {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    return getLogs().filter((l) => l.sana >= monthAgo);
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
};
