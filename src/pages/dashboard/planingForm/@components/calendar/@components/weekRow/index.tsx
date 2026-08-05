import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Copy } from "lucide-react";
import { DraggableWeekRow } from "./draggableWeek";
import { WeekRowVisual } from "./visualWeek";
import { useTranslation } from "react-i18next";
import {
  useInsertPlaningWithMeals,
  type useFetchPlanning,
} from "@src/services/tanstack/user/planing";

type PlaningType = NonNullable<
  ReturnType<typeof useFetchPlanning>["data"]
>[number];

interface CalendarViewProps {
  weeksGrid: Date[][];
}

export const CalendarView = ({ weeksGrid }: CalendarViewProps) => {
  const { t } = useTranslation();
  const [activeDays, setActiveDays] = useState<Date[] | null>(null);
  const insertPlaning = useInsertPlaningWithMeals();

  // Umbral de 5px para evitar activaciones por clics accidentales
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const days = event.active.data.current?.days as Date[];
    if (days) setActiveDays(days);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDays(null);

    // Si se soltó sobre una semana distinta a la de origen
    if (over && active.id !== over.id) {
      // 1. Extraemos los datos del payload arrastrado y los días de destino
      const sourceData = active.data.current?.planingData as PlaningType[];
      const targetWeekStart = over.data.current?.days[0] as Date;

      if (sourceData && targetWeekStart) {
        (async () => {
          try {
            await Promise.all(
              sourceData.map((day, index) => {
                const newDate = new Date(targetWeekStart);
                newDate.setDate(newDate.getDate() + index);

                return insertPlaning.mutateAsync({
                  ...day,
                  date: newDate, // Guardamos solo la fecha en formato YYYY-MM-DD
                  meals:
                    day.user_planing_meal?.map((meal) => ({
                      meal_id: meal.meal_id,
                      type_id: meal.recipe_type?.id,
                    })) || [],
                  comment: "",
                  event: "",
                });
              }),
            );
          } catch (error) {
            console.error("Error al clonar la semana:", error);
          }
        })();
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-y-1 p-4 shadow-xs">
        {weeksGrid.map((weekDays, idx) => (
          <DraggableWeekRow
            key={weekDays[0].toISOString() || idx}
            days={weekDays}
          />
        ))}
      </div>

      {/* ELEMENTO FLOTANTE AL ARRASTRAR */}
      <DragOverlay
        dropAnimation={{
          duration: 150,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeDays ? (
          <div className="relative flex items-center gap-2 rounded-2xl border-2 border-nutrition-green bg-white/95 p-2 shadow-2xl backdrop-blur-xs scale-105">
            <span className="absolute top-[-20px] flex items-center gap-1.5 rounded-lg bg-nutrition-green px-2.5 py-1 text-xs font-bold text-white shadow-xs">
              <Copy className="h-3.5 w-3.5" />
              {t("data:dashboardTable.actions.cloneTitle")}
            </span>
            <div className="pointer-events-none opacity-50">
              <WeekRowVisual days={activeDays} />
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
