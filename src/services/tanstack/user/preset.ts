import { supabase } from "@src/services/supabase/client";
import { queryKeys } from "../keys";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { queryClient } from "../queryClient";
import { useAppSelector } from "@src/store/store";
import { useGetAuthSession } from "../auth/get";

type Preset = NonNullable<ReturnType<typeof useFetchPresets>["data"]>[number];

const selectFromMeal = (languageCode: ReturnType<typeof useLanguageCode>) => {
    return `*,
        user_preset_meal(
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
                .from("user_preset")
                .select(selectFromMeal(languageCode));

            if (global) {
                if (!nutriId) throw new Error("Nutritionist ID is required to fetch global presets");
                const { data, error } = await query
                    .is("user_id", null)
                    .eq("nutri_id", nutriId);
                if (error) throw error;
                return data;
            }

            if (!userId) throw new Error("User ID is required to fetch presets");
            const { data, error } = await query.or(
                `user_id.is.null,user_id.eq.${userId}`,
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
                .from("user_preset")
                .upsert({
                    user_id: global ? null : userId,
                    nutri_id: nutriId,
                    name: name,
                    comment: comment,
                    training_hc: training_hc,
                })
                .select()
                .single();

            if (error) throw error;
            const presetId = data.id;

            const { error: mealsError } = await supabase
                .from("user_preset_meal")
                .insert(
                    meals.map((meal) => ({
                        preset_id: presetId,
                        meal_id: meal.meal_id,
                        type_id: meal.type_id,
                    }))
                );
            if (mealsError) throw mealsError;

            const { data: insertedPreset, error: fetchError } = await supabase
                .from("user_preset")
                .select(selectFromMeal(languageCode))
                .eq("id", presetId)
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
                .from("user_preset")
                .delete()
                .eq("id", presetId);

            if (global) {
                const { error } = await query.is("user_id", null);
                if (error) throw error;
                return presetId;
            }

            if (!userId) throw new Error("User ID is required to delete preset");
            const { error } = await query.eq("user_id", userId);

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
