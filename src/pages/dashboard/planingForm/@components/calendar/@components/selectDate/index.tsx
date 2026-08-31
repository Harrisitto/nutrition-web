import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@src/store/store";
import { useMonthsOfYear } from "@src/hooks/helpers/language";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import FromDate from "@src/helpers/dates";

interface SelectDateHeaderProps {
  viewMonth: (num: number) => void;
  viewYear: (num: number) => void;
}

export const SelectDateHeader = ({
  viewMonth,
  viewYear,
}: SelectDateHeaderProps) => {
  const d = useAppSelector((state) => state.config.selectedDay);

  // Obtenemos el mes y año de la fecha seleccionada inicial para el primer render
  const initialDate = useMemo(() => {
    return new FromDate(d);
  }, []);

  const currentYear = new Date().getFullYear();
  const monthsLabels = useMonthsOfYear();

  // El header gestiona SU PROPIO estado de lo que muestra visualmente
  const [displayMonth, setDisplayMonth] = useState(initialDate.getMonth());
  const [displayYear, setDisplayYear] = useState(initialDate.getFullYear());
  const [isYearOpen, setIsYearOpen] = useState(false);

  const yearListRef = useRef<HTMLDivElement>(null);

  const yearsOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = currentYear - 100; y <= currentYear + 10; y++) {
      years.push(y);
    }
    return years;
  }, [currentYear]);

  // Cambiar de mes navegando sobre un objeto Date ficticio siempre fijado al día 15
  // (Usar el día 15 evita errores de desbordamiento en meses de 28, 30 o 31 días)
  const navigateMonth = useCallback(
    (direction: "prev" | "next") => {
      // Forzamos el día 15 para evitar desbordamientos de mes (ej. 31 de Julio)
      const pivotDate = new Date(displayYear, displayMonth, 15);

      if (direction === "prev") {
        pivotDate.setMonth(pivotDate.getMonth() - 1);
      } else {
        pivotDate.setMonth(pivotDate.getMonth() + 1);
      }

      const nextMonth = pivotDate.getMonth();
      const nextYear = pivotDate.getFullYear();

      setDisplayMonth(nextMonth);
      setDisplayYear(nextYear);

      // Notificar los cambios al padre
      if (nextYear !== displayYear) {
        viewYear(nextYear);
      }
      viewMonth(nextMonth);
    },
    [displayMonth, displayYear, viewMonth, viewYear],
  );

  const handleSelectYear = useCallback(
    (yearNum: number) => {
      setDisplayYear(yearNum);
      viewYear(yearNum);
      setIsYearOpen(false);
    },
    [viewYear],
  );

  useEffect(() => {
    if (isYearOpen && yearListRef.current) {
      const selectedEl = yearListRef.current.querySelector(
        "[data-selected='true']",
      );
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "center" });
      }
    }
  }, [isYearOpen]);

  return (
    <div className="flex w-full items-center justify-between gap-2 px-1">
      {/* Texto de Mes + Selector de Año */}
      <div className="flex items-center gap-1.5 text-base font-bold capitalize text-dark-green">
        <span>{monthsLabels[displayMonth]}</span>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsYearOpen((prev) => !prev)}
            className="flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-sm font-semibold text-dark-green transition hover:bg-light-green/20"
          >
            {displayYear}
            <ChevronDown
              className={`h-3.5 w-3.5 text-dark-green/60 transition-transform ${
                isYearOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isYearOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsYearOpen(false)}
              />
              <div
                ref={yearListRef}
                className="absolute left-0 z-20 mt-1 max-h-52 w-28 overflow-y-auto rounded-xl border border-nutrition-green/20 bg-white p-1 shadow-lg"
              >
                {yearsOptions.map((year) => {
                  const isSelected = displayYear === year;
                  return (
                    <button
                      key={year}
                      type="button"
                      data-selected={isSelected}
                      onClick={() => handleSelectYear(year)}
                      className={`flex w-full items-center justify-center rounded-lg py-1.5 text-xs transition ${
                        isSelected
                          ? "bg-nutrition-green/20 font-semibold text-dark-green"
                          : "text-dark-green/80 hover:bg-light-green/20"
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Botones de Navegación entre Meses */}
      <div className="flex items-center gap-1 rounded-xl border border-nutrition-green/20 bg-nutrition-green/5 p-1 backdrop-blur-xs">
        <button
          type="button"
          onClick={() => navigateMonth("prev")}
          aria-label="Mes anterior"
          className="group relative flex h-7 w-7 items-center justify-center rounded-lg text-dark-green/70 transition-all hover:bg-white hover:text-dark-green hover:shadow-xs active:scale-95"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <div className="h-3.5 w-px bg-nutrition-green/20" />

        <button
          type="button"
          onClick={() => navigateMonth("next")}
          aria-label="Mes siguiente"
          className="group relative flex h-7 w-7 items-center justify-center rounded-lg text-dark-green/70 transition-all hover:bg-white hover:text-dark-green hover:shadow-xs active:scale-95"
        >
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
