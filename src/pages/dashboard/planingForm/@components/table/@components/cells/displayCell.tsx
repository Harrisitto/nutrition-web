import { displayChipStyle } from "../../styles";

interface CellDisplayProps {
  cellValue: string | number;
}

const CellDisplay = ({ cellValue }: CellDisplayProps) => {
  return (
    <div className={displayChipStyle}>{cellValue !== "" ? cellValue : "-"}</div>
  );
};

export default CellDisplay;
