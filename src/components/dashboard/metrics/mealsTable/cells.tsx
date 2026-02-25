import { type FetchPlanningType } from "@src/services/tanstack/user/planing";
import { useCallback, useRef, useState } from "react";
import { SelectMealCell } from "./selectMeal";
import { colorBasedOnKcal } from "./helper";
import { useInsertTraining } from "@src/services/tanstack/user/training";
import { useTranslation } from "react-i18next";

export const CornerCell = () => (
  <div className="border border-nutrition-green/30 bg-dark-green p-3 font-bold text-white-green">
    -
  </div>
);

export const HeaderCell = ({
  dayOfWeek,
  dayOfMonth,
}: {
  dayOfWeek: string;
  dayOfMonth: number;
}) => (
  <div className="border border-nutrition-green/30 bg-nutrition-green p-3 font-semibold text-white-green text-center hover:bg-dark-green transition-colors">
    {`${dayOfWeek} ${dayOfMonth}`}
  </div>
);

export const MealNameCell = ({ name }: { name: string }) => (
  <div className="border border-nutrition-green/30 bg-white-green/30 p-3 font-semibold whitespace-nowrap text-text-title hover:bg-white-green/50 transition-colors">
    {name}
  </div>
);

export const KcalCell = ({ kcal }: { kcal: number }) => (
  <div className="border border-gray-blue-200 bg-gray-blue-50 p-3 flex items-center justify-center text-text-body hover:bg-gray-blue-100 transition-colors">
    <div className="text-sm font-medium">{kcal}</div>
  </div>
);

interface PartialPlan {
  meal_id: number;
  date: string;
  type_id: {
    name: string;
  };
}

export const MealCell = ({
  plan,
}: {
  plan: FetchPlanningType | PartialPlan;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const kcal = "macros_id" in plan.type_id ? plan.type_id.macros_id.kcal : null;
  const kcalColor = kcal !== null ? colorBasedOnKcal(kcal) : "";
  return (
    <div
      className={`relative overflow-hidden border cursor-pointer border-gray-blue-200 bg-gray-blue-50 p-3 flex items-center justify-center text-text-body hover:bg-gray-blue-100 transition-colors ${kcalColor}`}
      ref={ref}
    >
      <div className="text-sm font-medium">{plan.type_id.name}</div>
      <SelectMealCell
        mealId={plan.meal_id}
        date={new Date(plan.date)}
        parentRef={ref}
      />
    </div>
  );
};

export const HCHeaderCell = () => {
  const { t } = useTranslation("data")

  return (
  <div className="border border-nutrition-green/30 bg-nutrition-green p-3 flex items-center justify-center text-white-green font-semibold hover:bg-dark-green transition-colors col-span-8">
    <div>{t("dashboardTable.hcHeader")}</div>
  </div>
);
} 


export const HCCell = ({
  hourIndex,
  dayHc,
  date,
}: {
  hourIndex: number;
  dayHc: number[];
  date: Date;
}) => {
  const [buffer, setBuffer] = useState<number>(dayHc[hourIndex] || 0);
  const insert = useInsertTraining();

  const saveData = useCallback(() => {
    const dayHcLength = dayHc.length;
    let result: number[];

    if (hourIndex >= dayHcLength) {
      result = Array.from({ length: hourIndex + 1 }, (_, i) => {
        if (i < dayHcLength) return dayHc[i] ?? 0;
        if (i === hourIndex) return buffer;
        return 0;
      });
    } else {
      result = dayHc.map((hc, idx) => (idx === hourIndex ? buffer : hc ?? 0));
    }

    // Trim trailing zeros
    while (result.length > 0 && result[result.length - 1] === 0) {
      result.pop();
    }

    insert.mutate({
      date,
      trainingHc: result,
    });
  }, [buffer, dayHc, hourIndex, insert, date]);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border border-gray-blue-200 bg-gray-blue-50 p-3 flex items-center justify-center text-text-body hover:bg-gray-blue-100 transition-colors">
      <input
        id={`hc-input-${hourIndex}`}
        ref={inputRef}
        type="number"
        className="w-full text-center text-sm font-medium bg-transparent focus:outline-none"
        value={buffer === 0 ? "" : buffer}
        onChange={(e) => setBuffer(Number(e.target.value))}
        placeholder="..."
        onBlur={saveData}
        step={10}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            inputRef.current?.blur();
          }
        }}
      />
    </div>
  );
};


export const ResumeHeaderCell = () => {
  const { t } = useTranslation("data")

  return (
  <div className="border border-nutrition-green/30 bg-nutrition-green p-3 flex items-center justify-center text-white-green font-semibold hover:bg-dark-green transition-colors col-span-8">
    <div>{t("dashboardTable.resumeHeader")}</div>
  </div>
);
}
