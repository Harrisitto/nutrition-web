import { cardStyle } from "@src/components/styles";

// Estilos compartidos por la página de carreras
export const sectionStyle = `${cardStyle} flex flex-col gap-5 p-5`;

export const secondaryButtonStyle =
  "inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-nutrition-green transition-colors hover:bg-white-green/60";

// Fila de las listas de carreras, tomas y puntos de interés
export const listItemStyle = (hasError = false) =>
  `rounded-lg border bg-white px-3 py-2 ${
    hasError ? "border-red-400" : "border-nutrition-green/20"
  }`;

export const emptyTextStyle = "p-4 text-sm text-text-muted";
