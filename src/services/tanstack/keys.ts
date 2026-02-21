export const queryKeys = {
    user: {
        single: (userId: string) => ["user", "single", userId],
        fromNutritionist: (nutritionistId: string) => ["user", "fromNutritionist", nutritionistId],
        formBrand: (brandId: string) => ["user", "fromBrand", brandId],
    },
}