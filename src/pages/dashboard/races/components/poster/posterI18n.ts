import i18next, { type i18n } from "i18next";
import { resources, type SupportedLanguage } from "@src/services/i18n/config";

const instances = new Map<SupportedLanguage, i18n>();

/**
 * Traducciones para pintar la imagen de la carrera en el idioma del corredor, que puede no ser
 * el de la web. Es una instancia aparte (no un clon de la global): cambiarle el idioma no toca
 * el de la web ni el que el detector guarda en localStorage. Con los recursos en el código,
 * init es síncrono.
 */
export const posterI18n = (language: SupportedLanguage) => {
  let instance = instances.get(language);
  if (!instance) {
    instance = i18next.createInstance({
      resources,
      lng: language,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      initAsync: false,
      showSupportNotice: false,
    });
    void instance.init();
    instances.set(language, instance);
  }
  return instance;
};
