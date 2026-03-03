import { fromDate } from "@src/helpers/dates";
import { ColSideElement, CornerCell, HCHeaderCell } from "./cells/plain";
import { Provider } from "./tableProvider";
import { HeaderDaysOfWeek } from "./cells/daysOfWeek";
import { ColWeeklyMeals } from "./cells/weeklyMeals";
import { TablePlaning } from "./cells/weeklyPlan";

export const WeeklyMeals = ({
  startMonday,
  endSunday,
}: {
  startMonday?: Date;
  endSunday?: Date;
}) => {
  const startDate = startMonday || fromDate().nextMonday();
  const endDate = endSunday || fromDate(startDate).nextSunday();

  return (
    <Provider startMonday={startDate} endSunday={endDate}>
        <div className="bg-white-green/10 p-4 w-full ">
          <div className="grid gap-px grid-cols-[min-content_repeat(8,_1fr)] w-full">
            {/* ROW 0 */}
            <CornerCell />
            <HeaderDaysOfWeek />
            <ColSideElement />
            <ColWeeklyMeals />
            <TablePlaning />
            
            {/** Training HC */}
            <HCHeaderCell />
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
