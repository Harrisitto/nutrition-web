import { useTranslation } from "react-i18next";
import { useTableContext } from "../../tableContext";

export const HeaderEnergyBalance = () => {
  const { t } = useTranslation();

  return (
    <div className="border col-start-1 col-end-10 p-3 font-semibold text-center transition-colors h-full flex items-center justify-center border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green">
      {t("data:dashboardTable.energyBalanceHeader")}
    </div>
  );
};

export const EnergyBalanceEmptyCol = () => {
const { tableFragmentIndex } = useTableContext();
  return (
    <div
      className="border p-3 font-semibold text-center transition-colors h-full flex items-center justify-center border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green"
      style={{
        gridColumn: 9,
        gridRow: tableFragmentIndex.trainingKcalRows.start + 2,
      }}
    />
  );
};

export const TrainingKcalCell = () => {
  const { t } = useTranslation();

  return (
    <div className="border col-start-1 p-3 font-semibold text-center transition-colors h-full flex items-center justify-center border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green">
      {t("data:dashboardTable.trainingKcalHeader")}
    </div>
  );
};
