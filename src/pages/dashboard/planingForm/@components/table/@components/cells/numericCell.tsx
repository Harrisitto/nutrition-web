import type FromDate from "@src/helpers/dates";
import type { RowInfo } from "../../types";
import NumericEditor from "../inputs/numericInput";
import { cellChipStyle, highlightRingStyle } from "../../styles";

interface CellNumericProps {
  rowInfo: RowInfo;
  date: FromDate;
  cellValue: string | number;
  isEditing: boolean;
  isHighlighted: boolean;
  openEditor: () => void;
  closeEditor: () => void;
}

const CellNumeric = ({
  rowInfo,
  date,
  cellValue,
  isEditing,
  isHighlighted,
  openEditor,
  closeEditor,
}: CellNumericProps) => {
  const numericValue =
    typeof cellValue === "number" ? cellValue : Number(cellValue) || 0;

  return (
    <>
      <button
        type="button"
        onClick={openEditor}
        className={`${cellChipStyle} text-dark-green ${
          isHighlighted ? highlightRingStyle : ""
        }`}
      >
        {cellValue !== "" && cellValue !== undefined ? cellValue : "-"}
      </button>

      {isEditing && (
        <NumericEditor
          title={`${rowInfo.label} (${date.save()})`}
          initialValue={numericValue}
          onSave={(val) => {
            rowInfo.map.set(date.save(), val);
            closeEditor();
          }}
          onClose={closeEditor}
        />
      )}
    </>
  );
};

export default CellNumeric;
