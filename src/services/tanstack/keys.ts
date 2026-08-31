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
    mealsBase: ["user", "meals", userId],
    meals: (start: string, end: string) => [
      "user",
      "meals",
      userId,
      language,
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
  },
  auth: {
    profile: ["auth", "profile", userId],
    session: ["auth", "session"],
    subscription: ["auth", "subscription", userId],
  },
});
