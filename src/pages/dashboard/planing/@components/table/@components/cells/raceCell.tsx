import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { cellChipStyle, highlightRingStyle } from "../../styles";

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
    <button
      type="button"
      onClick={openEditor}
      aria-label={
        hasRace
          ? t("data:dashboardTable.racesCell", { day: dayName, kcal: cellValue })
          : t("data:dashboardTable.racesCellEmpty", { day: dayName })
      }
      className={`${cellChipStyle} flex min-h-7 items-center justify-center gap-1 text-dark-green hover:bg-fade-green/25 ${
        isHighlighted ? highlightRingStyle : ""
      }`}
    >
      {hasRace && (
        <>
          <Check size={14} className="shrink-0 text-nutrition-green" />
          {cellValue} {t("data:dashboardTable.Kcal")}
        </>
      )}
    </button>
  );
};

export default CellRace;
