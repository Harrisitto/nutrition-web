import { useConfigSelectedUserId } from "@src/store/slices/config/hook";
import { fieldIds, useContextFormPreset } from "./hook";
import { useInsertPreset } from "@src/services/tanstack/user/preset";
import { useCallback } from "react";
import type { InputState } from "@src/hooks/form/types";
import { t } from "i18next";

export const useInsert = () => {
    const userId = useConfigSelectedUserId();
    const formPreset = useContextFormPreset();
    const insertPreset = useInsertPreset();

    const hadleSubmit = useCallback(async () => {
        if (!formPreset || !userId) return;
        const isValid = formPreset.form.validateForm();
        if (!isValid) return;
        const data = formPreset.form.getState();
        const name = data[fieldIds.name] as InputState<'text'>['currentValue'];
        const comment = data[fieldIds.comment] as InputState<'text'>['currentValue'];

        const multiValue = Object.entries(data).reduce((acc, [key, value]) => {
            if (fieldIds.meal.isId(key)) {
                const mealType = Number(value as InputState<'selectOne'>['currentValue']);
                const mealId = fieldIds.meal.parseId(key);
                if (mealType && mealId) {
                    acc.meals.push({
                        meal_id: mealId,
                        type_id: mealType,
                    });
                }
            } else if (fieldIds.trainingHc.isId(key)) {
                const trainingHcValue = value as InputState<'numeric'>['currentValue'];
                const trainingHcIndex = fieldIds.trainingHc.parseId(key);
                const numericTrainingHc = Number(trainingHcValue);
                if (
                    trainingHcIndex !== null &&
                    trainingHcValue !== "" &&
                    !Number.isNaN(numericTrainingHc)
                ) {
                    acc.trainingHc[trainingHcIndex] = numericTrainingHc;
                }
            }
            return acc;
        }, { meals: [], trainingHc: [] } as { meals: { meal_id: number; type_id: number }[]; trainingHc: number[] });

        const lastTrainingHcIndex = multiValue.trainingHc.reduce(
            (lastIndex, hc, index) => (Number.isNaN(hc) ? lastIndex : index),
            -1,
        );

        const trainingHc =
            lastTrainingHcIndex === -1
                ? []
                : Array.from({ length: lastTrainingHcIndex + 1 }, (_, index) => {
                    const hc = multiValue.trainingHc[index];
                    return typeof hc === "number" && !Number.isNaN(hc) ? hc : 0;
                });

        try {
            const result = await insertPreset.mutateAsync({
            name,
            comment,
            meals: multiValue.meals,
            training_hc: trainingHc,
            });
            if(!result.id) throw new Error("Invalid response from server: missing preset ID");
            formPreset.form.reset();
        } catch (error) {
            console.error("Error inserting preset:", error);
            alert(t("forms:preset.insertError"));
        }
        
    }, [formPreset, insertPreset, userId]);

    return {
        onSubmit: hadleSubmit,
    };
}