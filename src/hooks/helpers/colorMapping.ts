export const APP_DOT_COLOR_CLASSES = [
  "bg-emerald-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-lime-500",
  "bg-blue-500",
  "bg-orange-500",
  "bg-fuchsia-500",
  "bg-teal-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-sky-500",
  "bg-emerald-700",
  "bg-rose-700",
  "bg-cyan-700",
  "bg-amber-700",
  "bg-violet-700",
  "bg-lime-700",
  "bg-blue-700",
  "bg-orange-700",
  "bg-fuchsia-700",
  "bg-teal-700",
  "bg-red-700",
  "bg-indigo-700",
  "bg-pink-700",
  "bg-yellow-600",
  "bg-sky-700",
] as const;

const COLOR_CLASS_TO_HEX: Record<(typeof APP_DOT_COLOR_CLASSES)[number], string> = {
  "bg-emerald-500": "#10b981",
  "bg-rose-500": "#f43f5e",
  "bg-cyan-500": "#06b6d4",
  "bg-amber-500": "#f59e0b",
  "bg-violet-500": "#8b5cf6",
  "bg-lime-500": "#84cc16",
  "bg-blue-500": "#3b82f6",
  "bg-orange-500": "#f97316",
  "bg-fuchsia-500": "#d946ef",
  "bg-teal-500": "#14b8a6",
  "bg-red-500": "#ef4444",
  "bg-indigo-500": "#6366f1",
  "bg-pink-500": "#ec4899",
  "bg-yellow-500": "#eab308",
  "bg-sky-500": "#0ea5e9",
  "bg-emerald-700": "#047857",
  "bg-rose-700": "#be123c",
  "bg-cyan-700": "#0e7490",
  "bg-amber-700": "#b45309",
  "bg-violet-700": "#6d28d9",
  "bg-lime-700": "#4d7c0f",
  "bg-blue-700": "#1d4ed8",
  "bg-orange-700": "#c2410c",
  "bg-fuchsia-700": "#a21caf",
  "bg-teal-700": "#0f766e",
  "bg-red-700": "#b91c1c",
  "bg-indigo-700": "#4338ca",
  "bg-pink-700": "#be185d",
  "bg-yellow-600": "#ca8a04",
  "bg-sky-700": "#0369a1",
};

export const getDeterministicMeasureColorClass = (measureId: number) => {
  const paletteSize = APP_DOT_COLOR_CLASSES.length;
  // Keep modulo-based infinite wrapping, but permute indices so adjacent ids
  // map to visually separated colors.
  const normalizedId = ((measureId % paletteSize)) ;
  return APP_DOT_COLOR_CLASSES[normalizedId];
};

export const getChartColorFromClass = (colorClass?: string) => {
  if (!colorClass) return "#64748b";
  return COLOR_CLASS_TO_HEX[colorClass as keyof typeof COLOR_CLASS_TO_HEX] ?? "#64748b";
};
