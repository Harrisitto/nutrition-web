// Clases Tailwind compartidas entre páginas (tarjetas, botones, input de fichero)

export const cardStyle =
  "rounded-2xl border border-nutrition-green/20 bg-gradient-to-br from-white to-white-green/70 shadow-md";

export const primaryButtonStyle =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-nutrition-green px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50";

export const deleteButtonStyle =
  "shrink-0 rounded-md p-1.5 text-red-500 transition hover:bg-red-50 disabled:opacity-50";

export const fileInputStyle =
  "w-full text-sm text-gray-blue-700 file:mr-3 file:rounded-md file:border-0 file:bg-white-green file:px-3 file:py-1 file:text-dark-green";

// Botón de solo icono, en verde (acción principal: añadir, crear)
export const primaryIconButtonStyle =
  "inline-flex shrink-0 items-center justify-center rounded-lg bg-nutrition-green p-2 text-white transition hover:opacity-90 disabled:opacity-50";

// Botón de solo icono, sin fondo (acciones secundarias: editar, guardar, cancelar)
export const iconButtonStyle =
  "shrink-0 rounded-md p-1.5 text-nutrition-green transition hover:bg-white-green/60 disabled:opacity-50";
