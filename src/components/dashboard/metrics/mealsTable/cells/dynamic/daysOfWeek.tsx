import { useCallback, useMemo } from "react";
import { getDateForDayIndex, getDayOfMonth } from "../../helper";
import { useTableContext } from "../../tableContext";
import { CellWrapper } from "../../cellWrap";
import { SideSelectOptions } from "./inputs/selectOptions";
import { useFetchPresets } from "@src/services/tanstack/user/preset";
import { useTranslation } from "react-i18next";
import { useDeletePlaning, useInsertPlaningWithMeals } from "@src/services/tanstack/user/planing";

const SideElement = ({
  date,
}: {
  date: Date;
}) => {
  const { t } = useTranslation();
  const presetQuery = useFetchPresets();
  const insertPlaningQuery = useInsertPlaningWithMeals();
  const deletePlaningQuery = useDeletePlaning();
  const clearOption = {
    id: "clear",
    name: t('system:messages.clear'),
  };

  const options = useMemo(() => {
    if (!presetQuery.data) return [];
    const presetOptions = presetQuery.data.map((preset) => [preset.id.toString(), preset.name]);
    return [
      [clearOption.id, clearOption.name],
      ...presetOptions,
    ] as [string, string][];
  }, [presetQuery.data, t]);

  const insertPlaning = useCallback((presetId: string) => {
    if (presetId === clearOption.id) {
      deletePlaningQuery.mutateAsync(date);
      return;
    }

    const preset = presetQuery.data?.find((p) => p.id.toString() === presetId);
    if (!preset) return;

    insertPlaningQuery.mutateAsync({
      date,
      training_hc: preset.training_hc,
      meals: preset.user_preset_meal.map((upm) => ({
        meal_id: upm.meal_id.id,
        type_id: upm.type_id.id,
      })),
    });
  }, [presetQuery.data, insertPlaningQuery, deletePlaningQuery, date]);

  return (
    <SideSelectOptions
      options={options}
      onSelect={insertPlaning}
    />
  );
};

const Cell = ({
  dayOfWeek,
  dayOfMonth,
  isSelected,
}: {
  dayOfWeek: string;
  dayOfMonth: number;
  isSelected: boolean;
}) => {
  return (
    <div
      className={`border p-3 font-semibold text-center transition-colors h-full ${
        isSelected
          ? "border-dark-green bg-dark-green text-white"
          : "border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green"
      }`}
    >
      {`${dayOfWeek} ${dayOfMonth}`}
    </div>
  );
};

export const HeaderDaysOfWeek = () => {
  const { daysOfWeek, startMonday, tableFragmentIndex } = useTableContext();

  const dayOfMonth = useCallback(
    (i: number) => {
      return getDayOfMonth(startMonday, i);
    },
    [startMonday],
  );

  return daysOfWeek.map((day, index) => (
    <CellWrapper 
        key={`header-days-${index}`} 
        posX={index} 
        posY={tableFragmentIndex.weekDaysHeader.start}
        SideElement={<SideElement date={getDateForDayIndex(startMonday, index)} />}
    >
      {({ isSelected }) => (
        <Cell
          dayOfWeek={day}
          dayOfMonth={dayOfMonth(index)}
          isSelected={isSelected}
        />
      )}
    </CellWrapper>
  ));
};
