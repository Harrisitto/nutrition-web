// Título de una consulta. description null en una con fecha (p.ej. las que crea
// assign_appointment_theme al asignar una temática) = los nombres de las temáticas de sus puntos,
// en orden alfabético. La sin fecha junta puntos de cualquier temática: no tiene título por defecto
export const appointmentTitle = (appointment: {
  description: string | null;
  scheduled_on: string | null;
  appointment_points: { client_themes: { theme_name: string } | null }[];
}) => {
  if (appointment.description) return appointment.description;
  if (!appointment.scheduled_on) return "";
  const themeNames = new Set(
    appointment.appointment_points
      .map((point) => point.client_themes?.theme_name)
      .filter((name): name is string => !!name),
  );
  return [...themeNames].sort((a, b) => a.localeCompare(b)).join(", ");
};
