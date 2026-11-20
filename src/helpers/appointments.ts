// Título de una consulta. description null en una con fecha (p.ej. las que crea
// nutri_client_themes_assign al asignar una temática) = los nombres de las temáticas de sus puntos,
// en orden alfabético. La sin fecha junta puntos de cualquier temática: no tiene título por defecto
export const appointmentTitle = (appointment: {
  description: string | null;
  scheduled_on: string | null;
  nutri_points: { theme_name: string | null }[];
}) => {
  if (appointment.description) return appointment.description;
  if (!appointment.scheduled_on) return "";
  const themeNames = new Set(
    appointment.nutri_points
      .map((point) => point.theme_name)
      .filter((name): name is string => !!name),
  );
  return [...themeNames].sort((a, b) => a.localeCompare(b)).join(", ");
};
