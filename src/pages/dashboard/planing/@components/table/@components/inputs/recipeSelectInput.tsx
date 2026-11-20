import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { useFetchTopRecipesForUser } from "@src/services/tanstack/data/recipes";
import type { DraftMealIngredient } from "@src/services/tanstack/data/ingredients";
import { useFetchCustomRecipesForType } from "@src/services/tanstack/user/customRecipes";
import InputComponent from "@src/components/input";
import { useAppSelector } from "@src/store/store";
import SelectEditor from "./default/selectInput";
import IngredientsEditor from "./ingredientsSelectInput";
import { addIngredientsButtonStyle } from "../../styles";

const NO_RECIPE_ID = -1;

interface RecipeOption {
  id: number;
  name: string;
  url: string | null;
  isClear?: boolean;
  /** Receta propia (user_recipes) del cliente o del nutricionista */
  isCustom?: boolean;
  /** Dueño de la receta propia (cliente o nutricionista) */
  ownerId?: string;
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
  const userId = useAppSelector((state) => state.config.selectedUserId);
  // Se abre con lo elegido en la configuración de la tabla; el toggle solo cambia este selector
  const defaultShowCustom = useAppSelector(
    (state) => state.config.defaults.displayDefaultNutritionistRecipes,
  );
  const [showCustom, setShowCustom] = useState(defaultShowCustom);

  // Solo se pide la lista visible: catálogo (con las propias que llegan al tipo) o recetas propias.
  // Las dos listas traen solo recetas que llegan a las macros del tipo: se fijan como cualquier receta
  const topRecipes = useFetchTopRecipesForUser({ typeId, enabled: !showCustom });
  const customRecipesForType = useFetchCustomRecipesForType({ typeId, enabled: showCustom });
  const { fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = showCustom
    ? customRecipesForType
    : topRecipes;

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
    const recipes: RecipeOption[] = showCustom
      ? (customRecipesForType.data?.pages.flat() ?? []).map((recipe) => ({
          id: recipe.id,
          name: recipe.name,
          url: null,
          isCustom: true,
          ownerId: recipe.owner_id,
        }))
      : (topRecipes.data?.pages.flat() ?? []);
    return [noRecipe, ...recipes];
  }, [showCustom, customRecipesForType.data, topRecipes.data, t]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const withSaving = (save: Promise<unknown>) => {
    setIsSaving(true);
    save.finally(() => setIsSaving(false));
  };

  const saveAll = (ingredients: DraftMealIngredient[]) => {
    if (!ingredientsFor) return;
    withSaving(
      onSaveWithIngredients(
        ingredientsFor.isClear ? null : ingredientsFor.id,
        ingredients,
      ),
    );
  };

  const handleSelect = (opt: RecipeOption) => {
    if (opt.isClear) {
      onSave(null);
      return;
    }
    onSave(opt.id);
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

  const addIngredientsButton = (opt: RecipeOption) => (
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
  );

  return (
    <SelectEditor<RecipeOption>
      title={t("data:dashboardTable.selectRecipe")}
      options={options}
      getOptionId={(opt) => opt.id}
      getOptionLabel={(opt) => opt.name}
      onSave={handleSelect}
      onClose={onClose}
      onScrollEnd={loadMore}
      searchable
      topContent={
        <label
          className="flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-white-green px-3 py-2"
          // Mantiene el foco en el buscador para seguir usando el teclado en la lista
          onMouseDown={(e) => e.preventDefault()}
        >
          <span className="text-xs font-semibold text-dark-green">
            {t("data:dashboardTable.recipeSource.nutritionistRecipes")}
          </span>
          <InputComponent.Toggle checked={showCustom} onChange={setShowCustom} />
        </label>
      }
      listFooter={
        isFetching && (
          <p className="text-center text-xs text-text-muted">
            {t("system:messages.loading")}
          </p>
        )
      }
      renderOption={(opt) => {
        if (opt.isClear) {
          return (
            <div className="flex items-center gap-3 py-1">
              <span className="flex-1 font-semibold text-rose-600">{opt.name}</span>
              {addIngredientsButton(opt)}
            </div>
          );
        }

        if (opt.isCustom) {
          const isClient = opt.ownerId === userId;
          return (
            <div className="flex items-center gap-3 py-1">
              <span className="flex-1 truncate text-sm text-dark-green">{opt.name}</span>
              {opt.ownerId && (
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isClient
                      ? "bg-nutrition-green/15 text-nutrition-green"
                      : "bg-dark-green/10 text-dark-green"
                  }`}
                >
                  {isClient
                    ? t("data:dashboardTable.customRecipeOwner.client")
                    : t("data:dashboardTable.customRecipeOwner.mine")}
                </span>
              )}
              {addIngredientsButton(opt)}
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
            {addIngredientsButton(opt)}
          </div>
        );
      }}
    />
  );
};

export default RecipeSelectEditor;
