import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { useFetchTopRecipesForUser } from "@src/services/tanstack/data/recipes";
import type { DraftMealIngredient } from "@src/services/tanstack/data/ingredients";
import SelectEditor from "./default/selectInput";
import IngredientsEditor from "./ingredientsSelectInput";
import { addIngredientsButtonStyle } from "../../styles";

const NO_RECIPE_ID = -1;

interface RecipeOption {
  id: number;
  name: string;
  url: string | null;
  isClear?: boolean;
}

interface RecipeSelectEditorProps {
  typeId: number;
  /** Ingredientes con los que empieza el editor para esa receta (null = sin receta fija) */
  initialIngredientsFor?: (recipeId: number | null) => DraftMealIngredient[];
  /** null = sin receta fija. Guarda y cierra el editor */
  onSave: (recipeId: number | null) => void;
  /**
   * "Hecho" en los ingredientes: guarda tipo, receta e ingredientes y cierra.
   * recipeId null = sin receta fija (la elige el cliente; no se bloquea)
   */
  onSaveWithIngredients: (
    recipeId: number | null,
    ingredients: DraftMealIngredient[],
  ) => Promise<unknown>;
  onClose: () => void;
}

const RecipeSelectEditor = ({
  typeId,
  initialIngredientsFor,
  onSave,
  onSaveWithIngredients,
  onClose,
}: RecipeSelectEditorProps) => {
  const { t } = useTranslation();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useFetchTopRecipesForUser({ typeId });
  // Opción (receta o "Sin receta fija") cuyos ingredientes se están editando
  const [ingredientsFor, setIngredientsFor] = useState<RecipeOption | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const options = useMemo<RecipeOption[]>(() => {
    const noRecipe: RecipeOption = {
      id: NO_RECIPE_ID,
      name: t("data:dashboardTable.noFixedRecipe"),
      url: null,
      isClear: true,
    };
    const recipes = data?.pages.flat() ?? [];
    return [noRecipe, ...recipes];
  }, [data, t]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const saveAll = (ingredients: DraftMealIngredient[]) => {
    if (!ingredientsFor) return;
    setIsSaving(true);
    onSaveWithIngredients(
      ingredientsFor.isClear ? null : ingredientsFor.id,
      ingredients,
    ).finally(() => setIsSaving(false));
  };

  if (ingredientsFor) {
    return (
      <IngredientsEditor
        mealLabel={ingredientsFor.name}
        initialIngredients={initialIngredientsFor?.(
          ingredientsFor.isClear ? null : ingredientsFor.id,
        )}
        isSaving={isSaving}
        onDone={saveAll}
        // Sin guardar: vuelve a la lista de recetas
        onClose={() => setIngredientsFor(null)}
      />
    );
  }

  return (
    <SelectEditor<RecipeOption>
      title={t("data:dashboardTable.selectRecipe")}
      options={options}
      getOptionId={(opt) => opt.id}
      getOptionLabel={(opt) => opt.name}
      onSave={(opt) => onSave(opt.isClear ? null : opt.id)}
      onClose={onClose}
      onScrollEnd={loadMore}
      searchable
      listFooter={
        isFetching && (
          <p className="text-center text-xs text-gray-500">
            {t("system:messages.loading")}
          </p>
        )
      }
      renderOption={(opt) => {
        if (opt.isClear) {
          return (
            <div className="flex items-center gap-3 py-1">
              <span className="flex-1 font-semibold text-rose-600">{opt.name}</span>
              <button
                type="button"
                onClick={(e) => {
                // Sin esto el click tambien selecciona la receta y cierra
                e.stopPropagation();
                setIngredientsFor(opt);
              }}
              className={addIngredientsButtonStyle}
            >
      {t("data:dashboardTable.ingredients.addToMeal")}
    </button>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-3 py-1">
            {opt.url ? (
              <img
                src={opt.url}
                alt={opt.name}
                loading="lazy"
                className="size-10 shrink-0 rounded-md object-cover"
              />
            ) : (
              <div className="size-10 shrink-0 rounded-md bg-nutrition-green/10" />
            )}
            <span className="flex-1 text-sm text-dark-green">{opt.name}</span>
            <button
              type="button"
              onClick={(e) => {
                // Sin esto el click tambien selecciona la receta y cierra
                e.stopPropagation();
                setIngredientsFor(opt);
              }}
              className={addIngredientsButtonStyle}
            >
              {t("data:dashboardTable.ingredients.addToMeal")}
            </button>
          </div>
        );
      }}
    />
  );
};

export default RecipeSelectEditor;
