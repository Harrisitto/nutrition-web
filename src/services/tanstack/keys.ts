export const queryKeys = {
    user: {
        single: (userId: string) => ["user", "single", userId],
        fromNutritionist: ["user", "myUsers"],
        formBrand: ["user", "brandUsers"],
        planingBase: (userId: string | null) => ["user", "planing", userId],
        planingDay: (userId: string | null, date: string) => ["user", "planing", userId, date],
        planing: (userId: string | null, start: string, end: string) => ["user", "planing", userId, start, end],
        trainingBase: (userId: string | null) => ["user", "training", userId],
        training: (userId: string | null, start: string, end: string) => ["user", "training", userId, start, end],
        presets: (userId: string | null) => ["user", "presets", userId],
    },
    data: {
        meals: (lang: string) => ["data", "meals", lang],
        typesForMeal: (mealId: number) => ["data", "receiptsForMeal", mealId],
        measures: ["data", "measures"],
        receipts: ["data", "receipts"],
        videos: ["data", "videos"],
    }
}