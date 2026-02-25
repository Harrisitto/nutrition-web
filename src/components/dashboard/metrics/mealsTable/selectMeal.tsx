import { useFetchReceiptsForMeal } from "@src/services/tanstack/data/meals";
import { useInsertMeal } from "@src/services/tanstack/user/planing";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export const SelectMealCell = ({
  mealId,
  date,
  parentRef,
}: {
  mealId: number;
  date: Date;
  parentRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [isShown, setIsShown] = useState(false);
  const options = useFetchReceiptsForMeal(mealId).data || [];
  const insert = useInsertMeal();
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const lastWheelAt = useRef(0);
  const wheelIntervalMs = 100;

  const items = useMemo(() => {
    if (options.length === 0) {
      return [];
    }
    return [
      { id: -1, name: t("system:messages.clear") },
      ...options.map((option) => option.type_id),
    ];
  }, [options]);

  const insertMeal = useCallback(() => {
    const selectedItem = items[selectedIndex];
    if (!selectedItem) return;
    let deleteFlag = false;
    if (selectedItem.id === -1) {
      deleteFlag = true;
    }
    insert.mutateAsync({
      mealId: mealId,
      typeId: selectedItem.id,
      date: date,
      delete: deleteFlag,
    });
  }, [insert, mealId, options, selectedIndex, date]);

  useEffect(() => {
    if (!parentRef.current) return;
    const handleParentClick = () => setIsShown(true);
    parentRef.current.addEventListener("click", handleParentClick);
    return () => {
      parentRef.current?.removeEventListener("click", handleParentClick);
    };
  }, [parentRef]);

  useEffect(() => {
    if (!isShown) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (!parentRef.current?.contains(event.target as Node)) {
        setIsShown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isShown, parentRef]);

  useEffect(() => {
    if (!isShown) return;
    const handleKeyboard = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % items.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
          break;
        case "Enter":
          event.preventDefault();
          insertMeal();
          break;
        case "Escape":
          event.preventDefault();
          setIsShown(false);
          break;
      }
    };
    const handleMouseScroll = (event: WheelEvent) => {
      if (items.length === 0) return;
      const now = event.timeStamp
      if (now - lastWheelAt.current < wheelIntervalMs) return;
      lastWheelAt.current = now;
      event.preventDefault();
      if (event.deltaY > 0) {
        setSelectedIndex((prev) => (prev + 1) % items.length);
        return;
      }
      if (event.deltaY < 0) {
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
      }
    };

    document.addEventListener("keydown", handleKeyboard);
    document.addEventListener("wheel", handleMouseScroll, { passive: false });

    return () => {
      document.removeEventListener("keydown", handleKeyboard);
      document.removeEventListener("wheel", handleMouseScroll);
    };
  }, [isShown, items.length, insertMeal]);

  useEffect(() => {
    if (!insert.isSuccess) return;
    setIsShown(false);
  }, [insert.isSuccess]);

  if (!isShown) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-50 border border-gray-blue-200 bg-gray-blue-50 p-1 flex flex-col gap-1 text-text-body">
      <button
        type="button"
        className="w-full h-full text-left px-2 py-1 text-sm rounded hover:bg-gray-blue-100"
        onClick={insertMeal}
      >
        {items.length === 0 ? t("system:messages.noResults"): items[selectedIndex]?.name}
      </button>
    </div>
  );
};
