export const queryKeys = {
    user: {
        single: (userId: string) => ["user", "single", userId],
        fromNutritionist: ["user", "myUsers"],
        formBrand: ["user", "brandUsers"],
        planingBase: (userId: string | null) => ["user", "planing", userId],
        planing: (userId: string | null, start: string, end: string) => ["user", "planing", userId, start, end],
        trainingBase: (userId: string | null) => ["user", "training", userId],
        training: (userId: string | null, start: string, end: string) => ["user", "training", userId, start, end],
    },
    data: {
        meals: (lang: string) => ["data", "meals", lang],
        receiptsForMeal: (mealId: number) => ["data", "receiptsForMeal", mealId],
        measures: ["data", "measures"],
        receipts: ["data", "receipts"],
        videos: ["data", "videos"],
    }
}