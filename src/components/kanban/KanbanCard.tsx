import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, MapPin, AlertTriangle } from "lucide-react";
import type { Ariza } from "@/data/mock-data";

interface Props {
  ariza: Ariza;
  isDragging?: boolean;
  onClick?: () => void;
  isWarning?: boolean;
}

export function KanbanCard({ ariza, isDragging, onClick, isWarning }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: ariza.id,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  const daysSince = Math.floor((Date.now() - new Date(ariza.sana).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`
        bg-card border rounded-lg p-3 cursor-grab active:cursor-grabbing
        hover:shadow-md transition-shadow select-none
        ${isDragging ? "opacity-70 shadow-lg rotate-2 scale-105" : ""}
        ${isWarning ? "border-amber-400 dark:border-amber-600" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm text-foreground leading-tight">{ariza.fuqaroIsm}</h4>
        {isWarning && <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />}
      </div>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{ariza.tur}</p>
      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {ariza.tuman.replace(" tumani", "")}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {ariza.sana}
        </span>
      </div>
      {daysSince >= 3 && ariza.status === "korib_chiqilmoqda" && (
        <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
          ⏰ {daysSince} kun turib qolgan
        </div>
      )}
    </div>
  );
}
