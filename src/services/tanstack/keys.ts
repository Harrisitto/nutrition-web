import { saveDate } from "@src/helpers/dates";

export const queryKeys = ({
    userId = '',
    language = '',
} : {
    userId?: string | null;
    language?: string;
} = {}) => ({
    user: {
        single: ["user", "single", userId],
        fromNutritionist: ["user", "myUsers", userId],
        formBrand: ["user", "brandUsers"],
        planingBase: ["user", "planing", userId],
        planing: (start: string, end: string) => ["user", "planing", userId, start, end],
        trainingBase: ["user", "training", userId],
        training: (start: string, end: string) => ["user", "training", userId, start, end],
        presets: ["user", "presets", userId],
        basalMetabolicRate: (startDate: Date, endDate: Date) => ["user", "bmr", userId, saveDate(startDate), saveDate(endDate)],
        weightForDateRange: (startDate: Date, endDate: Date) => ["user", "weightForDateRange", userId, saveDate(startDate), saveDate(endDate)],
        measuresForDateRange: (startDate: Date, endDate: Date) => ["user", "measuresForDateRange", userId, saveDate(startDate), saveDate(endDate)],
    },
    data: {
        meals: ["data", "meals", language],
        typesForMeal: (mealId: number) => ["data", "receiptsForMeal", mealId, language],
        allTypes: ["data", "allTypes", language],
        measures: ["data", "measures"],
        receipts: ["data", "receipts"],
        videos: ["data", "videos"],
    }
});