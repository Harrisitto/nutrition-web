import { supabase } from "@src/services/supabase/client";
import { queryKeys } from "../keys";
import { TABLE_USER_PRESET, TABLE_USER_PRESET_MEAL } from "@src/services/supabase/definitions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { queryClient } from "../queryClient";
import { useAppSelector } from "@src/store/store";
import { useGetAuthSession } from "../auth/get";

type Preset = NonNullable<ReturnType<typeof useFetchPresets>["data"]>[number];

const selectFromMeal = (languageCode: ReturnType<typeof useLanguageCode>) => {
    return `*,
        ${TABLE_USER_PRESET_MEAL.NAME}(
        preset_id,
        meal_id(
            id,
            name: name->>${languageCode}
        ),
        type_id(
            *,
            name: name->>${languageCode}
        ))` as const;
}

const updatePresetList = (
    newPreset: Preset
) => {
    // Un preset global aparece en la lista de cada cliente: se refrescan todas
    if (newPreset.user_id === null) {
        queryClient.invalidateQueries({ queryKey: queryKeys().user.presetsBase });
        return;
    }
    queryClient.setQueryData<Preset[]>(
        queryKeys({
            userId: newPreset.user_id,
        }).user.presets,
        (oldData) => {
            if (!oldData) return [newPreset];
            const list = new Map(oldData.map(preset => [preset.id, preset]));
            list.set(newPreset.id, newPreset);
            return Array.from(list.values());
        }
    );
}

const removePresetFromList = (
    presetId: number,
    userId: string | null
) => {
    if (userId === null) {
        queryClient.invalidateQueries({ queryKey: queryKeys().user.presetsBase });
        return;
    }
    queryClient.setQueryData<Preset[]>(
        queryKeys({
            userId,
        }).user.presets,
        (oldData) => {
            if (!oldData) return [];
            return oldData.filter(preset => preset.id !== presetId);
        }
    );
}

// global: solo los presets con user_id null. Si no, los globales más los del cliente
export const useFetchPresets = ({ global = false }: { global?: boolean } = {}) => {
    const userId = useAppSelector((state) => state.config.selectedUserId);
    const { data: session } = useGetAuthSession();
    const nutriId = session?.userId;
    const languageCode = useLanguageCode();

    return useQuery({
        queryKey: global
            ? queryKeys({ userId: nutriId }).user.globalPresets
            : queryKeys({
                userId,
            }).user.presets,
        queryFn: async () => {
            const query = supabase
                .from(TABLE_USER_PRESET.NAME)
                .select(selectFromMeal(languageCode));

            if (global) {
                if (!nutriId) throw new Error("Nutritionist ID is required to fetch global presets");
                const { data, error } = await query
                    .is(TABLE_USER_PRESET.COLS.USER_ID, null)
                    .eq(TABLE_USER_PRESET.COLS.NUTRI_ID, nutriId);
                if (error) throw error;
                return data;
            }

            if (!userId) throw new Error("User ID is required to fetch presets");
            const { data, error } = await query.or(
                `${TABLE_USER_PRESET.COLS.USER_ID}.is.null,${TABLE_USER_PRESET.COLS.USER_ID}.eq.${userId}`,
            );

            if (error) throw error;
            return data;
        }
    })
}

export const useInsertPreset = ({ global = false }: { global?: boolean } = {}) => {
    const userId = useAppSelector((state) => state.config.selectedUserId);
    const { data: session } = useGetAuthSession();
    const nutriId = session?.userId;
    const languageCode = useLanguageCode();

    return useMutation({
        mutationFn: async ({
            name,
            comment,
            meals,
            training_hc = []
        }: {
            name: string;
            comment: string;
            training_hc?: number[];
            meals: {
                meal_id: number;
                type_id: number;
            }[];
        }) => {
            if (!global && !userId) throw new Error("User ID is required to insert preset");
            if (!nutriId) throw new Error("Nutritionist ID is required to insert preset");
            const { data, error } = await supabase
                .from(TABLE_USER_PRESET.NAME)
                .upsert({
                    [TABLE_USER_PRESET.COLS.USER_ID]: global ? null : userId,
                    [TABLE_USER_PRESET.COLS.NUTRI_ID]: nutriId,
                    [TABLE_USER_PRESET.COLS.NAME]: name,
                    [TABLE_USER_PRESET.COLS.COMMENT]: comment,
                    [TABLE_USER_PRESET.COLS.TRAINING_HC]: training_hc,
                })
                .select()
                .single();

            if (error) throw error;
            const presetId = data.id;

            const { error: mealsError } = await supabase
                .from(TABLE_USER_PRESET_MEAL.NAME)
                .insert(
                    meals.map((meal) => ({
                        [TABLE_USER_PRESET_MEAL.COLS.PRESET_ID]: presetId,
                        [TABLE_USER_PRESET_MEAL.COLS.MEAL_ID]: meal.meal_id,
                        [TABLE_USER_PRESET_MEAL.COLS.TYPE_ID]: meal.type_id,
                    }))
                );
            if (mealsError) throw mealsError;

            const { data: insertedPreset, error: fetchError } = await supabase
                .from(TABLE_USER_PRESET.NAME)
                .select(selectFromMeal(languageCode))
                .eq(TABLE_USER_PRESET.COLS.ID, presetId)
                .single();

            if (fetchError) throw fetchError;

            return insertedPreset;
        },
        onSuccess: (data) => {
            if (!data) return;
            updatePresetList(data);
        }
    })
}

export const useDeletePreset = ({ global = false }: { global?: boolean } = {}) => {
    const userId = useAppSelector((state) => state.config.selectedUserId);

    return useMutation({
        mutationFn: async (presetId: number) => {
            const query = supabase
                .from(TABLE_USER_PRESET.NAME)
                .delete()
                .eq(TABLE_USER_PRESET.COLS.ID, presetId);

            if (global) {
                const { error } = await query.is(TABLE_USER_PRESET.COLS.USER_ID, null);
                if (error) throw error;
                return presetId;
            }

            if (!userId) throw new Error("User ID is required to delete preset");
            const { error } = await query.eq(TABLE_USER_PRESET.COLS.USER_ID, userId);

            if (error) throw error;
            return presetId;
        },
        onSuccess: (presetId) => {
            if (global) {
                removePresetFromList(presetId, null);
                return;
            }
            if (!userId) return;
            removePresetFromList(presetId, userId);
        }
    })
}
