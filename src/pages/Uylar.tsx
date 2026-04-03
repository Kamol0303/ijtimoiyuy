import { useState } from "react";
import { Home, Search } from "lucide-react";
import { uylar, SAMARQAND_TUMANLARI } from "@/data/mock-data";
import { Input } from "@/components/ui/input";

const statusLabels = { band: "Band", bosh: "Bo'sh", muddat_yaqin: "Muddat yaqin" };
const statusClasses = { band: "status-band--yashil", bosh: "status-band--qizil", muddat_yaqin: "status-band--sariq" };

const Uylar = () => {
  const [qidiruv, setQidiruv] = useState("");
  const [turFilter, setTurFilter] = useState<"barchasi" | "jiloy" | "nejiloy">("barchasi");
  const [tumanFilter, setTumanFilter] = useState<string>("barchasi");

  const filtered = uylar.filter(u => {
    const matchSearch = u.nomi.toLowerCase().includes(qidiruv.toLowerCase()) || u.manzil.toLowerCase().includes(qidiruv.toLowerCase());
    const matchTur = turFilter === "barchasi" || u.tur === turFilter;
    const matchTuman = tumanFilter === "barchasi" || u.tuman === tumanFilter;
    return matchSearch && matchTur && matchTuman;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Uylar boshqaruvi</h1>
        <p className="page-subtitle">Samarqand viloyati — jiloy va nejiloy obyektlarni boshqaring</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Uy nomi yoki manzil bo'yicha qidirish..."
              value={qidiruv}
              onChange={e => setQidiruv(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(["barchasi", "jiloy", "nejiloy"] as const).map(t => (
              <button key={t} onClick={() => setTurFilter(t)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${turFilter === t ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`}
              >
                {t === "barchasi" ? "Barchasi" : t === "jiloy" ? "Jiloy" : "Nejiloy"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 bg-muted rounded-lg p-1">
          <button onClick={() => setTumanFilter("barchasi")}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${tumanFilter === "barchasi" ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`}
          >
            Barcha tumanlar
          </button>
          {SAMARQAND_TUMANLARI.map(t => (
            <button key={t} onClick={() => setTumanFilter(t)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${tumanFilter === t ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`}
            >
              {t.replace(" tumani", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(uy => (
          <div key={uy.id} className="bg-card rounded-xl border p-5 hover:shadow-lg transition-shadow animate-slide-up">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${uy.tur === "jiloy" ? "bg-primary/10" : "bg-accent/20"}`}>
                  <Home className={`h-4 w-4 ${uy.tur === "jiloy" ? "text-primary" : "text-accent-foreground"}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase">{uy.tur === "jiloy" ? "Jiloy" : "Nejiloy"}</span>
              </div>
              <span className={`status-band ${statusClasses[uy.status]}`}>{statusLabels[uy.status]}</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{uy.nomi}</h3>
            <p className="text-sm text-muted-foreground mb-1">{uy.manzil}</p>
            <p className="text-xs text-primary font-medium mb-3">{uy.tuman}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {uy.tur === "jiloy" && <div><span className="text-muted-foreground">Xonalar:</span> <span className="font-medium text-foreground">{uy.xonalar}</span></div>}
              <div><span className="text-muted-foreground">Maydon:</span> <span className="font-medium text-foreground">{uy.maydon} m²</span></div>
              {uy.egasi && <div className="col-span-2"><span className="text-muted-foreground">Egasi:</span> <span className="font-medium text-foreground">{uy.egasi}</span></div>}
              {uy.shartnomaMuddat && <div className="col-span-2"><span className="text-muted-foreground">Muddat:</span> <span className="font-medium text-foreground">{uy.shartnomaMuddat}</span></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Uylar;
