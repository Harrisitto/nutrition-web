import { useCallback, useMemo } from "react";
import { CellWrapper } from "../cellWrap";
import { generateMealKey, getDateForDayIndex } from "../../helperFunctions";
import { SideSelectOptions } from "./inputs/selectOptions";
import { useTableContext } from "../../tableContext";
import { useTranslation } from "react-i18next";
import { useFetchTypesForMeal } from "@src/services/tanstack/data/meals";
import {
  useDeleteMeal,
  useInsertMeal,
} from "@src/services/tanstack/user/planing";
import { saveDate } from "@src/helpers/dates";

const SideElement = ({
  mealId,
  dayIndex,
}: {
  mealId: number;
  dayIndex: number;
}) => {
  const { t } = useTranslation();
  const mealsQuery = useFetchTypesForMeal(mealId);
  const insert = useInsertMeal();
  const deleteMeal = useDeleteMeal();
  const { startMonday, planing } = useTableContext();
  const date = getDateForDayIndex(startMonday, dayIndex);
  const planingKey = generateMealKey(mealId, date);
  const planingData = planing.mealsMap.get(planingKey);

  const mealTypes = mealsQuery.data || [];
  const clearOptionId = "clear";

  const options = useMemo(() => {
    return [
      [clearOptionId, t("system:messages.clear")] as [string, string],
      ...mealTypes.map(
        (opt) =>
          [opt.type_id.id.toString(), opt.type_id.name] as [string, string],
      ),
    ];
  }, [mealTypes, t]);

  const handleDBMeal = useCallback(
    (id: string) => {
      const date = getDateForDayIndex(startMonday, dayIndex);

      if (id === clearOptionId) {
        if (!planingData) {
          console.warn("No meal to delete for this cell");
          return;
        }
        deleteMeal.mutateAsync({
          mealId,
          planingId: planingData.planing_id,
        });
        return;
      }

      const selectedTypeId = Number(id);
      if (Number.isNaN(selectedTypeId)) return;
      insert.mutateAsync({
        mealId,
        typeId: selectedTypeId,
        date,
        planingId: planingData?.planing_id,
      });
    },
    [insert, mealId, startMonday, dayIndex, planingData, deleteMeal],
  );

  return (
    <SideSelectOptions
      initialId={planingData?.type_id?.id?.toString()}
      options={options}
      onSelect={handleDBMeal}
    />
  );
};

const PlaningCell = ({
  mealId,
  dayIndex,
  isSelected,
}: {
  mealId: number;
  dayIndex: number;
  isSelected: boolean;
}) => {
  const { planing, startMonday } = useTableContext();
  const date = getDateForDayIndex(startMonday, dayIndex);
  const planingKey = generateMealKey(mealId, date);
  const planingData = planing.mealsMap.get(planingKey);

  if (!planingData) {
    return (
      <div
        className={`border p-3 text-center transition-colors h-full flex items-center justify-center ${isSelected ? "border-dark-green bg-light-green text-white" : "border-nutrition-green/30 bg-nutrition-green/20 text-white-green hover:bg-nutrition-green/30"}`}
      />
    );
  }

  return (
    <div
      className={`border p-3 text-center transition-colors h-full flex items-center justify-center ${isSelected ? "border-dark-green bg-light-green text-white" : "border-nutrition-green/30 bg-nutrition-green/20 text-white-green hover:bg-nutrition-green/30"}`}
    >
      {planingData.type_id.name}
    </div>
  );
};

export const TablePlaning = () => {
  const { meals, daysOfWeek, tableFragmentIndex, startMonday } = useTableContext();

  return meals.map((meal, mealIndex) => {
    return daysOfWeek.map((day, dayIndex) => {
      const posX = dayIndex;
      const posY = tableFragmentIndex.mealRows.start + mealIndex;
      const gridX = posX + 2; // +1 for row name, +1 for 0-based index
      const gridY = posY + 1; // +1 for header row

      return (
        <CellWrapper
          key={`meal-${meal.id}-${day}`}
          posX={posX}
          posY={posY}
          SideElement={<SideElement mealId={meal.id} dayIndex={dayIndex} />}
          sideElementKey={`${meal.id}-${dayIndex}-${saveDate(getDateForDayIndex(startMonday, dayIndex))}`}
          style={{
            gridColumn: gridX,
            gridRow: gridY,
          }}
        >
          {({ isSelected }) => (
            <PlaningCell
              mealId={meal.id}
              dayIndex={dayIndex}
              isSelected={isSelected}
            />
          )}
        </CellWrapper>
      );
    });
  });
};
