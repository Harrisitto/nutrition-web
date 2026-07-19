import { useCallback, useMemo } from "react";
import { CellWrapper } from "../cellWrap";
import { generateMealKey, getDateForDayIndex } from "../../helperFunctions";
import { SideSelectOptions } from "./inputs/selectOptions";
import { useTableContext } from "../../tableContext";
import { useTranslation } from "react-i18next";
import { useFetchOrderedMealsForId } from "@src/services/tanstack/data/meals";
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

  const insert = useInsertMeal();
  const deleteMeal = useDeleteMeal();
  const { startMonday, planing } = useTableContext();
  const date = getDateForDayIndex(startMonday, dayIndex);
  const planingKey = generateMealKey(mealId, date);
  const planingData = planing.mealsMap.get(planingKey);
  const mealsQuery = useFetchOrderedMealsForId({
    mealId,
    date: new Date(startMonday),
  });

  const clearOptionId = "clear";
  const mealTypes = mealsQuery.data ?? [];

  const { options, map } = useMemo(() => {
    return {
      options: [
        [clearOptionId, t("system:messages.clear")] as [string, string],
        ...mealTypes.map(
          (opt) => [opt.id.toString(), opt.name] as [string, string],
        ),
      ],
      map: new Map(mealTypes.map((opt) => [opt.id.toString(), opt])),
    };
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
      render={(id: string) => {
        if (id === clearOptionId) return null;
        const mealType = map.get(id);
        if (!mealType) return null;
        return (
          <div className="grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
            <div className="rounded-md border border-dark-green/20 bg-dark-green/10 px-2 py-1 text-center text-dark-green">
              <div className="text-[10px] font-semibold uppercase tracking-wide">
                {t("data:dashboardTable.Kcal")}
              </div>
              <div className="text-xs font-semibold">{mealType.kcal}</div>
            </div>
            <div className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-center text-blue-700">
              <div className="text-[10px] font-semibold uppercase tracking-wide">
                {t("data:macronutrients.shortProtein")}
              </div>
              <div className="text-xs font-semibold">{mealType.prot} g</div>
            </div>
            <div className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-center text-amber-700">
              <div className="text-[10px] font-semibold uppercase tracking-wide">
                {t("data:macronutrients.shortFats")}
              </div>
              <div className="text-xs font-semibold">{mealType.fat} g</div>
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-center text-emerald-700">
              <div className="text-[10px] font-semibold uppercase tracking-wide">
                {t("data:macronutrients.shortCarbs")}
              </div>
              <div className="text-xs font-semibold">{mealType.hc} g</div>
            </div>
          </div>
        );
      }}
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

  const kcalStyle = useMemo(() => {
    if (!planingData) return "";
    const type = planingData.type_id;
    if (type.kcal < 200) {
      return "border-green-500 bg-green-100/30 hover:bg-green-100/50";
    } else if (type.kcal < 500) {
      return "border-yellow-500 bg-yellow-100/30 hover:bg-yellow-100/50";
    } else if (type.kcal < 800) {
      return "border-orange-500 bg-orange-100/30 hover:bg-orange-100/50";
    } else {
      return "border-red-500 bg-red-100/30 hover:bg-red-100/50";
    }
  }, [planingData]);

  if (!planingData) {
    return (
      <div
        className={`border p-3 text-center transition-colors h-full flex items-center justify-center text-fade-dark-green font-bold cursor-pointer ${isSelected ? "border-dark-green bg-light-green" : "border-nutrition-green/30 bg-nutrition-green/20 text-white-green hover:bg-nutrition-green/30"}`}
      />
    );
  }

  return (
    <div
      className={`border p-3 text-center transition-colors h-full flex items-center justify-center text-fade-dark-green font-bold cursor-pointer ${isSelected ? "border-dark-green bg-light-green" : `${kcalStyle}`}`}
    >
      {planingData.type_id.name}
    </div>
  );
};

export const TablePlaning = () => {
  const { meals, daysOfWeek, tableFragmentIndex, startMonday } =
    useTableContext();

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
