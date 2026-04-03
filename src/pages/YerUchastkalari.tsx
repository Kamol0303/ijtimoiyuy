import { yerUchastkalari } from "@/data/mock-data";
import { LandPlot, ArrowRightLeft, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusLabel = { bosh: "Bo'sh", band: "Band", boshqa_tashkilot: "Boshqa tashkilotda" };
const statusClass = { bosh: "status-band--yashil", band: "status-band--qizil", boshqa_tashkilot: "status-band--sariq" };

const YerUchastkalari = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="page-header">Yer uchastkalari</h1>
      <p className="page-subtitle">Yer balansini yuritish va boshqarish</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {yerUchastkalari.map(yer => (
        <div key={yer.id} className="bg-card rounded-xl border p-5 animate-slide-up">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <LandPlot className="h-5 w-5 text-primary" />
            </div>
            <span className={`status-band ${statusClass[yer.status]}`}>{statusLabel[yer.status]}</span>
          </div>
          <h3 className="font-semibold text-foreground mb-1">{yer.nomi}</h3>
          <p className="text-sm text-muted-foreground mb-3">{yer.manzil}</p>
          <div className="text-sm mb-4">
            <span className="text-muted-foreground">Maydon:</span> <span className="font-medium text-foreground">{yer.maydon} m²</span>
          </div>
          <div className="flex gap-2">
            {yer.status === "bosh" && (
              <>
                <Button size="sm" variant="outline"><Gavel className="h-3.5 w-3.5 mr-1" />Auksionga</Button>
                <Button size="sm" variant="outline"><ArrowRightLeft className="h-3.5 w-3.5 mr-1" />Balansdan</Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default YerUchastkalari;
