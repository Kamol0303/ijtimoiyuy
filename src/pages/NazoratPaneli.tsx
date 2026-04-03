import { useState, useEffect } from "react";
import { Shield, Activity, AlertTriangle, Users, FileBarChart, Bell, Brain, TrendingUp, CheckCircle } from "lucide-react";
import { AIMonitor, type AIAlert } from "@/services/AIMonitor";
import { AuditService } from "@/services/AuditService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const alertIcons: Record<string, React.ElementType> = {
  xavf: AlertTriangle,
  ogohlantirish: Bell,
  malumo: CheckCircle,
};

const alertColors: Record<string, string> = {
  xavf: "bg-destructive/10 border-destructive/20 text-destructive",
  ogohlantirish: "bg-warning/10 border-warning/20 text-accent-foreground",
  malumo: "bg-primary/5 border-primary/20 text-primary",
};

const NazoratPaneli = () => {
  const [stats, setStats] = useState({ bugungiOzgarishlar: 0, yangiMalumotlar: 0, aiMuammolar: 0, faolFoydalanuvchilar: 0 });
  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [logs, setLogs] = useState(AuditService.getBugungi());

  useEffect(() => {
    refresh();
    const h1 = () => refresh();
    const h2 = () => refresh();
    window.addEventListener("audit-log-added", h1);
    window.addEventListener("ai-alert-added", h2);
    return () => {
      window.removeEventListener("audit-log-added", h1);
      window.removeEventListener("ai-alert-added", h2);
    };
  }, []);

  function refresh() {
    setStats(AIMonitor.getStats());
    setAlerts(AIMonitor.getAlerts());
    setLogs(AuditService.getBugungi());
  }

  // Bo'lim statistikasi
  const bolimStats: Record<string, number> = {};
  logs.forEach((l) => {
    bolimStats[l.bolim] = (bolimStats[l.bolim] || 0) + 1;
  });
  const sortedBolimlar = Object.entries(bolimStats).sort((a, b) => b[1] - a[1]);

  // Amal turlari
  const amalStats = {
    qoshish: logs.filter((l) => l.amal === "qoshish").length,
    tahrirlash: logs.filter((l) => l.amal === "tahrirlash").length,
    ochirish: logs.filter((l) => l.amal === "ochirish").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            Ma'lumotlar nazorati va AI kuzatuv
          </h1>
          <p className="page-subtitle">Tizim holati va sun'iy intellekt monitoring</p>
        </div>
        <Button onClick={() => { AIMonitor.analyze(); refresh(); }} className="gap-2">
          <Brain className="h-4 w-4" />
          AI tahlil boshlash
        </Button>
      </div>

      {/* KPI paneli */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.bugungiOzgarishlar}</p>
              <p className="text-xs text-muted-foreground">Bugungi o'zgarishlar</p>
            </div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.yangiMalumotlar}</p>
              <p className="text-xs text-muted-foreground">Yangi ma'lumotlar</p>
            </div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.aiMuammolar}</p>
              <p className="text-xs text-muted-foreground">AI aniqlagan muammolar</p>
            </div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Users className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.faolFoydalanuvchilar}</p>
              <p className="text-xs text-muted-foreground">Faol foydalanuvchilar</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI ogohlantirishlar */}
        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">AI ogohlantirishlar</h2>
            </div>
            {alerts.some((a) => !a.oquldi) && (
              <Button variant="ghost" size="sm" onClick={() => { AIMonitor.markAllRead(); refresh(); }}>
                Barchasini o'qildi
              </Button>
            )}
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">AI ogohlantirishlar yo'q</p>
              </div>
            ) : (
              alerts.slice(0, 20).map((alert) => {
                const Icon = alertIcons[alert.tur] || Bell;
                return (
                  <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${alertColors[alert.tur]} ${!alert.oquldi ? "ring-1 ring-primary/20" : "opacity-75"}`}>
                    <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{alert.xabar}</p>
                      <p className="text-xs opacity-60 mt-1">{alert.sana} {alert.vaqt}</p>
                    </div>
                    {!alert.oquldi && (
                      <Badge variant="secondary" className="shrink-0 text-xs">Yangi</Badge>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Analitika */}
        <div className="space-y-4">
          {/* Bo'lim statistikasi */}
          <div className="bg-card rounded-xl border p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileBarChart className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Bo'lim statistikasi</h2>
            </div>
            {sortedBolimlar.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Bugun hali ma'lumot yo'q</p>
            ) : (
              <div className="space-y-3">
                {sortedBolimlar.map(([bolim, count]) => (
                  <div key={bolim} className="flex items-center gap-3">
                    <span className="text-sm text-foreground min-w-[100px]">{bolim}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (count / Math.max(...Object.values(bolimStats))) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground min-w-[30px] text-right">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amal turlari */}
          <div className="bg-card rounded-xl border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Bugungi amallar</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-success/5">
                <p className="text-xl font-bold text-success">{amalStats.qoshish}</p>
                <p className="text-xs text-muted-foreground">Qo'shildi</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <p className="text-xl font-bold text-primary">{amalStats.tahrirlash}</p>
                <p className="text-xs text-muted-foreground">Tahrirlandi</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-destructive/5">
                <p className="text-xl font-bold text-destructive">{amalStats.ochirish}</p>
                <p className="text-xs text-muted-foreground">O'chirildi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NazoratPaneli;
