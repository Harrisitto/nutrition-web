import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";
import { ALL_IDS, MealRowInfo, RowInfo, TrainingHcRowInfo } from "../types";
import { useDaysOfWeek } from "@src/hooks/helpers/language";
import CellRowLabel from "../@components/cells/rowLabel";
import CellPresetDay from "../@components/cells/presetDay";
import CellMeal from "../@components/cells/mealCell";
import CellNumeric from "../@components/cells/numericCell";
import CellText from "../@components/cells/textCell";
import CellDisplay from "../@components/cells/displayCell";
import CellAutoGenerate from "../@components/cells/autoGenerateCell";
import CellRace from "../@components/cells/raceCell";
import CellDocument from "../@components/cells/documentCell";
import DayCell from "../@components/cells/dayCell";
import { dayColumnId, type RenderDayCell } from "./dayCellContext";
import type FromDate from "@src/helpers/dates";
import { features } from "../features";
import { useMutatePlaning } from "@src/services/tanstack/user/planing";
import { useSaveTraining } from "./training";

// Solo se aceptan enlaces https; vacío borra el enlace
const isValidHttpsUrl = (value: string) => {
  if (/\s/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.includes(".");
  } catch {
    return false;
  }
};

const useTableColumns = ({
  editingCell,
  selectCell,
  closeEditor,
  dayDates,
  highlightedCellId,
}: {
  editingCell: string | null;
  selectCell: (row: RowInfo, dayIndex: number) => void;
  closeEditor: () => void;
  dayDates: FromDate[];
  highlightedCellId: string | null;
}) => {
  const { t } = useTranslation();
  const daysOfWeek = useDaysOfWeek();
  const planingMutation = useMutatePlaning();
  // Con el ajuste automatico activo tambien reajustan las comidas del dia
  const { saveTrainingKcal, saveTrainingHc } = useSaveTraining();

  // Cambia con cada edición (selectCell depende de las filas): por eso no va en columnDef.cell
  const renderDayCell = useCallback<RenderDayCell>(
    (rowInfo, dayIndex) => {
      const date = dayDates[dayIndex];
      if (!date) return null;
      const cellValue = rowInfo.map.get(date.save()) ?? "";
      const cellKey = rowInfo.getCellId(date.save());
      const isEditing = editingCell === cellKey;
      const isHighlighted = !isEditing && highlightedCellId === cellKey;
      const openEditor = () => selectCell(rowInfo, dayIndex);

      switch (rowInfo.getRowId()) {
        case ALL_IDS.INPUT_PRESET:
          return (
            <CellPresetDay
              date={date}
              dayName={daysOfWeek[dayIndex]}
              isEditing={isEditing}
              isHighlighted={isHighlighted}
              openEditor={openEditor}
              closeEditor={closeEditor}
            />
          );

        case ALL_IDS.INPUT_AUTO_GENERATE:
          return (
            <CellAutoGenerate
              date={date}
              isEditing={isEditing}
              isHighlighted={isHighlighted}
              openEditor={openEditor}
              closeEditor={closeEditor}
            />
          );

        case ALL_IDS.INPUT_MEAL:
          if (!(rowInfo instanceof MealRowInfo)) return null;
          return (
            <CellMeal
              rowInfo={rowInfo}
              date={date}
              cellValue={cellValue}
              isEditing={isEditing}
              isHighlighted={isHighlighted}
              openEditor={openEditor}
              closeEditor={closeEditor}
            />
          );

        case ALL_IDS.INPUT_TRAINING_HC:
          if (!(rowInfo instanceof TrainingHcRowInfo)) return null;
          return (
            <CellNumeric
              rowInfo={rowInfo}
              date={date}
              cellValue={cellValue}
              isEditing={isEditing}
              isHighlighted={isHighlighted}
              openEditor={openEditor}
              closeEditor={closeEditor}
              onSave={(num) => {
                saveTrainingHc(date, rowInfo.getUpdatedArray(date.save(), num));
              }}
            />
          );

        case ALL_IDS.INPUT_TRAINING_KCAL:
          return (
            <CellNumeric
              rowInfo={rowInfo}
              date={date}
              cellValue={cellValue}
              isEditing={isEditing}
              isHighlighted={isHighlighted}
              openEditor={openEditor}
              closeEditor={closeEditor}
              onSave={(num) => {
                saveTrainingKcal(date, num);
              }}
            />
          );

        case ALL_IDS.INPUT_RACES:
          return (
            <CellRace
              dayName={daysOfWeek[dayIndex]}
              cellValue={cellValue}
              isHighlighted={isHighlighted}
              openEditor={openEditor}
            />
          );

        case ALL_IDS.INPUT_COMMENTS:
          return (
            <CellText
              rowInfo={rowInfo}
              date={date}
              cellValue={cellValue}
              isEditing={isEditing}
              isHighlighted={isHighlighted}
              placeholder={t("data:dashboardTable.commentsRows.writeComment")}
              openEditor={openEditor}
              closeEditor={closeEditor}
              onSave={(val) => {
                planingMutation.mutateAsync({
                  date,
                  comment: val,
                });
              }}
            />
          );
        case ALL_IDS.INPUT_EVENTS:
          return (
            <CellText
              rowInfo={rowInfo}
              date={date}
              cellValue={cellValue}
              isEditing={isEditing}
              isHighlighted={isHighlighted}
              placeholder={t("data:dashboardTable.commentsRows.writeComment")}
              openEditor={openEditor}
              closeEditor={closeEditor}
              onSave={(val) => {
                planingMutation.mutateAsync({
                  date,
                  event: val,
                });
              }}
            />
          );
        case ALL_IDS.INPUT_CUSTOM_URL:
          return (
            <CellText
              rowInfo={rowInfo}
              date={date}
              cellValue={cellValue}
              isEditing={isEditing}
              isHighlighted={isHighlighted}
              placeholder={t("data:dashboardTable.customUrlRow.placeholder")}
              openEditor={openEditor}
              closeEditor={closeEditor}
              validate={(val) =>
                !val || isValidHttpsUrl(val)
                  ? null
                  : t("data:dashboardTable.customUrlRow.invalidUrl")
              }
              onSave={(val) => {
                planingMutation.mutateAsync({
                  date,
                  custom_url: val || null,
                });
              }}
            />
          );

        case ALL_IDS.INPUT_DOCUMENT:
          return (
            <CellDocument
              date={date}
              cellValue={cellValue}
              isEditing={isEditing}
              isHighlighted={isHighlighted}
              openEditor={openEditor}
              closeEditor={closeEditor}
            />
          );

        case ALL_IDS.DISPLAY_ENERGY_BALANCE:
        case ALL_IDS.DISPLAY_CARBS_PER_KG:
        case ALL_IDS.DISPLAY_PROTEIN_PER_KG:
        case ALL_IDS.DISPLAY_FAT_PER_KG:
        default:
          return <CellDisplay cellValue={cellValue} />;
      }
    },
    [
      dayDates,
      editingCell,
      highlightedCellId,
      selectCell,
      closeEditor,
      daysOfWeek,
      planingMutation,
      saveTrainingKcal,
      saveTrainingHc,
      t,
    ],
  );

  // Solo depende del número de días: las celdas no se remontan al cambiar datos o selección
  const dayCount = dayDates.length;
  const columns = useMemo<Array<ColumnDef<typeof features, RowInfo>>>(
    () => [
      { id: "rowLabel", cell: CellRowLabel },
      ...Array.from({ length: dayCount }, (_, dayIndex) => ({
        id: dayColumnId(dayIndex),
        cell: DayCell,
      })),
    ],
    [dayCount],
  );

  return { columns, renderDayCell };
};

export default useTableColumns;
