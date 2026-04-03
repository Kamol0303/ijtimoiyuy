import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { DataManager } from "@/services/DataManager";
import { type Uy, SAMARQAND_TUMANLARI, type SamarqandTuman } from "@/data/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface UyCrudDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  uy?: Uy;
  onSaved: () => void;
}

export function UyCrudDialog({ open, onClose, mode, uy, onSaved }: UyCrudDialogProps) {
  const { user } = useAuth();
  const [form, setForm] = useState<Partial<Uy>>(
    uy || { nomi: "", tur: "jiloy", manzil: "", tuman: "Samarqand tumani" as SamarqandTuman, egasi: "", status: "bosh", shartnomaMuddat: "", xonalar: 0, maydon: 0 }
  );

  const handleSave = useCallback(() => {
    if (!form.nomi || !form.manzil) {
      toast.error("Nomi va manzil to'ldirilishi shart");
      return;
    }
    const foydalanuvchi = user?.ism || "Noma'lum";
    if (mode === "add") {
      const newUy: Uy = {
        ...form,
        id: Date.now().toString(),
        nomi: form.nomi!,
        tur: (form.tur as Uy["tur"]) || "jiloy",
        manzil: form.manzil!,
        tuman: form.tuman as SamarqandTuman || "Samarqand tumani",
        egasi: form.egasi || "",
        status: (form.status as Uy["status"]) || "bosh",
        shartnomaMuddat: form.shartnomaMuddat || "",
        xonalar: form.xonalar || 0,
        maydon: form.maydon || 0,
      };
      DataManager.addUy(newUy, foydalanuvchi);
      toast.success("Uy muvaffaqiyatli qo'shildi");
    } else if (uy) {
      DataManager.updateUy(uy.id, form, foydalanuvchi);
      toast.success("Uy muvaffaqiyatli tahrirlandi");
    }
    onSaved();
    onClose();
  }, [form, mode, uy, user, onSaved, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Yangi uy qo'shish" : "Uyni tahrirlash"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div><Label>Nomi</Label><Input value={form.nomi || ""} onChange={(e) => setForm({ ...form, nomi: e.target.value })} /></div>
          <div><Label>Manzil</Label><Input value={form.manzil || ""} onChange={(e) => setForm({ ...form, manzil: e.target.value })} /></div>
          <div>
            <Label>Tuman</Label>
            <Select value={form.tuman} onValueChange={(v) => setForm({ ...form, tuman: v as SamarqandTuman })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SAMARQAND_TUMANLARI.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Tur</Label>
              <Select value={form.tur} onValueChange={(v) => setForm({ ...form, tur: v as Uy["tur"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="jiloy">Jiloy</SelectItem>
                  <SelectItem value="nejiloy">Nejiloy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Uy["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bosh">Bo'sh</SelectItem>
                  <SelectItem value="band">Band</SelectItem>
                  <SelectItem value="muddat_yaqin">Muddat yaqin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Xonalar</Label><Input type="number" value={form.xonalar || 0} onChange={(e) => setForm({ ...form, xonalar: +e.target.value })} /></div>
            <div><Label>Maydon (m²)</Label><Input type="number" value={form.maydon || 0} onChange={(e) => setForm({ ...form, maydon: +e.target.value })} /></div>
          </div>
          <div><Label>Egasi</Label><Input value={form.egasi || ""} onChange={(e) => setForm({ ...form, egasi: e.target.value })} /></div>
          <div><Label>Shartnoma muddati</Label><Input type="date" value={form.shartnomaMuddat || ""} onChange={(e) => setForm({ ...form, shartnomaMuddat: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
          <Button onClick={handleSave}>{mode === "add" ? "Qo'shish" : "Saqlash"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
