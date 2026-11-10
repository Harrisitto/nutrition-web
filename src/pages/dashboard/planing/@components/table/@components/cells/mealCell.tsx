import type FromDate from "@src/helpers/dates";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  filterMealIngredients,
  useFetchMealIngredientsForDate,
} from "@src/services/tanstack/data/ingredients";
import type { MealRowInfo } from "../../types";
import MealTypeEditor from "../inputs/mealSelectInput";
import {
  expandedRevealStyle,
  highlightRingStyle,
  overflowRevealStyle,
} from "../../styles";
import ExpandableCell from "./expandableCell";
import DraggableCell from "./draggableCell";

interface CellMealProps {
  rowInfo: MealRowInfo;
  date: FromDate;
  cellValue: string | number;
  isEditing: boolean;
  isHighlighted: boolean;
  openEditor: () => void;
  closeEditor: () => void;
}

const round = (value: number) => Math.round(value * 10) / 10;

const getKcalColorClass = (kcal: number) => {
  if (kcal < 300) {
    return "bg-nutrition-green/15 text-dark-green hover:bg-nutrition-green/25";
  }
  if (kcal < 600) {
    return "bg-nutrition-blue/15 text-nutrition-blue hover:bg-nutrition-blue/25";
  }
  return "bg-nutrition-red/15 text-nutrition-red hover:bg-nutrition-red/25";
};

const CellMeal = ({
  rowInfo,
  date,
  cellValue,
  isEditing,
  isHighlighted,
  openEditor,
  closeEditor,
}: CellMealProps) => {
  const { t } = useTranslation();
  // Misma query semanal para todas las celdas: una sola petición por semana
  const { data: weekIngredients } = useFetchMealIngredientsForDate({ date });
  const extraIngredients = cellValue
    ? filterMealIngredients(weekIngredients, {
        date: date.save(),
        mealId: rowInfo.mealId,
      })
    : [];
  const fixedRecipe = cellValue
    ? rowInfo.getFixedRecipe(date.save())
    : undefined;
  const recipeComment = cellValue
    ? rowInfo.getRecipeComment(date.save())
    : undefined;
  const ingredientLines = extraIngredients.map(
    (el) =>
      `${el.ingredient?.name ?? "-"} · ${round(el.amount)}${el.ingredient?.units ? ` ${el.ingredient.units}` : ""}`,
  );
  // El title muestra lo mismo que el hover cuando el texto no cabe en la celda
  const tooltip = [fixedRecipe, ...ingredientLines, recipeComment]
    .filter(Boolean)
    .join("\n");
  const isFixedRecipe = fixedRecipe !== undefined;
  const colorClass = cellValue
    ? getKcalColorClass(rowInfo.getKcal(date.save()))
    : "bg-fade-green/10 text-gray-blue-500 hover:bg-fade-green/25";

  return (
    <>
      {/* Arrastrar la comida sobre otra celda la copia allí (ver hooks/copyMeal.ts) */}
      <DraggableCell
        data={{ kind: "meal", date: date.save(), mealId: rowInfo.mealId }}
        canDrag={!!cellValue}
      >
        {({ isDragging }) => {
          // Detalle visible con hover o con la celda seleccionada, nunca mientras se arrastra:
          // la celda sigue al puntero y se expandiría encima del destino
          const isExpanded = isHighlighted && !isDragging;
          const revealClass = isDragging
            ? "hidden"
            : isExpanded
              ? "block whitespace-normal"
              : "hidden group-hover:block";

          return (
            <ExpandableCell isExpanded={isExpanded}>
              <button
                type="button"
                onClick={openEditor}
                title={tooltip || undefined}
                className={`group ${overflowRevealStyle} w-full cursor-pointer rounded-lg px-2 py-1.5 text-center text-xs font-semibold transition-colors ${colorClass} ${
                  isHighlighted ? highlightRingStyle : ""
                } ${isExpanded ? expandedRevealStyle : ""}`}
              >
                {cellValue ? String(cellValue) : "-"}
                {isFixedRecipe && (
                  <Lock
                    className="ml-1 inline size-3 shrink-0 align-[-2px]"
                    aria-hidden
                  />
                )}
                {extraIngredients.length > 0 && (
                  <span
                    aria-label={t("data:dashboardTable.ingredients.cellBadge", {
                      count: extraIngredients.length,
                    })}
                    className="ml-1 rounded-full bg-white-green/80 px-1 text-[10px] font-bold text-dark-green"
                  >
                    +{extraIngredients.length}
                  </span>
                )}
                {!!fixedRecipe && (
                  <span
                    className={`mt-0.5 text-[11px] font-normal italic opacity-80 ${revealClass}`}
                  >
                    {fixedRecipe}
                  </span>
                )}
                {ingredientLines.length > 0 && (
                  <ul
                    className={`mt-0.5 text-left text-[11px] font-normal opacity-80 ${revealClass}`}
                  >
                    {ingredientLines.map((line, index) => (
                      <li key={extraIngredients[index].id}>+ {line}</li>
                    ))}
                  </ul>
                )}
                {!!recipeComment && (
                  <span
                    className={`mt-0.5 text-left text-[11px] font-normal italic opacity-80 ${revealClass}`}
                  >
                    “{recipeComment}”
                  </span>
                )}
              </button>
            </ExpandableCell>
          );
        }}
      </DraggableCell>

      {isEditing && (
        <MealTypeEditor
          mealId={rowInfo.mealId}
          date={date}
          displayValue={String(cellValue)}
          selectedTypeId={typeof cellValue === "number" ? cellValue : undefined}
          onClose={closeEditor}
        />
      )}
    </>
  );
};

export default CellMeal;
