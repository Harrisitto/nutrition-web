import type FromDate from "@src/helpers/dates";
import type { MealRowInfo } from "../../types";
import MealTypeEditor from "../inputs/mealSelectInput";
import { highlightRingStyle } from "../../styles";

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
  if (kcal < 400) {
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
  const colorClass = cellValue
    ? getKcalColorClass(rowInfo.kcal)
    : "bg-fade-green/10 text-gray-blue-500 hover:bg-fade-green/25";

  return (
    <>
      <button
        type="button"
        onClick={openEditor}
        className={`w-full cursor-pointer rounded-lg px-2 py-1.5 text-center text-xs font-semibold transition-colors ${colorClass} ${
          isHighlighted ? highlightRingStyle : ""
        }`}
      >
        {cellValue ? String(cellValue) : "-"}
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
