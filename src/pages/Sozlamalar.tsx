import { useState } from "react";
import { Settings, Users, Shield, Link, Globe, Pencil, Save, X, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { DataManager } from "@/services/DataManager";
import { toast } from "sonner";

interface Rahbar {
  id: string;
  ism: string;
  lavozim: string;
  telefon: string;
  role: string;
}

const defaultRahbarlar: Rahbar[] = [
  { id: "r1", ism: "Sultonov Shavkat Abdullayevich", lavozim: "Hokim", telefon: "+998 90 000 00 02", role: "hokim" },
  { id: "r2", ism: "Qodirov Bobur Anvarovich", lavozim: "Uy-joy bo'limi rahbari", telefon: "+998 90 000 00 03", role: "uy_joy" },
  { id: "r3", ism: "Murodova Zulfiya Karimovna", lavozim: "Ayollar bo'limi rahbari", telefon: "+998 90 000 00 04", role: "ayollar" },
];

const getRahbarlar = (): Rahbar[] => {
  const stored = localStorage.getItem("rahbarlar");
  return stored ? JSON.parse(stored) : defaultRahbarlar;
};

const saveRahbarlar = (data: Rahbar[]) => {
  localStorage.setItem("rahbarlar", JSON.stringify(data));
};

const Sozlamalar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isHokim = user?.role === "hokim";

  const [rahbarlar, setRahbarlar] = useState<Rahbar[]>(getRahbarlar());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Rahbar>>({});

  const integratsiyalar = [
    { nomi: "MyID", holat: t("ulangan"), icon: Shield },
    { nomi: "MyGov", holat: t("ulangan"), icon: Globe },
    { nomi: "Telegram Bot", holat: t("sozlanmoqda"), icon: Link },
    { nomi: "SMS xizmati", holat: t("faol"), icon: Link },
  ];

  const rollar = [
    { nomi: t("hokim"), tavsif: t("barcha_statistikani_koradi"), foydalanuvchilar: 1 },
    { nomi: t("uy_joy_bolimi"), tavsif: t("uylar_bilan_ishlaydi"), foydalanuvchilar: 3 },
    { nomi: t("ayollar_bolimi"), tavsif: t("ijtimoiy_oilalar_bilan"), foydalanuvchilar: 2 },
  ];

  const arizalar = DataManager.getArizalar();
  const statsData = {
    jami: arizalar.length,
    tasdiqlandi: arizalar.filter(a => a.status === "tasdiqlandi").length,
    korilmoqda: arizalar.filter(a => a.status === "korib_chiqilmoqda").length,
    rad: arizalar.filter(a => a.status === "rad_etildi").length,
  };

  const startEdit = (r: Rahbar) => {
    setEditingId(r.id);
    setEditForm({ ism: r.ism, lavozim: r.lavozim, telefon: r.telefon });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = (id: string) => {
    if (!editForm.ism?.trim() || !editForm.lavozim?.trim()) {
      toast.error("Ism va lavozim to'ldirilishi shart");
      return;
    }
    const updated = rahbarlar.map(r =>
      r.id === id ? { ...r, ism: editForm.ism!, lavozim: editForm.lavozim!, telefon: editForm.telefon || r.telefon } : r
    );
    setRahbarlar(updated);
    saveRahbarlar(updated);
    setEditingId(null);
    setEditForm({});
    toast.success(`${t("saqlash")} — ${editForm.ism}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">{t("sozlamalar")}</h1>
        <p className="page-subtitle">{t("sozlamalar_tavsifi")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integratsiyalar */}
        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />{t("integratsiyalar")}
          </h2>
          <div className="space-y-3">
            {integratsiyalar.map(i => (
              <div key={i.nomi} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <i.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{i.nomi}</span>
                </div>
                <span className={`status-band ${i.holat === t("ulangan") || i.holat === t("faol") ? "status-band--yashil" : "status-band--sariq"}`}>{i.holat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rollar */}
        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />{t("rollar_va_foydalanuvchilar")}
          </h2>
          <div className="space-y-3">
            {rollar.map(r => (
              <div key={r.nomi} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.nomi}</p>
                  <p className="text-xs text-muted-foreground">{r.tavsif}</p>
                </div>
                <span className="text-sm text-muted-foreground">{r.foydalanuvchilar} {t("ta")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rahbarlar boshqaruvi - Hokim only */}
      {isHokim && (
        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />{t("rahbarlarni_boshqarish")}
          </h2>
          <div className="space-y-3">
            {rahbarlar.map(r => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                {editingId === r.id ? (
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 mr-3">
                    <Input value={editForm.ism || ""} onChange={e => setEditForm(p => ({ ...p, ism: e.target.value }))} placeholder="Ism" />
                    <Input value={editForm.lavozim || ""} onChange={e => setEditForm(p => ({ ...p, lavozim: e.target.value }))} placeholder={t("lavozim")} />
                    <Input value={editForm.telefon || ""} onChange={e => setEditForm(p => ({ ...p, telefon: e.target.value }))} placeholder="Telefon" />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.ism}</p>
                    <p className="text-xs text-muted-foreground">{r.lavozim} • {r.telefon}</p>
                  </div>
                )}
                <div className="flex gap-1">
                  {editingId === r.id ? (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => saveEdit(r.id)}>
                        <Save className="h-4 w-4 text-success" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => startEdit(r)}>
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Murojaatlar statistikasi - Hokim only */}
      {isHokim && (
        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />{t("murojaatlar_statistikasi")}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{statsData.jami}</p>
              <p className="text-xs text-muted-foreground">{t("jami_murojaatlar")}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-success">{statsData.tasdiqlandi}</p>
              <p className="text-xs text-muted-foreground">{t("tasdiqlandi")}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-warning">{statsData.korilmoqda}</p>
              <p className="text-xs text-muted-foreground">{t("jarayonda")}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-destructive">{statsData.rad}</p>
              <p className="text-xs text-muted-foreground">{t("rad_etildi")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sozlamalar;