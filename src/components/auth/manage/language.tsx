import { supportedLngs } from "@src/services/i18n/config";
import { useTranslation } from "react-i18next";

export const Select = () => {
  const { i18n, t} = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="relative inline-block w-full sm:w-auto text-body">
      {/* Label con mayor tamaño y peso de fuente */}
      <label className="block mb-2 text-sm md:text-base font-medium text-text-muted">
        {t('data:configuration.sections.authManagement.chooseLanguage')}
      </label>

      {/* Contenedor relativo para posicionar la flecha correctamente debajo del label */}
      <div className="relative">
        {/* Selector con mayor relleno, texto más grande y min-width */}
        <select
          value={i18n.language?.slice(0, 2) || "en"}
          onChange={handleChange}
          aria-label="Seleccionar idioma"
          className="
            w-full min-w-[160px] appearance-none cursor-pointer
            px-4 py-3 pr-10
            bg-white-green hover:bg-gray-blue-100
            text-dark-green font-semibold text-base md:text-lg
            border-2 border-gray-blue-300 hover:border-nutrition-green
            rounded-xl shadow-md
            transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-nutrition-green/30 focus:border-nutrition-green
          "
        >
          {supportedLngs.map((lng) => (
            <option
              key={lng}
              value={lng}
              className="bg-white-green text-dark-green font-medium py-2 text-base"
            >
              {lng.toUpperCase()}
            </option>
          ))}
        </select>

        {/* Ícono de flecha más grande, centrado verticalmente respecto al select */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="w-5 h-5 fill-current text-nutrition-green"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
