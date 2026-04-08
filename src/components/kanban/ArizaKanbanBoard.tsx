import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { DataManager } from "@/services/DataManager";
import { PermissionService } from "@/services/PermissionService";
import { SAMARQAND_TUMANLARI } from "@/data/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { Ariza } from "@/data/mock-data";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { ArizaDetailModal } from "./ArizaDetailModal";

type KanbanStatus = "yangi" | "korib_chiqilmoqda" | "tasdiqlandi" | "rad_etildi" | "yakunlangan";

const KANBAN_COLUMNS: { id: KanbanStatus; labelKey: string; color: string; icon: string }[] = [
  { id: "yangi", labelKey: "yangi_arizalar", color: "border-t-yellow-400", icon: "🟡" },
  { id: "korib_chiqilmoqda", labelKey: "korilmoqda", color: "border-t-blue-400", icon: "🔵" },
  { id: "tasdiqlandi", labelKey: "tasdiqlandi", color: "border-t-green-400", icon: "🟢" },
  { id: "rad_etildi", labelKey: "rad_etildi", color: "border-t-red-400", icon: "🔴" },
  { id: "yakunlangan", labelKey: "yakunlandi", color: "border-t-gray-500", icon: "⚫" },
];

function getKanbanStatus(ariza: Ariza): KanbanStatus {
  if ((ariza as any).holat === "yakunlangan") return "yakunlangan";
  // New applications: submitted within 1 day and still pending
  const daysSinceSubmit = Math.floor((Date.now() - new Date(ariza.sana).getTime()) / (1000 * 60 * 60 * 24));
  if (ariza.status === "korib_chiqilmoqda" && daysSinceSubmit <= 1) return "yangi";
  return ariza.status;
}

function getDaysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

interface Props {
  onRefresh: () => void;
  refreshKey: number;
}

