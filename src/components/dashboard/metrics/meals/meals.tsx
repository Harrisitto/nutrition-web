import { AnimationLoading } from "@src/components/global/Animations";
import { fromDate } from "@src/helpers/dates";
import { useDaysOfWeek } from "@src/hooks/helpers/language";
import { useFetchMeals } from "@src/services/tanstack/data/meals";
import { useFetchPlanning } from "@src/services/tanstack/user/planing";
import type { FetchPlanningType } from "@src/services/tanstack/user/planing";
import { Fragment, useMemo } from "react";
import {
  generatePlaningKey,
  generateTrainingKey,
  getDateForDayIndex,
  getDayIndexForDate,
  getDayOfMonth,
} from "./helper";
import {
  CornerCell,
  HCCell,
  HCHeaderCell,
  HeaderCell,
  KcalCell,
  MealCell,
  MealNameCell,
  ResumeHeaderCell,
} from "./cells";
import { useTranslation } from "react-i18next";
import { useFetchTraining } from "@src/services/tanstack/user/training";

export const WeeklyMeals = ({
  startMonday,
  endSunday,
}: {
  startMonday?: Date;
  endSunday?: Date;
}) => {
  const { t } = useTranslation();
  const startDate = startMonday || fromDate().nextMonday();
  const endDate = endSunday || fromDate(startDate).nextSunday();
  const mealsQuery = useFetchMeals();
  const daysOfWeek = useDaysOfWeek();
  const planing = useFetchPlanning({
    startDate,
    endDate,
  });
  const training = useFetchTraining({
    startDate,
    endDate,
  });

  const meals = mealsQuery.data ?? [];
  const planningMap = useMemo(() => {
    const data = planing.data ?? [];
    const map = new Map<string, FetchPlanningType>(
      data.map(
        (plan) =>
          [
            generatePlaningKey(plan.meal_id.toString(), new Date(plan.date)),
            plan,
          ] as const,
      ),
    );
    return map;
  }, [planing.data]);

  const trainingMap = useMemo(() => {
    const data = training.data ?? [];
    const map = new Map<string, number[]>();
    data.forEach((plan) => {
      map.set(generateTrainingKey(new Date(plan.date)), plan.training_hc ?? []);
    });
    return map;
  }, [training.data]);

  const kcalState = useMemo(() => {
    if (!planing.data) return Array(daysOfWeek.length).fill(0);
    const kcalPerDay = Array(daysOfWeek.length).fill(0);
    planing.data.forEach((plan) => {
      const date = new Date(plan.date);
      const dayIndex = getDayIndexForDate(startDate, date);
      if (dayIndex >= 0 && dayIndex < daysOfWeek.length) {
        kcalPerDay[dayIndex] += plan.type_id.macros_id.kcal;
      } else {
        console.error(
          "Plan date is out of range for the current week:",
          plan.date,
        );
      }
    });
    return kcalPerDay;
  }, [planing.data, startDate, daysOfWeek.length]);

  const maxHours = useMemo(() => {
    if (!training.data || training.data.length === 0) return 0;
    return Math.max(
      0,
      ...training.data.map((plan) => plan.training_hc?.length ?? 0),
    );
  }, [training.data]);

  if (mealsQuery.isLoading || planing.isLoading) return <AnimationLoading />;
  if (mealsQuery.error || planing.error) return <div>Error loading data</div>;

  return (
    <div className="overflow-x-auto">
      <div className="shadow-lg rounded-lg bg-white-green/10 p-4">
        <div className="grid gap-px grid-cols-[min-content_repeat(7,_1fr)]">
          {/* Header */}
          <CornerCell />
          {daysOfWeek.map((day, dayIndex) => (
            <HeaderCell
              key={dayIndex}
              dayOfWeek={day}
              dayOfMonth={getDayOfMonth(startDate, dayIndex)}
            />
          ))}
          {/* Body */}
          {meals.map((meal) => (
            <Fragment key={meal.id}>
              <MealNameCell name={meal.name} />

              {daysOfWeek.map((_, dayIndex) => {
                const date = getDateForDayIndex(startDate, dayIndex);
                const planKey = generatePlaningKey(meal.id.toString(), date);
                const plan = planningMap.get(planKey);
                if (!plan) {
                  return (
                    <MealCell
                      key={planKey}
                      plan={{
                        meal_id: meal.id,
                        date: date.toISOString(),
                        type_id: {
                          name: "-",
                        },
                      }}
                    />
                  );
                }
                return <MealCell key={planKey} plan={plan} />;
              })}
            </Fragment>
          ))}
          {/** Training HC */}
          <HCHeaderCell />

          {Array.from({ length: maxHours + 1 }).map((_, hourIndex) => (
            <Fragment key={hourIndex}>
              <MealNameCell name={`${hourIndex + 1}h`} />
              {daysOfWeek.map((_, dayIndex) => {
                const date = getDateForDayIndex(startDate, dayIndex);
                const training = trainingMap.get(generateTrainingKey(date));
                return (
                  <HCCell
                    key={`hc-${hourIndex}`}
                    hourIndex={hourIndex}
                    dayHc={training ?? []}
                    date={getDateForDayIndex(startDate, dayIndex)}
                  />
                );
              })}
            </Fragment>
          ))}

          <ResumeHeaderCell />

          {/** Daily kCal*/}
          <MealNameCell name={t("data:misc.Kcal")} />
          {kcalState.map((kcal, index) => (
            <KcalCell key={`kcal-${index}`} kcal={kcal} />
          ))}
        </div>
      </div>
    </div>
  );
};
