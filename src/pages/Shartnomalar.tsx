import { uylar } from "@/data/mock-data";
import { ShieldCheck, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Shartnomalar = () => {
  const shartnomaUylar = uylar.filter(u => u.egasi && u.shartnomaMuddat);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Shartnomalar</h1>
        <p className="page-subtitle">Avtomatik yaratilgan shartnomalar va muddat nazorati</p>
      </div>

      <div className="space-y-4">
        {shartnomaUylar.map(uy => (
          <div key={uy.id} className="bg-card rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{uy.nomi}</h3>
                <p className="text-sm text-muted-foreground">{uy.egasi}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Muddat: {uy.shartnomaMuddat}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`status-band ${uy.status === "muddat_yaqin" ? "status-band--sariq" : "status-band--yashil"}`}>
                {uy.status === "muddat_yaqin" ? "Muddat yaqin" : "Faol"}
              </span>
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />PDF</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shartnomalar;
