import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Check, Info, Loader2 } from "lucide-react";
import InputSelectRecipeType from "@src/components/shared/recipeTypes/input";
import { cardStyle, primaryButtonStyle } from "@src/components/styles";
import { useNotification } from "@src/store/slices/notification/hook";
import {
  useSelectCustomRecipeId,
  useUpsertCustomRecipe,
  type CustomRecipe,
} from "@src/services/tanstack/user/customRecipes";
import { useFetchCustomIngredients } from "@src/services/tanstack/data/ingredients";
import { useFetchRecipeType } from "@src/services/tanstack/data/recipeTypes";
import { Macros } from "@src/helpers/macros";
import RecipeIngredientsEditor from "./@components/ingredients";
import { RecipeTypeFitChart } from "./@components/typeFitChart";
import { draftMacros, parseAmount, type DraftRecipeIngredient } from "./helpers";
import { fitAmountsToMacros } from "./fitAmounts";
import { fieldIds, useCustomRecipeForm } from "./form";
import { doIngredientsMatchRecipeType } from "./@api/matchType";

const toDraft = (recipe: CustomRecipe | null | undefined): DraftRecipeIngredient[] =>
  (recipe?.ingredients ?? []).flatMap((row) =>
    row.ingredient ? [{ ingredientId: row.ingredient.id, amount: String(row.amount) }] : [],
  );

type TypeStatus = "custom" | "incomplete" | "checking" | "match" | "noMatch";

