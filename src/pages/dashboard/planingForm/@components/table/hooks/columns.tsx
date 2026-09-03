import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";
import { ALL_IDS, MealRowInfo, RowInfo } from "../types";
import { useDaysOfWeek } from "@src/hooks/helpers/language";
import CellRowLabel from "../@components/cells/rowLabel";
import CellPresetDay from "../@components/cells/presetDay";
import CellMeal from "../@components/cells/mealCell";
import CellNumeric from "../@components/cells/numericCell";
import CellText from "../@components/cells/textCell";
import CellDisplay from "../@components/cells/displayCell";
import type FromDate from "@src/helpers/dates";
import { features } from "../features";

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

  const columns = useMemo<Array<ColumnDef<typeof features, RowInfo>>>(() => {
    const rowLabelCol: ColumnDef<typeof features, RowInfo> = {
      id: "rowLabel",
      cell: CellRowLabel,
    };

    const dayColumns: Array<ColumnDef<typeof features, RowInfo>> =
      dayDates.map(
        (date, dayIndex): ColumnDef<typeof features, RowInfo> => ({
          id: `day-${dayIndex}`,
          cell: ({ row }) => {
            const rowInfo = row.original;
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
                  />
                );

              case ALL_IDS.INPUT_COMMENTS:
              case ALL_IDS.INPUT_EVENTS:
                return (
                  <CellText
                    rowInfo={rowInfo}
                    date={date}
                    cellValue={cellValue}
                    isEditing={isEditing}
                    isHighlighted={isHighlighted}
                    placeholder={t(
                      "data:dashboardTable.commentsRows.writeComment",
                    )}
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
        }),
      );

    return [rowLabelCol, ...dayColumns];
  }, [
    dayDates,
    editingCell,
    highlightedCellId,
    selectCell,
    closeEditor,
    daysOfWeek,
    t,
  ]);

  return columns;
};

export default useTableColumns;
