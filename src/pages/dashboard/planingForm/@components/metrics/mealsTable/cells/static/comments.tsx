import { useTranslation } from "react-i18next";
import { cellStyles } from "../defaultStyles";

export const HeaderComments = () => {
  const { t } = useTranslation();
  return <div className={cellStyles.longHeader.background}>
    {t("data:dashboardTable.commentsRows.header")}
  </div>;
};

export const RowComments = () => {
  const { t } = useTranslation();
  return <div className={cellStyles.leftColumnCell.background}>
    {t("data:dashboardTable.commentsRows.rowHeader")}
  </div>;
};

export const EmptyCellComments = () => {
  return <div className={cellStyles.rightColumnCell.background} />;
};