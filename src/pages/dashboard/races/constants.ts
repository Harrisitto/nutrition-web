// Orden de los pasos para planificar una carrera
export const RACE_STEPS = ["profile", "landmarks", "ingredients"] as const;

export type RaceStep = (typeof RACE_STEPS)[number];
