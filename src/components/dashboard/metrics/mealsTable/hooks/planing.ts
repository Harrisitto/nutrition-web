import { useFetchPlanning, type PlanningPageParam } from "@src/services/tanstack/user/planing";
import { generateMealKey, generatePlaningKey, getDayIndexForDate } from "../helper";
import { useMemo } from "react";
import { loadDate, saveDate } from "@src/helpers/dates";
import { useFetchBmr } from "@src/services/tanstack/user/info";
import { calculateKcalFromMacros } from "@src/hooks/helpers/constants";

const daysInWeek = 7;


export const usePlaning = ({
    forDate,
    pageIndex = 0,
}: {
    forDate?: Date;
    pageIndex?: number;
} = {}) => {
    /**
     * Fetches the meal planning data for the specified date range using the useFetchPlanning hook.
     */
    const planing = useFetchPlanning({
        forDate,
    });

    const bmrQuery = useFetchBmr();

    /**
     * Maps meal planning data to a structure that allows quick access to meal plans for each meal and date.
     */
    const planningMap = useMemo(() => {
        const data = planing.data?.pages[pageIndex] ?? [];
        const map = new Map(
            data.map((plan) => {
                return [
                    generatePlaningKey(plan.date),
                    plan,
                ] as const;
            }),
        );
        return map;
    }, [pageIndex, planing.data]);

    const mealsMap = useMemo(() => {
        const data = planing.data?.pages[pageIndex] ?? [];
        const map = new Map(
            data.flatMap((plan) => {
                return plan.user_planing_meal.map((meal) => {
                    return [
                        generateMealKey(meal.meal_id, plan.date),
                        meal,
                    ] as const;
                });
            }),
        );
        return map;
    }, [pageIndex, planing.data]);

    /**
     * Calculates the total kcal for each day of the week based on the meal planning data.
     * This is used to display the total kcal for each day in the meals table.
     */
    const kcalState = useMemo(() => {
        const kcalPerDay: {
            meals: number;
            training: number;
            total: number;
            balance: number;
        }[] = Array.from({ length: daysInWeek }, () => ({
            meals: 0,
            training: 0,
            total: 0,
            balance: 0,
        }));
        if (!planing.data) return kcalPerDay;
        const data = planing.data.pages[pageIndex] ?? [];
        const { start: startDate } = planing.data.pageParams[pageIndex] as PlanningPageParam;
        const fallbackStartDate = startDate ? loadDate(startDate) : new Date();
        
        data.forEach((plan) => {
            const date = new Date(plan.date);
            const dayIndex = getDayIndexForDate(fallbackStartDate, date);
            if (dayIndex < 0 || dayIndex >= daysInWeek) {
                console.warn(`Planing date ${saveDate(date)} is out of range for the current week starting on ${saveDate(fallbackStartDate)}`);
                return; // Skip meals that are outside the current week
            }
            kcalPerDay[dayIndex].meals = plan.user_planing_meal.reduce((total, meal) => {
                return total + meal.type_id.macros_id.kcal;
            }, 0);
            kcalPerDay[dayIndex].training = plan.training_hc.reduce((total, hc) => {
                return total + calculateKcalFromMacros({ carbs: hc, protein: 0, fat: 0 });
            }, 0);
            kcalPerDay[dayIndex].total = kcalPerDay[dayIndex].meals + kcalPerDay[dayIndex].training;
            kcalPerDay[dayIndex].balance = (bmrQuery.data ?? 0) - kcalPerDay[dayIndex].total;
        });

        return kcalPerDay;
    }, [forDate, pageIndex, planing.data]);

    const maxTrainingHours = useMemo(() => {
        const data = planing.data?.pages.flat() ?? [];
        if (data.length === 0) return 3; // Default to 3 training hours if no data is available

        const maxFilledHours = Math.max(
            3, // Minimum of 3 hours
            ...data.map((plan) => {
                const trainingHours = plan.training_hc ?? [];
                for (let index = trainingHours.length - 1; index >= 0; index--) {
                    if ((trainingHours[index] ?? 0) > 0) {
                        return index + 1;
                    }
                }
                return 0;
            }),
        );

        return Math.max(3, maxFilledHours + 1); // +1 for the next editable empty row
    }, [planing.data]);

    return {
        planningMap,
        mealsMap,
        maxTrainingHours,
        kcalState,
    };
};