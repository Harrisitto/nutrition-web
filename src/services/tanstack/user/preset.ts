import { supabase } from "@src/services/supabase/client";
import { queryKeys } from "../keys";
import { TABLE_USER_PRESET, TABLE_USER_PRESET_MEAL } from "@src/services/supabase/definitions";
import { useConfigSelectedUserId } from "@src/store/slices/config/hook";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { queryClient } from "../queryClient";

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
            id,
            name: name->>${languageCode},
            all_macros(*)
        ))` as const;
}

const updatePresetList = (
    newPreset: Preset
) => {
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
    userId: string
) => {
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

export const useFetchPresets = () => {
    const userId = useConfigSelectedUserId();
    const languageCode = useLanguageCode();

    return useQuery({
        queryKey: queryKeys({
            userId,
        }).user.presets,
        queryFn: async () => {
            if (!userId) throw new Error("User ID is required to fetch presets");
            const { data, error } = await supabase
                .from(TABLE_USER_PRESET.NAME)
                .select(selectFromMeal(languageCode))
                .eq(TABLE_USER_PRESET.COLS.USER_ID, userId)

            if (error) throw error;
            return data;
        }
    })
}

export const useInsertPreset = () => {
    const userId = useConfigSelectedUserId();
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
            if (!userId) throw new Error("User ID is required to insert preset");
            const { data, error } = await supabase
                .from(TABLE_USER_PRESET.NAME)
                .upsert({
                    [TABLE_USER_PRESET.COLS.USER_ID]: userId,
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

export const useDeletePreset = () => {
    const userId = useConfigSelectedUserId();

    return useMutation({
        mutationFn: async (presetId: number) => {
            if (!userId) throw new Error("User ID is required to delete preset");
            const { error } = await supabase
                .from(TABLE_USER_PRESET.NAME)
                .delete()
                .eq(TABLE_USER_PRESET.COLS.ID, presetId)
                .eq(TABLE_USER_PRESET.COLS.USER_ID, userId);
            
            if (error) throw error;
            return presetId;
        },
        onSuccess: (presetId) => {
            if (!userId) return;
            removePresetFromList(presetId, userId);
        }
    })
}


