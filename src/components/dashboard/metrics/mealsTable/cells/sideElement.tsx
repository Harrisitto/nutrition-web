import { useTranslation } from "react-i18next";
import { useTableContext } from "../tableContext";

export const ColSideElement = () => {
  const { t } = useTranslation("data");
  const { tableFragmentIndex, sideElement } = useTableContext();
  const span = Math.max(
    tableFragmentIndex.mealRows.end - tableFragmentIndex.mealRows.start + 1,
    1,
  );
  return (
    <div
      className={`row-span-${span} border border-nutrition-green/30 bg-nutrition-green p-3 flex items-center justify-center text-white-green font-semibold hover:bg-dark-green transition-colors`}
    >
      {sideElement ? (
        sideElement
      ) : (
        <div className="text-sm font-medium">{t("dashboardTable.search")}</div>
      )}
    </div>
  );
};
