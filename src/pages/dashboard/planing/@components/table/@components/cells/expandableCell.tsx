import type { ReactNode } from "react";

interface ExpandableCellProps {
  /** Fuerza el estado expandido (p. ej. la celda seleccionada por teclado) */
  isExpanded?: boolean;
  children: ReactNode;
}

/**
 * Reserva en el flujo de la tabla la altura de un chip de una sola línea
 * (h-7) y pinta el chip encima en `position: absolute`. Así, cuando el
 * contenido se despliega (hover o selección) crece desde el centro, hacia
 * arriba y hacia abajo por igual, tapando las celdas vecinas en lugar de
 * estirar toda la fila. Al expandirse también gana algo de ancho
 * (-inset-x-3) para que el texto necesite menos líneas. El ring exterior
 * del color de la tabla separa el chip expandido de los que tapa; sin
 * expansión no se ve, porque cae en el hueco entre celdas.
 *
 * El fondo opaco (mismo color que la tabla) evita que el contenido de debajo
 * se transparente a través de los chips translúcidos; sin expansión el
 * resultado es visualmente idéntico. z-[5] queda por debajo de la columna
 * de etiquetas sticky (z-10) para no taparla al hacer scroll horizontal.
 */
const ExpandableCell = ({
  isExpanded = false,
  children,
}: ExpandableCellProps) => (
  <div className="relative h-7">
    <div
      className={`absolute top-1/2 -translate-y-1/2 rounded-lg bg-white-green ring-2 ring-white-green ${
        isExpanded
          ? "-inset-x-3 z-[5]"
          : "inset-x-0 hover:-inset-x-4 hover:z-[5]"
      }`}
    >
      {children}
    </div>
  </div>
);

export default ExpandableCell;
