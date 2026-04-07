import { useState } from "react";
import { CheckCircle, Search, RotateCcw, Archive } from "lucide-react";
import { DataManager } from "@/services/DataManager";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab = "uylar" | "fuqarolar" | "arizalar";

const YakunlanganIshlar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>("uylar");
  const [qidiruv, setQidiruv] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const isHokim = user?.role === "hokim";

  const yakunlanganUylar = DataManager.getUylar().filter(u => (u as any).holat === "yakunlangan");
  const yakunlanganFuqarolar = DataManager.getFuqarolar().filter(f => (f as any).holat === "yakunlangan");
  const yakunlanganArizalar = DataManager.getArizalar().filter(a => (a as any).holat === "yakunlangan");

  const handleRestore = (bolim: string, id: string) => {
    if (bolim === "uylar") DataManager.updateUy(id, { holat: "aktiv" } as any, user?.ism || "");
    if (bolim === "fuqarolar") DataManager.updateFuqaro(id, { holat: "aktiv" } as any, user?.ism || "");
    if (bolim === "arizalar") DataManager.updateAriza(id, { holat: "aktiv" } as any, user?.ism || "");
    toast.success(t("qayta_tiklandi"));
    setRefreshKey(k => k + 1);
  };

  const handleArchive = (bolim: string, id: string) => {
    if (bolim === "uylar") DataManager.updateUy(id, { holat: "arxivlangan" } as any, user?.ism || "");
    if (bolim === "fuqarolar") DataManager.updateFuqaro(id, { holat: "arxivlangan" } as any, user?.ism || "");
    if (bolim === "arizalar") DataManager.updateAriza(id, { holat: "arxivlangan" } as any, user?.ism || "");
    toast.success(t("arxivlash") + " — " + t("bajarildi"));
    setRefreshKey(k => k + 1);
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "uylar", label: t("uylar"), count: yakunlanganUylar.length },
    { key: "fuqarolar", label: t("fuqarolar"), count: yakunlanganFuqarolar.length },
    { key: "arizalar", label: t("arizalar"), count: yakunlanganArizalar.length },
  ];

  const renderItems = () => {
    if (tab === "uylar") {
      const items = yakunlanganUylar.filter(u => u.nomi.toLowerCase().includes(qidiruv.toLowerCase()));
      return items.map(u => (
        <div key={u.id} className="bg-card rounded-xl border p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{u.nomi}</h3>
            <p className="text-sm text-muted-foreground">{u.manzil}</p>
            <p className="text-xs text-primary">{u.tuman}</p>
          </div>
          {isHokim && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleRestore("uylar", u.id)} className="gap-1">
                <RotateCcw className="h-3.5 w-3.5" /> {t("tiklash")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleArchive("uylar", u.id)} className="gap-1">
                <Archive className="h-3.5 w-3.5" /> {t("arxivlash")}
              </Button>
            </div>
          )}
        </div>
      ));
    }
    if (tab === "fuqarolar") {
      const items = yakunlanganFuqarolar.filter(f => f.ism.toLowerCase().includes(qidiruv.toLowerCase()));
      return items.map(f => (
        <div key={f.id} className="bg-card rounded-xl border p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{f.ism}</h3>
            <p className="text-sm text-muted-foreground">{f.tuman}</p>
          </div>
          {isHokim && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleRestore("fuqarolar", f.id)} className="gap-1">
                <RotateCcw className="h-3.5 w-3.5" /> {t("tiklash")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleArchive("fuqarolar", f.id)} className="gap-1">
                <Archive className="h-3.5 w-3.5" /> {t("arxivlash")}
              </Button>
            </div>
          )}
        </div>
      ));
    }
    const items = yakunlanganArizalar.filter(a => a.fuqaroIsm.toLowerCase().includes(qidiruv.toLowerCase()));
    return items.map(a => (
      <div key={a.id} className="bg-card rounded-xl border p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{a.fuqaroIsm}</h3>
          <p className="text-sm text-muted-foreground">{a.tur} — {a.tuman}</p>
        </div>
        {isHokim && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleRestore("arizalar", a.id)} className="gap-1">
              <RotateCcw className="h-3.5 w-3.5" /> {t("tiklash")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleArchive("arizalar", a.id)} className="gap-1">
              <Archive className="h-3.5 w-3.5" /> {t("arxivlash")}
            </Button>
          </div>
        )}
      </div>
    ));
  };

  const items = renderItems();

  return (
    <div className="space-y-6 animate-fade-in" key={refreshKey}>
      <div>
        <h1 className="page-header">{t("yakunlangan_ishlar")}</h1>
        <p className="page-subtitle">{t("samarqand_viloyati")}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("qidirish_umumiy")} value={qidiruv} onChange={e => setQidiruv(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {tabs.map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${tab === tb.key ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`}
            >
              {tb.label} ({tb.count})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {items}
        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{t("yakunlangan_topilmadi")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YakunlanganIshlar;