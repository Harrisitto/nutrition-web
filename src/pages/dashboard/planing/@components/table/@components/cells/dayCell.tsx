import { useContext } from "react";
import type { RowInfo } from "../../types";
import { DayCellContext, dayIndexFromColumnId } from "../../hooks/dayCellContext";

/** `columnDef.cell` estable de las columnas de día; el contenido sale del contexto */
const DayCell = ({
  row,
  column,
}: {
  row: { original: RowInfo };
  column: { id: string };
}) => {
  const renderDayCell = useContext(DayCellContext);
  return <>{renderDayCell(row.original, dayIndexFromColumnId(column.id))}</>;
};

export default DayCell;
