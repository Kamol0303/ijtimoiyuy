import { Bell, Check, AlertTriangle, FileText, Clock } from "lucide-react";

const xabarnomalar = [
  { id: "1", xabar: "Baraka Ipoteka (Urgut tumani) — shartnoma muddati tugashiga 47 kun qoldi", tur: "muddat", sana: "2026-04-03", oqilgan: false },
  { id: "2", xabar: "Karimova Nilufar (Kattaqo'rg'on tumani) — ijara uzaytirish arizasi tasdiqlandi", tur: "ariza", sana: "2026-04-02", oqilgan: true },
  { id: "3", xabar: "Oila Baxti Blok-2 (Nurobod tumani) — muddat 27 kun ichida tugaydi", tur: "muddat", sana: "2026-04-02", oqilgan: false },
  { id: "4", xabar: "Nodirova Malika (Jomboy tumani) — ariza rad etildi, hujjatlar to'liq emas", tur: "ariza", sana: "2026-04-01", oqilgan: true },
  { id: "5", xabar: "AI: Samarqand tumanida 1 ta uyda boshqa shaxs yashayotgani aniqlandi", tur: "ai", sana: "2026-04-01", oqilgan: false },
];

const Xabarnomalar = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="page-header">Xabarnomalar</h1>
      <p className="page-subtitle">Samarqand viloyati — bildirishnomalar va ogohlantirishlar</p>
    </div>

    <div className="space-y-3">
      {xabarnomalar.map(x => (
        <div key={x.id} className={`bg-card rounded-xl border p-4 flex items-start gap-4 transition-colors ${!x.oqilgan ? "border-l-4 border-l-primary" : ""}`}>
          <div className={`p-2 rounded-lg shrink-0 ${
            x.tur === "muddat" ? "bg-warning/10" : x.tur === "ai" ? "bg-destructive/10" : "bg-primary/10"
          }`}>
            {x.tur === "muddat" ? <Clock className="h-4 w-4 text-warning" /> :
             x.tur === "ai" ? <AlertTriangle className="h-4 w-4 text-destructive" /> :
             <FileText className="h-4 w-4 text-primary" />}
          </div>
          <div className="flex-1">
            <p className={`text-sm ${!x.oqilgan ? "font-medium text-foreground" : "text-muted-foreground"}`}>{x.xabar}</p>
            <p className="text-xs text-muted-foreground mt-1">{x.sana}</p>
          </div>
          {x.oqilgan && <Check className="h-4 w-4 text-success shrink-0 mt-1" />}
        </div>
      ))}
    </div>
  </div>
);

export default Xabarnomalar;
