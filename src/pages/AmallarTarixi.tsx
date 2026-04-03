import { useState, useEffect } from "react";
import { History, Search, Download, Filter } from "lucide-react";
import { AuditService, type AuditLog } from "@/services/AuditService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const amalLabels: Record<string, string> = {
  qoshish: "Qo'shildi",
  tahrirlash: "Tahrirlandi",
  ochirish: "O'chirildi",
};

const amalColors: Record<string, string> = {
  qoshish: "bg-success/10 text-success",
  tahrirlash: "bg-primary/10 text-primary",
  ochirish: "bg-destructive/10 text-destructive",
};

const AmallarTarixi = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [qidiruv, setQidiruv] = useState("");
  const [bolimFilter, setBolimFilter] = useState("barchasi");
  const [davrFilter, setDavrFilter] = useState<"barchasi" | "bugun" | "hafta" | "oy">("barchasi");

  useEffect(() => {
    loadLogs();
    const handler = () => loadLogs();
    window.addEventListener("audit-log-added", handler);
    return () => window.removeEventListener("audit-log-added", handler);
  }, []);

  function loadLogs() {
    setLogs(AuditService.getAll());
  }

  const filteredLogs = logs.filter((l) => {
    if (qidiruv && !l.malumot.toLowerCase().includes(qidiruv.toLowerCase()) && !l.foydalanuvchi.toLowerCase().includes(qidiruv.toLowerCase())) return false;
    if (bolimFilter !== "barchasi" && l.bolim !== bolimFilter) return false;
    if (davrFilter === "bugun") {
      const bugun = new Date().toISOString().split("T")[0];
      if (l.sana !== bugun) return false;
    } else if (davrFilter === "hafta") {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
      if (l.sana < weekAgo) return false;
    } else if (davrFilter === "oy") {
      const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
      if (l.sana < monthAgo) return false;
    }
    return true;
  });

  function exportLogs() {
    const headers = ["Sana", "Vaqt", "Foydalanuvchi", "Amal", "Bo'lim", "Ma'lumot", "Tafsilot"];
    const rows = filteredLogs.map((l) => [l.sana, l.vaqt, l.foydalanuvchi, amalLabels[l.amal], l.bolim, l.malumot, l.tafsilot].map((v) => `"${v}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `amallar-tarixi-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const bolimlar = [...new Set(logs.map((l) => l.bolim))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header flex items-center gap-2">
            <History className="h-7 w-7 text-primary" />
            Amallar tarixi
          </h1>
          <p className="page-subtitle">Barcha o'zgarishlar va amallar qayd etilgan</p>
        </div>
        <Button onClick={exportLogs} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          CSV yuklash
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Qidirish..." value={qidiruv} onChange={(e) => setQidiruv(e.target.value)} className="pl-9" />
        </div>
        <Select value={bolimFilter} onValueChange={setBolimFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Bo'lim" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="barchasi">Barcha bo'limlar</SelectItem>
            {bolimlar.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={davrFilter} onValueChange={(v) => setDavrFilter(v as typeof davrFilter)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Davr" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="barchasi">Barchasi</SelectItem>
            <SelectItem value="bugun">Bugun</SelectItem>
            <SelectItem value="hafta">Haftalik</SelectItem>
            <SelectItem value="oy">Oylik</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="kpi-card text-center">
          <p className="text-2xl font-bold text-foreground">{filteredLogs.length}</p>
          <p className="text-xs text-muted-foreground">Jami amallar</p>
        </div>
        <div className="kpi-card text-center">
          <p className="text-2xl font-bold text-success">{filteredLogs.filter((l) => l.amal === "qoshish").length}</p>
          <p className="text-xs text-muted-foreground">Qo'shildi</p>
        </div>
        <div className="kpi-card text-center">
          <p className="text-2xl font-bold text-primary">{filteredLogs.filter((l) => l.amal === "tahrirlash").length}</p>
          <p className="text-xs text-muted-foreground">Tahrirlandi</p>
        </div>
        <div className="kpi-card text-center">
          <p className="text-2xl font-bold text-destructive">{filteredLogs.filter((l) => l.amal === "ochirish").length}</p>
          <p className="text-xs text-muted-foreground">O'chirildi</p>
        </div>
      </div>

      {/* Log list */}
      <div className="bg-card rounded-xl border">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Hozircha amallar tarixi bo'sh</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredLogs.slice(0, 50).map((log) => (
              <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center text-xs text-muted-foreground min-w-[60px]">
                  <span>{log.vaqt}</span>
                  <span>{log.sana}</span>
                </div>
                <Badge className={`${amalColors[log.amal]} border-0 font-medium`}>
                  {amalLabels[log.amal]}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{log.malumot}</p>
                  <p className="text-xs text-muted-foreground truncate">{log.tafsilot}</p>
                </div>
                <div className="text-right min-w-[120px]">
                  <p className="text-sm text-foreground">{log.foydalanuvchi}</p>
                  <p className="text-xs text-muted-foreground">{log.bolim}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AmallarTarixi;
