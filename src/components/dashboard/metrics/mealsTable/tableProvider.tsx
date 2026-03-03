import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Context } from "./tableContext";
import { useFetchMeals } from "@src/services/tanstack/data/meals";
import { useDaysOfWeek } from "@src/hooks/helpers/language";
import { usePlaning } from "./hooks/planing";

export const Provider = ({
  children,
  startMonday,
  endSunday,
}: {
  children: React.ReactNode;
  startMonday: Date;
  endSunday: Date;
}) => {
  const dateRange = {
    startDate: startMonday,
    endDate: endSunday,
  };

  const meals = useFetchMeals();
  const daysOfWeek = useDaysOfWeek();
  const planing = usePlaning(dateRange);

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
      trainingHeader: {
        start: mealslength + 2,
        end: mealslength + 2,
      },
      trainingRows: {
        start: mealslength + 3,
        end: mealslength + trainingHours + 3,
      },
    };
  }, [meals.data, planing.maxTrainingHours]);

  const cancelFocus = useCallback(() => {
    setIsFocused(false);
  }, []);

  useEffect(() => {
    if (cells.length === 0) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        cells.some((row) =>
          row.some((cell) => cell?.contains(e.target as Node)),
        )
      )
        return;
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
        };

        const blurHandler = () => {
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
  }, [cells]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cells.length === 0) return;
      switch (e.key) {
        case "ArrowUp":
          if (isFocused) return;
          setSelectedCell((prev) => {
            const nextY = (prev.y - 1 + cells.length) % cells.length;
            const nextRow = cells[nextY] ?? [];
            const maxX = Math.max(nextRow.length - 1, 0);
            const nextX = Math.min(prev.x, maxX);
            return { x: nextX, y: nextY };
          });
          break;
        case "ArrowDown":
          if (isFocused) return;
          setSelectedCell((prev) => {
            const nextY = (prev.y + 1) % cells.length;
            const nextRow = cells[nextY] ?? [];
            const maxX = Math.max(nextRow.length - 1, 0);
            const nextX = Math.min(prev.x, maxX);
            return { x: nextX, y: nextY };
          });
          break;
        case "ArrowLeft":
          setIsFocused(false);
          setSideElement(null);
          setSelectedCell((prev) => {
            const currentRow = cells[prev.y] ?? [];
            if (currentRow.length === 0) return prev;
            const nextX = (prev.x - 1 + currentRow.length) % currentRow.length;
            return { x: nextX, y: prev.y };
          });
          break;
        case "ArrowRight":
          setIsFocused(false);
          setSideElement(null);
          setSelectedCell((prev) => {
            const currentRow = cells[prev.y] ?? [];
            if (currentRow.length === 0) return prev;
            const nextX = (prev.x + 1) % currentRow.length;
            return { x: nextX, y: prev.y };
          });
          break;
        case "Enter":
          if (isFocused) break;
          currentCell()?.click();
          break;
        case "Escape":
            console.log("Escape pressed, cancelling focus", { isFocused, currentCell: currentCell() });
          if (!isFocused) break;
          setIsFocused(false);
          setSideElement(null);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cells, currentCell, isFocused]);

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
        endSunday,
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
