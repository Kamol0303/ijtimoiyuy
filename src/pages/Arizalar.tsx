import { useState } from "react";
import { FileText, Search, Plus } from "lucide-react";
import { arizalar } from "@/data/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const statusLabel = { korib_chiqilmoqda: "Ko'rib chiqilmoqda", tasdiqlandi: "Tasdiqlandi", rad_etildi: "Rad etildi" };
const statusClass = { korib_chiqilmoqda: "status-band--sariq", tasdiqlandi: "status-band--yashil", rad_etildi: "status-band--qizil" };

const Arizalar = () => {
  const [qidiruv, setQidiruv] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("barchasi");

  const filtered = arizalar.filter(a => {
    const matchSearch = a.fuqaroIsm.toLowerCase().includes(qidiruv.toLowerCase());
    const matchStatus = statusFilter === "barchasi" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Arizalar</h1>
          <p className="page-subtitle">Barcha arizalar va murojaatlar</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />Yangi ariza</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Fuqaro ismi bo'yicha qidiring..." value={qidiruv} onChange={e => setQidiruv(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {["barchasi", "korib_chiqilmoqda", "tasdiqlandi", "rad_etildi"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${statusFilter === s ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`}
            >
              {s === "barchasi" ? "Barchasi" : statusLabel[s as keyof typeof statusLabel]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fuqaro</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Turi</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Sana</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Holat</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Izoh</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{a.fuqaroIsm}</td>
                  <td className="p-4 text-sm text-muted-foreground">{a.tur}</td>
                  <td className="p-4 text-sm text-muted-foreground">{a.sana}</td>
                  <td className="p-4"><span className={`status-band ${statusClass[a.status]}`}>{statusLabel[a.status]}</span></td>
                  <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{a.izoh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Arizalar;
