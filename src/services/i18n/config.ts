import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enSystem from "./locales/en/system.json";
import enAuth from "./locales/en/auth.json";

const resources = {
    en: {
        system: enSystem,
        auth: enAuth

    }, // English translations
};

i18next
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: "en",
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
