import { useState, useCallback, useEffect } from "react";
import { Home, Search, Plus, Pencil, Trash2, Download, CheckCircle, Archive } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { SAMARQAND_TUMANLARI } from "@/data/mock-data";
import { DataManager } from "@/services/DataManager";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { PermissionService } from "@/services/PermissionService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UyCrudDialog } from "@/components/crud/UyCrudDialog";
import { toast } from "sonner";
import type { Uy } from "@/data/mock-data";

const Uylar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "barchasi";

  const [qidiruv, setQidiruv] = useState("");
  const [turFilter, setTurFilter] = useState<"barchasi" | "jiloy" | "nejiloy">("barchasi");
  const [tumanFilter, setTumanFilter] = useState<string>("barchasi");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingUy, setEditingUy] = useState<Uy | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const isHokim = user?.role === "hokim";
  const canEdit = user?.role === "hokim" || user?.role === "uy_joy";

  useEffect(() => {
    const s = searchParams.get("status");
    if (s) setStatusFilter(s);
  }, [searchParams]);

  const uylar = DataManager.getUylar().filter(u => (u as any).holat !== "yakunlangan" && (u as any).holat !== "arxivlangan");

  const filtered = uylar.filter(u => {
    const matchSearch = u.nomi.toLowerCase().includes(qidiruv.toLowerCase()) || u.manzil.toLowerCase().includes(qidiruv.toLowerCase());
    const matchTur = turFilter === "barchasi" || u.tur === turFilter;
    const matchTuman = tumanFilter === "barchasi" || u.tuman === tumanFilter;
    const matchStatus = statusFilter === "barchasi" || u.status === statusFilter;
    return matchSearch && matchTur && matchTuman && matchStatus;
  });

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const handleDelete = (uy: Uy) => {
    if (!isHokim) return;
    if (confirm(`"${uy.nomi}" uyini o'chirishni xohlaysizmi?`)) {
      DataManager.deleteUy(uy.id, user?.ism || "Noma'lum");
      toast.success("Uy o'chirildi");
      refresh();
    }
  };

  const handleYakunlash = (uy: Uy) => {
    DataManager.updateUy(uy.id, { holat: "yakunlangan" } as any, user?.ism || "");
    toast.success(`"${uy.nomi}" yakunlandi`);
    refresh();
  };

  const handleExport = () => {
    const csv = DataManager.exportToCSV("uylar");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "uylar.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success(t("malumotlar_yuklandi"));
  };

  const statusLabels: Record<string, string> = { band: t("band"), bosh: t("bosh"), muddat_yaqin: t("muddat_yaqin") };
  const statusClasses: Record<string, string> = { band: "status-band--yashil", bosh: "status-band--qizil", muddat_yaqin: "status-band--sariq" };

  return (
    <div className="space-y-6 animate-fade-in" key={refreshKey}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">{t("uylar_boshqaruvi")}</h1>
          <p className="page-subtitle">{t("jiloy_va_nejiloy")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} size="sm" className="gap-1">
            <Download className="h-4 w-4" /> {t("export")}
          </Button>
          {canEdit && (
            <Button onClick={() => { setDialogMode("add"); setEditingUy(undefined); setDialogOpen(true); }} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> {t("yangi_uy")}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("qidirish")} value={qidiruv} onChange={e => setQidiruv(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(["barchasi", "jiloy", "nejiloy"] as const).map(tr => (
              <button key={tr} onClick={() => setTurFilter(tr)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${turFilter === tr ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`}
              >
                {tr === "barchasi" ? t("barchasi") : tr === "jiloy" ? t("jiloy") : t("nejiloy")}
              </button>
            ))}
          </div>
        </div>
        {/* Status filter */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {["barchasi", "band", "bosh", "muddat_yaqin"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${statusFilter === s ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`}
            >
              {s === "barchasi" ? t("barchasi") : statusLabels[s]}
            </button>
          ))}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(uy => (
          <div key={uy.id} className="bg-card rounded-xl border p-5 hover:shadow-lg transition-shadow animate-slide-up group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${uy.tur === "jiloy" ? "bg-primary/10" : "bg-accent/20"}`}>
                  <Home className={`h-4 w-4 ${uy.tur === "jiloy" ? "text-primary" : "text-accent-foreground"}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase">{uy.tur === "jiloy" ? t("jiloy") : t("nejiloy")}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`status-band ${statusClasses[uy.status]}`}>{statusLabels[uy.status]}</span>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1 ml-1 transition-opacity">
                  {canEdit && (
                    <>
                      <button onClick={() => { setDialogMode("edit"); setEditingUy(uy); setDialogOpen(true); }}
                        className="p-1 rounded hover:bg-muted"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
                      <button onClick={() => handleYakunlash(uy)}
                        className="p-1 rounded hover:bg-success/10" title={t("yakunlash")}>
                        <CheckCircle className="h-3.5 w-3.5 text-success" />
                      </button>
                    </>
                  )}
                  {isHokim && (
                    <button onClick={() => handleDelete(uy)}
                      className="p-1 rounded hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                  )}
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{uy.nomi}</h3>
            <p className="text-sm text-muted-foreground mb-1">{uy.manzil}</p>
            <p className="text-xs text-primary font-medium mb-3">{uy.tuman}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {uy.tur === "jiloy" && <div><span className="text-muted-foreground">{t("xonalar")}:</span> <span className="font-medium text-foreground">{uy.xonalar}</span></div>}
              <div><span className="text-muted-foreground">{t("maydon")}:</span> <span className="font-medium text-foreground">{uy.maydon} m²</span></div>
              {uy.egasi && <div className="col-span-2"><span className="text-muted-foreground">{t("egasi")}:</span> <span className="font-medium text-foreground">{uy.egasi}</span></div>}
              {uy.shartnomaMuddat && <div className="col-span-2"><span className="text-muted-foreground">{t("muddat")}:</span> <span className="font-medium text-foreground">{uy.shartnomaMuddat}</span></div>}
            </div>
          </div>
        ))}
      </div>

      <UyCrudDialog open={dialogOpen} onClose={() => setDialogOpen(false)} mode={dialogMode} uy={editingUy} onSaved={refresh} />
    </div>
  );
};

export default Uylar;
