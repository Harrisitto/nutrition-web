import { useTranslation } from "react-i18next";
import { useTableContext } from "../../tableContext";
import { useMemo } from "react";
import { useFetchBmr } from "@src/services/tanstack/user/info";

export const HeaderEnergyBalance = () => {
  const { t } = useTranslation();

  return (
    <div className="border col-start-1 col-end-10 p-3 font-semibold text-center transition-colors h-full flex items-center justify-center border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green">
      {t("data:dashboardTable.energyBalanceHeader")}
    </div>
  );
};

export const EnergyBalanceEmptyCol = () => {
const { tableFragmentIndex } = useTableContext();
  return (
    <div
      className="border p-3 font-semibold text-center transition-colors h-full flex items-center justify-center border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green"
      style={{
        gridColumn: 9,
        gridRow: tableFragmentIndex.trainingKcalRows.start + 2,
      }}
    />
  );
};

export const TrainingKcalCell = () => {
  const { t } = useTranslation();

  return (
    <div className="border col-start-1 p-3 font-semibold text-center transition-colors h-full flex items-center justify-center border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green">
      {t("data:dashboardTable.trainingKcalHeader")}
    </div>
  );
};

export const BalanceEnergyRow = () => {
  const { t } = useTranslation();

  return (
    <div className="border col-start-1 p-3 font-semibold text-center transition-colors h-full flex items-center justify-center border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green">
      {t("data:dashboardTable.energyBalanceHeader")}
    </div>
  );
}

export const DailyEnergyBalance = () => {
  const { daysOfWeek, planing } = useTableContext();
  const bmrQuery = useFetchBmr();
  const closeBalanceThreshold = 100;

  const energyBalance = useMemo(() => {
    const data = bmrQuery.data as unknown;
    if (typeof data === "number") return data;
    if (data && typeof data === "object" && "bmr" in data) {
      const bmrValue = (data as { bmr?: unknown }).bmr;
      if (typeof bmrValue === "number") return bmrValue;
    }
    return 0;
  }, [bmrQuery.data]);

  const getTone = (balance: number) => {
    if (Math.abs(balance) <= closeBalanceThreshold) return "warning" as const;
    return balance < 0 ? "good" as const : "bad" as const;
  };

  const getToneClasses = (tone: "good" | "warning" | "bad") => {
    if (tone === "warning") return "border-amber-300/80 bg-amber-50 text-amber-700";
    if (tone === "good") return "border-emerald-300/80 bg-emerald-50 text-emerald-700";
    return "border-rose-200/70 bg-rose-50/60 text-rose-600";
  };

  const dailyEnergy = useMemo(() => {
    const kcalPerDay = planing.kcalState;
    return kcalPerDay.map((kcal) => ({
      balance: energyBalance - kcal.total,
    }));
  }, [planing.kcalState, energyBalance]);

  const weeklyEnergy = useMemo(() => {
    
    const weekTotal = dailyEnergy.reduce((acc, day) => {
      acc += day.balance;
      return acc;
    }, 0);

    return {
      balance: weekTotal,
    };
  }, [dailyEnergy]);

  const baseBalanceCellClass = "border p-3 text-center transition-colors h-full flex items-center justify-center font-semibold tabular-nums";

  return [...daysOfWeek, 'total'].map((day, dayIndex) => {
    if (day === 'total') {
      const weeklyTone = getTone(weeklyEnergy.balance);
      return (
        <div
          key={`energy-balance-total`}
          className={`${baseBalanceCellClass} font-bold ring-1 ring-black/5 ${getToneClasses(weeklyTone)}`}
        >
          {Math.round(weeklyEnergy.balance)} kcal
        </div>
      );
    }
    const dayEnergy = dailyEnergy[dayIndex];
    const dayTone = getTone(dayEnergy.balance);
    return (
      <div
        key={`energy-balance-${dayIndex}`}
        className={`${baseBalanceCellClass} ${getToneClasses(dayTone)}`}
      >
        {Math.round(dayEnergy.balance)} kcal
      </div>
    );
  });
}


