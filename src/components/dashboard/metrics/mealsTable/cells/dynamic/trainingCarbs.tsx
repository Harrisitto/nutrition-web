import { CellWrapper } from "../../cellWrap";
import { useTableContext } from "../../tableContext";
import { generatePlaningKey, getDateForDayIndex } from "../../helper";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInsertPlaning } from "@src/services/tanstack/user/planing";

const Cell = ({
  date,
  trainingHourIndex,
  isSelected,
}: {
  date: Date;
  trainingHourIndex: number;
  isSelected: boolean;
}) => {
  const { planing, isFocused } = useTableContext();
  const insertPlaning = useInsertPlaning();
  const inputRef = useRef<HTMLInputElement>(null);
  const wasActiveRef = useRef(false);
  const dirtyRef = useRef(false);
  const current = useMemo(() => {
    const planingKey = generatePlaningKey(date);
    return planing.planningMap.get(planingKey);
  }, [planing.planningMap, date]);
  const [value, setValue] = useState(
    current?.training_hc?.[trainingHourIndex] ?? 0,
  );

  const saveHC = useCallback(() => {
    if (!dirtyRef.current) return;

    const currentHours = [...(current?.training_hc ?? [])];
    const normalizedValue = Number.isFinite(value) && value > 0 ? value : 0;
    const nextHours = [...currentHours];
    nextHours[trainingHourIndex] = normalizedValue;
    dirtyRef.current = false;
    insertPlaning.mutateAsync({
      date,
      trainingHc: nextHours,
    });
  }, [current, insertPlaning, date, trainingHourIndex, value]);

  const handleEnterSave = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      e.stopPropagation();
      saveHC();
      inputRef.current?.blur();
    },
    [saveHC],
  );

  useEffect(() => {
    const isActive = isSelected && isFocused;

    if (isActive) {
      inputRef.current?.focus();
      wasActiveRef.current = true;
      return;
    }

    if (wasActiveRef.current) {
      saveHC();
      wasActiveRef.current = false;
    }
  }, [isSelected, isFocused, saveHC]);

  useEffect(() => {
    if (current) {
      const hcValue = current.training_hc?.[trainingHourIndex] ?? 0;
      setValue(hcValue);
    } else {
      setValue(0);
    }
    dirtyRef.current = false;
  }, [current, trainingHourIndex]);

  return (
    <div
      className={`border text-center transition-colors h-full w-full flex items-center justify-center ${
        isSelected
          ? "border-dark-green bg-light-green text-white"
          : "border-nutrition-green/30 bg-nutrition-green/20 text-white-green hover:bg-nutrition-green/30"
      }`}
    >
      {isSelected ? (
        <input
          placeholder="0"
          ref={inputRef}
          type="text"
          value={value > 0 ? value : ""}
          onChange={(e) => {
            dirtyRef.current = true;
            setValue(Number(e.target.value));
          }}
          onKeyDown={handleEnterSave}
          onBlur={saveHC}
          className="w-full h-full bg-transparent text-center text-fade-dark-green focus:outline-none placeholder:text-white/40"
        />
      ) : (
        <span className="text-sm text-dark-green">
          {value > 0 ? value : "-"}
        </span>
      )}
    </div>
  );
};

export const TableTrainingCarbs = () => {
  const { daysOfWeek, planing, tableFragmentIndex, startMonday } =
    useTableContext();

  return daysOfWeek.map((_, dayIndex) => {
    return Array.from({ length: planing.maxTrainingHours }, (_, i) => {
      const date = getDateForDayIndex(startMonday, dayIndex);
      return (
        <CellWrapper
          key={`training-carbs-${dayIndex}-${i}`}
          posX={dayIndex}
          posY={tableFragmentIndex.trainingRows.start + i}
          style={{
            gridColumn: dayIndex + 2,
            gridRow: tableFragmentIndex.trainingRows.start + i + 2,
          }}
          SideElement={null}
        >
          {({ isSelected }) => (
            <Cell date={date} trainingHourIndex={i} isSelected={isSelected} />
          )}
        </CellWrapper>
      );
    });
  });
};
