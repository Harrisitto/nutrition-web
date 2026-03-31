export const TABLE_USER_PLANING_MEAL = {
    NAME: 'user_planing_meal',
    COLS: {
        MEAL_ID: 'meal_id',
        PLANING_ID: 'planing_id',
        TYPE_ID: 'type_id',
    }
} as const

export const TABLE_USER_PLANING = {
    NAME: 'user_planing',
    COLS: {
        ID: 'id',
        USER_ID: 'user_id',
        DATE: 'date',
        TRAINING_HC: 'training_hc',
    }
} as const

export const TABLE_RECIPE_TYPES = {
    NAME: 'recipe_type',
    COLS: {
        ID: 'id',
        MACROS_ID: 'macros_id',
        CODE: 'code',
        NAME: 'name',
    }
} as const

export const TABLE_ALL_MACROS = {
    NAME: 'all_macros',
    COLS: {
        ID: 'id',
        KCAL: 'kcal',
        PROTEIN: 'prot',
        CARBS: 'hc',
        FAT: 'fat',
    }
} as const

export const TABLE_ALL_MEASURES = {
    NAME: 'all_measures',
    COLS: {
        ID: 'id',
        NAME: 'name',
        UNITS: 'units',
        DESCRIPTION: 'description',
    }
} as const

export const TABLE_USER_PRESET = {
    NAME: 'user_preset',
    COLS: {
        ID: 'id',
        USER_ID: 'user_id',
        NAME: 'name',
        TRAINING_HC: 'training_hc',
        COMMENT: 'comment',
    }
} as const

export const TABLE_USER_PRESET_MEAL = {
    NAME: 'user_preset_meal',
    COLS: {
        PRESET_ID: 'preset_id',
        MEAL_ID: 'meal_id',
        TYPE_ID: 'type_id',
    }
} as const

export const TABLE_USER_INFO = {
    NAME: 'user_info',
    COLS: {
        USER_ID: 'user_id',
    }
} as const

export const TABLE_ALL_USERS = {
    NAME: 'all_users',
    COLS: {
        USER_ID: 'user_id',
        NUTRI_ID: 'nutri_id',
        IS_NUTRI: 'is_nutritionist',
        BRAND_ID: 'brand_id',
        IS_OWNER: 'is_owner',
        CREATED_AT: 'created_at',
    }
} as const

export const TABLE_ALL_MEALS = {
    NAME: 'all_meals',
    COLS: {
        ID: 'id',
        ORDER: 'order',
        NAME: 'name',
    }
} as const

export const TABLE_RECIPE_TYPE_MEALS = {
    NAME: 'recipe_type_meal',
    COLS: {
        MEAL_ID: 'meal_id',
        TYPE_ID: 'type_id',
    }
} as const

export const TABLE_USER_MEASURES = {
    NAME: 'user_measures',
    COLS: {
        USER_ID: 'user_id',
        MEASURE_ID: 'measure_id',
        DATE: 'date',
        VALUE: 'value',
    }
} as const
        
