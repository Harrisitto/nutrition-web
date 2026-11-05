import type FromDate from "@src/helpers/dates";
import type { RowInfo } from "../../types";
import TextEditor from "../inputs/default/textInput";
import {
  cellChipStyle,
  expandedRevealStyle,
  highlightRingStyle,
  overflowRevealStyle,
} from "../../styles";
import ExpandableCell from "./expandableCell";

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
  validate?: (value: string) => string | null;
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
  validate,
}: CellTextProps) => {
  const textValue = String(cellValue ?? "");

  return (
    <>
      <ExpandableCell isExpanded={isHighlighted}>
        <button
          type="button"
          onClick={openEditor}
          className={`${cellChipStyle} ${overflowRevealStyle} text-left text-dark-green ${
            isHighlighted ? `${highlightRingStyle} ${expandedRevealStyle}` : ""
          }`}
        >
          {textValue || "-"}
        </button>
      </ExpandableCell>

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
          validate={validate}
        />
      )}
    </>
  );
};

export default CellText;
