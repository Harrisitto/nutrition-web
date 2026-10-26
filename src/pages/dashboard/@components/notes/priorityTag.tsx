import { useTranslation } from "react-i18next";
import { Flag } from "lucide-react";
import { NOTE_PRIORITY_MAX } from "@src/services/tanstack/data/notes";
import { priorityClassName } from "./priority";

// Las normales (0) no llevan etiqueta: solo destaca lo que tiene prioridad
export const PriorityTag = ({ priority }: { priority: number }) => {
  const { t } = useTranslation();
  if (priority <= 0) return null;
  const label = `${t("data:notes.priority")} ${priority}/${NOTE_PRIORITY_MAX}`;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${priorityClassName(priority)}`}
      title={label}
    >
      <Flag size={10} aria-hidden />
      <span className="sr-only">{label}</span>
      <span aria-hidden>{priority}</span>
    </span>
  );
};
