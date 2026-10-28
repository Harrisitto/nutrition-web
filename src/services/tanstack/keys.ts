import type FromDate from "@src/helpers/dates";

export const queryKeys = ({
  userId = "",
  language = "",
  searchStr = "",
}: {
  userId?: string | null;
  language?: string;
  searchStr?: string;
} = {}) => ({
  user: {
    invitationsBase: ["user", "invitations", userId],
    invitations: (code: string) => ["user", "invitations", userId, code],
    single: ["user", "single", userId],
    fromNutritionist: ["user", "myUsers", userId],
    formBrand: ["user", "brandUsers"],
    planingBase: ["user", "planing", userId],
    planing: (start: string, end: string) => [
      "user",
      "planing",
      userId,
      start,
      end,
    ],
    // Mismo prefijo que la semana: invalidar planingBase refresca tambien las busquedas
    planingSearch: (search: string) => ["user", "planing", userId, "search", search],
    mealsBase: ["user", "meals", userId],
    meals: (start: string, end: string) => [
      "user",
      "meals",
      userId,
      language,
      start,
      end,
    ],
    racesBase: ["user", "races", userId],
    racePlan: (raceId: number) => ["user", "races", userId, "plan", raceId],
    races: (start: string, end: string) => [
      "user",
      "races",
      userId,
      start,
      end,
    ],
    presets: ["user", "presets", userId],
    measuresBase: ["user", "measuresBase", userId],
    basalMetabolicRate: (startDate: FromDate, endDate: FromDate) => [
      "user",
      "measuresBase",
      userId,
      "bmr",
      startDate.save(),
      endDate.save(),
    ],
    weightForDateRange: (startDate: FromDate, endDate: FromDate) => [
      "user",
      "measuresBase",
      userId,
      "weight",
      startDate.save(),
      endDate.save(),
    ],
    measuresForDateRange: (startDate: FromDate, endDate: FromDate) => [
      "user",
      "measuresBase",
      userId,
      startDate.save(),
      endDate.save(),
    ],
    // Fuera de measuresBase: las mutaciones de mediciones insertan en todas sus listas
    measuresSearch: (search: string) => ["user", "measuresSearch", userId, language, search],
    appointments: {
      pendingClientPoints: ["user", "appointments", userId, "pendingClientPoints"],
      treatedClientPoints: ["user", "appointments", userId, "treatedClientPoints"],
      pending: ["user", "appointments", userId, "pending"],
      treated: ["user", "appointments", userId, "treated"],
      single: (appointmentId: number | null) => ["user", "appointments", userId, "single", appointmentId],
      themesWithPoints: ["user", "appointments", userId, "themesWithPoints"],
      undated: ["user", "appointments", userId, "undated"],
      pendingPoints: ["user", "appointments", userId, "pendingPoints"],
      // Prefijo de todas las anteriores: invalidarlo refresca todo lo de las consultas del cliente
      all: ["user", "appointments", userId],

    },
    notes: {
      // Fechas "YYYY-MM-DD", ambas incluidas
      range: (start: string, end: string) => ["user", "notes", userId, "range", start, end],
      search: (search: string) => ["user", "notes", userId, "search", search],
      pending: ["user", "notes", userId, "pending"],
      // Prefijo de todas las anteriores
      all: ["user", "notes", userId],
    },
  },
  // userId = el nutricionista: notas y consultas de todos sus clientes
  nutritionist: {
    // Prefijo sin userId: las mutaciones de cualquier cliente lo invalidan
    calendarBase: ["nutritionist", "calendar"],
    calendarNotes: (start: string, end: string) => ["nutritionist", "calendar", userId, "notes", start, end],
    calendarAppointments: (start: string, end: string) => ["nutritionist", "calendar", userId, "appointments", start, end],
    notes: {
      // Bajo calendarBase: cualquier mutacion de notas la refresca. Fecha "YYYY-MM-DD"
      scheduled: (date: string) => ["nutritionist", "calendar", userId, "scheduled", date],
    },
  },
  data: {
    meals: ["data", "meals", language],
    allTypes: ["data", "allTypes", language],
    orderedTypes: ["data", "orderedTypes", language],
    measures: ["data", "measures"],
    receipts: ["data", "receipts"],
    videos: ["data", "videos"],
    singleRecipe: (id: number) => ["data", "recipe", id, language],
    recipes: ["data", "recipes", language, searchStr],
    raceIngredients: ["data", "raceIngredients", userId],
    raceLandmarks: ["data", "raceLandmarks", language],
    appointmentThemes: ["data", "appointmentThemes"],
    appointmentPoints: (themeId: number) => ["data", "appointmentThemes", themeId, "points"],
  },
  auth: {
    profileBase: ["auth", "profile"],
    profile: ["auth", "profile", userId],
    session: ["auth", "session"],
    subscriptionBase: ["auth", "subscription"],
    subscription: ["auth", "subscription", userId],
  },
});
