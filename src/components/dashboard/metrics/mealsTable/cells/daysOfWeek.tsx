import { useCallback } from "react";
import { getDayOfMonth } from "../helper";
import { useTableContext } from "../tableContext";
import { CellWrapper } from "../cellWrap";

const SideElement = () => {
  return (
    <div className="absolute top-0 left-full ml-4 w-64 p-4 bg-white-green/90 rounded-lg shadow-lg">
      Side Element
    </div>
  );
};

const Cell = ({
  dayOfWeek,
  dayOfMonth,
  isSelected,
}: {
  dayOfWeek: string;
  dayOfMonth: number;
  isSelected: boolean;
}) => {
  return (
    <div
      className={`border p-3 font-semibold text-center transition-colors ${
        isSelected
          ? "border-dark-green bg-dark-green text-white"
          : "border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green"
      }`}
    >
      {`${dayOfWeek} ${dayOfMonth}`}
    </div>
  );
};

export const HeaderDaysOfWeek = () => {
  const { daysOfWeek, startMonday, tableFragmentIndex } = useTableContext();

  const dayOfMonth = useCallback(
    (i: number) => {
      return getDayOfMonth(startMonday, i);
    },
    [startMonday],
  );

  return daysOfWeek.map((day, index) => (
    <CellWrapper 
        key={`header-days-${index}`} 
        posX={index} 
        posY={tableFragmentIndex.weekDaysHeader.start}
        SideElement={<SideElement />}
    >
      {({ isSelected }) => (
        <Cell
          dayOfWeek={day}
          dayOfMonth={dayOfMonth(index)}
          isSelected={isSelected}
        />
      )}
    </CellWrapper>
  ));
};
