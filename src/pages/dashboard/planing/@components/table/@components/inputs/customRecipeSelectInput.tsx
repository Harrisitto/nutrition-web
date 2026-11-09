import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  customRecipeIngredients as recipeIngredients,
  recipeMacros,
} from "@src/components/shared/recipes/helpers";
import type { DraftMealIngredient } from "@src/services/tanstack/data/ingredients";
import {
  useFetchClientCustomRecipes,
  useFetchMyCustomRecipes,
  type CustomRecipe,
} from "@src/services/tanstack/user/customRecipes";
import SelectEditor from "./default/selectInput";
import IngredientsEditor from "./ingredientsSelectInput";
import { addIngredientsButtonStyle } from "../../styles";

const NO_RECIPE_ID = -1;

interface CustomRecipeOption {
  id: number;
  name: string;
  recipe: CustomRecipe | null;
  isClient: boolean;
  isClear?: boolean;
}

interface CustomRecipeSelectEditorProps {
  /** Ingredientes guardados si la comida ya era de este tipo sin receta; si no, [] */
  savedIngredients: DraftMealIngredient[];
  /** "Sin receta fija": guarda el tipo sin tocar ingredientes y cierra */
  onSave: () => void;
  /**
   * Guarda el tipo con exactamente esos ingredientes y cierra. `recipe`: la receta propia elegida
   * (la comida queda fija y su comentario es el de la receta); null con "Sin receta fija"
   */
  onSaveWithIngredients: (
    ingredients: DraftMealIngredient[],
    recipe: CustomRecipe | null,
  ) => Promise<unknown>;
  onClose: () => void;
}

/**
 * Selector para el tipo "receta propia": en vez del catálogo de recetas ofrece las recetas
 * propias del nutricionista y las del cliente. Elegir una copia sus alimentos a los
 * ingredientes de la comida (user_planing_meal_ingredients); "+ Ingredientes" abre el editor
 * con ellos para ajustarlos antes de guardar.
 * Con una receta elegida la comida queda fija (is_fixed_recipe) pero sin recipe_id: las recetas
 * propias no están en all_recipes.
 */
const CustomRecipeSelectEditor = ({
  savedIngredients,
  onSave,
  onSaveWithIngredients,
  onClose,
}: CustomRecipeSelectEditorProps) => {
  const { t } = useTranslation();
  const mine = useFetchMyCustomRecipes();
  const client = useFetchClientCustomRecipes();
  // Opción cuyos ingredientes se están editando
  const [ingredientsFor, setIngredientsFor] = useState<CustomRecipeOption | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const options = useMemo<CustomRecipeOption[]>(() => {
    const noRecipe: CustomRecipeOption = {
      id: NO_RECIPE_ID,
      name: t("data:dashboardTable.noFixedRecipe"),
      recipe: null,
      isClient: false,
      isClear: true,
    };
    const toOption = (isClient: boolean) => (recipe: CustomRecipe) => ({
      id: recipe.id,
      name: recipe.name,
      recipe,
      isClient,
    });
    return [
      noRecipe,
      ...(client.data ?? []).map(toOption(true)),
      ...(mine.data ?? []).map(toOption(false)),
    ];
  }, [client.data, mine.data, t]);

  const save = (ingredients: DraftMealIngredient[], recipe: CustomRecipe | null) => {
    setIsSaving(true);
    onSaveWithIngredients(ingredients, recipe).finally(() => setIsSaving(false));
  };

  const handleSelect = (opt: CustomRecipeOption) => {
    if (!opt.recipe) {
      onSave();
      return;
    }
    save(recipeIngredients(opt.recipe), opt.recipe);
  };

  if (ingredientsFor) {
    return (
      <IngredientsEditor
        mealLabel={ingredientsFor.recipe ? ingredientsFor.name : undefined}
        initialIngredients={
          ingredientsFor.recipe ? recipeIngredients(ingredientsFor.recipe) : savedIngredients
        }
        isSaving={isSaving}
        onDone={(ingredients) => save(ingredients, ingredientsFor.recipe)}
        // Sin guardar: vuelve a la lista de recetas
        onClose={() => setIngredientsFor(null)}
      />
    );
  }

  const addIngredientsButton = (opt: CustomRecipeOption) => (
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
    <SelectEditor<CustomRecipeOption>
      title={t("data:dashboardTable.selectCustomRecipe")}
      options={options}
      getOptionId={(opt) => opt.id}
      getOptionLabel={(opt) => opt.name}
      onSave={handleSelect}
      onClose={onClose}
      searchable
      listFooter={
        (mine.isLoading || client.isLoading) && (
          <p className="text-center text-xs text-text-muted">{t("system:messages.loading")}</p>
        )
      }
      renderOption={(opt) => {
        if (!opt.recipe) {
          return (
            <div className="flex items-center gap-3 py-1">
              <span className="flex-1 font-semibold text-rose-600">{opt.name}</span>
              {addIngredientsButton(opt)}
            </div>
          );
        }

        const macros = recipeMacros(opt.recipe);
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-dark-green">{opt.name}</span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    opt.isClient
                      ? "bg-nutrition-green/15 text-nutrition-green"
                      : "bg-dark-green/10 text-dark-green"
                  }`}
                >
                  {opt.isClient
                    ? t("data:dashboardTable.customRecipeOwner.client")
                    : t("data:dashboardTable.customRecipeOwner.mine")}
                </span>
              </div>
              <span className="text-[11px] text-text-muted">
                {Math.round(macros.kcal)} {t("data:macronutrients.kcal")} ·{" "}
                {t("data:macronutrients.shortCarbs")} {Math.round(macros.hc)}g ·{" "}
                {t("data:macronutrients.shortProtein")} {Math.round(macros.prot)}g ·{" "}
                {t("data:macronutrients.shortFats")} {Math.round(macros.fat)}g
              </span>
            </div>
            {addIngredientsButton(opt)}
          </div>
        );
      }}
    />
  );
};

export default CustomRecipeSelectEditor;
