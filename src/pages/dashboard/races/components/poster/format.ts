// Números de la imagen con el separador decimal del idioma (37,5 km en castellano)
export const formatNumber = (value: number, language: string, maximumFractionDigits = 1) =>
  new Intl.NumberFormat(language, { maximumFractionDigits }).format(value);
