import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Context } from "./tableContext";
import { useFetchMeals } from "@src/services/tanstack/data/meals";
import { useDaysOfWeek } from "@src/hooks/helpers/language";
import { usePlaning } from "./hooks/planing";
import { useAppSelector } from "@src/store/store";

export const Provider = ({
  children,
  startMonday,
}: {
  children: React.ReactNode;
  startMonday: Date;
}) => {

  const meals = useFetchMeals();
  const daysOfWeek = useDaysOfWeek();
  const planing = usePlaning({ forDate: startMonday });
  const tableNavigation = useAppSelector((state) => state.config.keyboardCommands.tableNavigation);

  const [cells, setCells] = useState<HTMLDivElement[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [sideElement, setSideElement] = useState<React.ReactNode>(null);

  const sideElements = useRef<Record<string, React.ReactNode>>({});

  const addCell = useCallback(
    (
      cell: HTMLDivElement,
      posX: number,
      posY: number,
      sideElement: React.ReactNode,
    ) => {
      setCells((prev) => {
        const newCells = [...prev];
        if (!newCells[posY]) {
          newCells[posY] = [];
        }
        newCells[posY][posX] = cell;
        return newCells;
      });
      if (sideElement) {
        sideElements.current[`${posX}-${posY}`] = sideElement;
      } else {
        delete sideElements.current[`${posX}-${posY}`];
      }
    },
    [],
  );

  const currentCell = useCallback(() => {
    return cells[selectedCell.y]?.[selectedCell.x] || null;
  }, [cells, selectedCell]);

  const centerCellInViewport = useCallback((cell: HTMLDivElement | null) => {
    if (!cell) return;

    const rect = cell.getBoundingClientRect();
    const isVerticallyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    const isHorizontallyVisible = rect.left >= 0 && rect.right <= window.innerWidth;

    if (isVerticallyVisible && isHorizontallyVisible) return;

    cell.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, []);

  const tableFragmentIndex = useMemo(() => {
    const mealslength = meals.data?.length ?? 0;
    const trainingHours = planing.maxTrainingHours;
    return {
      weekDaysHeader: {
        start: 0,
        end: 0,
      },
      mealRows: {
        start: 1,
        end: mealslength + 1,
      },
      trainingRows: {
        start: mealslength + 1,
        end: mealslength + trainingHours + 0,
      },
      trainingKcalRows: {
        start: mealslength + trainingHours + 1,
        end: mealslength + trainingHours + 1,
      },
      commentsRows: {
        start: mealslength + trainingHours + 2,
        end: mealslength + trainingHours + 2, 
      },
      eventsRow: {
        start: mealslength + trainingHours + 3,
        end: mealslength + trainingHours + 3, 
      }
    };
  }, [meals.data, planing.maxTrainingHours]);

  const cancelFocus = useCallback(() => {
    setIsFocused(false);
    setSideElement(null);
  }, []);

  useEffect(() => {
    if (cells.length === 0) return;

    const isInCell = (node: Node | null) => {
      if (!node) return false;
      return cells.some(
        (row) => Array.isArray(row) && row.some((cell) => !!cell && cell.contains(node)),
      );
    };

    const isInEditorPortal = (node: Node | null) => {
      if (!node) return false;
      const element = node instanceof Element ? node : node.parentElement;
      return !!element?.closest("[data-table-editor-portal='true']");
    };

    const isInTableInteractionScope = (node: Node | null) => {
      return isInCell(node) || isInEditorPortal(node);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (isInTableInteractionScope(e.target as Node | null)) return;
      setIsFocused(false);
      setSideElement(null);
    };

    // Store handlers with proper references for cleanup
    const handlers = cells.flatMap((row, indexY) => {
      if (!row) return [];
      return row.map((cell, indexX) => {
        if (!cell) return null;

        const clickHandler = () => {
          setSelectedCell({ x: indexX, y: indexY });
          setSideElement(sideElements.current[`${indexX}-${indexY}`] || null);
          setIsFocused(true);

          // ensure DOM focus actually moves to this cell
          cell.focus();
          centerCellInViewport(cell);
        };

        const blurHandler = (e: FocusEvent) => {
          // Keep table focus while moving between cells or into the floating editor portal.
          const nextFocusedNode =
            (e.relatedTarget as Node | null) ?? document.activeElement;
          if (isInTableInteractionScope(nextFocusedNode)) return;

          setIsFocused(false);
          setSideElement(null);
        };

        cell.addEventListener("focusout", blurHandler);
        cell.addEventListener("click", clickHandler);

        return { cell, clickHandler, blurHandler };
      });
    });

    window.addEventListener("click", handleClickOutside);

    return () => {
      handlers.forEach((handler) => {
        if (!handler) return;
        handler.cell.removeEventListener("focusout", handler.blurHandler);
        handler.cell.removeEventListener("click", handler.clickHandler);
      });
      window.removeEventListener("click", handleClickOutside);
    };
  }, [cells, centerCellInViewport]);

  useEffect(() => {
    if (cells.length === 0) return;
    centerCellInViewport(currentCell());
  }, [cells, currentCell, selectedCell, centerCellInViewport]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cells.length === 0) return;

      const eventTarget = e.target as Node | null;
      const targetIsCurrentCellInput =
        !!eventTarget && !!currentCell()?.contains(eventTarget);

      if (
        isFocused &&
        targetIsCurrentCellInput &&
        [
          tableNavigation.moveUp,
          tableNavigation.moveDown,
          tableNavigation.moveLeft,
          tableNavigation.moveRight,
          tableNavigation.selectCell,
        ].includes(e.key)
      ) {
        return;
      }

      switch (e.key) {
        case tableNavigation.moveUp:
          if (isFocused && !targetIsCurrentCellInput) return;
          e.preventDefault();
          setIsFocused(false);
          setSideElement(null);
          setSelectedCell((prev) => {
            const nextY = (prev.y - 1 + cells.length) % cells.length;
            const nextRow = cells[nextY] ?? [];
            const maxX = Math.max(nextRow.length - 1, 0);
            const nextX = Math.min(prev.x, maxX);
            return { x: nextX, y: nextY };
          });
          break;
        case tableNavigation.moveDown:
          if (isFocused && !targetIsCurrentCellInput) return;
          e.preventDefault();
          setIsFocused(false);
          setSideElement(null);
          setSelectedCell((prev) => {
            const nextY = (prev.y + 1) % cells.length;
            const nextRow = cells[nextY] ?? [];
            const maxX = Math.max(nextRow.length - 1, 0);
            const nextX = Math.min(prev.x, maxX);
            return { x: nextX, y: nextY };
          });
          break;
        case tableNavigation.moveLeft:
          setIsFocused(false);
          setSideElement(null);
          setSelectedCell((prev) => {
            const currentRow = cells[prev.y] ?? [];
            if (currentRow.length === 0) return prev;
            const nextX = (prev.x - 1 + currentRow.length) % currentRow.length;
            return { x: nextX, y: prev.y };
          });
          break;
        case tableNavigation.moveRight:
          setIsFocused(false);
          setSideElement(null);
          setSelectedCell((prev) => {
            const currentRow = cells[prev.y] ?? [];
            if (currentRow.length === 0) return prev;
            const nextX = (prev.x + 1) % currentRow.length;
            return { x: nextX, y: prev.y };
          });
          break;
        case tableNavigation.selectCell:
          if (isFocused) break;
          currentCell()?.click();
          break;
        case tableNavigation.exitCell:
          if (!isFocused) break;
          setIsFocused(false);
          setSideElement(null);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cells, currentCell, isFocused, tableNavigation]);

  return (
    <Context.Provider
      value={{
        addCell,
        setSideElement,
        cancelFocus,
        tableFragmentIndex,
        sideElement,
        selectedCell,
        startMonday,
        isFocused,
        daysOfWeek,
        planing,
        meals: meals.data ?? [],
      }}
    >
      {children}
    </Context.Provider>
  );
};
