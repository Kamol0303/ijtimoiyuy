import { useState, useCallback } from "react";
import { FileText, Search, Plus, Download, CheckCircle, Pencil, Trash2, Archive } from "lucide-react";
import { SAMARQAND_TUMANLARI } from "@/data/mock-data";
import { DataManager } from "@/services/DataManager";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { PermissionService } from "@/services/PermissionService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArizaCrudDialog } from "@/components/crud/ArizaCrudDialog";
import { toast } from "sonner";
import type { Ariza } from "@/data/mock-data";

const Arizalar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [qidiruv, setQidiruv] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("barchasi");
  const [tumanFilter, setTumanFilter] = useState<string>("barchasi");
  const [refreshKey, setRefreshKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingAriza, setEditingAriza] = useState<Ariza | undefined>();

  const isHokim = user?.role === "hokim";
  const canEdit = user?.role === "hokim" || user?.role === "uy_joy";

  const arizalar = DataManager.getArizalar().filter(a => (a as any).holat !== "yakunlangan" && (a as any).holat !== "arxivlangan");

  const filtered = arizalar.filter(a => {
    const matchSearch = a.fuqaroIsm.toLowerCase().includes(qidiruv.toLowerCase());
    const matchStatus = statusFilter === "barchasi" || a.status === statusFilter;
    const matchTuman = tumanFilter === "barchasi" || a.tuman === tumanFilter;
    return matchSearch && matchStatus && matchTuman;
  });

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  const statusLabel: Record<string, string> = { korib_chiqilmoqda: t("korilmoqda"), tasdiqlandi: t("tasdiqlandi"), rad_etildi: t("rad_etildi") };
  const statusClass: Record<string, string> = { korib_chiqilmoqda: "status-band--sariq", tasdiqlandi: "status-band--yashil", rad_etildi: "status-band--qizil" };

  const handleYakunlash = (id: string, ism: string) => {
    DataManager.updateAriza(id, { holat: "yakunlangan" } as any, user?.ism || "");
    toast.success(`"${ism}" ${t("yakunlandi")}`);
    refresh();
  };

  const handleDelete = (id: string, ism: string) => {
    if (!isHokim) return;
    if (confirm(`"${ism}" arizasini o'chirishni xohlaysizmi?`)) {
      DataManager.deleteAriza(id, user?.ism || "");
      toast.success("Ariza o'chirildi");
      refresh();
    }
  };

  const handleExport = () => {
    const csv = DataManager.exportToCSV("arizalar");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "arizalar.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success(t("malumotlar_yuklandi"));
  };

  return (
    <div className="space-y-6 animate-fade-in" key={refreshKey}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">{t("arizalar")}</h1>
          <p className="page-subtitle">{t("barcha_arizalar")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} size="sm" className="gap-1">
            <Download className="h-4 w-4" /> {t("export")}
          </Button>
          {canEdit && (
            <Button size="sm" onClick={() => { setDialogMode("add"); setEditingAriza(undefined); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />{t("yangi_ariza")}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("qidirish_ariza")} value={qidiruv} onChange={e => setQidiruv(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {["barchasi", "korib_chiqilmoqda", "tasdiqlandi", "rad_etildi"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${statusFilter === s ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`}
              >
                {s === "barchasi" ? t("barchasi") : statusLabel[s]}
              </button>
            ))}
          </div>
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

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("fuqaro")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("turi")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("sana")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("holat")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("izoh")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors group">
                  <td className="p-4 text-sm font-medium text-foreground">{a.fuqaroIsm}</td>
                  <td className="p-4 text-sm text-muted-foreground">{a.tur}</td>
                  <td className="p-4 text-sm text-muted-foreground">{a.sana}</td>
                  <td className="p-4"><span className={`status-band ${statusClass[a.status]}`}>{statusLabel[a.status]}</span></td>
                  <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{a.izoh}</td>
                  <td className="p-4">
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      {canEdit && (
                        <>
                          <button onClick={() => { setDialogMode("edit"); setEditingAriza(a); setDialogOpen(true); }}
                            className="p-1 rounded hover:bg-muted" title={t("tahrirlash")}>
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                          <button onClick={() => handleYakunlash(a.id, a.fuqaroIsm)}
                            className="p-1 rounded hover:bg-success/10" title={t("yakunlash")}>
                            <CheckCircle className="h-3.5 w-3.5 text-success" />
                          </button>
                        </>
                      )}
                      {isHokim && (
                        <button onClick={() => handleDelete(a.id, a.fuqaroIsm)}
                          className="p-1 rounded hover:bg-destructive/10">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ArizaCrudDialog open={dialogOpen} onClose={() => setDialogOpen(false)} mode={dialogMode} ariza={editingAriza} onSaved={refresh} />
    </div>
  );
};

export default Arizalar;