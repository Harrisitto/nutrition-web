import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enSystem from "./locales/en/system.json";
import enAuth from "./locales/en/auth.json";
import enApp from "./locales/en/data.json";
import enForms from "./locales/en/forms.json";
import enHome from "./locales/en/home.json";

import esSystem from "./locales/es/system.json";
import esAuth from "./locales/es/auth.json";
import esApp from "./locales/es/data.json";
import esForms from "./locales/es/forms.json";
import esHome from "./locales/es/home.json";

const resources = {
    en: {
        system: enSystem,
        auth: enAuth,
        data: enApp,
        forms: enForms,
        home: enHome,
    }, // English translations
    es: {
        system: esSystem,
        auth: esAuth,
        data: esApp,
        forms: esForms,
        home: esHome,
    }, // Spanish translations
};

export const supportedLngs = ["en", 'es'] as const;
export type SupportedLanguage = typeof supportedLngs[number];

i18next
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: "en",
        supportedLngs: supportedLngs,
        load: "languageOnly",
        // detection options: prefer navigator languages, then querystring/localStorage/cookie
        detection: {
            order: ["navigator", "querystring", "localStorage", "cookie", "htmlTag", "path", "subdomain"],
            caches: ["localStorage", "cookie"],
        },

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18next;
