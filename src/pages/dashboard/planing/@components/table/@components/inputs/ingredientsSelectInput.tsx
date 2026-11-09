import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { useAppSelector } from "@src/store/store";
import {
  mealIngredientMacros,
  useFetchCustomIngredients,
  type CustomIngredient,
  type DraftMealIngredient,
} from "@src/services/tanstack/data/ingredients";
import ModalShell from "./default/portal";
import { draftMacros, parseAmount } from "@src/components/shared/recipes/helpers";
import type { Macros } from "@src/helpers/macros";

// Sin límite la lista del catálogo renderizaría cientos de filas a cada tecla
const MAX_RESULTS = 30;

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const round = (value: number) => Math.round(value * 10) / 10;

// La cantidad se guarda como texto mientras se escribe ("" o "1." son válidos al teclear)
type DraftRow = { ingredientId: number; amount: string };



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

const DraftIngredientRow = ({
  row,
  ingredient,
  onChangeAmount,
  onRemove,
}: {
  row: DraftRow;
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
          aria-label={t("data:dashboardTable.ingredients.amount")}
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
        title={t("data:dashboardTable.ingredients.remove")}
        className="shrink-0 rounded-md p-1 text-nutrition-red transition-colors hover:bg-nutrition-red/10"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </li>
  );
};

interface IngredientsEditorProps {
  /** Nombre de la receta, para el título */
  mealLabel?: string;
  /** Ingredientes ya guardados para esta receta: "Hecho" reemplaza la lista entera */
  initialIngredients?: DraftMealIngredient[];
  isSaving?: boolean;
  /** "Hecho": el padre guarda tipo, receta y estos ingredientes */
  onDone: (ingredients: DraftMealIngredient[]) => void;
  /** Cerrar sin guardar */
  onClose: () => void;
}

/**
 * Borrador de los ingredientes extra de una comida (user_planing_meal_ingredients).
 * No guarda nada por sí mismo: al pulsar "Hecho" entrega la lista al padre.
 */
const IngredientsEditor = ({
  mealLabel,
  initialIngredients = [],
  isSaving = false,
  onDone,
  onClose,
}: IngredientsEditorProps) => {
  const { t } = useTranslation();
  const closeKey = useAppSelector(
    (state) => state.config.keyboardCommands.tableNavigation.exitCell,
  );
  const [search, setSearch] = useState("");
  // Empieza con los guardados: "Hecho" sustituye los ingredientes por este borrador,
  // así que empezar vacío los borraría sin avisar
  const [draft, setDraft] = useState<DraftRow[]>(() =>
    initialIngredients.map((el) => ({
      ingredientId: el.ingredientId,
      amount: String(el.amount),
    })),
  );

  const catalog = useFetchCustomIngredients();

  const catalogById = useMemo(
    () => new Map((catalog.data ?? []).map((el) => [el.id, el])),
    [catalog.data],
  );

  const addedIds = useMemo(() => new Set(draft.map((row) => row.ingredientId)), [draft]);

  const results = useMemo(() => {
    const query = normalize(search.trim());
    const all = catalog.data ?? [];
    const filtered = query
      ? all.filter((el) => normalize(el.name ?? "").includes(query))
      : all;
    return filtered.slice(0, MAX_RESULTS);
  }, [catalog.data, search]);

  const totals = useMemo(() => draftMacros(draft, catalogById), [draft, catalogById]);

  const hasInvalidAmount = draft.some((row) => parseAmount(row.amount) === null);

  // Se añade con la cantidad de referencia del catálogo; luego se ajusta en la lista
  const addIngredient = (ingredient: CustomIngredient) => {
    if (addedIds.has(ingredient.id)) return;
    setDraft((prev) => [
      ...prev,
      { ingredientId: ingredient.id, amount: String(ingredient.amount || 1) },
    ]);
  };

  const changeAmount = (ingredientId: number, amount: string) =>
    setDraft((prev) =>
      prev.map((row) => (row.ingredientId === ingredientId ? { ...row, amount } : row)),
    );

  const removeIngredient = (ingredientId: number) =>
    setDraft((prev) => prev.filter((row) => row.ingredientId !== ingredientId));

  const handleDone = () => {
    if (hasInvalidAmount || isSaving) return;
    onDone(
      draft.map((row) => ({
        ingredientId: row.ingredientId,
        amount: parseAmount(row.amount)!,
      })),
    );
  };

  const title = mealLabel
    ? t("data:dashboardTable.ingredients.titleFor", { meal: mealLabel })
    : t("data:dashboardTable.ingredients.title");

  return (
    <ModalShell title={title} onClose={onClose}>
      <div
        className="space-y-4"
        onKeyDown={(e) => {
          if (e.key === closeKey) {
            // Consumida aquí para que la tabla no la procese otra vez
            e.preventDefault();
            onClose();
          }
        }}
      >
        <section className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t("data:dashboardTable.ingredients.added")}
          </h4>
          {draft.length === 0 ? (
            <p className="rounded-lg bg-fade-green/10 p-3 text-center text-xs text-text-muted">
              {t("data:dashboardTable.ingredients.empty")}
            </p>
          ) : (
            <>
              <ul className="max-h-52 space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
                {draft.map((row) => (
                  <DraftIngredientRow
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
            {t("data:dashboardTable.ingredients.add")}
          </h4>
          <input
            autoFocus
            type="text"
            value={search}
            placeholder={t("data:dashboardTable.search")}
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
                {t("data:dashboardTable.ingredients.noResults")}
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
                    {!isAdded && (
                      <Plus className="size-4 shrink-0 text-nutrition-green" aria-hidden />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-nutrition-green/30 px-3 py-2 text-xs font-semibold text-dark-green"
          >
            {t("data:dashboardTable.ingredients.back")}
          </button>
          <button
            type="button"
            onClick={handleDone}
            disabled={hasInvalidAmount || isSaving}
            className="rounded-md bg-dark-green px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {isSaving ? t("system:messages.loading") : t("data:dashboardTable.ingredients.done")}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default IngredientsEditor;
