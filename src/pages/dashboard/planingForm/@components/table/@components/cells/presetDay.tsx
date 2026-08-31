import PresetDayEditor from "../inputs/presetSelectInput";
import { highlightRingOnDarkStyle, sectionHeaderBoxStyle } from "../../styles";

interface CellPresetDayProps {
  dayName: string;
  isEditing: boolean;
  isHighlighted: boolean;
  openEditor: () => void;
  closeEditor: () => void;
}

const CellPresetDay = ({
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

      {isEditing && <PresetDayEditor onClose={closeEditor} />}
    </>
  );
};

export default CellPresetDay;
