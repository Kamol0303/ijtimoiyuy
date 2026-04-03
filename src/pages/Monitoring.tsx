import { uylar, fuqarolar, arizalar } from "@/data/mock-data";
import { BarChart3, TrendingUp, Home, Users, AlertTriangle } from "lucide-react";

const Monitoring = () => {
  const bandUylar = uylar.filter(u => u.status === "band").length;
  const boshUylar = uylar.filter(u => u.status === "bosh").length;
  const muddatYaqin = uylar.filter(u => u.status === "muddat_yaqin").length;
  const total = uylar.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Monitoring</h1>
        <p className="page-subtitle">Samarqand viloyati — real-time holat nazorati</p>
      </div>

      {/* Visual bars */}
      <div className="bg-card rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Uylar holati</h2>
        <div className="space-y-5">
          {[
            { label: "Band uylar", value: bandUylar, color: "bg-success", pct: (bandUylar / total * 100) },
            { label: "Bo'sh uylar", value: boshUylar, color: "bg-destructive", pct: (boshUylar / total * 100) },
            { label: "Muddat yaqin", value: muddatYaqin, color: "bg-warning", pct: (muddatYaqin / total * 100) },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground font-medium">{item.label}</span>
                <span className="text-muted-foreground">{item.value} ta ({item.pct.toFixed(0)}%)</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color} transition-all duration-700`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border p-5 text-center">
          <Home className="h-8 w-8 text-primary mx-auto mb-3" />
          <p className="text-3xl font-bold text-foreground">{total}</p>
          <p className="text-sm text-muted-foreground">Umumiy obyektlar</p>
        </div>
        <div className="bg-card rounded-xl border p-5 text-center">
          <Users className="h-8 w-8 text-secondary mx-auto mb-3" />
          <p className="text-3xl font-bold text-foreground">{fuqarolar.length}</p>
          <p className="text-sm text-muted-foreground">Fuqarolar</p>
        </div>
        <div className="bg-card rounded-xl border p-5 text-center">
          <AlertTriangle className="h-8 w-8 text-warning mx-auto mb-3" />
          <p className="text-3xl font-bold text-foreground">{arizalar.filter(a => a.status === "korib_chiqilmoqda").length}</p>
          <p className="text-sm text-muted-foreground">Kutilayotgan arizalar</p>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