export function ArizaKanbanBoard({ onRefresh, refreshKey }: Props) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [qidiruv, setQidiruv] = useState("");
  const [tumanFilter, setTumanFilter] = useState("barchasi");
  const [turFilter, setTurFilter] = useState("barchasi");
  const [detailAriza, setDetailAriza] = useState<Ariza | null>(null);

  const role = user?.role;
  const canEdit = role ? PermissionService.canEdit(role, "arizalar") : false;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const allArizalar = DataManager.getArizalar();

  const filtered = useMemo(() => {
    return allArizalar.filter(a => {
      if ((a as any).holat === "arxivlangan") return false;
      const matchSearch = a.fuqaroIsm.toLowerCase().includes(qidiruv.toLowerCase());
      const matchTuman = tumanFilter === "barchasi" || a.tuman === tumanFilter;
      const matchTur = turFilter === "barchasi" || a.tur === turFilter;
      return matchSearch && matchTuman && matchTur;
    });
  }, [allArizalar, qidiruv, tumanFilter, turFilter]);

  const turlar = useMemo(() => {
    const set = new Set(allArizalar.map(a => a.tur));
    return Array.from(set);
  }, [allArizalar]);

  const grouped = useMemo(() => {
    const map: Record<KanbanStatus, Ariza[]> = {
      yangi: [], korib_chiqilmoqda: [], tasdiqlandi: [], rad_etildi: [], yakunlangan: [],
    };
    filtered.forEach(a => {
      const status = getKanbanStatus(a);
      map[status].push(a);
    });
    return map;
  }, [filtered]);

  // Warnings: applications stuck for 3+ days
  const warnings = useMemo(() => {
    return allArizalar.filter(a => {
      if ((a as any).holat === "yakunlangan" || (a as any).holat === "arxivlangan") return false;
      return a.status === "korib_chiqilmoqda" && getDaysSince(a.sana) >= 3;
    });
  }, [allArizalar]);

  // AI-like stats
  const stats = useMemo(() => {
    const pending = allArizalar.filter(a => a.status === "korib_chiqilmoqda" && (a as any).holat !== "yakunlangan" && (a as any).holat !== "arxivlangan");
    const tumanCounts: Record<string, number> = {};
    pending.forEach(a => { tumanCounts[a.tuman] = (tumanCounts[a.tuman] || 0) + 1; });
    const topTuman = Object.entries(tumanCounts).sort((a, b) => b[1] - a[1])[0];
    const stuck = warnings.length;
    return { pendingCount: pending.length, topTuman, stuck };
  }, [allArizalar, warnings]);

  const activeAriza = activeId ? allArizalar.find(a => a.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || !canEdit) return;

    const arizaId = active.id as string;
    const targetColumn = over.id as KanbanStatus;

    if (!KANBAN_COLUMNS.find(c => c.id === targetColumn)) return;

    const ariza = allArizalar.find(a => a.id === arizaId);
    if (!ariza) return;

    const currentStatus = getKanbanStatus(ariza);
    if (currentStatus === targetColumn) return;

    // Map kanban column to actual status
    let newStatus: Ariza["status"] = ariza.status;
    let newHolat: string | undefined;

    if (targetColumn === "yakunlangan") {
      newHolat = "yakunlangan";
    } else if (targetColumn === "yangi" || targetColumn === "korib_chiqilmoqda") {
      newStatus = "korib_chiqilmoqda";
      newHolat = undefined;
    } else if (targetColumn === "tasdiqlandi") {
      newStatus = "tasdiqlandi";
      newHolat = undefined;
    } else if (targetColumn === "rad_etildi") {
      newStatus = "rad_etildi";
      newHolat = undefined;
    }

    const updates: any = { status: newStatus };
    if (newHolat) updates.holat = newHolat;

    DataManager.updateAriza(arizaId, updates, user?.ism || "");
    toast.success(`"${ariza.fuqaroIsm}" — ${t(targetColumn === "yakunlangan" ? "yakunlandi" : targetColumn === "tasdiqlandi" ? "tasdiqlandi" : targetColumn === "rad_etildi" ? "rad_etildi" : "korilmoqda")}`);
    onRefresh();
  };

  return (
    <div className="space-y-4" key={refreshKey}>
      {/* AI warnings */}
      {(stats.pendingCount > 0 || stats.stuck > 0) && (
        <div className="flex flex-wrap gap-2">
          {stats.pendingCount > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>{stats.pendingCount} ta ariza ko'rib chiqilmayapti</span>
            </div>
          )}
          {stats.topTuman && (
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 text-sm">
              <span>📍 {stats.topTuman[0]}da arizalar ko'paygan ({stats.topTuman[1]} ta)</span>
            </div>
          )}
          {stats.stuck > 0 && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>{stats.stuck} ta ariza 3+ kundan ortiq turib qolgan</span>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("qidirish_ariza")} value={qidiruv} onChange={e => setQidiruv(e.target.value)} className="pl-10" />
        </div>
        <Select value={tumanFilter} onValueChange={setTumanFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder={t("tuman")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="barchasi">{t("barcha_tumanlar")}</SelectItem>
            {SAMARQAND_TUMANLARI.map(tm => (
              <SelectItem key={tm} value={tm}>{tm}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={turFilter} onValueChange={setTurFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder={t("ariza_turi")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="barchasi">{t("barchasi")}</SelectItem>
            {turlar.map(tur => (
              <SelectItem key={tur} value={tur}>{tur}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kanban board */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
          {KANBAN_COLUMNS.map(col => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={`${col.icon} ${t(col.labelKey)}`}
              color={col.color}
              count={grouped[col.id].length}
              items={grouped[col.id]}
              onCardClick={setDetailAriza}
              warnings={col.id === "korib_chiqilmoqda" ? warnings : []}
            />
          ))}
        </div>
        <DragOverlay>
          {activeAriza ? <KanbanCard ariza={activeAriza} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      {/* Detail modal */}
      <ArizaDetailModal
        ariza={detailAriza}
        onClose={() => setDetailAriza(null)}
        onSaved={() => { setDetailAriza(null); onRefresh(); }}
      />
    </div>
  );
}
