import { useState } from "react";
import { Users, Search, Phone, FileText } from "lucide-react";
import { fuqarolar, SAMARQAND_TUMANLARI } from "@/data/mock-data";
import { Input } from "@/components/ui/input";

const Fuqarolar = () => {
  const [qidiruv, setQidiruv] = useState("");
  const [tumanFilter, setTumanFilter] = useState<string>("barchasi");

  const filtered = fuqarolar.filter(f => {
    const matchSearch = f.ism.toLowerCase().includes(qidiruv.toLowerCase()) || f.jshshir.includes(qidiruv);
    const matchTuman = tumanFilter === "barchasi" || f.tuman === tumanFilter;
    return matchSearch && matchTuman;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Fuqarolar</h1>
        <p className="page-subtitle">Samarqand viloyati — ijtimoiy himoyaga muhtoj fuqarolar ro'yxati</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Ism yoki JShShIR bo'yicha qidiring..." value={qidiruv} onChange={e => setQidiruv(e.target.value)} className="pl-10" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(f => (
          <div key={f.id} className="bg-card rounded-xl border p-5 animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{f.ism}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">JShShIR: {f.jshshir}</p>
                <p className="text-xs text-primary font-medium mt-0.5">{f.tuman}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{f.telefon}</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><FileText className="h-3.5 w-3.5" />{f.arizalarSoni} ta ariza</span>
                </div>
                <div className="mt-3">
                  <span className="status-band status-band--yashil">{f.ijtimoiyHolat}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fuqarolar;
