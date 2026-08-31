import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import SelectEditor from "./selectInput";
import { useFetchPresets } from "@src/services/tanstack/user/preset";

const CLEAR_PRESET_OPTION = "__clear_preset__";

type PresetOption =
  | {
      id: string;
      name: string;
      comment?: string;
    }
  | NonNullable<ReturnType<typeof useFetchPresets>["data"]>[number];

export interface PresetDayEditorProps {
  onClose: () => void;
}

const PresetDayEditor = ({ onClose }: PresetDayEditorProps) => {
  const { t } = useTranslation();
  const presetQuery = useFetchPresets();

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
    /*
      SAVE PRESET ON PLANING
    */
    console.warn(
      "NO HAY LOGICA DE IMPLANTACIÓN DE PLANIFICACIONES AÚN. ESPERANDO MIGRACIÓN DE BBDD",
      selected,
    );
    onClose();
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
