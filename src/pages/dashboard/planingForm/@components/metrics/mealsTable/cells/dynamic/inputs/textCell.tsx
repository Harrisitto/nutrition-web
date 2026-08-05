import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTableContext } from "../../../tableContext";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@src/store/store";

type FloatingBox = {
  top: number;
  left: number;
  width: number;
};

export const CellTextInput = ({
  isSelected,
  textValue,
  onSave,
  placeholder,
}: {
  isSelected: boolean;
  textValue: string;
  onSave: (value: string) => void;
  onchange?: (value: string) => void;
  placeholder?: string;
}) => {
  const { t } = useTranslation();
  const { isFocused } = useTableContext();
  const closeEditorKey = useAppSelector((state) => state.config.keyboardCommands.commentsEditor.closeEditor);
  const cellRef = useRef<HTMLDivElement>(null);
  const floatingPanelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wasActiveRef = useRef(false);
  const dirtyRef = useRef(false);
  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  

  const normalizeLeadingBreaks = useCallback((value: string) => {
    return value.replace(/^(\r?\n)+/, "");
  }, []);

  const [text, setText] = useState(normalizeLeadingBreaks(textValue));
  const [floatingBox, setFloatingBox] = useState<FloatingBox>({
    top: 0,
    left: 0,
    width: 480,
  });
  const [isEditorOpen, setIsEditorOpen] = useState(isSelected && isFocused);

  useEffect(() => {
    const isActive = isSelected && isFocused;
    setIsEditorOpen(isActive);
  }, [isSelected, isFocused, onSave, text]);

  const updateFloatingBox = useCallback(() => {
    if (!cellRef.current) return;

    const rect = cellRef.current.getBoundingClientRect();
    const horizontalMargin = 12;
    const maxWidth = Math.max(280, window.innerWidth - horizontalMargin * 2);
    const desiredWidth = Math.max(320, rect.width + 160);
    const width = Math.min(desiredWidth, maxWidth);

    const minCenter = horizontalMargin + width / 2;
    const maxCenter = window.innerWidth - horizontalMargin - width / 2;
    const centerX = rect.left + rect.width / 2;
    const left = Math.min(Math.max(centerX, minCenter), maxCenter);

    setFloatingBox({
      top: Math.max(8, rect.top + 4),
      left,
      width,
    });
  }, []);

  const clampPosition = useCallback((next: FloatingBox): FloatingBox => {
    const horizontalMargin = 12;
    const maxTop = Math.max(8, window.innerHeight - 80);
    const minLeft = horizontalMargin + next.width / 2;
    const maxLeft = window.innerWidth - horizontalMargin - next.width / 2;
    return {
      ...next,
      top: Math.min(Math.max(next.top, 8), maxTop),
      left: Math.min(Math.max(next.left, minLeft), maxLeft),
    };
  }, []);

  const handleDragStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();
      dragStateRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startLeft: floatingBox.left,
        startTop: floatingBox.top,
      };

      const onPointerMove = (moveEvent: PointerEvent) => {
        const dragState = dragStateRef.current;
        if (!dragState) return;

        const dx = moveEvent.clientX - dragState.startX;
        const dy = moveEvent.clientY - dragState.startY;
        setFloatingBox(
          clampPosition({
            ...floatingBox,
            left: dragState.startLeft + dx,
            top: dragState.startTop + dy,
          }),
        );
      };

      const onPointerUp = () => {
        dragStateRef.current = null;
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [clampPosition, floatingBox],
  );

  const saveHandler = useCallback(
    (str: string) => {
      if (!dirtyRef.current) return;
      onSave(normalizeLeadingBreaks(str));
      dirtyRef.current = false;
    },
    [normalizeLeadingBreaks, onSave],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== closeEditorKey) {
        e.stopPropagation();
        return;
      }
      saveHandler(text);
      inputRef.current?.blur();
    },
    [closeEditorKey, saveHandler, text],
  );

  useEffect(() => {
    const isActive = isSelected && isFocused;
    if (isActive) {
      inputRef.current?.focus();
      wasActiveRef.current = true;
      return;
    }
    if (wasActiveRef.current) {
      saveHandler(text);
      wasActiveRef.current = false;
    }
  }, [isSelected, isFocused, saveHandler, text]);

  useEffect(() => {
    if (textValue) {
      setText(normalizeLeadingBreaks(textValue));
    } else {
      setText("");
    }
    dirtyRef.current = false;
  }, [normalizeLeadingBreaks, setText, textValue]);

  useEffect(() => {
    if (!isEditorOpen) return;
    updateFloatingBox();
    const handleResize = () => {
      setFloatingBox((current) => clampPosition(current));
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [clampPosition, isEditorOpen, updateFloatingBox]);

  useEffect(() => {
    if (!isEditorOpen || !floatingPanelRef.current) return;

    floatingPanelRef.current.style.top = `${floatingBox.top}px`;
    floatingPanelRef.current.style.left = `${floatingBox.left}px`;
    floatingPanelRef.current.style.width = `${floatingBox.width}px`;
  }, [floatingBox, isEditorOpen]);

  return (
    <div
      ref={cellRef}
      className={`relative overflow-visible border transition-colors h-full w-full p-2 ${
        isSelected ? "z-[120]" : "z-0"
      } ${
        isSelected
          ? "border-dark-green bg-light-green text-white"
          : "border-nutrition-green/30 bg-nutrition-green/20 text-white-green hover:bg-nutrition-green/30"
      }`}
    >
      {isEditorOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={floatingPanelRef}
            data-table-editor-portal="true"
            className="fixed left-0 top-0 z-[9999] flex -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-nutrition-green/35 bg-gradient-to-b from-white to-white-green/95 shadow-[0_20px_45px_rgba(5,48,39,0.28)]"
          >
            <div
              onPointerDown={handleDragStart}
              className="flex cursor-move select-none items-center justify-between border-b border-nutrition-green/20 bg-white-green/70 px-3 py-2"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide text-nutrition-green">
                {t("data:dashboardTable.commentsRows.writeComment")}
              </span>
              <span className="rounded-full border border-nutrition-green/30 bg-white px-2 py-0.5 text-[10px] font-medium text-dark-green/80">
                {`${t("data:dashboardTable.commentsRows.pressEsc")} (${closeEditorKey})`}
              </span>
            </div>
            <div className="p-3">
              <textarea
                ref={inputRef}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  dirtyRef.current = true;
                }}
                onBlur={() => saveHandler(text)}
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                className="h-full min-h-[7rem] w-full resize-none rounded-lg border border-nutrition-green/25 bg-white p-3 text-sm leading-relaxed text-dark-green outline-none placeholder:text-dark-green/45 focus:border-nutrition-green/50 focus:ring-2 focus:ring-light-green/40"
              />
            </div>
          </div>,
          document.body,
        )}
      {!isEditorOpen ? (
        <div className="min-h-[3.5rem] z-0 w-full whitespace-pre-wrap break-words text-sm leading-relaxed text-dark-green"
          onClick={() => {
            if (!isSelected) return;
            requestAnimationFrame(() => {
              setIsEditorOpen(true);
            });
          }}
        >
          {text?.trim() ? (
            text
          ) : (
            <span className="italic text-dark-green/60">
              {placeholder || "-"}
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
};
