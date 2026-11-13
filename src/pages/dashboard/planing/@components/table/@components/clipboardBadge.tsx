import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { ClipboardCopy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDaysOfWeek } from "@src/hooks/helpers/language";
import type { CopiedCell } from "../hooks/clipboard";

interface ClipboardBadgeProps {
  copied: CopiedCell | null;
  /** `getCellId("")` de la fila seleccionada (el `data-row-key` de su <tr>) */
  rowKey: string | null;
  /** Índice del día seleccionado (0-6) */
  col: number;
  /** Lo copiado se puede pegar en la celda seleccionada */
  canPaste: boolean;
  /** Con un editor abierto no se muestra */
  hidden: boolean;
  /** Contenedor con scroll horizontal de la tabla */
  scrollRef: RefObject<HTMLDivElement | null>;
}

type Position = { left: number; top: number };

/**
 * Lo copiado con la tecla `copyCell` (ver hooks/clipboard.ts): día, fila y valor (`RowInfo.getDisplayText`).
 * Sigue a la celda seleccionada, pegado encima de su esquina superior izquierda, y no recibe el ratón
 * (`pointer-events-none`) para no tapar clicks. Verde si se puede pegar ahí; apagado si no. La tecla de salir lo vacía
 */
const ClipboardBadge = ({ copied, rowKey, col, canPaste, hidden, scrollRef }: ClipboardBadgeProps) => {
  const { t } = useTranslation();
  const daysOfWeek = useDaysOfWeek();
  const badgeRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position | null>(null);

  // Sin dependencias a propósito: la celda puede moverse con cualquier render (filas que aparecen o cambian de
  // alto al revalidar). Solo se actualiza el estado si la posición cambia, así que no hay bucle
  useLayoutEffect(() => {
    const update = () => {
      const badge = badgeRef.current;
      const parent = badge?.offsetParent;
      const cell = rowKey
        ? document.querySelector<HTMLElement>(
            // +2: nth-child empieza en 1 y la primera columna es la etiqueta de la fila
            `tr[data-row-key="${rowKey}"] > td:nth-child(${col + 2})`,
          )
        : null;
      if (!parent || !cell) {
        setPosition((prev) => (prev === null ? prev : null));
        return;
      }
      const cellRect = cell.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const next = { left: cellRect.left - parentRect.left, top: cellRect.top - parentRect.top };
      setPosition((prev) =>
        prev && prev.left === next.left && prev.top === next.top ? prev : next,
      );
    };
    update();
    const scroller = scrollRef.current;
    scroller?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  });

  if (!copied) return null;

  // daysOfWeek empieza en lunes; getDay() en domingo
  const dayName = daysOfWeek[(copied.date.getDay() + 6) % 7];
  const text = [`${dayName} ${copied.date.getDate()}`, copied.row.getDisplayText(copied.date.save())]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      ref={badgeRef}
      aria-live="polite"
      // -translate-y-full: queda justo encima de la celda, sobre el hueco con la fila anterior
      className={`pointer-events-none absolute z-30 flex max-w-[220px] -translate-y-full items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium shadow-sm transition-[left,top,opacity] duration-150 ${
        canPaste ? "bg-dark-green text-white-green" : "bg-gray-blue-200 text-text-muted"
      } ${hidden || !position ? "opacity-0" : "opacity-90"}`}
      style={{ left: position?.left ?? 0, top: position?.top ?? 0 }}
    >
      <ClipboardCopy className="size-2.5 shrink-0" aria-hidden />
      <span className="sr-only">{t("data:dashboardTable.actions.clipboard")}</span>
      <span className="truncate">{text}</span>
    </div>
  );
};

export default ClipboardBadge;
