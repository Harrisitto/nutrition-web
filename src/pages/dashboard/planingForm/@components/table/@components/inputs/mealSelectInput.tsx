import { useTranslation } from "react-i18next";
import FromDate from "@src/helpers/dates";
import { useFetchOrderedMealsForId } from "@src/services/tanstack/data/meals";
import { useMemo } from "react";
import {
  useInsertMeal,
  useDeleteMeal,
} from "@src/services/tanstack/user/planing";
import SelectEditor from "./selectInput";

const CLEAR_MEAL_ID = -1;

interface MealTypeOption {
  id: number;
  name: string;
  kcal?: number;
  hc?: number;
  prot?: number;
  fat?: number;
  comment?: string | number;
  isClear?: boolean;
}

interface MealTypeEditorProps {
  mealId: number;
  date: FromDate;
  displayValue: string;
  selectedTypeId?: number;
  onClose: () => void;
}

const MealTypeEditor = ({
  mealId,
  date,
  selectedTypeId,
  onClose,
}: MealTypeEditorProps) => {
  const { t } = useTranslation();

  const mealTypes = useFetchOrderedMealsForId({
    mealId,
  });

  const insertMeal = useInsertMeal();
  const deleteMeal = useDeleteMeal();

  const rawOptions = mealTypes.data ?? [];

  // Opción de limpiar al inicio del listado
  const options = useMemo<MealTypeOption[]>(() => {
    const clearOption: MealTypeOption = {
      id: CLEAR_MEAL_ID,
      name: t("system:messages.clear"),
      isClear: true,
    };
    return [clearOption, ...rawOptions];
  }, [rawOptions, t]);

  const initialValue = useMemo(
    () => options.find((opt) => opt.id === selectedTypeId),
    [options, selectedTypeId],
  );

  const handleSave = (selected: MealTypeOption) => {
    if (selected.isClear || selected.id === CLEAR_MEAL_ID) {
      deleteMeal.mutateAsync({ date, mealId }).finally(onClose);
      return;
    }

    insertMeal
      .mutateAsync({
        mealId,
        typeId: selected.id,
        date,
      })
      .finally(onClose);
  };

  return (
    <SelectEditor<MealTypeOption>
      title={t("data:dashboardTable.search")}
      options={options}
      initialValue={initialValue}
      getOptionId={(opt) => opt.id}
      getOptionLabel={(opt) => opt.name}
      onSave={handleSave}
      onClose={onClose}
      searchable
      renderOption={(opt) => {
        if (opt.isClear) {
          return (
            <div className="flex items-center justify-between py-1 text-rose-600 font-semibold">
              <span>{opt.name}</span>
            </div>
          );
        }

        const hasMacros =
          opt.hc !== undefined ||
          opt.prot !== undefined ||
          opt.fat !== undefined;

        return (
          <div className="flex w-full flex-col gap-1 py-1 text-left">
            {/* Fila superior: Nombre de la receta y Kcal */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-dark-green">
                {opt.name}
              </span>
              {opt.kcal !== undefined && (
                <span className="shrink-0 rounded-full bg-dark-green/10 px-2 py-0.5 text-[11px] font-bold text-dark-green">
                  {opt.kcal} {t("data:macronutrients.kcal")}
                </span>
              )}
            </div>

            {/* Fila secundaria: Comentarios opcionales */}
            {!!opt.comment && (
              <p className="text-xs italic text-gray-500">{opt.comment}</p>
            )}

            {/* Fila inferior: Macronutrientes formateados con i18n */}
            {hasMacros && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
                {opt.hc !== undefined && (
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-medium text-amber-700">
                    <span className="uppercase">
                      {t("data:macronutrients.shortCarbs")}
                    </span>
                    : <strong className="font-bold">{opt.hc}g</strong>
                  </span>
                )}
                {opt.prot !== undefined && (
                  <span className="rounded bg-rose-500/10 px-1.5 py-0.5 font-medium text-rose-700">
                    <span className="uppercase">
                      {t("data:macronutrients.shortProtein")}
                    </span>
                    : <strong className="font-bold">{opt.prot}g</strong>
                  </span>
                )}
                {opt.fat !== undefined && (
                  <span className="rounded bg-yellow-500/10 px-1.5 py-0.5 font-medium text-yellow-800">
                    <span className="uppercase">
                      {t("data:macronutrients.shortFats")}
                    </span>
                    : <strong className="font-bold">{opt.fat}g</strong>
                  </span>
                )}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default MealTypeEditor;