// Explica con qué tipo se guardará la receta según el tipo elegido y sus alimentos
const TypeStatusHint = ({ status }: { status: TypeStatus }) => {
  const { t } = useTranslation();
  const text = t(`data:customRecipes.form.type.status.${status}`);

  switch (status) {
    case "match":
      return (
        <p className="flex items-center gap-1.5 text-sm text-nutrition-green">
          <Check size={16} className="shrink-0" /> {text}
        </p>
      );
    case "noMatch":
      return (
        <p className="flex items-center gap-1.5 text-sm text-amber-700">
          <AlertTriangle size={16} className="shrink-0" /> {text}
        </p>
      );
    case "checking":
      return (
        <p className="flex items-center gap-1.5 text-sm text-text-muted">
          <Loader2 size={16} className="shrink-0 animate-spin" /> {text}
        </p>
      );
    default:
      return (
        <p className="flex items-center gap-1.5 text-sm text-text-muted">
          <Info size={16} className="shrink-0" /> {text}
        </p>
      );
  }
};

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
  // Id del tipo "receta propia" en la base de datos: ese tipo no se valida contra sus ingredientes
  const { data: customRecipeTypeId } = useSelectCustomRecipeId();
  const [ingredients, setIngredients] = useState<DraftRecipeIngredient[]>(() => toDraft(recipe));
  const [selectedRecipeTypeId, setSelectedRecipeTypeId] = useState<number | null>(
    () => recipe?.type_id ?? null,
  );
  const [isResolvingType, setIsResolvingType] = useState(false);
  const [adjustFailed, setAdjustFailed] = useState(false);
  const upsert = useUpsertCustomRecipe({ toClient });
  const catalog = useFetchCustomIngredients();
  const { data: selectedType } = useFetchRecipeType(selectedRecipeTypeId);

  const isEditing = !!recipe;
  const hasInvalidAmount = ingredients.some((row) => parseAmount(row.amount) === null);
  const isSaving = upsert.isPending || isResolvingType;

  const catalogById = useMemo(
    () => new Map((catalog.data ?? []).map((el) => [el.id, el])),
    [catalog.data],
  );
  const recipeTotals = useMemo(
    () => draftMacros(ingredients, catalogById),
    [ingredients, catalogById],
  );

  // Solo los tipos del catálogo se comprueban: sin tipo o "receta propia" no tienen macros que cumplir
  const needsCheck =
    selectedRecipeTypeId !== null &&
    customRecipeTypeId !== undefined &&
    selectedRecipeTypeId !== customRecipeTypeId;
  const typeTarget = needsCheck && selectedType ? Macros.from(selectedType) : null;

  const typeStatus: TypeStatus = !needsCheck
    ? "custom"
    : ingredients.length === 0 || hasInvalidAmount
      ? "incomplete"
      : !typeTarget || !catalog.data
        ? "checking"
        : recipeTotals.fits(typeTarget)
          ? "match"
          : "noMatch";

  // Cambiar alimentos a mano invalida el aviso del último ajuste automático
  const changeIngredients = (next: DraftRecipeIngredient[]) => {
    setIngredients(next);
    setAdjustFailed(false);
  };

  /** Ajusta las cantidades para que la receta encaje en el tipo elegido (fitAmounts.ts) */
  const autoAdjust = () => {
    if (!typeTarget) return;
    const rows = ingredients.flatMap((row) => {
      const ingredient = catalogById.get(row.ingredientId);
      return ingredient ? [{ id: row.ingredientId, ingredient, amount: parseAmount(row.amount) }] : [];
    });
    const result = fitAmountsToMacros(rows, typeTarget);
    const adjusted = new Map(rows.map((row, i) => [row.id, result.amounts[i]]));
    setIngredients(
      ingredients.map((row) => {
        const amount = adjusted.get(row.ingredientId);
        return amount === undefined ? row : { ...row, amount: String(amount) };
      }),
    );
    setAdjustFailed(!result.fits);
  };

  /**
   * Tipo con el que se guarda: el elegido si los alimentos encajan; si no (o no hay tipo), el de
   * receta propia. Así upsert_custom_recipe nunca falla con 23514 por macros que no encajan.
   * La UI calcula el encaje en local (Macros.fits), pero aquí decide la base de datos, con la misma
   * regla y su catálogo
   */
  const resolveTypeId = async (): Promise<number | null> => {
    const fallback = customRecipeTypeId ?? null;
    if (!needsCheck) return selectedRecipeTypeId ?? fallback;
    try {
      const match = await doIngredientsMatchRecipeType(
        ingredients.map((row) => ({ id: row.ingredientId, amount: parseAmount(row.amount)! })),
        selectedRecipeTypeId,
      );
      return match ? selectedRecipeTypeId : fallback;
    } catch (error) {
      console.error("Error checking if ingredients match recipe type:", error);
      return fallback;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSaving) return;
    // Validar todo antes de cortar: validateForm marca los errores de cada campo
    const isFormValid = form.validateForm();
    if (!isFormValid || hasInvalidAmount || ingredients.length === 0) {
      addInvalidForm();
      return;
    }

    const state = form.getState();
    setIsResolvingType(true);
    const typeId = await resolveTypeId();
    setIsResolvingType(false);

    upsert.mutate(
      {
        id: recipe?.id,
        name: state[fieldIds.name] as string,
        description: (state[fieldIds.description] as string) || null,
        typeId,
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
            setSelectedRecipeTypeId(null);
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

      {/* Tipo arriba del todo: guía qué alimentos y cantidades poner */}
      <div className="flex flex-col gap-2">
        <InputSelectRecipeType
          label={t("data:customRecipes.form.type.label")}
          recipeTypeId={selectedRecipeTypeId}
          onChange={(typeId) => {
            setSelectedRecipeTypeId(typeId);
            setAdjustFailed(false);
          }}
        />
        {typeTarget && ingredients.length > 0 && (
          <RecipeTypeFitChart
            recipe={recipeTotals}
            target={typeTarget}
            typeName={selectedType?.name ?? null}
            onAutoAdjust={catalog.data ? autoAdjust : undefined}
            adjustFailed={adjustFailed}
          />
        )}
        <TypeStatusHint status={typeStatus} />
      </div>

      <RecipeIngredientsEditor value={ingredients} onChange={changeIngredients} />

      <div>{Fields}</div>

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
          disabled={isSaving || hasInvalidAmount || ingredients.length === 0}
          className={primaryButtonStyle}
        >
          {isSaving
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
