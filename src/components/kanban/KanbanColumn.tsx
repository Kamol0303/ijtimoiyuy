import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./KanbanCard";
import type { Ariza } from "@/data/mock-data";

interface Props {
  id: string;
  title: string;
  color: string;
  count: number;
  items: Ariza[];
  onCardClick: (ariza: Ariza) => void;
  warnings: Ariza[];
}

export function KanbanColumn({ id, title, color, count, items, onCardClick, warnings }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const warningIds = new Set(warnings.map(w => w.id));

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-[280px] bg-muted/50 rounded-xl border-t-4 ${color} ${isOver ? "ring-2 ring-primary/40 bg-muted/80" : ""} transition-all`}
    >
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="bg-background text-foreground text-xs font-semibold px-2 py-0.5 rounded-full">{count}</span>
        </div>
      </div>
      <div className="p-2 space-y-2 max-h-[60vh] overflow-y-auto">
        {items.map(ariza => (
          <KanbanCard
            key={ariza.id}
            ariza={ariza}
            onClick={() => onCardClick(ariza)}
            isWarning={warningIds.has(ariza.id)}
          />
        ))}
        {items.length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-8">—</div>
        )}
      </div>
    </div>
  );
}
