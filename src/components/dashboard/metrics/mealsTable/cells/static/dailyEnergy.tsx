import { useTranslation } from "react-i18next";
import { useTableContext } from "../../tableContext";
import { useMemo } from "react";
import { cellStyles } from "../defaultStyles";

export const HeaderEnergyBalance = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className={cellStyles.longHeader.backgroundSpan8}>
        {t("data:dashboardTable.energyBalanceHeader")}
      </div>
      <div className={`${cellStyles.rightColumnCell.background}`}>
        {t("data:dashboardTable.weekBalance")}
      </div>
    </>
  );
};

export const TrainingKcalCell = () => {
  const { t } = useTranslation();

  return (
    <div className={cellStyles.leftColumnCell.background}>
      {t("data:dashboardTable.trainingKcalHeader")}
    </div>
  );
};

export const BalanceEnergyRow = () => {
  const { t } = useTranslation();

  return (
    <div className={cellStyles.leftColumnCell.background}>
      {t("data:dashboardTable.energyBalanceHeader")}
    </div>
  );
}

export const DailyEnergyBalance = () => {
  const { daysOfWeek, planing } = useTableContext();
  const closeBalanceThreshold = 100;

  const getTone = (balance: number) => {
    if (Math.abs(balance) <= closeBalanceThreshold) return "warning" as const;
    return balance > 0 ? "good" as const : "bad" as const;
  };

  const getToneClasses = (tone: "good" | "warning" | "bad") => {
    if (tone === "warning") return "border-amber-300/80 bg-amber-50 text-amber-700";
    if (tone === "good") return "border-emerald-300/80 bg-emerald-50 text-emerald-700";
    return "border-rose-200/70 bg-rose-50/60 text-rose-600";
  };

  const weeklyEnergy = useMemo(() => {
    
    const weekTotal = planing.kcalState.reduce((acc, day) => {
      acc += day.balance;
      return acc;
    }, 0);

    return {
      balance: weekTotal,
    };
  }, [planing.kcalState]);

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
    const dayTone = getTone(planing.kcalState[dayIndex].balance);
    return (
      <div
        key={`energy-balance-${dayIndex}`}
        className={`${baseBalanceCellClass} ${getToneClasses(dayTone)}`}
      >
        {Math.round(planing.kcalState[dayIndex].balance)} kcal
      </div>
    );
  });
}


