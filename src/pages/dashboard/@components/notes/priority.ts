import { NOTE_PRIORITY_MAX, NOTE_PRIORITY_MIN } from "@src/services/tanstack/data/notes";

// Estilo de la etiqueta segun el tramo de prioridad. Siempre va con icono y numero: el color
// nunca va solo
export const priorityClassName = (priority: number) => {
  if (priority >= 8) return "bg-red-50 text-red-700";
  if (priority >= 5) return "bg-amber-50 text-amber-700";
  return "bg-white-green text-dark-green";
};

// Entero dentro del rango permitido; lo que no es un numero cuenta como prioridad normal
export const clampPriority = (value: number) => {
  if (!Number.isFinite(value)) return NOTE_PRIORITY_MIN;
  return Math.min(NOTE_PRIORITY_MAX, Math.max(NOTE_PRIORITY_MIN, Math.round(value)));
};
