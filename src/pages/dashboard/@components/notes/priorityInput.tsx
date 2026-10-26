import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Minus, Plus } from "lucide-react";
import { NOTE_PRIORITY_MAX, NOTE_PRIORITY_MIN } from "@src/services/tanstack/data/notes";
import { clampPriority } from "./priority";

const stepButtonStyle =
  "flex h-full items-center px-2.5 text-gray-blue-600 transition hover:bg-gray-blue-100 focus:outline-none focus-visible:bg-gray-blue-100 disabled:opacity-40 disabled:hover:bg-transparent";

// Prioridad de 0 a 10: se escribe o se ajusta con los botones (o las flechas del teclado)
export const PriorityInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const { t } = useTranslation();
  const labelId = useId();

  return (
    <div className="flex flex-col gap-2">
      <span id={labelId} className="text-sm text-gray-blue-600">
        {t("data:notes.priority")}
      </span>
      <div className="flex h-[42px] items-center overflow-hidden rounded-md border border-gray-blue-300 bg-gray-blue-50 text-gray-blue-700 focus-within:ring-2 focus-within:ring-gray-blue-400">
        <button
          type="button"
          className={stepButtonStyle}
          onClick={() => onChange(clampPriority(value - 1))}
          disabled={value <= NOTE_PRIORITY_MIN}
          aria-label={t("data:notes.priorityDecrease")}
          title={t("data:notes.priorityDecrease")}
        >
          <Minus size={16} />
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={NOTE_PRIORITY_MIN}
          max={NOTE_PRIORITY_MAX}
          step={1}
          value={value}
          aria-labelledby={labelId}
          // Sin las flechas nativas: ya estan los botones
          className="w-10 bg-transparent text-center font-semibold tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          onFocus={(e) => e.target.select()}
          // Al vaciar el campo queda en 0; lo que se sale del rango se ajusta al limite
          onChange={(e) => onChange(clampPriority(e.target.valueAsNumber))}
        />
        <span className="pr-1 text-xs text-text-muted" aria-hidden>
          /{NOTE_PRIORITY_MAX}
        </span>
        <button
          type="button"
          className={stepButtonStyle}
          onClick={() => onChange(clampPriority(value + 1))}
          disabled={value >= NOTE_PRIORITY_MAX}
          aria-label={t("data:notes.priorityIncrease")}
          title={t("data:notes.priorityIncrease")}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
