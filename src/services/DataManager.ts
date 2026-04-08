import { type Uy, type Fuqaro, type Ariza, uylar as defaultUylar, fuqarolar as defaultFuqarolar, arizalar as defaultArizalar } from "@/data/mock-data";
import { AuditService } from "./AuditService";

function getOrInit<T>(key: string, defaults: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(key, JSON.stringify(defaults));
    return [...defaults];
  } catch {
    return [...defaults];
  }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

function logAndNotify(
  foydalanuvchi: string,
  amal: "qoshish" | "tahrirlash" | "ochirish",
  bolim: string,
  malumot: string,
  tafsilot: string
) {
  AuditService.log({ foydalanuvchi, amal, bolim, malumot, tafsilot });
}

const UYLAR_KEY = "ijtimoiy_uylar";
const FUQAROLAR_KEY = "ijtimoiy_fuqarolar";
const ARIZALAR_KEY = "ijtimoiy_arizalar";

export const DataManager = {
  // ===== UYLAR =====
  getUylar(): Uy[] {
    return getOrInit(UYLAR_KEY, defaultUylar);
  },
  addUy(uy: Uy, foydalanuvchi: string) {
    const data = this.getUylar();
    data.push(uy);
    save(UYLAR_KEY, data);
    logAndNotify(foydalanuvchi, "qoshish", "Uylar", uy.nomi, `Yangi uy qo'shildi: ${uy.nomi}`);
  },
  updateUy(id: string, updates: Partial<Uy>, foydalanuvchi: string) {
    const data = this.getUylar();
    const idx = data.findIndex((u) => u.id === id);
    if (idx >= 0) {
      const old = data[idx];
      data[idx] = { ...old, ...updates };
      save(UYLAR_KEY, data);
      logAndNotify(foydalanuvchi, "tahrirlash", "Uylar", old.nomi, `Uy tahrirlandi: ${old.nomi}`);
    }
  },
  deleteUy(id: string, foydalanuvchi: string) {
    const data = this.getUylar();
    const uy = data.find((u) => u.id === id);
    if (uy) {
      save(UYLAR_KEY, data.filter((u) => u.id !== id));
      logAndNotify(foydalanuvchi, "ochirish", "Uylar", uy.nomi, `Uy o'chirildi: ${uy.nomi}`);
    }
  },

  // ===== FUQAROLAR =====
  getFuqarolar(): Fuqaro[] {
    return getOrInit(FUQAROLAR_KEY, defaultFuqarolar);
  },
  addFuqaro(fuqaro: Fuqaro, foydalanuvchi: string) {
    const data = this.getFuqarolar();
    data.push(fuqaro);
    save(FUQAROLAR_KEY, data);
    logAndNotify(foydalanuvchi, "qoshish", "Fuqarolar", fuqaro.ism, `Yangi fuqaro qo'shildi: ${fuqaro.ism}`);
  },
  updateFuqaro(id: string, updates: Partial<Fuqaro>, foydalanuvchi: string) {
    const data = this.getFuqarolar();
    const idx = data.findIndex((f) => f.id === id);
    if (idx >= 0) {
      const old = data[idx];
      data[idx] = { ...old, ...updates };
      save(FUQAROLAR_KEY, data);
      logAndNotify(foydalanuvchi, "tahrirlash", "Fuqarolar", old.ism, `Fuqaro tahrirlandi: ${old.ism}`);
    }
  },
  deleteFuqaro(id: string, foydalanuvchi: string) {
    const data = this.getFuqarolar();
    const fuqaro = data.find((f) => f.id === id);
    if (fuqaro) {
      save(FUQAROLAR_KEY, data.filter((f) => f.id !== id));
      logAndNotify(foydalanuvchi, "ochirish", "Fuqarolar", fuqaro.ism, `Fuqaro o'chirildi: ${fuqaro.ism}`);
    }
  },

  // ===== ARIZALAR =====
  getArizalar(): Ariza[] {
    return getOrInit(ARIZALAR_KEY, defaultArizalar);
  },
  addAriza(ariza: Ariza, foydalanuvchi: string) {
    const data = this.getArizalar();
    data.push(ariza);
    save(ARIZALAR_KEY, data);
    logAndNotify(foydalanuvchi, "qoshish", "Arizalar", ariza.fuqaroIsm, `Yangi ariza qo'shildi: ${ariza.fuqaroIsm}`);
  },
  updateAriza(id: string, updates: Partial<Ariza>, foydalanuvchi: string) {
    const data = this.getArizalar();
    const idx = data.findIndex((a) => a.id === id);
    if (idx >= 0) {
      const old = data[idx];
      data[idx] = { ...old, ...updates };
      save(ARIZALAR_KEY, data);
      logAndNotify(foydalanuvchi, "tahrirlash", "Arizalar", old.fuqaroIsm, `Ariza tahrirlandi: ${old.fuqaroIsm}`);
    }
  },
  deleteAriza(id: string, foydalanuvchi: string) {
    const data = this.getArizalar();
    const ariza = data.find((a) => a.id === id);
    if (ariza) {
      save(ARIZALAR_KEY, data.filter((a) => a.id !== id));
      logAndNotify(foydalanuvchi, "ochirish", "Arizalar", ariza.fuqaroIsm, `Ariza o'chirildi: ${ariza.fuqaroIsm}`);
    }
  },

  // ===== EXPORT =====
  exportToCSV(bolim: string): string {
    let data: Record<string, unknown>[] = [];
    if (bolim === "uylar") data = this.getUylar();
    else if (bolim === "fuqarolar") data = this.getFuqarolar();
    else if (bolim === "arizalar") data = this.getArizalar();
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map((d) => headers.map((h) => `"${String(d[h] ?? "")}"`).join(","));
    return [headers.join(","), ...rows].join("\n");
  },

  resetAll() {
    localStorage.removeItem(UYLAR_KEY);
    localStorage.removeItem(FUQAROLAR_KEY);
    localStorage.removeItem(ARIZALAR_KEY);
  },
};
