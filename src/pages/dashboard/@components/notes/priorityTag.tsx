import { useTranslation } from "react-i18next";
import { Flag } from "lucide-react";
import type { NotePriority } from "@src/services/tanstack/data/notes";
import { PRIORITY_STYLES } from "./priority";

// Las normales no llevan etiqueta: solo destaca lo que tiene prioridad
export const PriorityTag = ({ priority }: { priority: NotePriority }) => {
  const { t } = useTranslation();
  if (priority === 0) return null;
  const { key, className } = PRIORITY_STYLES[priority];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${className}`}
    >
      <Flag size={10} />
      {t(`data:notes.priorities.${key}`)}
    </span>
  );
};
