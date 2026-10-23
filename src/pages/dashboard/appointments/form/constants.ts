// Orden de los pasos: primero se guarda la consulta y despues se le añaden puntos
export const APPOINTMENT_STEPS = ["details", "points"] as const;

export type AppointmentStep = (typeof APPOINTMENT_STEPS)[number];
