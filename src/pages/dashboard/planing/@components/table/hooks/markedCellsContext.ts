import { createContext } from "react";
import type { CellDragData } from "../@components/cells/draggableCell";

/** Id de dnd-kit de una celda: también la clave de las celdas marcadas */
export const dragId = (data: CellDragData) =>
  data.kind === "meal" ? `meal-${data.date}-${data.mealId}` : `day-${data.date}`;

/**
 * Celdas marcadas (tecla `markCell`) durante el arrastre actual (por `dragId`): al soltar se copia también en
 * ellas. Lo da la tabla (index.tsx) y lo lee DraggableCell para resaltarlas
 */
export const MarkedCellsContext = createContext<ReadonlySet<string>>(new Set());
