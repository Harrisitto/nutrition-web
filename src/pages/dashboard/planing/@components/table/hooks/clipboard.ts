import { useCallback, useEffect, useMemo, useState } from "react";
import type FromDate from "@src/helpers/dates";
import { toCommandKey } from "@src/helpers/keyboard";
import { useAppSelector } from "@src/store/store";
import { useNotification } from "@src/store/slices/notification/hook";
import { useMutatePlaning } from "@src/services/tanstack/user/planing";
import {
  ALL_IDS,
  MealRowInfo,
  TrainingHcRowInfo,
  type AllIdsValues,
  type RowInfo,
} from "../types";
import { useCloneDay, useCopyMeal } from "./copyMeal";
import { useSaveTraining } from "./training";

/**
 * Celda copiada: su fila, su fecha y el valor que tenía al copiar. Comidas y días no usan `value`: al pegar,
 * la RPC copia lo que haya en ese momento en la celda de origen (igual que arrastrar)
 */
export interface CopiedCell {
  row: RowInfo;
  date: FromDate;
  value: string | number;
}

type PasteHandler = (from: CopiedCell, to: { row: RowInfo; date: FromDate }) => void;

/**
 * Copiar (tecla `copyCell`, por defecto "c") y pegar (`pasteCell`, por defecto "v") la celda resaltada por la
 * navegación de teclado. Solo se copian las filas con un `PasteHandler` y solo se pega en una celda compatible
 * (`RowInfo.isSameCell`). Para que una fila nueva admita copiar/pegar basta con añadir su handler
 */
const useCellClipboard = ({
  editableRows,
  dayDates,
  selection,
  isEditorOpen,
}: {
  editableRows: RowInfo[];
  dayDates: FromDate[];
  selection: { row: number; col: number };
  isEditorOpen: boolean;
}) => {
  const { copyCell, pasteCell, exitCell } = useAppSelector(
    (state) => state.config.keyboardCommands.tableNavigation,
  );
  const { add: addNotification } = useNotification();
  const { mutateAsync: savePlaning } = useMutatePlaning();
  const { saveTrainingKcal, saveTrainingHc } = useSaveTraining();
  const { copyMeal } = useCopyMeal();
  const { cloneDay } = useCloneDay();
  // En estado (no en un ref) para mostrarlo en ClipboardBadge
  const [copied, setCopied] = useState<CopiedCell | null>(null);

  // Cómo se pega en cada fila, por su id base
  const pasteHandlers = useMemo<Partial<Record<AllIdsValues, PasteHandler>>>(
    () => ({
      // Comida en cualquier comida: copia tipo, receta, comentario e ingredientes
      [ALL_IDS.INPUT_MEAL]: (from, to) => {
        if (!(from.row instanceof MealRowInfo) || !(to.row instanceof MealRowInfo)) return;
        copyMeal({
          from: { date: from.date.save(), mealId: from.row.mealId },
          to: [{ date: to.date.save(), mealId: to.row.mealId }],
        });
      },
      // Día (fila de presets): clona todas sus comidas
      [ALL_IDS.INPUT_PRESET]: (from, to) => {
        cloneDay({ from: from.date.save(), to: [to.date.save()] });
      },
      // Entreno: con el ajuste automático activo también reajusta las comidas del día
      [ALL_IDS.INPUT_TRAINING_KCAL]: (from, to) => {
        saveTrainingKcal(to.date, Number(from.value) || 0);
      },
      [ALL_IDS.INPUT_TRAINING_HC]: (from, to) => {
        if (!(to.row instanceof TrainingHcRowInfo)) return;
        const hc = Number(from.value) || 0;
        saveTrainingHc(to.date, to.row.getUpdatedArray(to.date.save(), hc));
      },
      [ALL_IDS.INPUT_COMMENTS]: (from, to) => {
        savePlaning({ date: to.date, comment: String(from.value) });
      },
      [ALL_IDS.INPUT_EVENTS]: (from, to) => {
        savePlaning({ date: to.date, event: String(from.value) });
      },
      [ALL_IDS.INPUT_CUSTOM_URL]: (from, to) => {
        savePlaning({ date: to.date, custom_url: String(from.value) || null });
      },
      [ALL_IDS.INPUT_DOCUMENT]: (from, to) => {
        savePlaning({ date: to.date, document_id: String(from.value) || null });
      },
    }),
    [copyMeal, cloneDay, saveTrainingKcal, saveTrainingHc, savePlaning],
  );

  // Si lo copiado se puede pegar en una celda de `row` (ClipboardBadge cambia de color)
  const canPasteInto = useCallback(
    (row: RowInfo | undefined) =>
      !!copied && !!row && !!pasteHandlers[row.getRowId()] && copied.row.isSameCell(row),
    [copied, pasteHandlers],
  );

  useEffect(() => {
    if (isEditorOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat) return;
      // Ctrl/Cmd+C y similares siguen siendo los del navegador
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Escribiendo en algún campo de la página (buscadores, etc.)
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, select, [contenteditable='true']")) return;

      const key = toCommandKey(e.key);
      // Con el editor cerrado, la tecla de salir vacía el portapapeles (ClipboardBadge no se puede pulsar)
      if (key === exitCell && copied) {
        e.preventDefault();
        setCopied(null);
        return;
      }
      if (key !== copyCell && key !== pasteCell) return;

      const row = editableRows[selection.row];
      const date = dayDates[selection.col];
      if (!row || !date) return;
      e.preventDefault();

      if (key === copyCell) {
        if (!pasteHandlers[row.getRowId()]) return;
        const value = row.map.get(date.save()) ?? "";
        // Una comida vacía no tiene nada que copiar (como al arrastrar)
        if (row instanceof MealRowInfo && !value) return;
        // ClipboardBadge ya muestra lo copiado: no hace falta aviso
        setCopied({ row, date, value });
        return;
      }

      if (!copied) return;
      const paste = pasteHandlers[row.getRowId()];
      if (!paste || !canPasteInto(row)) {
        addNotification({ type: "error", message: "data:dashboardTable.actions.cannotPasteHere" });
        return;
      }
      // Sobre la misma celda, useCopyMeal y useCloneDay ya no hacen nada
      paste(copied, { row, date });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isEditorOpen,
    copyCell,
    pasteCell,
    exitCell,
    editableRows,
    dayDates,
    selection.row,
    selection.col,
    pasteHandlers,
    addNotification,
    copied,
    canPasteInto,
  ]);

  return { copied, canPasteInto };
};

export default useCellClipboard;
