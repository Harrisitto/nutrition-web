import { saveDate } from "@src/helpers/dates";

export const queryKeys = ({
    userId = '',
    language = '',
    searchStr = '',
} : {
    userId?: string | null;
    language?: string;
    searchStr?: string;
} = {}) => ({
    user: {
        invitationsBase : ["user", "invitations", userId],
        invitations: (code: string) => ["user", "invitations", userId, code],
        single: ["user", "single", userId],
        fromNutritionist: ["user", "myUsers", userId],
        formBrand: ["user", "brandUsers"],
        planingBase: ["user", "planing", userId],
        planing: (start: string, end: string) => ["user", "planing", userId, start, end],
        trainingBase: ["user", "training", userId],
        training: (start: string, end: string) => ["user", "training", userId, start, end],
        presets: ["user", "presets", userId],
        measuresBase: ["user", "measuresBase", userId],
        basalMetabolicRate: (startDate: Date, endDate: Date) => ["user", "measuresBase", userId, "bmr", saveDate(startDate), saveDate(endDate)],
        weightForDateRange: (startDate: Date, endDate: Date) => ["user", "measuresBase", userId, "weight", saveDate(startDate), saveDate(endDate)],
        measuresForDateRange: (startDate: Date, endDate: Date) => ["user", "measuresBase", userId, saveDate(startDate), saveDate(endDate)],
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
  }
});
