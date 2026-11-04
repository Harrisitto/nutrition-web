import type FromDate from "@src/helpers/dates";
import { Lock } from "lucide-react";
import type { MealRowInfo } from "../../types";
import MealTypeEditor from "../inputs/mealSelectInput";
import { highlightRingStyle, overflowRevealStyle } from "../../styles";

interface CellMealProps {
  rowInfo: MealRowInfo;
  date: FromDate;
  cellValue: string | number;
  isEditing: boolean;
  isHighlighted: boolean;
  openEditor: () => void;
  closeEditor: () => void;
}

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
  const fixedRecipe = cellValue ? rowInfo.getFixedRecipe(date.save()) : undefined;
  const isFixedRecipe = fixedRecipe !== undefined;
  const colorClass = cellValue
    ? getKcalColorClass(rowInfo.getKcal(date.save()))
    : "bg-fade-green/10 text-gray-blue-500 hover:bg-fade-green/25";

  return (
    <>
      <button
        type="button"
        onClick={openEditor}
        title={fixedRecipe || undefined}
        className={`group ${overflowRevealStyle} w-full cursor-pointer rounded-lg px-2 py-1.5 text-center text-xs font-semibold transition-colors ${colorClass} ${
          isHighlighted ? highlightRingStyle : ""
        }`}
      >
        {cellValue ? String(cellValue) : "-"}
        {isFixedRecipe && (
          <Lock className="ml-1 inline size-3 shrink-0 align-[-2px]" aria-hidden />
        )}
        {/* Receta fija: visible con hover o con la celda seleccionada */}
        {!!fixedRecipe && (
          <span
            className={`mt-0.5 text-[11px] font-normal italic opacity-80 ${
              isHighlighted ? "block whitespace-normal" : "hidden group-hover:block"
            }`}
          >
            {fixedRecipe}
          </span>
        )}
      </button>

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
