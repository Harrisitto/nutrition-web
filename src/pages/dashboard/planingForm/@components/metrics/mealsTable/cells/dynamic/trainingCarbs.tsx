import { CellWrapper } from "../cellWrap";
import { useTableContext } from "../../tableContext";
import { generatePlaningKey, getDateForDayIndex } from "../../helperFunctions";
import { useCallback, useMemo } from "react";
import { useInsertPlaning } from "@src/services/tanstack/user/planing";
import { CellNumericInput } from "./inputs/numericCell";

const Cell = ({
  date,
  trainingHourIndex,
  isSelected,
}: {
  date: Date;
  trainingHourIndex: number;
  isSelected: boolean;
}) => {
  const { planing } = useTableContext();
  const insertPlaning = useInsertPlaning();

  const current = useMemo(() => {
    const planingKey = generatePlaningKey(date);
    return planing.planningMap.get(planingKey);
  }, [planing.planningMap, date]);

  const saveHC = useCallback((value: number) => {
    const currentHours = [...(current?.training_hc ?? [])];
    const normalizedValue = Number.isFinite(value) && value > 0 ? value : 0;
    const nextHours = [...currentHours];
    nextHours[trainingHourIndex] = normalizedValue;
    insertPlaning.mutateAsync({
      date,
      training_hc: nextHours,
    });
  }, [current, insertPlaning, date, trainingHourIndex]);

  return (
    <CellNumericInput
      isSelected={isSelected}
      numValue={current?.training_hc?.[trainingHourIndex] ?? 0}
      onSave={saveHC}
    />
  );
};

export const TableTrainingCarbs = () => {
  const { daysOfWeek, planing, tableFragmentIndex, startMonday } =
    useTableContext();

  return daysOfWeek.map((_, dayIndex) => {
    return Array.from({ length: planing.maxTrainingHours }, (_, i) => {
      const date = getDateForDayIndex(startMonday, dayIndex);
      return (
        <CellWrapper
          key={`training-carbs-${dayIndex}-${i}`}
          posX={dayIndex}
          posY={tableFragmentIndex.trainingRows.start + i}
          style={{
            gridColumn: dayIndex + 2,
            gridRow: tableFragmentIndex.trainingRows.start + i + 2,
          }}
          SideElement={null}
        >
          {({ isSelected }) => (
            <Cell date={date} trainingHourIndex={i} isSelected={isSelected} />
          )}
        </CellWrapper>
      );
    });
  });
};
