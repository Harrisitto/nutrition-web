import { useTranslation } from "react-i18next";
import type FromDate from "@src/helpers/dates";
import AutoGenerateEditor from "../inputs/autoGenerateInput";
import {
  cellChipStyle,
  expandedRevealStyle,
  highlightRingStyle,
  overflowRevealStyle,
} from "../../styles";
import ExpandableCell from "./expandableCell";

interface CellAutoGenerateProps {
  date: FromDate;
  isEditing: boolean;
  isHighlighted: boolean;
  openEditor: () => void;
  closeEditor: () => void;
}

const CellAutoGenerate = ({
  date,
  isEditing,
  isHighlighted,
  openEditor,
  closeEditor,
}: CellAutoGenerateProps) => {
  const { t } = useTranslation();

  return (
    <>
      <ExpandableCell isExpanded={isHighlighted}>
        <button
          type="button"
          onClick={openEditor}
          className={`${cellChipStyle} ${overflowRevealStyle} text-dark-green hover:bg-fade-green/25 ${
            isHighlighted ? `${highlightRingStyle} ${expandedRevealStyle}` : ""
          }`}
        >
          {t("data:dashboardTable.autoGenerate.button")}
        </button>
      </ExpandableCell>

      {isEditing && <AutoGenerateEditor date={date} onClose={closeEditor} />}
    </>
  );
};

export default CellAutoGenerate;
