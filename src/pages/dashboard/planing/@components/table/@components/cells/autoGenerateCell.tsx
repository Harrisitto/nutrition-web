import { useTranslation } from "react-i18next";
import type FromDate from "@src/helpers/dates";
import AutoGenerateEditor from "../inputs/autoGenerateInput";
import { cellChipStyle, highlightRingStyle } from "../../styles";

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
      <button
        type="button"
        onClick={openEditor}
        className={`${cellChipStyle} text-dark-green hover:bg-fade-green/25 ${
          isHighlighted ? highlightRingStyle : ""
        }`}
      >
        {t("data:dashboardTable.autoGenerate.button")}
      </button>

      {isEditing && <AutoGenerateEditor date={date} onClose={closeEditor} />}
    </>
  );
};

export default CellAutoGenerate;
