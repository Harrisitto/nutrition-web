import { fromDate } from "@src/helpers/dates";
import { CornerCell, HCHeaderCell } from "./cells/static/plain";
import { Provider } from "./tableProvider";
import { HeaderDaysOfWeek } from "./cells/dynamic/daysOfWeek";
import { ColWeeklyMeals } from "./cells/static/weeklyMeals";
import { TablePlaning } from "./cells/dynamic/weeklyPlan";
import { ColSideElement } from "./cells/sideElement";
import { ColTrainingHc, HCEmptyCol } from "./cells/static/trainingHc";
import { TableTrainingCarbs } from "./cells/dynamic/trainingCarbs";

export const WeeklyMeals = ({
  startMonday,
}: {
  startMonday?: Date;
}) => {
  const startDate = startMonday || fromDate().nextMonday();

  return (
    <Provider startMonday={startDate}>
        <div className="bg-white-green/10 p-4 w-full ">
          <div className="grid gap-px grid-cols-[min-content_repeat(8,_1fr)] w-full">
            {/* ROW 0 */}
            <CornerCell />
            <HeaderDaysOfWeek />
            {/** RIGHT COLUMN (INTERACTIVE) */}
            <ColSideElement />
            {/** LEFT COLUMN */}
            <ColWeeklyMeals />
            {/** MEALS BETWEEN THE COLUMNS EG(BRE 1)*/}
            <TablePlaning />
            {/** TRAINING HC HEADER */}
            <HCHeaderCell />
            {/** TRAINING CARBS */}
            <ColTrainingHc />
            <HCEmptyCol />
            <TableTrainingCarbs />
            
          </div>
        </div>
    </Provider>
  );
};

/*

{Array.from({ length: maxTrainingHours + 1 }).map((_, hourIndex) => (
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

            {/** Daily kCal
            <MealNameCell name={t("data:dashboardTable.Kcal")} />
            {kcalState.map((kcal, index) => (
              <KcalCell key={`kcal-${index}`} kcal={kcal} />
            ))}

            */
