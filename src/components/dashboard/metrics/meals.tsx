import { AnimationLoading } from "@src/components/global/Animations";
import { dateNextMonday, dateNextSunday } from "@src/helpers/dates";
import { useDaysOfWeek } from "@src/hooks/helpers/language";
import { useFetchMeals } from "@src/services/tanstack/data/meals";
import { useFetchPlanning } from "@src/services/tanstack/user/selectPlaning";

const CornerCell = () => (
  <div className="border border-nutrition-green/30 bg-dark-green p-3 font-bold text-white-green">-</div>
);

const HeaderCell = ({ children }: { children: React.ReactNode }) => (
  <div className="border border-nutrition-green/30 bg-nutrition-green p-3 font-semibold text-white-green text-center hover:bg-dark-green transition-colors">
    {children}
  </div>
);

const MealNameCell = ({ name }: { name: string }) => (
  <div className="border border-nutrition-green/30 bg-white-green/30 p-3 font-semibold whitespace-nowrap text-text-title hover:bg-white-green/50 transition-colors">
    {name}
  </div>
);

const MealCell = ({ mealId, date }: { mealId: string; date: string }) => (
  <div className="border border-gray-blue-200 bg-gray-blue-50 p-3 flex items-center justify-center text-text-body hover:bg-gray-blue-100 transition-colors">
    {mealId}
  </div>
);

export const WeeklyMeals = ({
    startMonday,
    endSunday,
}: {
    startMonday?: Date;
    endSunday?: Date;
}) => {
  const startDate = startMonday || dateNextMonday();
  const endDate = endSunday || dateNextSunday();
  const mealsQuery = useFetchMeals();
  const daysOfWeek = useDaysOfWeek();
  const planing = useFetchPlanning({
    startDate,
    endDate,
  });

  if (mealsQuery.isLoading || planing.isLoading) return <AnimationLoading />;
  if (mealsQuery.error || planing.error) return <div>Error loading data</div>;

  const meals = mealsQuery.data ?? [];
  const planningMap = new Map(
    (planing.data ?? []).map((plan) => [`${plan.meal_id}-${plan.date}`, plan]),
  );

  const getDateForDay = (dayIndex: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayIndex);
    return date.toISOString().split("T")[0];
  };

  const getDayOfMonth = (dayIndex: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayIndex);
    return date.getDate();
  };

  return (
    <div className="overflow-x-auto">
      <div className="shadow-lg rounded-lg bg-white-green/10 p-4">
        <div className="grid gap-px grid-cols-[min-content_repeat(7,_1fr)]">
        {/* Header */}
        <CornerCell />
        {daysOfWeek.map((day, dayIndex) => (
          <HeaderCell key={day}>
            {`${day} ${getDayOfMonth(dayIndex)}`}
          </HeaderCell>
        ))}
        {/* Body */}
        {meals.map((meal) => (
          <>
            <MealNameCell key={`${meal.id}-name`} name={meal.name} />
            {daysOfWeek.map((_, dayIndex) => {
              const date = getDateForDay(dayIndex);
              const plan = planningMap.get(`${meal.id}-${date}`);
              return (
                <MealCell
                  key={`${meal.id}-${date}`}
                  mealId={plan ? plan.meal_id.toString() : "N/A"}
                  date={date}
                />
              );
            })}
          </>
        ))}
        {/** Calculations, like kcal, water consumption.... */}
      </div>
      </div>
    </div>
  );
};
