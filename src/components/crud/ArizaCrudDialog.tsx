import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SAMARQAND_TUMANLARI } from "@/data/mock-data";
import { DataManager } from "@/services/DataManager";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import type { Ariza } from "@/data/mock-data";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  ariza?: Ariza;
  onSaved: () => void;
}

const ARIZA_TURLARI_KEYS = ["uy_olish", "ijara_uzaytirish", "murojaat_yuborish", "tamir_talabi"];

export function ArizaCrudDialog({ open, onClose, mode, ariza, onSaved }: Props) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [fuqaroIsm, setFuqaroIsm] = useState("");
  const [tur, setTur] = useState("");
  const [tuman, setTuman] = useState<string>("");
  const [status, setStatus] = useState<Ariza["status"]>("korib_chiqilmoqda");
  const [izoh, setIzoh] = useState("");

  useEffect(() => {
    if (mode === "edit" && ariza) {
      setFuqaroIsm(ariza.fuqaroIsm);
      setTur(ariza.tur);
      setTuman(ariza.tuman);
      setStatus(ariza.status);
      setIzoh(ariza.izoh);
    } else {
      setFuqaroIsm("");
      setTur("");
      setTuman("");
      setStatus("korib_chiqilmoqda");
      setIzoh("");
    }
  }, [mode, ariza, open]);

  const handleSave = () => {
    if (!fuqaroIsm.trim() || !tur || !tuman) {
      toast.error(t("fuqaro_ismi") + " va " + t("ariza_turi") + " to'ldirilishi shart");
      return;
    }

    if (mode === "edit" && ariza) {
      DataManager.updateAriza(ariza.id, { fuqaroIsm, tur, tuman: tuman as any, status, izoh }, user?.ism || "");
      toast.success(t("saqlash") + " — " + fuqaroIsm);
    } else {
      const newAriza: Ariza = {
        id: Date.now().toString(),
        fuqaroId: "",
        fuqaroIsm,
        tur,
        sana: new Date().toISOString().split("T")[0],
        status,
        izoh,
        tuman: tuman as any,
      };
      DataManager.addAriza(newAriza, user?.ism || "");
      toast.success(t("qoshildi") + " — " + fuqaroIsm);
    }

    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? t("ariza_qoshish") : t("ariza_tahrirlash")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>{t("fuqaro_ismi")}</Label>
            <Input value={fuqaroIsm} onChange={e => setFuqaroIsm(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>{t("ariza_turi")}</Label>
            <Select value={tur} onValueChange={setTur}>
              <SelectTrigger className="mt-1"><SelectValue placeholder={t("ariza_turi")} /></SelectTrigger>
              <SelectContent>
                {ARIZA_TURLARI_KEYS.map(k => (
                  <SelectItem key={k} value={t(k)}>{t(k)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("tuman")}</Label>
            <Select value={tuman} onValueChange={setTuman}>
              <SelectTrigger className="mt-1"><SelectValue placeholder={t("tuman")} /></SelectTrigger>
              <SelectContent>
                {SAMARQAND_TUMANLARI.map(tm => (
                  <SelectItem key={tm} value={tm}>{tm}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {mode === "edit" && (
            <div>
              <Label>{t("holat")}</Label>
              <Select value={status} onValueChange={v => setStatus(v as Ariza["status"])}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="korib_chiqilmoqda">{t("korilmoqda")}</SelectItem>
                  <SelectItem value="tasdiqlandi">{t("tasdiqlandi")}</SelectItem>
                  <SelectItem value="rad_etildi">{t("rad_etildi")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label>{t("izoh")}</Label>
            <Textarea value={izoh} onChange={e => setIzoh(e.target.value)} placeholder={t("ariza_izoh")} className="mt-1" rows={3} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>{t("bekor_qilish")}</Button>
            <Button onClick={handleSave}>{mode === "add" ? t("qoshish") : t("saqlash")}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}