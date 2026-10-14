import { useTranslation } from "react-i18next";
import { hcToKcal, raceHc } from "@src/helpers/nutrition";
import { useRaceIngredientCatalog } from "@src/services/tanstack/data/raceIngredients";
import type { RaceIngredientDraft } from "@src/services/tanstack/user/races";
import { useRaceDraft } from "../../context/raceDraftContext";
import { StepSection } from "../../components/stepSection";
import { KmItemList } from "../../components/kmItemList";
import { useItemError } from "../../hooks";
import { AddIntakeForm } from "./addIntakeForm";

export const StepIngredients = () => {
  const { t } = useTranslation();
  const { draft, updateDraft } = useRaceDraft();
  // Con los ingredientes borrados del catálogo: siguen contando en la carrera
  const { byId, available } = useRaceIngredientCatalog();
  const errorOf = useItemError("ingredients");

  const hcAmountOf = (intake: RaceIngredientDraft) =>
    byId.get(intake.ingredient_id)?.hc_amount;
  const totalHc = raceHc(draft.ingredients, hcAmountOf);

  const onRemove = (index: number) =>
    updateDraft((prev) => ({
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));

  return (
    <StepSection
      step="ingredients"
      aside={
        <div className="rounded-lg bg-white px-3 py-2 text-right">
          <p className="text-xs text-text-muted">{t("data:races.ingredients.total")}</p>
          <p className="text-sm font-semibold text-dark-green">
            {Math.round(totalHc)} g HC · {Math.round(hcToKcal(totalHc))} kcal
          </p>
        </div>
      }
    >
      <AddIntakeForm options={available} />
      <KmItemList
        items={draft.ingredients}
        emptyText={t("data:races.ingredients.empty")}
        removeLabel={t("data:races.ingredients.remove")}
        onRemove={onRemove}
        errorOf={errorOf}
        renderItem={(intake) => {
          const ingredient = byId.get(intake.ingredient_id);
          return (
            <>
              <span className="min-w-0 flex-1 truncate text-text-title">
                {intake.amount}× {ingredient?.name ?? `#${intake.ingredient_id}`}
                {ingredient?.is_deleted && (
                  <span className="ml-2 text-xs text-text-muted">
                    {t("data:races.ingredients.deleted")}
                  </span>
                )}
              </span>
              {intake.km_span !== null && (
                <span className="text-xs text-text-muted">
                  {t("data:races.ingredients.during", { km: intake.km_span })}
                </span>
              )}
              <span className="w-16 text-right text-xs font-semibold text-dark-green">
                {Math.round(raceHc([intake], hcAmountOf))} g HC
              </span>
            </>
          );
        }}
      />
    </StepSection>
  );
};
