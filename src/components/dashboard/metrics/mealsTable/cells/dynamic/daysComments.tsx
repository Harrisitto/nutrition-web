import { useMemo } from "react";
import { CellWrapper } from "../cellWrap";
import { generatePlaningKey, getDateForDayIndex } from "../../helperFunctions";
import { useTableContext } from "../../tableContext";
import { useInsertPlaning } from "@src/services/tanstack/user/planing";
import { CellTextInput } from "./inputs/textCell";

const Cell = ({
  isSelected,
  date,
  day,
}: {
  isSelected: boolean;
  date: Date;
  day: string;
}) => {
  const { planing } = useTableContext();
  const insertPlaningQuery = useInsertPlaning();

  const planingDay = useMemo(() => {
    const key = generatePlaningKey(date);
    return planing.planningMap.get(key);
  }, [planing.planningMap, date]);

  return (
    <CellTextInput
      isSelected={isSelected}
      textValue={planingDay?.comment ?? ""}
      onSave={(value) => {
        insertPlaningQuery.mutateAsync({
          date,
          comment: value,
        });
      }}
      placeholder={day}
    />
  );
};

export const TableComments = () => {
  const { daysOfWeek, tableFragmentIndex, startMonday, isFocused, selectedCell } = useTableContext();

  return daysOfWeek.map((day, dayIndex) => {
    const date = getDateForDayIndex(startMonday, dayIndex);
    const commentsRowY = tableFragmentIndex.commentsRows.start;
    const isExpanded =
      isFocused && selectedCell.x === dayIndex && selectedCell.y === commentsRowY;

    return (
      <CellWrapper
        key={`comment-${dayIndex}`}
        posX={dayIndex}
        posY={tableFragmentIndex.commentsRows.start}
        SideElement={null}
        style={{
          gridColumn: isExpanded ? "2 / 9" : `${dayIndex + 2}`,
          gridRow: `${commentsRowY + 8}`,
          zIndex: isExpanded ? 20 : 1,
        }}
      >
        {({ isSelected }) => (
          <Cell date={date} isSelected={isSelected} day={day} />
        )}
      </CellWrapper>
    );
  });
};
