import { useState, useEffect } from "react";
import { Shield, Activity, Users, FileBarChart, TrendingUp } from "lucide-react";
import { AuditService } from "@/services/AuditService";
import { useLanguage } from "@/context/LanguageContext";

const NazoratPaneli = () => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState(AuditService.getBugungi());

  useEffect(() => {
    const refresh = () => setLogs(AuditService.getBugungi());
    window.addEventListener("audit-log-added", refresh);
    return () => window.removeEventListener("audit-log-added", refresh);
  }, []);

  const bolimStats: Record<string, number> = {};
  logs.forEach((l) => {
    bolimStats[l.bolim] = (bolimStats[l.bolim] || 0) + 1;
  });
  const sortedBolimlar = Object.entries(bolimStats).sort((a, b) => b[1] - a[1]);

  const amalStats = {
    qoshish: logs.filter((l) => l.amal === "qoshish").length,
    tahrirlash: logs.filter((l) => l.amal === "tahrirlash").length,
    ochirish: logs.filter((l) => l.amal === "ochirish").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          {t("malumotlar_nazorati")}
        </h1>
        <p className="page-subtitle">{t("tizim_holati_tavsif")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Activity className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{logs.length}</p>
              <p className="text-xs text-muted-foreground">{t("bugungi_ozgarishlar")}</p>
            </div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10"><TrendingUp className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{logs.filter(l => l.amal === "qoshish").length}</p>
              <p className="text-xs text-muted-foreground">{t("yangi_malumotlar")}</p>
            </div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20"><Users className="h-5 w-5 text-accent-foreground" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{new Set(logs.map(l => l.foydalanuvchi)).size}</p>
              <p className="text-xs text-muted-foreground">{t("faol_foydalanuvchilar")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileBarChart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{t("bolim_statistikasi")}</h2>
          </div>
          {sortedBolimlar.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{t("bugun_malumot_yoq")}</p>
          ) : (
            <div className="space-y-3">
              {sortedBolimlar.map(([bolim, count]) => (
                <div key={bolim} className="flex items-center gap-3">
                  <span className="text-sm text-foreground min-w-[100px]">{bolim}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (count / Math.max(...Object.values(bolimStats))) * 100)}%` }} />
                  </div>
                  <span className="text-sm font-medium text-foreground min-w-[30px] text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">{t("bugungi_amallar")}</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-success/5">
              <p className="text-xl font-bold text-success">{amalStats.qoshish}</p>
              <p className="text-xs text-muted-foreground">{t("qoshildi")}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/5">
              <p className="text-xl font-bold text-primary">{amalStats.tahrirlash}</p>
              <p className="text-xs text-muted-foreground">{t("tahrirlandi")}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-destructive/5">
              <p className="text-xl font-bold text-destructive">{amalStats.ochirish}</p>
              <p className="text-xs text-muted-foreground">{t("ochirildi_label")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NazoratPaneli;
