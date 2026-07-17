import { useCallback, useMemo } from "react";
import { getDateForDayIndex, getDayOfMonth } from "../../helperFunctions";
import { useTableContext } from "../../tableContext";
import { CellWrapper } from "../cellWrap";
import { SideSelectOptions } from "./inputs/selectOptions";
import { useFetchPresets } from "@src/services/tanstack/user/preset";
import { useTranslation } from "react-i18next";
import { useDeletePlaning, useInsertPlaningWithMeals } from "@src/services/tanstack/user/planing";
import { saveDate } from "@src/helpers/dates";
import { cellStyles } from "../defaultStyles";

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

  type PresetMeta = {
    comment: string;
    name: string;
    energy: number;
  };

  const { options, map } = useMemo(() => {
    if (!presetQuery.data) return {
      options: [[clearOption.id, clearOption.name]] as [string, string][],
      map: new Map<string, PresetMeta>(),
    };
    const presetOptions: [string, string][] = presetQuery.data.map(
      (preset): [string, string] => [preset.id.toString(), preset.name],
    );
    const mapOptions: [string, PresetMeta][] = presetQuery.data.map(
      (preset): [string, PresetMeta] => [
        preset.id.toString(),
        {
          comment: preset.comment,
          name: preset.name,
          energy: preset.user_preset_meal.reduce(
            (acc, meal) => acc + meal.type_id.kcal,
            0,
          ),
        },
      ],
    );
    const opt = [
      [clearOption.id, clearOption.name],
      ...presetOptions,
    ] as [string, string][];
    return {
      options: opt,
      map: new Map<string, PresetMeta>(mapOptions),
    };
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
      training_hc: preset.training_hc || undefined,
      comment: preset.comment || undefined,
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
      render={(id: string) => {
        if (id === clearOption.id) return null;
        const preset = map.get(id);
        if (!preset) return null;
        return (
          <div className="mt-2 space-y-1.5">
            <div className="inline-flex items-center rounded-full border border-dark-green/20 bg-dark-green/10 px-2 py-0.5 text-xs font-medium text-dark-green">
              {preset.energy} {t("data:dashboardTable.Kcal")}
            </div>
            {!!preset.comment && (
              <div className="text-xs leading-relaxed text-gray-600">
                {preset.comment}
              </div>
            )}
          </div>
        );
      }}
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

  return daysOfWeek.map((day, index) => {
    const date = getDateForDayIndex(startMonday, index);
    return (
      <CellWrapper
        key={`header-days-${index}`}
        className={cellStyles.sticky.top}
        posX={index}
        posY={tableFragmentIndex.weekDaysHeader.start}
        SideElement={<SideElement date={date} />}
        sideElementKey={saveDate(date)}
      >
        {({ isSelected }) => (
          <Cell
            dayOfWeek={day}
            dayOfMonth={dayOfMonth(index)}
            isSelected={isSelected}
          />
        )}
      </CellWrapper>
    );
  });
};
