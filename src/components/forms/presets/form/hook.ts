import useForm from "@src/hooks/form";
import type { InputState } from "@src/hooks/form/types";
import {
    useFetchMeals,
    useFetchTypesForAllMeals
} from "@src/services/tanstack/data/meals";
import { createContext, useContext, useMemo } from "react";

type Meal = NonNullable<ReturnType<typeof useFetchMeals>["data"]>[number];
type MealTypeRows = NonNullable<ReturnType<typeof useFetchTypesForAllMeals>[number]["data"]>;

export const fieldIds = {
    name: "name",
    comment: "comment",
    meal: {
        generateId: (mealId: number) => `meal-${mealId}`,
        isId: (fieldId: string) => fieldId.startsWith("meal-"),
        parseId: (fieldId: string) => {
            const prefix = "meal-";
            if (!fieldId.startsWith(prefix)) return null;
            const idPart = fieldId.slice(prefix.length);
            const id = parseInt(idPart, 10);
            return isNaN(id) ? null : id;
        }
    },
    trainingHc: {
        generateId: (index: number) => `training-hc-${index}`,
        isId: (fieldId: string) => fieldId.startsWith("training-hc-"),
        parseId: (fieldId: string) => {
            const prefix = "training-hc-";
            if (!fieldId.startsWith(prefix)) return null;
            const indexPart = fieldId.slice(prefix.length);
            const index = parseInt(indexPart, 10);
            return isNaN(index) ? null : index;
        }
    },

} as const;

const nameField = {
    id: fieldIds.name,
    type: "text",
    currentValue: "",
    inputProps: {
        label: "forms:preset.fields.name",
    },
} as InputState<"text">;

const commentField = {
    id: fieldIds.comment,
    type: "textarea",
    currentValue: "",
    inputProps: {
        label: "forms:preset.fields.comment",
    },
} as InputState<"textarea">;

const createFieldForMeal = (meal: Meal, mealOptions: MealTypeRows | undefined) => {

    const unselectableOption = {
        value: "",
        label: " - ",
    };

    const options = mealOptions ? [unselectableOption, ...mealOptions.map((option) => ({
        value: option.type_id?.id?.toString(),
        label: option.type_id?.name,
    }))] : [unselectableOption];

    return {
        id: fieldIds.meal.generateId(meal.id),
        type: "selectOne",
        currentValue: "",
        inputProps: {
            label: meal.name,
            options
        },
    } as InputState<"selectOne">;
};

const createFieldForTrainingHc = (hcData: number[]) => {
    return hcData.map((hcId, index) => ({
        id: fieldIds.trainingHc.generateId(index),
        type: "numeric",
        currentValue: hcId || "",
        inputProps: {
            label: `${index + 1} H`,
        },
        isHidden: index > 4, // only show up to 5 HC fields by default
        controllers: [{
            subscribedIds: [
                fieldIds.trainingHc.generateId(index),
                fieldIds.trainingHc.generateId(index + 1)
            ],
            update: (hc1, hc2) => {
                if (!hc1.currentValue) {
                    return []; // if current HC is empty, do nothing
                }
                hc2.isHidden = false; // show next HC field
                return [hc2];
            }
        }]
    } as InputState<"numeric">));
};


const useCreateConfig = () => {
    const mealsQuery = useFetchMeals();
    const mealOptionsQueries = useFetchTypesForAllMeals(
        (mealsQuery.data ?? []).map((meal) => meal.id)
    );

    const mealsConfig = useMemo(() => {
        if (!mealsQuery.data) return [];
        return mealsQuery.data.map((meal) =>
            createFieldForMeal(
                meal,
                mealOptionsQueries.find((query) => query.data?.some((option) => option.meal_id === meal.id))?.data
            ),
        );
    }, [mealsQuery.data, mealOptionsQueries]);

    const trainingHcConfig = useMemo(() => {
        const hcData = Array.from({ length: 24 }, () => 0);
        return createFieldForTrainingHc(hcData);
    }, []);

    return [nameField, commentField, ...mealsConfig, ...trainingHcConfig];
};

export const useFormPreset = () => {
    const config = useCreateConfig();
    const formPreset = useForm({
        config,
    });

    return formPreset;
}

export const Context = createContext<ReturnType<typeof useFormPreset> | null>(null);

export const useContextFormPreset = () => {
    return useContext(Context);
}
