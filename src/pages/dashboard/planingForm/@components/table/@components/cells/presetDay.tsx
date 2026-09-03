import PresetDayEditor from "../inputs/presetSelectInput";
import { highlightRingOnDarkStyle, sectionHeaderBoxStyle } from "../../styles";
import type FromDate from "../../../../../../../helpers/dates";

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
      <button
        type="button"
        onClick={openEditor}
        className={`${sectionHeaderBoxStyle} cursor-pointer capitalize transition-colors hover:bg-dark-green ${
          isHighlighted ? highlightRingOnDarkStyle : ""
        }`}
      >
        {dayName}
      </button>

      {isEditing && <PresetDayEditor onClose={closeEditor} date={date} />}
    </>
  );
};

export default CellPresetDay;
