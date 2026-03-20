import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInsertPlaning } from "@src/services/tanstack/user/planing";

export const CornerCell = () => (
  <div className="border border-nutrition-green/30 bg-dark-green p-3 font-bold text-white-green">
    -
  </div>
);

export const EmptyCell = () => (
  <div className="border border-gray-blue-200 bg-gray-blue-50 p-3 flex items-center justify-center text-text-body hover:bg-gray-blue-100 transition-colors" />
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

export const HCHeaderCell = () => {
  const { t } = useTranslation("data");

  return (
    <div className="border border-nutrition-green/30 bg-nutrition-green p-3 flex items-center justify-center text-white-green font-semibold hover:bg-dark-green transition-colors col-span-9">
      <div>{t("dashboardTable.hcHeader")}</div>
    </div>
  );
};

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
  const insert = useInsertPlaning();

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
      result = dayHc.map((hc, idx) => (idx === hourIndex ? buffer : (hc ?? 0)));
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
  const { t } = useTranslation("data");

  return (
    <div className="border border-nutrition-green/30 bg-nutrition-green p-3 flex items-center justify-center text-white-green font-semibold hover:bg-dark-green transition-colors col-span-8">
      <div>{t("dashboardTable.resumeHeader")}</div>
    </div>
  );
};
