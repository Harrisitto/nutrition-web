import type { Database } from "./types"

export const tableUsers = "all_users"
export const tableAllBrands = "all_brands"
export const tableAllMeals = "all_meals"
export const tableAllMeasures = "all_measures"
export const tableAllReceipts = "all_receipts"
export const tableAllVideos = "all_videos"
export const tableBrandInfo = "brand_info"
export const tableReceiptTypes = "receipt_types"
export const userMeasures = "user_measures"
export const userPlanning = "user_planing"

const tables: Record<string, keyof Database['public']['Tables']> = {
    users: tableUsers,
    allBrands: tableAllBrands,
    allMeals: tableAllMeals,
    allMeasures: tableAllMeasures,
    allReceipts: tableAllReceipts,
    allVideos: tableAllVideos,
    brandInfo: tableBrandInfo,
    receiptTypes: tableReceiptTypes,
    userMeasures: userMeasures,
    userPlanning: userPlanning,
}

export const colsTableUsers = {
    brandId: 'brand_id',
    createdAt: 'created_at',
    isNutritionist: 'is_nutritionist',
    isOwner: 'is_owner',
    nutriId: 'nutri_id',
    userId: 'user_id',
} as const

export const colsTableAllBrands = {
    id: 'id',
} as const

export const colsTableAllMeals = {
    id: 'id',
    name: 'name',
} as const

export const colsTableAllMeasures = {
    id: 'id',
    name: 'name',
    description: 'description',
    units: 'units',
} as const

export const colsTableAllReceipts = {
    id: 'id',
    name: 'name',
    description: 'description',
    url: 'url',
    foodTypeId: 'food_type_id',
    ingredients: 'ingredients',
} as const

export const colsTableAllVideos = {
    id: 'id',
    name: 'name',
    description: 'description',
    url: 'url',
    lang: 'lang',
    userId: 'user_id',
} as const 

export const colsTableBrandInfo = {
    brandId: 'brand_id',
    name: 'name',
    email: 'email',
    phoneNumber: 'phone_number',
    location: 'location',
    description: 'description',
    webUrl: 'web_url',
    socialMediaUrl: 'social_media_url',
    logoUrl: 'logo_url',
} as const 

export const colsTableReceiptTypes = {
    id: 'id',
    name: 'name',
    code: 'code',
    macrosId: 'macros_id',
} as const

export const colsTableUserMeasures = {
    id: 'id',
    userId: 'user_id',
    measureId: 'measure_id',
    relationship: 'relationship',
    date: 'date',
} as const

export const colsTableUserPlanning = {
    id: 'id',
    userId: 'user_id',
    mealId: 'meal_id',
    typeId: 'type_id',
    date: 'date',
} as const

export { tables }
