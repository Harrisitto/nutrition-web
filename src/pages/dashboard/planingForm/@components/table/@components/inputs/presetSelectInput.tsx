import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import SelectEditor from "./selectInput";
import { useFetchPresets } from "@src/services/tanstack/user/preset";
import { useDeletePlaningMeal, useMutatePlaningMeals } from "../../../../../../../services/tanstack/user/meals";
import { useDeletePlaning, useInsertPlaning } from "../../../../../../../services/tanstack/user/planing";
import type FromDate from "../../../../../../../helpers/dates";

const CLEAR_PRESET_OPTION = "__clear_preset__";

type PresetOption =
  | {
      id: string;
      name: string;
      comment?: string;
    }
  | NonNullable<ReturnType<typeof useFetchPresets>["data"]>[number];

export interface PresetDayEditorProps {
  date: FromDate;
  onClose: () => void;
}

const PresetDayEditor = ({ onClose, date }: PresetDayEditorProps) => {
  const { t } = useTranslation();
  const presetQuery = useFetchPresets();
  
  const deleteMeals = useDeletePlaningMeal({
    forDate: date,
  });
  const deletePlaning = useDeletePlaning({
    forDate: date,
  });
  const upsertMeals = useMutatePlaningMeals({
    forDate: date,
  });
  const upsertPlaning = useInsertPlaning();

  // Memoización para mantener la estabilidad de referencia de initialValue/clearOption
  const clearOption = useMemo(
    () => ({
      id: CLEAR_PRESET_OPTION,
      name: t("system:messages.clear"),
    }),
    [t],
  );

  // Construcción del listado asegurando que clearOption siempre esté presente
  const options = useMemo<PresetOption[]>(() => {
    const presets = presetQuery.data ?? [];
    return [clearOption, ...presets];
  }, [presetQuery.data, clearOption]);

  const handleSave = (selected: PresetOption) => {
    if (selected.id === CLEAR_PRESET_OPTION) {
      Promise.all([
        deleteMeals.mutateAsync(undefined),
        deletePlaning.mutateAsync(),
      ]).finally(onClose);
      return;
    }

    const selectedPreset = presetQuery.data?.find((preset) => preset.id === selected.id);
    if(!selectedPreset) {
      console.error("Selected preset not found in the fetched presets.");
      onClose();
      return;
    }

    Promise.all([
      upsertMeals.mutateAsync(selectedPreset.user_preset_meal.map((meal) => ({
        meal_id: meal.meal_id.id,
        type_id: meal.type_id.id,
      }))),
      upsertPlaning.mutateAsync({
        date,
        comment: selectedPreset.comment,
        training_hc: selectedPreset.training_hc,
      }),
    ]).finally(onClose);
  };

  return (
    <SelectEditor<PresetOption>
      title={t("data:dashboardTable.search")}
      options={options}
      initialValue={clearOption}
      getOptionId={(opt) => opt.id}
      getOptionLabel={(opt) => opt.name}
      onSave={handleSave}
      onClose={onClose}
      searchable
      renderOption={(opt) => {
        // Acceso seguro a la propiedad opcional comment
        const description = "comment" in opt ? opt.comment : undefined;
        return (
          <div className="flex flex-col items-center justify-between w-full">
            <p className="text-sm font-semibold text-dark-green w-full align-left">
              {opt.name}
            </p>
            {!!description && (
              <p className="text-sm text-dark-green">{description}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default PresetDayEditor;
