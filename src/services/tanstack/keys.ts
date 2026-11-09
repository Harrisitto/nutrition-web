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
    // Planificación de todos los clientes (p.ej. al borrar un documento adjunto a varios)
    planingAllUsers: ["user", "planing"],
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
    // Ingredientes añadidos a las comidas planificadas (user_planing_meal_ingredients)
    mealIngredientsBase: ["user", "mealIngredients", userId],
    mealIngredients: (start: string, end: string) => [
      "user",
      "mealIngredients",
      userId,
      language,
      start,
      end,
    ],
    // Kcal y macros diarios calculados por la RPC calculate_macros_for_date_range
    macrosBase: ["user", "macros", userId],
    macros: (start: string, end: string) => [
      "user",
      "macros",
      userId,
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
    // Presets con user_id null del nutricionista `userId`, compartidos por todos sus clientes
    globalPresets: ["user", "presets", "global", userId],
    presetsBase: ["user", "presets"],
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
    // Recetas propias cuyo dueño (owner_id) es `userId`: un cliente o el propio nutricionista
    // Prefijo de las recetas propias de todos los dueños (cliente y nutricionista)
    customRecipesAll: ["user", "customRecipes"],
    customRecipesBase: ["user", "customRecipes", userId],
    customRecipes: ["user", "customRecipes", userId, language],
    // Bajo customRecipesAll (se invalida al guardar), pero fuera de customRecipesBase: su cache es InfiniteData
    customRecipesForTypeBase: ["user", "customRecipes", "forType"],
    customRecipesForType: (typeId?: number) => ["user", "customRecipes", "forType", userId, typeId ?? null, searchStr],
    notes: {
      // Fechas "YYYY-MM-DD", ambas incluidas
      range: (start: string, end: string) => ["user", "notes", userId, "range", start, end],
      search: (search: string) => ["user", "notes", userId, "search", search],
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
      pending: ["nutritionist", "calendar", userId, "pending"],
    },
  },
  data: {
    meals: ["data", "meals", language],
    allTypes: ["data", "allTypes", language],
    // Busqueda paginada (InfiniteData): prefijo propio, no comparte cache con allTypes
    recipeTypesBase: ["data", "recipeTypes"],
    recipeTypes: ["data", "recipeTypes", language, searchStr],
    recipeType: (id: number | null) => ["data", "recipeType", language, id],
    orderedTypes: ["data", "orderedTypes", language],
    measures: ["data", "measures"],
    receipts: ["data", "receipts"],
    videos: ["data", "videos", userId],
    documents: ["data", "documents", userId],
    singleRecipe: (id: number) => ["data", "recipe", id, language],
    // Prefijo de todas las busquedas de recetas del idioma
    recipesBase: ["data", "recipes", language],
    recipes: (typeIds: number[]) => ["data", "recipes", language, searchStr, [...typeIds].sort((a, b) => a - b)],
    // Fuera de recipesBase: su cache es InfiniteData, no un array
    topRecipesBase: ["data", "topRecipes"],
    topRecipesForUser: (typeId?: number) => ["data", "topRecipes", language, userId, typeId ?? null, searchStr],
    raceIngredients: ["data", "raceIngredients", userId],
    customIngredients: ["data", "customIngredients", language],
    // Id del recipe_type "receta propia" (RPC custom_recipe_type_id): no cambia
    customRecipeTypeId: ["data", "customRecipeTypeId"],
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
