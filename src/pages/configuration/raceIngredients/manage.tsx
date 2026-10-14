import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageOff, Trash2 } from "lucide-react";
import { SectionLoading } from "@src/components/global/Animations";
import { deleteButtonStyle } from "@src/components/styles";
import { useNotification } from "@src/store/slices/notification/hook";
import {
  useDeleteRaceIngredient,
  useFetchRaceIngredients,
} from "@src/services/tanstack/data/raceIngredients";
import { amountFields } from "./constants";

// Sin distinguir mayúsculas ni acentos: "cafe" encuentra "Café"
const normalize = (text: string) =>
  text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export const IngredientList = () => {
  const { t } = useTranslation();
  const [searchStr, setSearchStr] = useState("");

  const { data, isLoading, isError } = useFetchRaceIngredients();
  const { mutate: deleteIngredient, isPending, variables } =
    useDeleteRaceIngredient();
  const { addFormSubmitError } = useNotification();

  // El catálogo incluye los de borrado lógico (las carreras los siguen usando)
  const ingredients = data?.filter((ingredient) => !ingredient.is_deleted);

  const onDelete = (ingredient: { id: number; name: string }) => {
    const message = t("data:configuration.sections.raceIngredients.confirmDelete", {
      name: ingredient.name,
    });
    if (!window.confirm(message)) return;
    deleteIngredient(ingredient.id, { onError: () => addFormSubmitError() });
  };

  if (isLoading) {
    return <SectionLoading />;
  }

  if (isError) {
    return (
      <p className="p-4 text-sm text-red-500">
        {t("data:configuration.sections.raceIngredients.loadError")}
      </p>
    );
  }

  if (!ingredients?.length) {
    return (
      <p className="p-4 text-sm text-text-muted">
        {t("data:configuration.sections.raceIngredients.empty")}
      </p>
    );
  }

  const search = normalize(searchStr.trim());
  const filteredIngredients = ingredients.filter((ingredient) =>
    normalize(ingredient.name).includes(search)
  );

  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        value={searchStr}
        onChange={(e) => setSearchStr(e.target.value)}
        placeholder={t("data:configuration.sections.raceIngredients.search")}
        className="w-full rounded-lg border border-nutrition-green/20 bg-white px-3 py-2 text-sm text-dark-green outline-none transition-all placeholder:text-text-muted/80 focus:border-nutrition-green/50 focus:ring-2 focus:ring-light-green/40"
      />
      {!filteredIngredients.length && (
        <p className="p-4 text-sm text-text-muted">
          {t("data:configuration.sections.raceIngredients.noResults")}
        </p>
      )}
      <ul className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
        {filteredIngredients.map((ingredient) => (
          <li
            key={ingredient.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-nutrition-green/20 bg-white px-3 py-2"
          >
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white-green/50">
              {ingredient.image_url ? (
                <img
                  alt={ingredient.name}
                  src={ingredient.image_url}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-text-muted/60">
                  <ImageOff size={18} />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-text-title">
                {ingredient.name}
              </p>
              <ul className="text-xs text-text-muted">
                {amountFields
                  .filter(({ key }) => ingredient[key] !== null)
                  .map(({ key, unit }) => (
                    <li key={key}>
                      {t(`data:configuration.sections.raceIngredients.fields.${key}`)}:{" "}
                      {ingredient[key]} {unit}
                    </li>
                  ))}
              </ul>
            </div>
            <button
              type="button"
              title={t("data:configuration.sections.raceIngredients.delete")}
              aria-label={t("data:configuration.sections.raceIngredients.delete")}
              disabled={isPending && variables === ingredient.id}
              onClick={() => onDelete(ingredient)}
              className={deleteButtonStyle}
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
