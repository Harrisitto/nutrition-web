import { useFetchPlanning } from "@src/services/tanstack/user/planing";
import { generateMealKey, generatePlaningKey, getDayIndexForDate } from "../helper";
import { useMemo } from "react";
import { saveDate } from "@src/helpers/dates";

const daysInWeek = 7;

export const usePlaning = ({
    startDate,
    endDate,
}: {
    startDate: Date;
    endDate: Date;
}) => {
    /**
     * Fetches the meal planning data for the specified date range using the useFetchPlanning hook.
     */
    const planing = useFetchPlanning({
        startDate,
        endDate,
    });

    /**
     * Maps meal planning data to a structure that allows quick access to meal plans for each meal and date.
     */
    const planningMap = useMemo(() => {
        const data = planing.data ?? [];
        const map = new Map(
            data.map((plan) => {
                return [
                    generatePlaningKey(plan.date),
                    plan,
                ] as const
            }),
        );
        return map;
    }, [planing.data]);

    const mealsMap = useMemo(() => {
        const data = planing.data ?? [];
        const map = new Map(
            data.flatMap((plan) => {
                return plan.user_planing_meal.map((meal) => {
                    return [
                        generateMealKey(meal.meal_id, plan.date),
                        meal,
                    ] as const
                });
            }),
        );
        return map;
    }, [planing.data]);

    /**
     * Calculates the total kcal for each day of the week based on the meal planning data. 
     * This is used to display the total kcal for each day in the meals table.
     */
    const kcalState = useMemo(() => {
        const kcalPerDay: number[] = Array(daysInWeek).fill(0);
        if (!planing.data) return kcalPerDay;
        planing.data.forEach((plan) => {
            const date = new Date(plan.date);
            const dayIndex = getDayIndexForDate(startDate, date);
            if (dayIndex < 0 || dayIndex >= daysInWeek) {
                console.warn(`Planing date ${saveDate(date)} is out of range for the current week starting on ${saveDate(startDate)}`);
                return; // Skip meals that are outside the current week
            }
            kcalPerDay[dayIndex] = plan.user_planing_meal.reduce((total, meal) => {
                return total + meal.type_id.macros_id.kcal;
            }, 0);
        });
        return kcalPerDay;
    }, [planing.data, startDate]);

    const maxTrainingHours = useMemo(() => {
        if (!planing.data || planing.data.length === 0) return 0;
        return Math.max(
            0,
            ...planing.data.map((plan) => plan.training_hc?.length ?? 0),
        ) + 1; // +1 for the extra hour
    }, [planing.data]);

    return {
        planningMap,
        mealsMap,
        maxTrainingHours,
        kcalState,
    };
}