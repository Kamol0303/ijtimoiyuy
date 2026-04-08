import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { DataManager } from "@/services/DataManager";
import { AuditService } from "@/services/AuditService";
import { PermissionService } from "@/services/PermissionService";
import { ArizaCrudDialog } from "@/components/crud/ArizaCrudDialog";
import { toast } from "sonner";
import { Pencil, Calendar, MapPin, FileText, MessageSquare, Clock } from "lucide-react";
import type { Ariza } from "@/data/mock-data";

interface Props {
  ariza: Ariza | null;
  onClose: () => void;
  onSaved: () => void;
}

const statusLabels: Record<string, { label: string; class: string }> = {
  korib_chiqilmoqda: { label: "Ko'rib chiqilmoqda", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  tasdiqlandi: { label: "Tasdiqlandi", class: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" },
  rad_etildi: { label: "Rad etildi", class: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" },
};

export function ArizaDetailModal({ ariza, onClose, onSaved }: Props) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [izoh, setIzoh] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  const role = user?.role;
  const canEdit = role ? PermissionService.canEdit(role, "arizalar") : false;

  if (!ariza) return null;

  const holat = (ariza as any).holat;
  const isYakunlangan = holat === "yakunlangan";

  // Get comments from audit log for this ariza
  const logs = AuditService.getAll().filter(
    l => l.bolim === "Arizalar" && l.malumot === ariza.fuqaroIsm
  );

  // Get saved comments
  const comments: { user: string; text: string; date: string }[] = (() => {
    try {
      const raw = localStorage.getItem(`ariza_comments_${ariza.id}`);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  })();

  const addComment = () => {
    if (!izoh.trim()) return;
    const newComments = [...comments, {
      user: user?.ism || "Noma'lum",
      text: izoh.trim(),
      date: new Date().toISOString().split("T")[0] + " " + new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
    }];
    localStorage.setItem(`ariza_comments_${ariza.id}`, JSON.stringify(newComments));
    toast.success("Izoh qo'shildi");
    setIzoh("");
  };

  const daysSince = Math.floor((Date.now() - new Date(ariza.sana).getTime()) / (1000 * 60 * 60 * 24));
  const statusInfo = statusLabels[ariza.status] || { label: ariza.status, class: "bg-muted" };

  return (
    <>
      <Dialog open={!!ariza} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {ariza.fuqaroIsm}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}>
                {isYakunlangan ? "⚫ Yakunlangan" : statusInfo.label}
              </span>
              {daysSince >= 3 && ariza.status === "korib_chiqilmoqda" && !isYakunlangan && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  ⏰ {daysSince} kun turib qolgan
                </span>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {ariza.tuman}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" /> {ariza.sana}
              </div>
              <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" /> {ariza.tur}
              </div>
            </div>

            {/* Izoh */}
            {ariza.izoh && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm">{ariza.izoh}</p>
              </div>
            )}

            {/* Edit button */}
            {canEdit && !isYakunlangan && (
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="gap-2">
                <Pencil className="h-3.5 w-3.5" /> {t("tahrirlash")}
              </Button>
            )}

            {/* Comments */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4" /> Izohlar va tarix
              </h4>

              <div className="space-y-2 max-h-[200px] overflow-y-auto mb-3">
                {comments.map((c, i) => (
                  <div key={i} className="bg-muted/50 rounded-lg p-2 text-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <span className="font-medium text-foreground">{c.user}</span>
                      <Clock className="h-3 w-3" /> {c.date}
                    </div>
                    <p>{c.text}</p>
                  </div>
                ))}
                {logs.slice(0, 5).map((l, i) => (
                  <div key={`log-${i}`} className="bg-muted/30 rounded-lg p-2 text-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <span className="font-medium text-foreground">{l.foydalanuvchi}</span>
                      <Clock className="h-3 w-3" /> {l.vaqt}
                    </div>
                    <p className="text-muted-foreground">{l.tafsilot}</p>
                  </div>
                ))}
                {comments.length === 0 && logs.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">Hozircha izohlar yo'q</p>
                )}
              </div>

              {/* Add comment */}
              <div className="flex gap-2">
                <Textarea
                  value={izoh}
                  onChange={e => setIzoh(e.target.value)}
                  placeholder="Izoh yozing..."
                  rows={2}
                  className="text-sm"
                />
                <Button size="sm" onClick={addComment} disabled={!izoh.trim()}>
                  Yuborish
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ArizaCrudDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        ariza={ariza}
        onSaved={() => { setEditOpen(false); onSaved(); }}
      />
    </>
  );
}
