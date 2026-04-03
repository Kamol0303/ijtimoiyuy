import { useState, useCallback } from "react";
import { Users, Search, Phone, FileText, Plus, Pencil, Trash2, Download, CheckCircle } from "lucide-react";
import { SAMARQAND_TUMANLARI } from "@/data/mock-data";
import { DataManager } from "@/services/DataManager";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FuqaroCrudDialog } from "@/components/crud/FuqaroCrudDialog";
import { toast } from "sonner";
import type { Fuqaro } from "@/data/mock-data";

const Fuqarolar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [qidiruv, setQidiruv] = useState("");
  const [tumanFilter, setTumanFilter] = useState<string>("barchasi");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingFuqaro, setEditingFuqaro] = useState<Fuqaro | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const isHokim = user?.role === "hokim";
  const canEdit = user?.role === "hokim" || user?.role === "uy_joy";

  const fuqarolar = DataManager.getFuqarolar().filter(f => (f as any).holat !== "yakunlangan" && (f as any).holat !== "arxivlangan");

  const filtered = fuqarolar.filter(f => {
    const matchSearch = f.ism.toLowerCase().includes(qidiruv.toLowerCase()) || f.jshshir.includes(qidiruv);
    const matchTuman = tumanFilter === "barchasi" || f.tuman === tumanFilter;
    return matchSearch && matchTuman;
  });

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const handleDelete = (f: Fuqaro) => {
    if (!isHokim) return;
    if (confirm(`"${f.ism}" fuqaroni o'chirishni xohlaysizmi?`)) {
      DataManager.deleteFuqaro(f.id, user?.ism || "Noma'lum");
      toast.success("Fuqaro o'chirildi");
      refresh();
    }
  };

  const handleYakunlash = (f: Fuqaro) => {
    DataManager.updateFuqaro(f.id, { holat: "yakunlangan" } as any, user?.ism || "");
    toast.success(`"${f.ism}" ${t("yakunlandi")}`);
    refresh();
  };

  const handleExport = () => {
    const csv = DataManager.exportToCSV("fuqarolar");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "fuqarolar.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success(t("malumotlar_yuklandi"));
  };

  return (
    <div className="space-y-6 animate-fade-in" key={refreshKey}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">{t("fuqarolar")}</h1>
          <p className="page-subtitle">{t("fuqarolar_royxati")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} size="sm" className="gap-1">
            <Download className="h-4 w-4" /> {t("export")}
          </Button>
          {canEdit && (
            <Button onClick={() => { setDialogMode("add"); setEditingFuqaro(undefined); setDialogOpen(true); }} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> {t("yangi_fuqaro")}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("qidirish_fuqaro")} value={qidiruv} onChange={e => setQidiruv(e.target.value)} className="pl-10" />
        </div>
        <div className="flex flex-wrap gap-1 bg-muted rounded-lg p-1">
          <button onClick={() => setTumanFilter("barchasi")}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${tumanFilter === "barchasi" ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`}
          >
            {t("barcha_tumanlar")}
          </button>
          {SAMARQAND_TUMANLARI.map(tm => (
            <button key={tm} onClick={() => setTumanFilter(tm)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${tumanFilter === tm ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`}
            >
              {tm.replace(" tumani", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(f => (
          <div key={f.id} className="bg-card rounded-xl border p-5 animate-slide-up group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-foreground">{f.ism}</h3>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                    {canEdit && (
                      <>
                        <button onClick={() => { setDialogMode("edit"); setEditingFuqaro(f); setDialogOpen(true); }}
                          className="p-1 rounded hover:bg-muted"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
                        <button onClick={() => handleYakunlash(f)}
                          className="p-1 rounded hover:bg-success/10" title={t("yakunlash")}>
                          <CheckCircle className="h-3.5 w-3.5 text-success" />
                        </button>
                      </>
                    )}
                    {isHokim && (
                      <button onClick={() => handleDelete(f)}
                        className="p-1 rounded hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">JShShIR: {f.jshshir}</p>
                <p className="text-xs text-primary font-medium mt-0.5">{f.tuman}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{f.telefon}</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><FileText className="h-3.5 w-3.5" />{f.arizalarSoni} {t("ta_ariza")}</span>
                </div>
                <div className="mt-3">
                  <span className="status-band status-band--yashil">{f.ijtimoiyHolat}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FuqaroCrudDialog open={dialogOpen} onClose={() => setDialogOpen(false)} mode={dialogMode} fuqaro={editingFuqaro} onSaved={refresh} />
    </div>
  );
};

export default Fuqarolar;
