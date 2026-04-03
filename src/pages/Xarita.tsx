import { useState } from "react";
import { Map as MapIcon } from "lucide-react";
import { uylar, yerUchastkalari } from "@/data/mock-data";

const Xarita = () => {
  const [filter, setFilter] = useState<"barchasi" | "jiloy" | "nejiloy" | "yer">("barchasi");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Xarita (GIS)</h1>
        <p className="page-subtitle">Samarqand viloyati — uylar va yer uchastkalari xaritada</p>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["barchasi", "jiloy", "nejiloy", "yer"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${filter === f ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`}
          >
            {f === "barchasi" ? "Barchasi" : f === "jiloy" ? "Jiloy" : f === "nejiloy" ? "Nejiloy" : "Yer"}
          </button>
        ))}
      </div>

      {/* Mock map — Samarqand viloyati */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="h-96 bg-muted relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, hsl(207 100% 40%) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          <div className="relative z-10 text-center">
            <MapIcon className="h-16 w-16 text-primary/30 mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Samarqand viloyati xaritasi</p>
            <p className="text-sm text-muted-foreground mt-1">Haqiqiy integratsiya uchun GIS API kerak</p>
          </div>

          {/* Mock pins */}
          {uylar.slice(0, 6).map((uy, i) => (
            <div key={uy.id} className={`absolute w-4 h-4 rounded-full border-2 border-card shadow-md ${
              uy.status === "band" ? "bg-success" : uy.status === "bosh" ? "bg-destructive" : "bg-warning"
            }`} style={{ top: `${20 + (i * 12)}%`, left: `${15 + (i * 13)}%` }} title={`${uy.nomi} — ${uy.tuman}`} />
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border p-5">
        <h3 className="font-semibold text-foreground mb-3">Xaritadagi obyektlar</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {uylar.filter(u => filter === "barchasi" || u.tur === filter).map(uy => (
            <div key={uy.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className={`w-3 h-3 rounded-full ${uy.status === "band" ? "bg-success" : uy.status === "bosh" ? "bg-destructive" : "bg-warning"}`} />
              <div>
                <p className="text-sm font-medium text-foreground">{uy.nomi}</p>
                <p className="text-xs text-muted-foreground">{uy.tuman}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Xarita;
