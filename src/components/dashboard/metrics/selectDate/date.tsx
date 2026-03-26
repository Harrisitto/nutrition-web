import { fromDate, saveDate } from "@src/helpers/dates";
import { useConfigSelectedDay } from "@src/store/slices/config/hook";
import { setSelectedDay } from "@src/store/slices/config/store";
import { useAppDispatch } from "@src/store/store";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { useCallback } from "react";

export const SelectDateHeader = () => {
  const currentDate = useConfigSelectedDay() ?? fromDate().nextMonday();
  const dispatch = useAppDispatch();
  const dateFn = fromDate(currentDate);

  console.log("Current date in SelectDateHeader:", currentDate);

  const addOneWeek = useCallback(() => {
    dispatch(setSelectedDay(saveDate(dateFn.incrementDay(7))));
  }, [currentDate, dispatch]);

  const subtractOneWeek = useCallback(() => {
    dispatch(setSelectedDay(saveDate(dateFn.incrementDay(-7))));
  }, [currentDate, dispatch]);

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-4 px-[clamp(0.5rem,12vw,33%)]">
      <div className="flex flex-row items-center justify-center gap-2">
        <button
          type="button"
          onClick={subtractOneWeek}
          className="rounded-md p-1.5 text-text-title hover:bg-nutrition-green/20"
          aria-label="Previous week"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-text-title">
          {dateFn.thisMonday().toLocaleDateString()} -{" "}
          {dateFn.thisSunday().toLocaleDateString()}
        </span>
        <button
          type="button"
          onClick={addOneWeek}
          className="rounded-md p-1.5 text-text-title hover:bg-nutrition-green/20"
          aria-label="Next week"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-row items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => dispatch(setSelectedDay(saveDate(new Date())))}
          className="rounded-md p-1.5 text-text-title hover:bg-nutrition-green/20"
          aria-label="Reset to today"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        <input
          type="date"
          value={saveDate(currentDate)}
          onChange={(e) => dispatch(setSelectedDay(e.target.value))}
          className="rounded-md border border-nutrition-green/30 bg-nutrition-green/20 px-2 py-1 text-sm text-text-title transition-colors hover:bg-nutrition-green/30 focus:outline-none focus:ring-2 focus:ring-nutrition-green/60 focus:border-nutrition-green [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:rounded [&::-webkit-calendar-picker-indicator]:p-0.5 [&::-webkit-calendar-picker-indicator]:transition [&::-webkit-calendar-picker-indicator]:opacity-90 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:sepia [&::-webkit-calendar-picker-indicator]:saturate-[3] [&::-webkit-calendar-picker-indicator]:hue-rotate-[45deg]"
        />
      </div>
    </div>
  );
};
