import { useTranslation } from "react-i18next";
import { cellStyles } from "../defaultStyles";

export const HeaderEvents = () => {
    const { t } = useTranslation();
  return <div className={cellStyles.longHeader.background}>
    {t("data:dashboardTable.eventsRow.header")}
  </div>;
}

export const RowEvents = () => {
    const { t } = useTranslation();
  return <div className={cellStyles.leftColumnCell.background}>
    {t("data:dashboardTable.eventsRow.rowHeader")}
  </div>;
}

export const EmptyCellEvents = () => {
  return <div className={cellStyles.rightColumnCell.background} />;
};