import PresetDayEditor from "../inputs/presetSelectInput";
import { highlightRingOnDarkStyle, sectionHeaderBoxStyle } from "../../styles";
import type FromDate from "@src/helpers/dates";
import DraggableCell from "./draggableCell";

interface CellPresetDayProps {
  dayName: string;
  date: FromDate;
  isEditing: boolean;
  isHighlighted: boolean;
  openEditor: () => void;
  closeEditor: () => void;
}

const CellPresetDay = ({
  date,
  dayName,
  isEditing,
  isHighlighted,
  openEditor,
  closeEditor,
}: CellPresetDayProps) => {
  return (
    <>
      {/* Arrastrar el día sobre otro clona sus comidas allí (ver hooks/copyMeal.ts) */}
      <DraggableCell data={{ kind: "day", date: date.save() }}>
        {() => (
          <button
            type="button"
            onClick={openEditor}
            className={`${sectionHeaderBoxStyle} w-full cursor-pointer capitalize transition-colors hover:bg-dark-green ${
              isHighlighted ? highlightRingOnDarkStyle : ""
            }`}
          >
            {dayName}
          </button>
        )}
      </DraggableCell>

      {isEditing && <PresetDayEditor onClose={closeEditor} date={date} />}
    </>
  );
};

export default CellPresetDay;
