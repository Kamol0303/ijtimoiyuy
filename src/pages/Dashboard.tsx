import { Home, Users, Building2, AlertTriangle, FileText, TrendingUp, Clock, Activity, Shield, BarChart3, Heart, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { KPICard } from "@/components/KPICard";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { DataManager } from "@/services/DataManager";
import { AuditService } from "@/services/AuditService";

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const uylar = DataManager.getUylar().filter(u => (u as any).holat !== "yakunlangan" && (u as any).holat !== "arxivlangan");
  const fuqarolar = DataManager.getFuqarolar().filter(f => (f as any).holat !== "yakunlangan" && (f as any).holat !== "arxivlangan");
  const arizalar = DataManager.getArizalar().filter(a => (a as any).holat !== "yakunlangan" && (a as any).holat !== "arxivlangan");

  const bandUylar = uylar.filter(u => u.status === "band").length;
  const boshUylar = uylar.filter(u => u.status === "bosh").length;
  const muddatYaqin = uylar.filter(u => u.status === "muddat_yaqin").length;
  const jiloyUylar = uylar.filter(u => u.tur === "jiloy").length;
  const nejiloyUylar = uylar.filter(u => u.tur === "nejiloy").length;

  const todayLogs = AuditService.getAll().filter(l => l.sana.startsWith(new Date().toISOString().slice(0, 10)));
  const isHokim = user?.role === "hokim";

  if (user?.role === "uy_joy") {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="page-header">{t("uy_joy_dashboard")}</h1>
          <p className="page-subtitle">{t("xush_kelibsiz")}, {user.ism}! — {t("samarqand_viloyati")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title={t("umumiy_uylar")} value={uylar.length} icon={<Home className="h-5 w-5 text-primary" />}
            trend={`${t("jiloy")}: ${jiloyUylar} | ${t("nejiloy")}: ${nejiloyUylar}`}
            onClick={() => navigate("/uylar")} />
          <KPICard title={t("band_uylar")} value={bandUylar} icon={<Building2 className="h-5 w-5 text-success" />}
            variant="success" trend={t("barqaror_holat")}
            onClick={() => navigate("/uylar?status=band")} />
          <KPICard title={t("bosh_uylar")} value={boshUylar} icon={<Home className="h-5 w-5 text-destructive" />}
            variant="danger" trend={t("taqsimot_kutilmoqda")}
            onClick={() => navigate("/uylar?status=bosh")} />
          <KPICard title={t("muddat_yaqin")} value={muddatYaqin} icon={<Clock className="h-5 w-5 text-warning" />}
            variant="warning" trend={t("diqqat_talab_etadi")}
            onClick={() => navigate("/uylar?status=muddat_yaqin")} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KPICard title={t("fuqarolar")} value={fuqarolar.length} icon={<Users className="h-5 w-5 text-primary" />}
            onClick={() => navigate("/fuqarolar")} />
          <KPICard title={t("arizalar")} value={arizalar.length} icon={<FileText className="h-5 w-5 text-primary" />}
            trend={`${arizalar.filter(a => a.status === "korib_chiqilmoqda").length} ${t("ta_korib_chiqilmoqda")}`}
            onClick={() => navigate("/arizalar")} />
        </div>

        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{t("songgi_arizalar")}</h2>
          </div>
          <div className="space-y-3">
            {arizalar.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.fuqaroIsm}</p>
                  <p className="text-xs text-muted-foreground">{a.tur} — {a.tuman}</p>
                </div>
                <span className={`status-band ${
                  a.status === "tasdiqlandi" ? "status-band--yashil" :
                  a.status === "rad_etildi" ? "status-band--qizil" :
                  "status-band--sariq"
                }`}>
                  {a.status === "tasdiqlandi" ? t("tasdiqlandi") :
                   a.status === "rad_etildi" ? t("rad_etildi") : t("korilmoqda")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === "ayollar") {
    const ayollarFuqarolar = fuqarolar.filter(f => 
      f.ijtimoiyHolat.includes("ona") || f.ijtimoiyHolat.includes("ayol") || 
      f.ijtimoiyHolat.includes("Zo'ravonlik") || f.ijtimoiyHolat.includes("bolali")
    );
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="page-header">{t("ayollar_dashboard")}</h1>
          <p className="page-subtitle">{t("xush_kelibsiz")}, {user.ism}! — {t("samarqand_viloyati")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard title={t("ijtimoiy_oilalar")} value={fuqarolar.length} icon={<Users className="h-5 w-5 text-primary" />}
            onClick={() => navigate("/fuqarolar")} />
          <KPICard title={t("himoyada")} value={ayollarFuqarolar.length} icon={<Heart className="h-5 w-5 text-destructive" />}
            variant="danger" />
          <KPICard title={t("arizalar")} value={arizalar.length} icon={<FileText className="h-5 w-5 text-primary" />}
            trend={`${arizalar.filter(a => a.status === "korib_chiqilmoqda").length} ${t("ta_korib_chiqilmoqda")}`}
            onClick={() => navigate("/arizalar")} />
        </div>

        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{t("ijtimoiy_oilalar")}</h2>
          </div>
          <div className="space-y-3">
            {fuqarolar.slice(0, 6).map(f => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{f.ism}</p>
                  <p className="text-xs text-muted-foreground">{f.tuman}</p>
                </div>
                <span className="status-band status-band--yashil">{f.ijtimoiyHolat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{t("songgi_arizalar")}</h2>
          </div>
          <div className="space-y-3">
            {arizalar.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.fuqaroIsm}</p>
                  <p className="text-xs text-muted-foreground">{a.tur} — {a.tuman}</p>
                </div>
                <span className={`status-band ${
                  a.status === "tasdiqlandi" ? "status-band--yashil" :
                  a.status === "rad_etildi" ? "status-band--qizil" :
                  "status-band--sariq"
                }`}>
                  {a.status === "tasdiqlandi" ? t("tasdiqlandi") :
                   a.status === "rad_etildi" ? t("rad_etildi") : t("korilmoqda")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">{t("bosh_sahifa")}</h1>
        <p className="page-subtitle">{t("xush_kelibsiz")}, {user?.ism}! — {t("samarqand_viloyati")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title={t("umumiy_uylar")} value={uylar.length} icon={<Home className="h-5 w-5 text-primary" />}
          trend={`${t("jiloy")}: ${jiloyUylar} | ${t("nejiloy")}: ${nejiloyUylar}`}
          onClick={() => navigate("/uylar")} />
        <KPICard title={t("band_uylar")} value={bandUylar} icon={<Building2 className="h-5 w-5 text-success" />}
          variant="success" trend={t("barqaror_holat")}
          onClick={() => navigate("/uylar?status=band")} />
        <KPICard title={t("bosh_uylar")} value={boshUylar} icon={<Home className="h-5 w-5 text-destructive" />}
          variant="danger" trend={t("taqsimot_kutilmoqda")}
          onClick={() => navigate("/uylar?status=bosh")} />
        <KPICard title={t("muddat_yaqin")} value={muddatYaqin} icon={<Clock className="h-5 w-5 text-warning" />}
          variant="warning" trend={t("diqqat_talab_etadi")}
          onClick={() => navigate("/uylar?status=muddat_yaqin")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPICard title={t("ijtimoiy_oilalar")} value={fuqarolar.length} icon={<Users className="h-5 w-5 text-primary" />}
          onClick={() => navigate("/fuqarolar")} />
        <KPICard title={t("arizalar")} value={arizalar.length} icon={<FileText className="h-5 w-5 text-primary" />}
          trend={`${arizalar.filter(a => a.status === "korib_chiqilmoqda").length} ${t("ta_korib_chiqilmoqda")}`}
          onClick={() => navigate("/arizalar")} />
      </div>

      {isHokim && (
        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{t("tizim_holati")}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <Activity className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{todayLogs.length}</p>
              <p className="text-xs text-muted-foreground">{t("bugungi_ozgarishlar")}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <TrendingUp className="h-5 w-5 text-success mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{uylar.length + fuqarolar.length}</p>
              <p className="text-xs text-muted-foreground">{t("yangi_malumotlar")}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <BarChart3 className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-xs text-muted-foreground">{t("faol_foydalanuvchilar")}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">{t("songgi_arizalar")}</h2>
        </div>
        <div className="space-y-3">
          {arizalar.slice(0, 5).map(a => (
            <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium text-foreground">{a.fuqaroIsm}</p>
                <p className="text-xs text-muted-foreground">{a.tur} — {a.tuman}</p>
              </div>
              <span className={`status-band ${
                a.status === "tasdiqlandi" ? "status-band--yashil" :
                a.status === "rad_etildi" ? "status-band--qizil" :
                "status-band--sariq"
              }`}>
                {a.status === "tasdiqlandi" ? t("tasdiqlandi") :
                 a.status === "rad_etildi" ? t("rad_etildi") : t("korilmoqda")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
