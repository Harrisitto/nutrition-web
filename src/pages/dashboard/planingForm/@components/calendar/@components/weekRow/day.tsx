import { memo } from "react";

interface DayCellProps {
  day: Date;
  isToday: boolean;
  isSelectedWeek: boolean;
  isFirstDay: boolean;
  isLastDay: boolean;
  eventTitle?: string; // Título o texto del evento a mostrar
  dayFlags?: { hasEvent: boolean; hasPlaning: boolean; hasTraining: boolean };
  onSelect: (day: Date) => void;
}

const DayCell = memo(
  ({
    day,
    isToday,
    isSelectedWeek,
    isFirstDay,
    isLastDay,
    eventTitle,
    dayFlags,
    onSelect,
  }: DayCellProps) => {
    return (
      <button
        type="button"
        onClick={() => onSelect(day)}
        className={`group relative flex h-8 w-8 flex-col items-center justify-center text-xs transition-colors sm:h-9 sm:w-9 ${
          isSelectedWeek
            ? "bg-nutrition-green/20 font-bold text-dark-green"
            : "hover:bg-light-green/30"
        } ${
          isFirstDay ? "rounded-l-lg" : ""
        } ${isLastDay ? "rounded-r-lg" : ""}`}
      >
        {/* Distintivo de HOY */}
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full transition-transform group-active:scale-95 ${
            isToday
              ? "bg-nutrition-green font-bold text-white shadow-xs"
              : "font-medium"
          }`}
        >
          {day.getDate()}
        </span>

        {/* Indicadores de datos */}
        {dayFlags &&
          (dayFlags.hasEvent ||
            dayFlags.hasPlaning ||
            dayFlags.hasTraining) && (
            <span className="absolute bottom-0.5 flex items-center justify-center gap-0.5">
              {dayFlags.hasEvent && (
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 ring-1 ring-white" />
              )}
              {dayFlags.hasPlaning && (
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 ring-1 ring-white" />
              )}
              {dayFlags.hasTraining && (
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 ring-1 ring-white" />
              )}
            </span>
          )}

        {/* Tooltip con texto del evento en estilo naranja */}
        {dayFlags?.hasEvent && eventTitle && (
          <div className="pointer-events-none absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20">
            <div className="whitespace-nowrap rounded-md bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white shadow-md transition-opacity">
              {eventTitle}
            </div>
            {/* Flecha inferior del tooltip */}
            <div className="h-1.5 w-1.5 -mt-1 rotate-45 bg-orange-500" />
          </div>
        )}
      </button>
    );
  },
);

DayCell.displayName = "DayCell";

export default DayCell;
