export const metricStyles = {
  row: "flex min-h-14 w-full flex-1 basis-[240px] items-start justify-between gap-3 rounded-xl border border-nutrition-green/20 bg-white/95 px-3 py-2.5 text-sm shadow-sm backdrop-blur-sm",
  label: "shrink-0 font-semibold uppercase tracking-[0.05em] text-dark-green/75",
  value: "min-w-0 text-right text-dark-green",
  link: "break-all font-semibold text-nutrition-green underline decoration-nutrition-green/45 underline-offset-2 transition-colors hover:text-dark-green",
  card: "w-full flex-1 basis-[320px] rounded-xl border border-nutrition-green/25 bg-white p-3 text-sm text-dark-green shadow-sm",
  cardTitle: "font-semibold uppercase tracking-[0.05em] text-dark-green/75",
  input:
    "mt-2 min-h-24 w-full resize-y rounded-lg border border-nutrition-green/40 bg-white p-3 text-sm leading-relaxed text-dark-green shadow-inner shadow-dark-green/5 outline-none transition focus:border-nutrition-green/60 focus:ring-2 focus:ring-light-green/55 placeholder:text-dark-green/45",
} as const;
