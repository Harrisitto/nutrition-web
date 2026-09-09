import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTable } from "@tanstack/react-table";
import FromDate from "@src/helpers/dates";
import { useAppSelector } from "@src/store/store";
import useTableRows from "./hooks/rows";
import useTableColumns from "./hooks/columns";
import useKeyboardNavigation from "./hooks/navigation";
import { features } from "./features";
import { sectionHeaderTdStyle } from "./styles";
import type { RowInfo } from "./types";

interface Selection {
  row: number;
  col: number;
}

export const WeeklyMeals = () => {
  const { rows } = useTableRows();
  const selectedDate = useAppSelector((state) => state.config.selectedDay);
  const dayDates = useMemo(() => {
    const startMonday = new FromDate(selectedDate).thisMonday();
    return Array.from({ length: 7 }, (_, i) => startMonday.incrementDay(i));
  }, [selectedDate]);

  // Estado para controlar qué celda está en modo edición mediante su Cell ID
  const [editingCell, setEditingCell] = useState<string | null>(null);
  // Estado para la celda resaltada por la navegación de teclado
  const [selection, setSelection] = useState<Selection>({ row: 0, col: 0 });

  const editableRows = useMemo(
    () => rows.filter((row) => !!row.isEditable),
    [rows],
  );

  const selectCell = useCallback(
    (row: RowInfo, dayIndex: number) => {
      // Se compara por identidad de contenido (no por referencia): `rows` se
      // reconstruye con instancias nuevas en cada refetch de las queries, así
      // que `indexOf` fallaría en silencio justo después de una revalidación.
      const rowKey = row.getCellId("");
      const rowIndex = editableRows.findIndex(
        (candidate) => candidate.getCellId("") === rowKey,
      );
      if (rowIndex !== -1) {
        setSelection({ row: rowIndex, col: dayIndex });
      }
      const date = dayDates[dayIndex];
      if (date) setEditingCell(row.getCellId(date.save()));
    },
    [editableRows, dayDates],
  );

  const closeEditor = useCallback(() => setEditingCell(null), []);

  const highlightedCellId = useMemo(() => {
    const row = editableRows[selection.row];
    const date = dayDates[selection.col];
    if (!row || !date) return null;
    return row.getCellId(date.save());
  }, [editableRows, dayDates, selection]);

  const selectedRowKey = useMemo(() => {
    const row = editableRows[selection.row];
    return row ? row.getCellId("") : null;
  }, [editableRows, selection.row]);

  // Centra verticalmente la fila seleccionada al navegar con teclado, pero no
  // en el primer render (evita un salto de scroll no solicitado al montar).
  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (!selectedRowKey) return;
    const rowElement = document.querySelector<HTMLElement>(
      `tr[data-row-key="${selectedRowKey}"]`,
    );
    rowElement?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [selectedRowKey]);

  const setTableSelection = useCallback(
    (patch: Partial<Selection & { isEditorOpen: boolean }>) => {
      if (patch.row !== undefined || patch.col !== undefined) {
        setSelection((prev) => ({
          row: patch.row ?? prev.row,
          col: patch.col ?? prev.col,
        }));
      }
      if (patch.isEditorOpen === true) {
        const row = editableRows[patch.row ?? selection.row];
        const date = dayDates[patch.col ?? selection.col];
        if (row && date) setEditingCell(row.getCellId(date.save()));
      } else if (patch.isEditorOpen === false) {
        setEditingCell(null);
      }
    },
    [editableRows, dayDates, selection],
  );

  useKeyboardNavigation({
    editableRows,
    tableSelection: { ...selection, isEditorOpen: editingCell !== null },
    setTableSelection,
    dayDatesLength: dayDates.length,
  });

  const columns = useTableColumns({
    editingCell,
    selectCell,
    closeEditor,
    dayDates,
    highlightedCellId,
  });

  const table = useTable({
    features,
    data: rows,
    columns,
  });

  return (
    <div className="overflow-x-auto rounded-2xl bg-white-green shadow-md">
      <table className="w-full min-w-[920px] border-separate border-spacing-0 text-sm">
        <tbody>
          {table.getRowModel().rows.map((row) => {
            if (row.original.isFullWidth) {
              return (
                <tr key={row.id}>
                  <td
                    className={sectionHeaderTdStyle}
                    colSpan={dayDates.length + 1}
                  >
                    {row.original.label}
                  </td>
                </tr>
              );
            }

            return (
              <tr
                key={row.id}
                data-row-key={row.original.getCellId("")}
                className={`transition-colors`}
              >
                {row.getAllCells().map((cell, index) => {
                  const isStickyLabel = index === 0;

                  // 1. La primera columna (index === 0) se ajusta al mínimo necesario sin romper línea.
                  // 2. Las 7 columnas restantes se dividen el espacio restante a partes iguales (100% / 7 = 14.28%).
                  const cellStyle = isStickyLabel
                    ? `sticky left-0 z-10 w-px whitespace-nowrap`
                    : "w-[14.28%] px-1.5 py-2 align-middle";

                  return (
                    <td key={cell.id} className={cellStyle}>
                      <table.FlexRender cell={cell} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyMeals;
