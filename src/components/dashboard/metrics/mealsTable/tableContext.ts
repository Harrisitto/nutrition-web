import { createContext, useContext, type ReactNode } from "react";
import type { usePlaning } from "./hooks/planing";
import type { useFetchMeals } from "@src/services/tanstack/data/meals";

type TableFragmentIndexKey = "weekDaysHeader" | "mealRows" | "trainingRows" | "trainingKcalRows" | "commentsRows" | "eventsRow";

interface TableContextType {
    addCell: (cell: HTMLDivElement, posX: number, posY: number, SideElement: ReactNode) => void;
    setSideElement: (element: React.ReactNode | null) => void;
    cancelFocus: () => void;
    tableFragmentIndex: Record<TableFragmentIndexKey, { start: number; end: number }>;
    sideElement: React.ReactNode | null;
    selectedCell: { x: number, y: number };
    isFocused: boolean;
    startMonday: Date;
    daysOfWeek: string[];
    meals: NonNullable<ReturnType<typeof useFetchMeals>["data"]>;
    planing: ReturnType<typeof usePlaning>;
}

export const Context = createContext<TableContextType | undefined>(undefined);

export const useTableContext = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("useTableContext must be used within a TableProvider");
    }
    return context;
}