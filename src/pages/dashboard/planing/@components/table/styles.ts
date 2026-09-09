// Look & feel shared across the whole weekly-meals table. Built only from the
// custom palette in tailwind.config.js — no `white`/`gray-*` fills, no border
// utilities. Structure comes from background contrast and spacing instead.

const headerVisual =
  "bg-nutrition-green px-3 py-2 text-xs font-bold uppercase tracking-wide text-white-green";

// Section-header rows span the full table width as a plain <td>, so this
// variant must stay block-level (a `<td>` can't be `display: flex`).
export const sectionHeaderTdStyle = `${headerVisual} text-center`;

// Same look, usable inside a <div>/<button> (row-label cell, preset-day cell).
export const sectionHeaderBoxStyle = `${headerVisual} flex h-full w-full flex-col items-center justify-center text-center`;

export const rowLabelStyle =
  "flex h-full min-w-[168px] flex-col justify-center gap-0.5 px-3 py-2 text-text-title";

// Base chip look shared by every interactive/data cell in the day columns.
export const cellChipStyle =
  "w-full cursor-pointer rounded-lg bg-fade-green/10 px-2 py-1.5 text-center text-xs font-medium text-text-body transition-colors";

export const displayChipStyle =
  "w-full rounded-lg bg-fade-green/10 px-2 py-1.5 text-center text-xs font-semibold text-dark-green";

// Keyboard-selection indicator for cells on the pale chip backgrounds
// (meal/numeric/text/display cells). Nutrition-blue has enough luminance
// contrast against those light fills to read clearly.
export const highlightRingStyle = "ring-2 ring-inset ring-nutrition-blue";

// Same indicator, for cells on the dark nutrition-green header bar (the
// preset row). Nutrition-blue and nutrition-green sit at almost the same
// luminance, so that ring all but disappears there — this uses the
// palette's lightest tone instead, which actually contrasts against a dark
// fill.
export const highlightRingOnDarkStyle = "ring-2 ring-inset ring-gray-blue-200";
