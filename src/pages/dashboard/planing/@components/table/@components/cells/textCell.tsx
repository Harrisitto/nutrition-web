import type FromDate from "@src/helpers/dates";
import type { RowInfo } from "../../types";
import TextEditor from "../inputs/default/textInput";
import { cellChipStyle, highlightRingStyle } from "../../styles";

interface CellTextProps {
  rowInfo: RowInfo;
  date: FromDate;
  cellValue: string | number;
  isEditing: boolean;
  isHighlighted: boolean;
  placeholder: string;
  openEditor: () => void;
  closeEditor: () => void;
  onSave: (value: string) => void;
}

const CellText = ({
  rowInfo,
  date,
  cellValue,
  isEditing,
  isHighlighted,
  placeholder,
  openEditor,
  closeEditor,
  onSave,
}: CellTextProps) => {
  const textValue = String(cellValue ?? "");

  return (
    <>
      <button
        type="button"
        onClick={openEditor}
        className={`${cellChipStyle} truncate text-left text-dark-green ${
          isHighlighted ? highlightRingStyle : ""
        }`}
      >
        {textValue || "-"}
      </button>

      {isEditing && (
        <TextEditor
          title={`${rowInfo.label} (${date.save()})`}
          initialValue={textValue}
          placeholder={placeholder}
          onSave={(val) => {
            rowInfo.map.set(date.save(), val);
            onSave(val);
            closeEditor();
          }}
          onClose={closeEditor}
        />
      )}
    </>
  );
};

export default CellText;
