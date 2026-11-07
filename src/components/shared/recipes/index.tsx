import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cardStyle, primaryButtonStyle } from "@src/components/styles";
import { useNotification } from "@src/store/slices/notification/hook";
import {
  useUpsertCustomRecipe,
  type CustomRecipe,
} from "@src/services/tanstack/user/customRecipes";
import RecipeIngredientsEditor from "./@components/ingredients";
import { parseAmount, type DraftRecipeIngredient } from "./helpers";
import { fieldIds, useCustomRecipeForm } from "./form";

const toDraft = (recipe: CustomRecipe | null | undefined): DraftRecipeIngredient[] =>
  (recipe?.ingredients ?? []).flatMap((row) =>
    row.ingredient ? [{ ingredientId: row.ingredient.id, amount: String(row.amount) }] : [],
  );

interface CustomRecipeFormProps {
  /** Receta a editar; sin ella se crea una nueva */
  recipe?: CustomRecipe | null;
  /** La receta es del cliente seleccionado (dashboard); si no, del nutricionista */
  toClient?: boolean;
  /** Tras guardar, con el id de la receta */
  onSaved?: (id: number) => void;
  onCancel?: () => void;
}

/**
 * Crea o edita una receta propia (custom_recipes + custom_recipe_ingredients) en una sola
 * llamada a upsert_custom_recipe. Se usa en configuración (recetas del nutricionista) y en el
 * dashboard (recetas del cliente). Para cambiar de receta, monta el componente con otra `key`.
 */
const CustomRecipeForm = ({ recipe, toClient = false, onSaved, onCancel }: CustomRecipeFormProps) => {
  const { t } = useTranslation();
  const { addFormSubmitSucess, addInvalidForm, addMutationError } = useNotification();
  const { form, Fields } = useCustomRecipeForm(recipe);
  const [ingredients, setIngredients] = useState<DraftRecipeIngredient[]>(() => toDraft(recipe));
  const upsert = useUpsertCustomRecipe({ toClient });

  const isEditing = !!recipe;
  const hasInvalidAmount = ingredients.some((row) => parseAmount(row.amount) === null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (upsert.isPending) return;
    // Validar todo antes de cortar: validateForm marca los errores de cada campo
    const isFormValid = form.validateForm();
    if (!isFormValid || hasInvalidAmount || ingredients.length === 0) {
      addInvalidForm();
      return;
    }

    const state = form.getState();
    upsert.mutate(
      {
        id: recipe?.id,
        name: state[fieldIds.name] as string,
        description: (state[fieldIds.description] as string) || null,
        ingredients: ingredients.map((row) => ({
          ingredient_id: row.ingredientId,
          amount: parseAmount(row.amount)!,
        })),
      },
      {
        onSuccess: (id) => {
          addFormSubmitSucess();
          if (!isEditing) {
            form.reset();
            setIngredients([]);
          }
          onSaved?.(id);
        },
        onError: addMutationError,
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className={`${cardStyle} space-y-4 p-4`}>
      <h3 className="text-lg font-semibold text-text-title">
        {isEditing ? t("data:customRecipes.form.editTitle") : t("data:customRecipes.form.newTitle")}
      </h3>

      <div>{Fields}</div>

      <RecipeIngredientsEditor value={ingredients} onChange={setIngredients} />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-nutrition-green/30 px-4 py-2 text-sm font-semibold text-dark-green"
          >
            {t("data:customRecipes.form.cancel")}
          </button>
        )}
        <button
          type="submit"
          disabled={upsert.isPending || hasInvalidAmount || ingredients.length === 0}
          className={primaryButtonStyle}
        >
          {upsert.isPending
            ? t("system:messages.loading")
            : isEditing
              ? t("data:customRecipes.form.save")
              : t("data:customRecipes.form.create")}
        </button>
      </div>
    </form>
  );
};

export default CustomRecipeForm;
