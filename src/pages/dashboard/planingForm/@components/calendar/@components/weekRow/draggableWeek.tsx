import { useCallback, useEffect, useMemo } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { saveDate } from "@src/helpers/dates";
import { WeekRowVisual } from "./visualWeek";
import { useFetchPlanning } from "@src/services/tanstack/user/planing";

interface DraggableWeekRowProps {
  days: Date[];
}

export const DraggableWeekRow = ({ days }: DraggableWeekRowProps) => {
  // Generamos una ID única e inmutable para esta fila (la fecha del lunes)
  const weekId = useMemo(() => saveDate(days[0]), [days]);
  const planningQuery = useFetchPlanning({
    forDate: days[0],
  });

  // Hook para hacer la fila ARRASTRABLE
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: weekId,
    data: { days, planingData: planningQuery.data }, // Pasamos las fechas para saber qué semana se está arrastrando
  });

  useEffect(() => {}, [planningQuery.data]);

  // Hook para hacer la fila RECEPTORA (droppable)
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: weekId,
    data: { days }, // Pasamos las fechas para saber sobre qué semana se va a soltar
  });

  // Combinamos ambas referencias para un mismo contenedor en el DOM
  const setCombinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      setDragRef(node);
      setDropRef(node);
    },
    [setDragRef, setDropRef],
  );

  return (
    <div
      ref={setCombinedRef}
      className="group relative flex items-center gap-1"
    >
      {/* Tirador / Handle para arrastrar la semana */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab text-dark-green/30 transition-colors hover:text-dark-green active:cursor-grabbing"
        title="Arrastra para clonar esta semana"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Renderizado de la semana visual con los estados de DnD */}
      <div className="flex-1">
        <WeekRowVisual days={days} isDragging={isDragging} isOver={isOver} />
      </div>
    </div>
  );
};
