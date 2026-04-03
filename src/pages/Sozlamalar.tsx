import { Settings, Users, Shield, Link, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const integratsiyalar = [
  { nomi: "MyID", holat: "Ulangan", icon: Shield },
  { nomi: "MyGov", holat: "Ulangan", icon: Globe },
  { nomi: "Telegram Bot", holat: "Sozlanmoqda", icon: Link },
  { nomi: "SMS xizmati", holat: "Faol", icon: Link },
];

const rollar = [
  { nomi: "Hokim", tavsif: "Barcha statistikani ko'radi", foydalanuvchilar: 1 },
  { nomi: "Uy-joy bo'limi", tavsif: "Uylar bilan ishlaydi", foydalanuvchilar: 3 },
  { nomi: "Ayollar bo'limi", tavsif: "Ijtimoiy oilalar bilan ishlaydi", foydalanuvchilar: 2 },
];

const Sozlamalar = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="page-header">Sozlamalar</h1>
      <p className="page-subtitle">Samarqand viloyati — tizim sozlamalari va integratsiyalar</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-xl border p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Link className="h-5 w-5 text-primary" />Integratsiyalar</h2>
        <div className="space-y-3">
          {integratsiyalar.map(i => (
            <div key={i.nomi} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <i.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{i.nomi}</span>
              </div>
              <span className={`status-band ${i.holat === "Ulangan" || i.holat === "Faol" ? "status-band--yashil" : "status-band--sariq"}`}>{i.holat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Rollar va foydalanuvchilar</h2>
        <div className="space-y-3">
          {rollar.map(r => (
            <div key={r.nomi} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium text-foreground">{r.nomi}</p>
                <p className="text-xs text-muted-foreground">{r.tavsif}</p>
              </div>
              <span className="text-sm text-muted-foreground">{r.foydalanuvchilar} ta</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Sozlamalar;
