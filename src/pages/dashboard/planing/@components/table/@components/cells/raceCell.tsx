import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import {
  cellChipStyle,
  expandedRevealStyle,
  highlightRingStyle,
  overflowRevealStyle,
} from "../../styles";
import ExpandableCell from "./expandableCell";

interface CellRaceProps {
  dayName: string;
  /** Kcal ingeridas en la carrera; "" si ese día no hay carrera */
  cellValue: string | number;
  isHighlighted: boolean;
  /** La fila tiene acción: abrir la celda navega a la página races */
  openEditor: () => void;
}

const CellRace = ({
  dayName,
  cellValue,
  isHighlighted,
  openEditor,
}: CellRaceProps) => {
  const { t } = useTranslation();
  const hasRace = cellValue !== "";

  return (
    <ExpandableCell isExpanded={isHighlighted}>
      <button
        type="button"
        onClick={openEditor}
        aria-label={
          hasRace
            ? t("data:dashboardTable.racesCell", {
                day: dayName,
                kcal: cellValue,
              })
            : t("data:dashboardTable.racesCellEmpty", { day: dayName })
        }
        className={`group ${cellChipStyle} flex min-h-7 items-center justify-center gap-1 text-dark-green hover:bg-fade-green/25 ${
          isHighlighted ? highlightRingStyle : ""
        }`}
      >
        {hasRace && (
          <>
            <Check size={14} className="shrink-0 text-nutrition-green" />
            <span
              className={`min-w-0 ${overflowRevealStyle} group-hover:whitespace-normal group-hover:[overflow-wrap:anywhere] ${
                isHighlighted ? expandedRevealStyle : ""
              }`}
            >
              {cellValue} {t("data:dashboardTable.Kcal")}
            </span>
          </>
        )}
      </button>
    </ExpandableCell>
  );
};

export default CellRace;
