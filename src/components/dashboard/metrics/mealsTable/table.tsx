import { fromDate } from "@src/helpers/dates";
import { CornerCell, HCHeaderCell } from "./cells/static/plain";
import { Provider } from "./tableProvider";
import { HeaderDaysOfWeek } from "./cells/dynamic/daysOfWeek";
import { ColWeeklyMeals } from "./cells/static/weeklyMeals";
import { TablePlaning } from "./cells/dynamic/weeklyPlan";
import { ColSideElement } from "./cells/sideElement";
import { ColTrainingHc, HCEmptyCol } from "./cells/static/trainingHc";
import { TableTrainingCarbs } from "./cells/dynamic/trainingCarbs";
import { BalanceEnergyRow, DailyEnergyBalance, HeaderEnergyBalance, TrainingKcalCell } from "./cells/static/dailyEnergy";
import { TableTrainingKcal } from "./cells/dynamic/trainingKcal";
import { DailyMacrosCarbsPerKg, DailyMacrosFatsPerKg, DailyMacrosProteinPerKg, HeaderMacros, ResumeMacrosCarbsPerKg, ResumeMacrosFatsPerKg, ResumeMacrosProteinPerKg, RowCarbsPerKg, RowFatsPerKg, RowProteinPerKgHeader } from "./cells/static/macros";
import { EmptyCellComments, HeaderComments, RowComments } from "./cells/static/comments";
import { TableComments } from "./cells/dynamic/daysComments";
import { EmptyCellEvents, HeaderEvents, RowEvents } from "./cells/static/events";
import { TableEvents } from "./cells/dynamic/daysEvents";

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
            <TrainingKcalCell />
            <TableTrainingKcal />
            {/** ENERGY BALANCE */}
            <HeaderEnergyBalance />
            <BalanceEnergyRow />
            <DailyEnergyBalance />
            {/** MACROS */}
            <HeaderMacros />
            {/** CARBS PER KG ROW */}
            <RowCarbsPerKg />
            <DailyMacrosCarbsPerKg />
            <ResumeMacrosCarbsPerKg />
            {/** PROTEIN PER KG ROW */}
            <RowProteinPerKgHeader />
            <DailyMacrosProteinPerKg />
            <ResumeMacrosProteinPerKg />
            {/** FATS PER KG ROW */}
            <RowFatsPerKg />
            <DailyMacrosFatsPerKg />
            <ResumeMacrosFatsPerKg />
            {/** COMMENTS ROW */}
            <HeaderComments />
            <RowComments />
            <TableComments />
            <EmptyCellComments />
            {/** EVENTS ROW */}
            <HeaderEvents />
            <RowEvents />
            <TableEvents />
            <EmptyCellEvents />


          </div>
        </div>
    </Provider>
  );
};