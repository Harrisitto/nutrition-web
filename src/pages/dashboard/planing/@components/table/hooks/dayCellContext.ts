import { createContext, type ReactNode } from "react";
import type { RowInfo } from "../types";

export type RenderDayCell = (rowInfo: RowInfo, dayIndex: number) => ReactNode;

const DAY_COLUMN_PREFIX = "day-";

export const dayColumnId = (dayIndex: number) => `${DAY_COLUMN_PREFIX}${dayIndex}`;
export const dayIndexFromColumnId = (columnId: string) =>
  Number(columnId.slice(DAY_COLUMN_PREFIX.length));

/**
 * Render de las celdas de día. Va por contexto para que `columnDef.cell` sea siempre
 * el mismo componente: FlexRender hace createElement(cell), y con una función nueva
 * en cada render React remontaba todas las celdas y perdía el estado de los editores.
 */
export const DayCellContext = createContext<RenderDayCell>(() => null);
