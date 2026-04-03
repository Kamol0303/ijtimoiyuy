import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { DataManager } from "@/services/DataManager";
import { type Fuqaro, SAMARQAND_TUMANLARI, type SamarqandTuman } from "@/data/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface FuqaroCrudDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  fuqaro?: Fuqaro;
  onSaved: () => void;
}

export function FuqaroCrudDialog({ open, onClose, mode, fuqaro, onSaved }: FuqaroCrudDialogProps) {
  const { user } = useAuth();
  const [form, setForm] = useState<Partial<Fuqaro>>(
    fuqaro || { ism: "", jshshir: "", telefon: "", ijtimoiyHolat: "", tuman: "Samarqand tumani" as SamarqandTuman, arizalarSoni: 0 }
  );

  const handleSave = useCallback(() => {
    if (!form.ism || !form.jshshir) {
      toast.error("Ism va JSHSHIR to'ldirilishi shart");
      return;
    }
    const foydalanuvchi = user?.ism || "Noma'lum";
    if (mode === "add") {
      const newF: Fuqaro = {
        id: Date.now().toString(),
        ism: form.ism!,
        jshshir: form.jshshir!,
        telefon: form.telefon || "",
        ijtimoiyHolat: form.ijtimoiyHolat || "",
        tuman: form.tuman as SamarqandTuman || "Samarqand tumani",
        arizalarSoni: form.arizalarSoni || 0,
      };
      DataManager.addFuqaro(newF, foydalanuvchi);
      toast.success("Fuqaro muvaffaqiyatli qo'shildi");
    } else if (fuqaro) {
      DataManager.updateFuqaro(fuqaro.id, form, foydalanuvchi);
      toast.success("Fuqaro muvaffaqiyatli tahrirlandi");
    }
    onSaved();
    onClose();
  }, [form, mode, fuqaro, user, onSaved, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Yangi fuqaro qo'shish" : "Fuqaroni tahrirlash"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div><Label>Ism</Label><Input value={form.ism || ""} onChange={(e) => setForm({ ...form, ism: e.target.value })} /></div>
          <div><Label>JSHSHIR</Label><Input value={form.jshshir || ""} onChange={(e) => setForm({ ...form, jshshir: e.target.value })} /></div>
          <div><Label>Telefon</Label><Input value={form.telefon || ""} onChange={(e) => setForm({ ...form, telefon: e.target.value })} /></div>
          <div><Label>Ijtimoiy holat</Label><Input value={form.ijtimoiyHolat || ""} onChange={(e) => setForm({ ...form, ijtimoiyHolat: e.target.value })} /></div>
          <div>
            <Label>Tuman</Label>
            <Select value={form.tuman} onValueChange={(v) => setForm({ ...form, tuman: v as SamarqandTuman })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SAMARQAND_TUMANLARI.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
          <Button onClick={handleSave}>{mode === "add" ? "Qo'shish" : "Saqlash"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
