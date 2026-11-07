import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { deleteButtonStyle } from "@src/components/styles";
import {
  mealIngredientMacros,
  useFetchCustomIngredients,
  type CustomIngredient,
} from "@src/services/tanstack/data/ingredients";
import { parseAmount, type DraftRecipeIngredient } from "../helpers";

// Sin límite la lista del catálogo renderizaría cientos de filas a cada tecla
const MAX_RESULTS = 30;

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const round = (value: number) => Math.round(value * 10) / 10;

type Macros = ReturnType<typeof mealIngredientMacros>;

const MacrosLine = ({ macros }: { macros: Macros }) => {
  const { t } = useTranslation();
  return (
    <span className="text-[11px] text-text-muted">
      {Math.round(macros.kcal)} {t("data:macronutrients.kcal")} ·{" "}
      {t("data:macronutrients.shortCarbs")} {round(macros.hc)}g ·{" "}
      {t("data:macronutrients.shortProtein")} {round(macros.prot)}g ·{" "}
      {t("data:macronutrients.shortFats")} {round(macros.fat)}g
    </span>
  );
};

const DraftRow = ({
  row,
  ingredient,
  onChangeAmount,
  onRemove,
}: {
  row: DraftRecipeIngredient;
  ingredient?: CustomIngredient;
  onChangeAmount: (amount: string) => void;
  onRemove: () => void;
}) => {
  const { t } = useTranslation();
  const amount = parseAmount(row.amount);

  return (
    <li className="flex items-center gap-3 rounded-lg border border-nutrition-green/20 bg-white-green/40 px-3 py-2">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-dark-green">
          {ingredient?.name ?? "-"}
        </span>
        {ingredient && amount !== null && (
          <MacrosLine macros={mealIngredientMacros(ingredient, amount)} />
        )}
      </div>
      <label className="flex shrink-0 items-center gap-1">
        <input
          type="number"
          min={0}
          step="any"
          value={row.amount}
          aria-label={t("data:customRecipes.form.amount")}
          aria-invalid={amount === null}
          onChange={(e) => onChangeAmount(e.target.value)}
          className={`w-20 rounded-md border px-2 py-1 text-right text-sm text-dark-green outline-none focus:border-dark-green ${
            amount === null ? "border-nutrition-red" : "border-nutrition-green/30"
          }`}
        />
        <span className="w-8 text-xs text-text-muted">{ingredient?.units ?? ""}</span>
      </label>
      <button
        type="button"
        onClick={onRemove}
        title={t("data:customRecipes.form.removeIngredient")}
        aria-label={t("data:customRecipes.form.removeIngredient")}
        className={deleteButtonStyle}
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </li>
  );
};

/**
 * Lista de alimentos de la receta (custom_recipe_ingredients) y buscador del catálogo.
 * Controlado: el padre guarda el borrador y lo envía al guardar la receta.
 */
const RecipeIngredientsEditor = ({
  value,
  onChange,
}: {
  value: DraftRecipeIngredient[];
  onChange: (value: DraftRecipeIngredient[]) => void;
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const catalog = useFetchCustomIngredients();

  const catalogById = useMemo(
    () => new Map((catalog.data ?? []).map((el) => [el.id, el])),
    [catalog.data],
  );

  const addedIds = useMemo(() => new Set(value.map((row) => row.ingredientId)), [value]);

  const results = useMemo(() => {
    const query = normalize(search.trim());
    const all = catalog.data ?? [];
    const filtered = query ? all.filter((el) => normalize(el.name ?? "").includes(query)) : all;
    return filtered.slice(0, MAX_RESULTS);
  }, [catalog.data, search]);

  const totals = useMemo(
    () =>
      value.reduce<Macros>(
        (acc, row) => {
          const ingredient = catalogById.get(row.ingredientId);
          const amount = parseAmount(row.amount);
          if (!ingredient || amount === null) return acc;
          const m = mealIngredientMacros(ingredient, amount);
          return {
            kcal: acc.kcal + m.kcal,
            prot: acc.prot + m.prot,
            hc: acc.hc + m.hc,
            fat: acc.fat + m.fat,
          };
        },
        { kcal: 0, prot: 0, hc: 0, fat: 0 },
      ),
    [value, catalogById],
  );

  // Se añade con la cantidad de referencia del catálogo; luego se ajusta en la lista
  const addIngredient = (ingredient: CustomIngredient) => {
    if (addedIds.has(ingredient.id)) return;
    onChange([...value, { ingredientId: ingredient.id, amount: String(ingredient.amount || 1) }]);
  };

  const changeAmount = (ingredientId: number, amount: string) =>
    onChange(value.map((row) => (row.ingredientId === ingredientId ? { ...row, amount } : row)));

  const removeIngredient = (ingredientId: number) =>
    onChange(value.filter((row) => row.ingredientId !== ingredientId));

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          {t("data:customRecipes.form.ingredients")}
        </h4>
        {value.length === 0 ? (
          <p className="rounded-lg bg-fade-green/10 p-3 text-center text-xs text-text-muted">
            {t("data:customRecipes.form.noIngredients")}
          </p>
        ) : (
          <>
            <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {value.map((row) => (
                <DraftRow
                  key={row.ingredientId}
                  row={row}
                  ingredient={catalogById.get(row.ingredientId)}
                  onChangeAmount={(amount) => changeAmount(row.ingredientId, amount)}
                  onRemove={() => removeIngredient(row.ingredientId)}
                />
              ))}
            </ul>
            <div className="flex justify-end">
              <MacrosLine macros={totals} />
            </div>
          </>
        )}
      </section>

      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          {t("data:customRecipes.form.addIngredient")}
        </h4>
        <input
          type="text"
          value={search}
          placeholder={t("data:customRecipes.form.search")}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-nutrition-green/30 px-3 py-2 text-sm text-dark-green outline-none focus:border-dark-green"
        />
        <ul className="max-h-52 space-y-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
          {catalog.isLoading && (
            <li className="p-2 text-center text-xs text-text-muted">
              {t("system:messages.loading")}
            </li>
          )}
          {!catalog.isLoading && results.length === 0 && (
            <li className="p-2 text-center text-xs text-text-muted">
              {t("data:customRecipes.form.noResults")}
            </li>
          )}
          {results.map((ingredient) => {
            const isAdded = addedIds.has(ingredient.id);
            return (
              <li key={ingredient.id}>
                <button
                  type="button"
                  onClick={() => addIngredient(ingredient)}
                  disabled={isAdded}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-nutrition-green/15 disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm text-dark-green">
                      {ingredient.name}{" "}
                      <span className="text-xs text-text-muted">
                        ({ingredient.amount} {ingredient.units ?? ""})
                      </span>
                    </span>
                    <MacrosLine macros={mealIngredientMacros(ingredient, ingredient.amount)} />
                  </div>
                  {!isAdded && <Plus className="size-4 shrink-0 text-nutrition-green" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default RecipeIngredientsEditor;
