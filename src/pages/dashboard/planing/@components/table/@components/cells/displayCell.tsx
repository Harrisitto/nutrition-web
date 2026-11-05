import { displayChipStyle } from "../../styles";
import ExpandableCell from "./expandableCell";

interface CellDisplayProps {
  cellValue: string | number;
}

const CellDisplay = ({ cellValue }: CellDisplayProps) => {
  return (
    <ExpandableCell>
      <div className={displayChipStyle}>
        {cellValue !== "" ? cellValue : "-"}
      </div>
    </ExpandableCell>
  );
};

export default CellDisplay;
