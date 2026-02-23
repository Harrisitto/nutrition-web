export const queryKeys = {
    user: {
        single: (userId: string) => ["user", "single", userId],
        fromNutritionist: ["user", "myUsers"],
        formBrand: ["user", "brandUsers"],
        planing: (userId: string | null, start: string, end: string) => ["user", "planing", userId, start, end],
    },
    data: {
        meals: (lang: string) => ["data", "meals", lang],
        measures: ["data", "measures"],
        receipts: ["data", "receipts"],
        videos: ["data", "videos"],
    }
}