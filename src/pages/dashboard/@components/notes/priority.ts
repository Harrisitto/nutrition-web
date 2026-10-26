import type { NotePriority } from "@src/services/tanstack/data/notes";

// Clave de traduccion (data:notes.priorities.*) y estilo de cada prioridad. Alta y urgente llevan
// icono y texto: el color nunca va solo
export const PRIORITY_STYLES: Record<NotePriority, { key: string; className: string }> = {
  0: { key: "normal", className: "bg-white-green text-dark-green" },
  1: { key: "high", className: "bg-amber-50 text-amber-700" },
  2: { key: "urgent", className: "bg-red-50 text-red-700" },
};
