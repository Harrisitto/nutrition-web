import { useTranslation } from "react-i18next";
import { supportedLngs } from "@src/services/i18n/config";
import type { SupportedLanguage } from "@src/services/i18n/config";

export const useLanguageCode = (): SupportedLanguage => {
    const { i18n } = useTranslation();
    const langCode = i18n.language.split('-')[0];
    
    // Ensure we return a valid supported language, fallback to first supported language
    return supportedLngs.includes(langCode as SupportedLanguage) 
        ? (langCode as SupportedLanguage) 
        : supportedLngs[0];
}

export const useDaysOfWeek = (): string[] => {
    const { t } = useTranslation("data");
    return [
        t("misc.daysOfWeek.0"),
        t("misc.daysOfWeek.1"),
        t("misc.daysOfWeek.2"),
        t("misc.daysOfWeek.3"),
        t("misc.daysOfWeek.4"),
        t("misc.daysOfWeek.5"),
        t("misc.daysOfWeek.6"),
    ];
}