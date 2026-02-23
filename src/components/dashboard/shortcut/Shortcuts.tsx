import { Draggable } from "@src/components/helpers/Draggable";
import { compareIncludeStringsForShortcut } from "@src/helpers/shortcut";
import {
  useConfigAvailableShortcuts,
  useConfigSelectedShortcutId,
  useConfigSetShortcutConfig,
  useConfigSetShortcuts,
  useConfigShortcutConfig,
} from "@src/store/slices/config/hook";
import { debounce } from "lodash";
import { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface AppShortcutsProps {
  parentRef: React.RefObject<HTMLElement | null>;
}

const AvailabableShortcutList = ({ 
  selectedIdx, 
  onSelect 
}: { 
  selectedIdx: number;
  onSelect: (shortcut: string) => void;
}) => {
  const availableShortcuts = useConfigAvailableShortcuts();
  const { guess: guessStr } = useConfigSelectedShortcutId();

  return (
    <div className="mb-3 flex flex-col gap-2 items-end max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-nutrition-purple/70 scrollbar-track-nutrition-purple/20">
      {availableShortcuts
        .slice(0, 10)
        .map((s, i) => {
          if (i === selectedIdx) {
            return (
              <p
                key={s}
                onClick={() => onSelect(s)}
                className="text-sm font-bold text-white underline decoration-white/70 decoration-2 underline-offset-2 px-2 py-1 bg-white/20 rounded-md cursor-pointer"
              >
                {s}
              </p>
            );
          } else if (compareIncludeStringsForShortcut(guessStr, s)) {
            return (
              <p
                key={s}
                onClick={() => onSelect(s)}
                className="text-sm text-white/80 hover:text-white transition-colors px-2 py-1 hover:bg-white/10 rounded-md cursor-pointer"
              >
                {s}
              </p>
            );
          }
          return null;
        })
        .filter(Boolean)}
    </div>
  );
};

export const AppShortcuts = ({ parentRef }: AppShortcutsProps) => {
  const { id: currId, guess: guessStr } = useConfigSelectedShortcutId();
  const { isFocused, positionX, positionY } = useConfigShortcutConfig();
  const { t } = useTranslation();
  const set = useConfigSetShortcuts();
  const setConfig = useConfigSetShortcutConfig();
  const availableSh = useConfigAvailableShortcuts();
  const availableShortcuts = useMemo(() => {
    if (!guessStr) return availableSh;
    return availableSh.filter((s) =>
      compareIncludeStringsForShortcut(guessStr, s),
    );
  }, [availableSh, guessStr]);
  const [listIdx, setListIdx] = useState(-1);
  // Only navigate through the visible items (max 10)
  const visibleShortcutsLength = Math.min(availableShortcuts.length, 10);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when shortcut is focused,
  // Also on component mount if it's already focused (e.g., due to a previous shortcut)
  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
    }
  }, [isFocused]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
      case "Tab":
        e.preventDefault();
        if (listIdx >= 0 && listIdx < visibleShortcutsLength) {
          const selectedShortcut = availableShortcuts[listIdx];
          set(selectedShortcut, "");
          setListIdx(-1);
        } else if (guessStr) {
          set(guessStr, "");
        }
        break;
      case "Escape":
        e.preventDefault();
        set("", "");
        setListIdx(-1);
        inputRef.current?.blur();
        break;
      case "ArrowDown":
        e.preventDefault();
        setListIdx((prev) => (prev < visibleShortcutsLength - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setListIdx((prev) => (prev > 0 ? prev - 1 : visibleShortcutsLength - 1));
        break;
      default:
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    set(currId, e.target.value);
    setListIdx(-1);
  };

  const handleSelectShortcut = (shortcut: string) => {
    set(shortcut, "");
    setListIdx(-1);
  };

  return (
    <Draggable
      parentRef={parentRef}
      initialPosition={
        positionX && positionY ? { x: positionX, y: positionY } : undefined
      }
      onMove={(pos) => {
        debounce(
          () => setConfig({ positionX: pos.x, positionY: pos.y }),
          100,
        )();
      }}
      className="m-2 px-6 py-4 rounded-xl shadow-2xl bg-gradient-to-br from-nutrition-purple via-nutrition-purple to-nutrition-purple/90 text-white backdrop-blur-sm border border-nutrition-purple/50"
    >
      <AvailabableShortcutList selectedIdx={listIdx} onSelect={handleSelectShortcut} />

      {currId && (
        <p className="text-sm mb-2 text-white/90">
          {t("system:shortcuts.draggableComponent.selected")}{" "}
          <span className="font-bold text-white bg-white/15 px-2 py-0.5 rounded">
            {currId}
          </span>
        </p>
      )}

      <input
        ref={inputRef}
        type="text"
        value={guessStr}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setConfig({ isFocused: true })}
        onBlur={() => setConfig({ isFocused: false })}
        placeholder={t("system:shortcuts.draggableComponent.placeholder")}
        className="w-full px-3 py-2 rounded-lg bg-black/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-nutrition-purple text-sm cursor-text border border-white/20 transition-all"
      />

      <p className="text-xs text-white/80 mt-2 flex items-center justify-center gap-2">
        <span className="bg-white/15 px-2 py-0.5 rounded">{t("system:shortcuts.draggableComponent.navigate")}</span>
        <span className="bg-white/15 px-2 py-0.5 rounded">{t("system:shortcuts.draggableComponent.enterSelect")}</span>
        <span className="bg-white/15 px-2 py-0.5 rounded">{t("system:shortcuts.draggableComponent.escExit")}</span>
      </p>
    </Draggable>
  );
};
