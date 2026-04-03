import { AuditService, type AuditLog } from "./AuditService";

export interface AIAlert {
  id: string;
  xabar: string;
  tur: "ogohlantirish" | "xavf" | "malumo";
  sana: string;
  vaqt: string;
  oquldi: boolean;
}

const ALERTS_KEY = "ijtimoiy_ai_alerts";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getAlerts(): AIAlert[] {
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAlerts(alerts: AIAlert[]) {
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
}

function addAlert(xabar: string, tur: AIAlert["tur"]): AIAlert {
  const now = new Date();
  const alert: AIAlert = {
    id: generateId(),
    xabar,
    tur,
    sana: now.toISOString().split("T")[0],
    vaqt: now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
    oquldi: false,
  };
  const alerts = [alert, ...getAlerts()].slice(0, 200);
  saveAlerts(alerts);
  window.dispatchEvent(new CustomEvent("ai-alert-added", { detail: alert }));
  return alert;
}

export const AIMonitor = {
  analyze() {
    const bugungiLoglar = AuditService.getBugungi();

    // Juda ko'p o'zgartirishlar
    const userCounts: Record<string, number> = {};
    bugungiLoglar.forEach((l) => {
      userCounts[l.foydalanuvchi] = (userCounts[l.foydalanuvchi] || 0) + 1;
    });
    for (const [user, count] of Object.entries(userCounts)) {
      if (count >= 10) {
        addAlert(
          `"${user}" bugun ${count} ta o'zgartirish kiritdi — shubhali faollik`,
          "xavf"
        );
      }
    }

    // Bo'lim bo'yicha ko'p o'zgarish
    const bolimCounts: Record<string, number> = {};
    bugungiLoglar.forEach((l) => {
      bolimCounts[l.bolim] = (bolimCounts[l.bolim] || 0) + 1;
    });
    for (const [bolim, count] of Object.entries(bolimCounts)) {
      if (count >= 5) {
        addAlert(
          `"${bolim}" bo'limida bugun ${count} ta o'zgartirish kiritildi`,
          "ogohlantirish"
        );
      }
    }

    // O'chirish amallari
    const ochirishlar = bugungiLoglar.filter((l) => l.amal === "ochirish");
    if (ochirishlar.length >= 3) {
      addAlert(
        `Bugun ${ochirishlar.length} ta ma'lumot o'chirildi — tekshirish tavsiya etiladi`,
        "xavf"
      );
    }

    // Yangi qo'shilganlar
    const yangilar = bugungiLoglar.filter((l) => l.amal === "qoshish");
    if (yangilar.length > 0) {
      addAlert(
        `Bugun ${yangilar.length} ta yangi ma'lumot kiritildi`,
        "malumo"
      );
    }
  },

  onNewLog(log: AuditLog) {
    if (log.amal === "qoshish") {
      addAlert(`Yangi ma'lumot qo'shildi: ${log.bolim} → ${log.malumot}`, "malumo");
    }
    if (log.amal === "ochirish") {
      addAlert(`Ma'lumot o'chirildi: ${log.bolim} → ${log.malumot}`, "ogohlantirish");
    }
    if (log.amal === "tahrirlash") {
      const bugungiEdits = AuditService.getBugungi().filter(
        (l) => l.foydalanuvchi === log.foydalanuvchi && l.amal === "tahrirlash"
      );
      if (bugungiEdits.length >= 5) {
        addAlert(
          `"${log.foydalanuvchi}" juda ko'p tahrirlash kiritmoqda (${bugungiEdits.length} ta)`,
          "xavf"
        );
      }
    }
  },

  getAlerts(): AIAlert[] {
    return getAlerts();
  },

  getUnread(): AIAlert[] {
    return getAlerts().filter((a) => !a.oquldi);
  },

  markRead(id: string) {
    const alerts = getAlerts().map((a) => (a.id === id ? { ...a, oquldi: true } : a));
    saveAlerts(alerts);
  },

  markAllRead() {
    const alerts = getAlerts().map((a) => ({ ...a, oquldi: true }));
    saveAlerts(alerts);
  },

  getStats() {
    const logs = AuditService.getBugungi();
    const alerts = getAlerts();
    const bugun = new Date().toISOString().split("T")[0];
    return {
      bugungiOzgarishlar: logs.length,
      yangiMalumotlar: logs.filter((l) => l.amal === "qoshish").length,
      aiMuammolar: alerts.filter((a) => a.tur === "xavf" && a.sana === bugun).length,
      faolFoydalanuvchilar: new Set(logs.map((l) => l.foydalanuvchi)).size,
    };
  },
};
