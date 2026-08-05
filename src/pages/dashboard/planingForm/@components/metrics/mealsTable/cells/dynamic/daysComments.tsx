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
  const { daysOfWeek, tableFragmentIndex, startMonday } = useTableContext();

  return daysOfWeek.map((day, dayIndex) => {
    const date = getDateForDayIndex(startMonday, dayIndex);
    const commentsRowY = tableFragmentIndex.commentsRows.start;

    return (
      <CellWrapper
        key={`comment-${dayIndex}`}
        posX={dayIndex}
        posY={tableFragmentIndex.commentsRows.start}
        SideElement={null}
        style={{
          gridColumn: `${dayIndex + 2}`,
          gridRow: `${commentsRowY + 9}`,
          zIndex: 1,
        }}
      >
        {({ isSelected }) => (
          <Cell date={date} isSelected={isSelected} day={day} />
        )}
      </CellWrapper>
    );
  });
};
