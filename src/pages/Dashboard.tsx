import { Home, Users, Building2, AlertTriangle, FileText, Brain, TrendingUp, Clock } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { uylar, fuqarolar, arizalar, aiTavsiyalar } from "@/data/mock-data";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const bandUylar = uylar.filter(u => u.status === "band").length;
  const boshUylar = uylar.filter(u => u.status === "bosh").length;
  const muddatYaqin = uylar.filter(u => u.status === "muddat_yaqin").length;
  const jiloyUylar = uylar.filter(u => u.tur === "jiloy").length;
  const nejiloyUylar = uylar.filter(u => u.tur === "nejiloy").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Bosh sahifa</h1>
        <p className="page-subtitle">Xush kelibsiz, {user?.ism}! — Samarqand viloyati</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Umumiy uylar" value={uylar.length} icon={<Home className="h-5 w-5 text-primary" />} trend={`Jiloy: ${jiloyUylar} | Nejiloy: ${nejiloyUylar}`} />
        <KPICard title="Band uylar" value={bandUylar} icon={<Building2 className="h-5 w-5 text-success" />} variant="success" trend="Barqaror holat" />
        <KPICard title="Bo'sh uylar" value={boshUylar} icon={<Home className="h-5 w-5 text-destructive" />} variant="danger" trend="Taqsimot kutilmoqda" />
        <KPICard title="Muddat yaqin" value={muddatYaqin} icon={<Clock className="h-5 w-5 text-warning" />} variant="warning" trend="Diqqat talab etadi" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard title="Ijtimoiy oilalar" value={fuqarolar.length} icon={<Users className="h-5 w-5 text-primary" />} />
        <KPICard title="Arizalar" value={arizalar.length} icon={<FileText className="h-5 w-5 text-primary" />} trend={`${arizalar.filter(a => a.status === "korib_chiqilmoqda").length} ta ko'rib chiqilmoqda`} />
        <KPICard title="AI tavsiyalar" value={aiTavsiyalar.length} icon={<Brain className="h-5 w-5 text-primary" />} trend="Bugun yangilandi" />
      </div>

      {/* AI Recommendations & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI */}
        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">AI tavsiyalar</h2>
          </div>
          <div className="space-y-3">
            {aiTavsiyalar.map(t => (
              <div key={t.id} className={`flex items-start gap-3 p-3 rounded-lg ${
                t.tur === "xavf" ? "bg-destructive/5 border border-destructive/20" :
                t.tur === "ogohlantirish" ? "bg-warning/10 border border-warning/20" :
                "bg-primary/5 border border-primary/20"
              }`}>
                {t.tur === "xavf" ? <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" /> :
                 t.tur === "ogohlantirish" ? <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" /> :
                 <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" />}
                <div>
                  <p className="text-sm text-foreground">{t.xabar}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.sana}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent applications */}
        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">So'nggi arizalar</h2>
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
                  {a.status === "tasdiqlandi" ? "Tasdiqlandi" :
                   a.status === "rad_etildi" ? "Rad etildi" : "Ko'rilmoqda"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
