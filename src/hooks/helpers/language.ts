import { useTranslation } from "react-i18next";
import { supportedLngs } from "@src/services/i18n/config";
import type { SupportedLanguage } from "@src/services/i18n/config";

export const useLanguageCode = (): SupportedLanguage => {
  const { i18n } = useTranslation();
  const langCode = i18n.language.split("-")[0];

  // Ensure we return a valid supported language, fallback to first supported language
  return supportedLngs.includes(langCode as SupportedLanguage)
    ? (langCode as SupportedLanguage)
    : supportedLngs[0];
};

export const useDaysOfWeek = (): string[] => {
  const { t } = useTranslation("data");
  return [
    t("dashboardTable.daysOfWeek.0"),
    t("dashboardTable.daysOfWeek.1"),
    t("dashboardTable.daysOfWeek.2"),
    t("dashboardTable.daysOfWeek.3"),
    t("dashboardTable.daysOfWeek.4"),
    t("dashboardTable.daysOfWeek.5"),
    t("dashboardTable.daysOfWeek.6"),
  ];
};

export const useMonthsOfYear = (): string[] => {
  const { t } = useTranslation("data");
  return [
    t("dashboardTable.monthsOfYear.0"),
    t("dashboardTable.monthsOfYear.1"),
    t("dashboardTable.monthsOfYear.2"),
    t("dashboardTable.monthsOfYear.3"),
    t("dashboardTable.monthsOfYear.4"),
    t("dashboardTable.monthsOfYear.5"),
    t("dashboardTable.monthsOfYear.6"),
    t("dashboardTable.monthsOfYear.7"),
    t("dashboardTable.monthsOfYear.8"),
    t("dashboardTable.monthsOfYear.9"),
    t("dashboardTable.monthsOfYear.10"),
    t("dashboardTable.monthsOfYear.11"),
  ];
};
