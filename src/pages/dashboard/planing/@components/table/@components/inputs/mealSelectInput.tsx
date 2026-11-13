import { useTranslation } from "react-i18next";
import FromDate from "@src/helpers/dates";
import { useFetchRecipeTypes } from "@src/services/tanstack/data/recipeTypes";
import { useCallback, useMemo, useState } from "react";
import {
  useDeletePlaningMeal,
  useFetchPlaningMealsForDate,
  useMutatePlaningMeals,
} from "@src/services/tanstack/user/meals";
import { useAppSelector } from "@src/store/store";
import {
  filterMealIngredients,
  useFetchMealIngredientsForDate,
  useReplaceMealIngredients,
  type DraftMealIngredient,
} from "@src/services/tanstack/data/ingredients";
import { useNotification } from "@src/store/slices/notification/hook";
import { useSelectCustomRecipeId } from "@src/services/tanstack/user/customRecipes";
import SelectEditor from "./default/selectInput";
import RecipeSelectEditor from "./recipeSelectInput";
import CustomRecipeSelectEditor from "./customRecipeSelectInput";
import { customRecipeComment } from "@src/components/shared/recipes/helpers";
import { optionActionButtonStyle } from "../../styles";

const CLEAR_MEAL_ID = -1;
const RECIPE_COMMENT_MAX_LENGTH = 200;

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
  // Tipo cuyo listado de recetas se está mostrando (null = listado de tipos)
  const [recipeTypeId, setRecipeTypeId] = useState<number | null>(null);

  // Tipos ordenados por cuantas veces se han puesto al cliente en el ultimo mes, paginados
  const clientId = useAppSelector((state) => state.config.selectedUserId);
  // Solo cuentan los usos en esta comida: en la cena salen primero los tipos que suele cenar
  const mealTypes = useFetchRecipeTypes({ clientId, mealId });
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = mealTypes;
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const insertMeal = useMutatePlaningMeals({
    forDate: date,
  });

  const deleteMeal = useDeletePlaningMeal({
    forDate: date
  });

  const replaceIngredients = useReplaceMealIngredients();
  const saveKey = useAppSelector(
    (state) => state.config.keyboardCommands.tableNavigation.saveData,
  );
  const closeKey = useAppSelector(
    (state) => state.config.keyboardCommands.tableNavigation.exitCell,
  );

  // Comentario sobre la receta: parte del guardado y se envía con cualquier guardado del editor
  const { data: weekMeals } = useFetchPlaningMealsForDate({ date });
  const currentMeal = weekMeals?.find(
    (m) => m.date === date.save() && m.meal_id === mealId,
  );
  const [recipeComment, setRecipeComment] = useState(
    () => currentMeal?.recipe_comment ?? "",
  );

  // Ingredientes ya guardados: el editor parte de ellos si se vuelve a la misma receta
  const { data: weekIngredients } = useFetchMealIngredientsForDate({ date });
  const savedIngredients = useMemo<DraftMealIngredient[]>(
    () =>
      filterMealIngredients(weekIngredients, { date: date.save(), mealId }).map(
        (el) => ({ ingredientId: el.ingredient_id, amount: el.amount }),
      ),
    [weekIngredients, date, mealId],
  );
  const { addMutationError } = useNotification();
  // Tipo "receta propia": su selector ofrece las recetas propias en vez del catálogo
  const { data: customRecipeTypeId } = useSelectCustomRecipeId();


  const rawOptions = useMemo<MealTypeOption[]>(
    () =>
      (mealTypes.data?.pages.flat() ?? []).map((type) => ({
        ...type,
        comment: type.comment ?? undefined,
      })),
    [mealTypes.data],
  );

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

  // isFixed sin recipeId: receta propia, cuyos alimentos van como ingredientes de la comida.
  // comment sustituye al del campo de comentario (la receta propia pone el suyo)
  const saveMeal = (
    typeId: number,
    recipeId: number | null,
    isFixed = recipeId !== null,
    comment = recipeComment,
  ) =>
    insertMeal.mutateAsync([{
      meal_id: mealId,
      type_id: typeId,
      // Con receta elegida queda fija; sin ella deja de serlo
      recipe_id: recipeId,
      is_fixed_recipe: isFixed,
      recipe_comment: comment.trim() || null,
    }]);

  /**
   * "Hecho" en los ingredientes. Orden obligado: la comida primero (los ingredientes
   * cuelgan de ella por FK; si cambia la receta, el upsert borra los antiguos) y
   * después se reemplazan sus ingredientes por los del borrador.
   */
  const saveMealWithIngredients = async (
    typeId: number,
    // null: sin receta fija, saveMeal la guarda con is_fixed_recipe = false
    recipeId: number | null,
    ingredients: DraftMealIngredient[],
    isFixed = recipeId !== null,
    comment = recipeComment,
  ) => {
    // Si algo falla el editor sigue abierto con el borrador, para reintentar
    try {
      await saveMeal(typeId, recipeId, isFixed, comment);
    } catch {
      addMutationError();
      return;
    }
    try {
      await replaceIngredients.mutateAsync({ date, mealId, ingredients });
    } catch {
      // Ya lo notifica el onError de la mutación
      return;
    }
    onClose();
  };

  const handleSave = (selected: MealTypeOption) => {
    if (selected.isClear || selected.id === CLEAR_MEAL_ID) {
      deleteMeal.mutateAsync(mealId).finally(onClose);
      return;
    }

    saveMeal(selected.id, null).finally(onClose);
  };

  if (recipeTypeId !== null) {
    // Misma elección que la guardada (receta fija o, sin ella, mismo tipo): sus
    // ingredientes siguen valiendo. Con otra, el guardado los borra y se empieza vacío
    const ingredientsFor = (recipeId: number | null) => {
      if (!currentMeal) return [];
      const sameChoice =
        recipeId === null
          ? !currentMeal.is_fixed_recipe && currentMeal.type_id === recipeTypeId
          : currentMeal.is_fixed_recipe && currentMeal.recipe_id === recipeId;
      return sameChoice ? savedIngredients : [];
    };

    if (recipeTypeId === customRecipeTypeId) {
      return (
        <CustomRecipeSelectEditor
          savedIngredients={ingredientsFor(null)}
          onSave={() => saveMeal(recipeTypeId, null).finally(onClose)}
          onSaveWithIngredients={(ingredients, recipe) =>
            recipe
              ? saveMealWithIngredients(
                  recipeTypeId,
                  null,
                  ingredients,
                  true,
                  customRecipeComment(recipe),
                )
              : saveMealWithIngredients(recipeTypeId, null, ingredients)
          }
          onClose={onClose}
        />
      );
    }

    return (
      <RecipeSelectEditor
        typeId={recipeTypeId}
        initialIngredientsFor={ingredientsFor}
        onSave={(recipeId) => saveMeal(recipeTypeId, recipeId).finally(onClose)}
        onSaveWithIngredients={(recipeId, ingredients) =>
          saveMealWithIngredients(recipeTypeId, recipeId, ingredients)
        }
        // Como en el tipo "receta propia": fija, sin recipe_id y con el comentario de la receta
        onSaveCustomRecipe={(recipe, ingredients) =>
          saveMealWithIngredients(
            recipeTypeId,
            null,
            ingredients,
            true,
            customRecipeComment(recipe),
          )
        }
        onClose={onClose}
      />
    );
  }

  return (
    <SelectEditor<MealTypeOption>
      title={t("data:dashboardTable.search")}
      options={options}
      initialValue={initialValue}
      getOptionId={(opt) => opt.id}
      getOptionLabel={(opt) => opt.name}
      onSave={handleSave}
      onClose={onClose}
      onScrollEnd={loadMore}
      searchable
      bottomContent={
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-text-muted">
            {t("data:dashboardTable.recipeComment.label")}
          </span>
          <input
            type="text"
            value={recipeComment}
            maxLength={RECIPE_COMMENT_MAX_LENGTH}
            placeholder={t("data:dashboardTable.recipeComment.placeholder")}
            onChange={(e) => setRecipeComment(e.target.value)}
            onKeyDown={(e) => {
              // Guardar desde el comentario guarda el tipo actual, no la opción enfocada
              // de la lista (podría ser "Limpiar" y borrar la comida)
              if (e.key === saveKey && saveKey.length > 1) {
                e.preventDefault();
                e.stopPropagation();
                if (initialValue) handleSave(initialValue);
                return;
              }
              // Cerrar sigue funcionando; el resto de teclas (flechas, letras si se
              // configuraron como atajo) son para escribir, no para la lista
              if (e.key !== closeKey) e.stopPropagation();
            }}
            className="w-full rounded-lg border border-nutrition-green/30 px-3 py-1.5 text-sm text-dark-green outline-none focus:border-dark-green"
          />
        </label>
      }
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
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  // Sin esto el click tambien selecciona el tipo y cierra
                  e.stopPropagation();
                  setRecipeTypeId(opt.id);
                }}
                className={optionActionButtonStyle}
              >
                {t("data:dashboardTable.selectRecipe")}
              </button>
            </div>
          </div>
        );
      }}
    />
  );
};

export default MealTypeEditor;
