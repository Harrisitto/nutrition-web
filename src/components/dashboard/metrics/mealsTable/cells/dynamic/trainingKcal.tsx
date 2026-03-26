import { useMemo } from "react";
import { CellWrapper } from "../../cellWrap";
import { generatePlaningKey, getDateForDayIndex } from "../../helper";
import { useTableContext } from "../../tableContext";
import { CellNumericInput } from "./inputs/numericCell";
import { useInsertPlaning } from "@src/services/tanstack/user/planing";

const Cell = ({ isSelected, date }: { isSelected: boolean; date: Date }) => {
  const { planing } = useTableContext();
  const insertPlaningQuery = useInsertPlaning();

  const planingDay = useMemo(() => {
    const key = generatePlaningKey(date);
    return planing.planningMap.get(key);
  }, [planing.planningMap, date]);

  return (
    <CellNumericInput
        isSelected={isSelected}
        numValue={planingDay?.training_kcal ?? 0}
        onSave={(value) => {
            const normalizedValue = Number.isFinite(value) && value > 0 ? value : 0;
            insertPlaningQuery.mutateAsync({
                date,
                training_kcal: normalizedValue,
            });
        }}   
    />
  )
};

export const TableTrainingKcal = () => {
  const { daysOfWeek, tableFragmentIndex, startMonday } = useTableContext();

  return daysOfWeek.map((_, dayIndex) => {
    const date = getDateForDayIndex(startMonday, dayIndex);
    return (
      <CellWrapper
        key={`training-kcal-${dayIndex}`}
        posX={dayIndex}
        posY={tableFragmentIndex.trainingKcalRows.start}
        SideElement={null}
      >
        {({ isSelected }) => <Cell date={date} isSelected={isSelected} />}
      </CellWrapper>
    );
  });
};
