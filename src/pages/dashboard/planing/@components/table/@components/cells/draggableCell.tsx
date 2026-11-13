import { useCallback, useContext, useEffect, type ReactNode } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { dragId, MarkedCellsContext } from "../../hooks/markedCellsContext";

/**
 * Lo que viaja con la celda arrastrada y lo que identifica a la celda de destino.
 * Solo se suelta sobre una celda del mismo `kind`: comida sobre comida, día sobre día
 */
export type CellDragData =
  | { kind: "meal"; date: string; mealId: number }
  | { kind: "day"; date: string };

interface DraggableCellProps {
  data: CellDragData;
  /** false = solo receptora (p.ej. una comida vacía: no hay nada que copiar) */
  canDrag?: boolean;
  /** Recibe si la celda se está arrastrando, para que el contenido no se expanda mientras tanto */
  children: (state: { isDragging: boolean }) => ReactNode;
}

/**
 * Celda arrastrable y receptora (dnd-kit). Una comida soltada sobre otra celda de comida se copia
 * allí; un día soltado sobre otro día clona sus comidas (ver hooks/copyMeal.ts). El `DndContext`
 * está en la tabla. Los listeners van en el contenedor: el click normal sigue abriendo el editor
 * gracias al umbral de distancia del sensor. Durante el arrastre, la tecla `markCell` (Configuración → Teclado, por defecto espacio) sobre otra celda la marca
 * (anillo) y al soltar se copia también en ella.
 */
const DraggableCell = ({ data, canDrag = true, children }: DraggableCellProps) => {
  
  const id = dragId(data);
  
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({ id, data, disabled: !canDrag });
  
  const { setNodeRef: setDropRef, isOver, active } = useDroppable({ id, data });

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      setDragRef(node);
      setDropRef(node);
    },
    [setDragRef, setDropRef],
  );

  // Solo se resalta si soltar ahí hace algo: otra celda del mismo tipo
  const activeData = active?.data.current as CellDragData | undefined;
  const canReceive = isOver && active?.id !== id && activeData?.kind === data.kind;
  // Marcada en este arrastre: también recibirá la copia al soltar
  const isMarked = useContext(MarkedCellsContext).has(id);

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = "grabbing";
    } else {
      document.body.style.cursor = "";
    }
  }, [isDragging]);

  return (
    <div
      ref={setRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={`rounded-lg transition-shadow ${
        isDragging ? "relative z-20 cursor-grabbing opacity-70 shadow-lg" : ""
      } ${
        canReceive
          ? "ring-2 ring-nutrition-green ring-offset-1"
          : isMarked
            ? "outline-dashed outline-2 outline-offset-1 outline-nutrition-green/70"
            : ""
      }`}
    >
      {children({ isDragging })}
    </div>
  );
};

export default DraggableCell;
