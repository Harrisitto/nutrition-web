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
        id: meal.id.toString(),
        type: "selectOne",
        currentValue: "",
        inputProps: {
            label: meal.name,
            options
        },
    } as InputState<"selectOne">;
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

    return [nameField, commentField, ...mealsConfig];
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
