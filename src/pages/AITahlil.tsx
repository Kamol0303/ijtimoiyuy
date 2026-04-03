import { aiTavsiyalar } from "@/data/mock-data";
import { Brain, AlertTriangle, TrendingUp, ShieldAlert, Lightbulb } from "lucide-react";

const AITahlil = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="page-header">AI tahlil</h1>
      <p className="page-subtitle">Sun'iy intellekt asosidagi tahlil va tavsiyalar</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card rounded-xl border p-5 text-center">
        <ShieldAlert className="h-8 w-8 text-destructive mx-auto mb-3" />
        <p className="text-3xl font-bold text-foreground">{aiTavsiyalar.filter(t => t.tur === "xavf").length}</p>
        <p className="text-sm text-muted-foreground">Xavfli holatlar</p>
      </div>
      <div className="bg-card rounded-xl border p-5 text-center">
        <AlertTriangle className="h-8 w-8 text-warning mx-auto mb-3" />
        <p className="text-3xl font-bold text-foreground">{aiTavsiyalar.filter(t => t.tur === "ogohlantirish").length}</p>
        <p className="text-sm text-muted-foreground">Ogohlantirishlar</p>
      </div>
      <div className="bg-card rounded-xl border p-5 text-center">
        <Lightbulb className="h-8 w-8 text-primary mx-auto mb-3" />
        <p className="text-3xl font-bold text-foreground">{aiTavsiyalar.filter(t => t.tur === "tavsiya").length}</p>
        <p className="text-sm text-muted-foreground">Tavsiyalar</p>
      </div>
    </div>

    <div className="bg-card rounded-xl border p-5">
      <div className="flex items-center gap-2 mb-5">
        <Brain className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Barcha AI xulosalar</h2>
      </div>
      <div className="space-y-4">
        {aiTavsiyalar.map(t => (
          <div key={t.id} className={`p-4 rounded-xl border-l-4 ${
            t.tur === "xavf" ? "bg-destructive/5 border-l-destructive" :
            t.tur === "ogohlantirish" ? "bg-warning/10 border-l-warning" :
            "bg-primary/5 border-l-primary"
          }`}>
            <div className="flex items-start gap-3">
              {t.tur === "xavf" ? <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" /> :
               t.tur === "ogohlantirish" ? <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" /> :
               <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />}
              <div>
                <p className="text-foreground font-medium">{t.xabar}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.sana}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AITahlil;
