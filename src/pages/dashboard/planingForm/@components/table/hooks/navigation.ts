import { useEffect } from "react";
import { useAppSelector } from "@src/store/store";
import type { RowInfo } from "../types";

interface TableSelection {
  row: number;
  col: number;
  isEditorOpen: boolean;
}

const useKeyboardNavigation = ({
  editableRows,
  tableSelection,
  setTableSelection,
  dayDatesLength,
}: {
  editableRows: RowInfo[];
  tableSelection: TableSelection;
  setTableSelection: (prev: Partial<TableSelection>) => void;
  dayDatesLength: number;
}) => {
  const tableNavigation = useAppSelector(
    (state) => state.config.keyboardCommands.tableNavigation,
  );

  useEffect(() => {
    if (editableRows.length === 0 || dayDatesLength === 0) return;
    const safeRow = Math.min(tableSelection.row, editableRows.length - 1);
    const safeCol = Math.min(
      Math.max(tableSelection.col, 0),
      dayDatesLength - 1,
    );
    if (safeRow !== tableSelection.row || safeCol !== tableSelection.col) {
      setTableSelection({
        row: safeRow,
        col: safeCol,
      });
    }
  }, [
    editableRows.length,
    dayDatesLength,
    tableSelection.col,
    tableSelection.row,
    setTableSelection,
  ]);

  useEffect(() => {
    if (editableRows.length === 0 || dayDatesLength === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === tableNavigation.exitCell) {
        if (!tableSelection.isEditorOpen) return;
        e.preventDefault();
        setTableSelection({
          isEditorOpen: false,
        });
        return;
      }

      if (tableSelection.isEditorOpen) return;

      if (e.key === tableNavigation.selectCell) {
        e.preventDefault();
        const canOpen = !!editableRows[tableSelection.row]?.isEditable;
        setTableSelection({
          isEditorOpen: canOpen,
        });
        return;
      }

      if (e.key === tableNavigation.moveUp) {
        e.preventDefault();
        const nextRow =
          (tableSelection.row - 1 + editableRows.length) % editableRows.length;
        setTableSelection({
          row: nextRow,
        });
        return;
      }

      if (e.key === tableNavigation.moveDown) {
        e.preventDefault();
        const nextRow = (tableSelection.row + 1) % editableRows.length;
        setTableSelection({
          row: nextRow,
        });
        return;
      }

      if (e.key === tableNavigation.moveLeft) {
        e.preventDefault();
        const nextCol =
          (tableSelection.col - 1 + dayDatesLength) % dayDatesLength;
        setTableSelection({
          col: nextCol,
        });
        return;
      }

      if (e.key === tableNavigation.moveRight) {
        e.preventDefault();
        const nextCol = (tableSelection.col + 1) % dayDatesLength;
        setTableSelection({
          col: nextCol,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    editableRows,
    dayDatesLength,
    tableNavigation.exitCell,
    tableNavigation.moveDown,
    tableNavigation.moveLeft,
    tableNavigation.moveRight,
    tableNavigation.moveUp,
    tableNavigation.selectCell,
    tableSelection.col,
    tableSelection.isEditorOpen,
    tableSelection.row,
    setTableSelection,
  ]);
};

export default useKeyboardNavigation;
