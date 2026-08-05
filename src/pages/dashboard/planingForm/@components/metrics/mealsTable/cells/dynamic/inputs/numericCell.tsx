import { useTableContext } from "../../../tableContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "@src/store/store";

export const CellNumericInput = ({
  isSelected,
  numValue,
  onSave,
}: {
  isSelected: boolean;
  numValue: number;
  onSave: (value: number) => void;
}) => {
  const { isFocused } = useTableContext();
  const saveDataKey = useAppSelector((state) => state.config.keyboardCommands.tableNavigation.saveData);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasActiveRef = useRef(false);
  const dirtyRef = useRef(false);

  const [value, setValue] = useState(numValue);

  const saveHandler = useCallback(
    (num: number) => {
      if (!dirtyRef.current) return;
      onSave(num);
      dirtyRef.current = false;
    },
    [onSave],
  );

  const handleEnterSave = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== saveDataKey) return;
      e.preventDefault();
      e.stopPropagation();
      saveHandler(value);
      inputRef.current?.blur();
    },
    [saveDataKey, saveHandler, value],
  );

  useEffect(() => {
    const isActive = isSelected && isFocused;

    if (isActive) {
      inputRef.current?.focus();
      wasActiveRef.current = true;
      return;
    }
    if (wasActiveRef.current) {
      saveHandler(value);
      wasActiveRef.current = false;
    }
  }, [isSelected, isFocused, saveHandler, value]);

  useEffect(() => {
    if (numValue) {
      setValue(numValue);
    } else {
      setValue(0);
    }
    dirtyRef.current = false;
  }, [numValue]);

  return (
    <div
      className={`border text-center transition-colors h-full w-full flex items-center justify-center ${
        isSelected
          ? "border-dark-green bg-light-green text-white"
          : "border-nutrition-green/30 bg-nutrition-green/20 text-white-green hover:bg-nutrition-green/30"
      }`}
    >
      {isSelected ? (
        <input
          placeholder="0"
          ref={inputRef}
          type="text"
          value={value > 0 ? value : ""}
          onChange={(e) => {
            dirtyRef.current = true;
            setValue(Number(e.target.value));
          }}
          onKeyDown={handleEnterSave}
          onBlur={() => saveHandler(value)}
          className="w-full h-full bg-transparent text-center text-fade-dark-green focus:outline-none placeholder:text-white/40"
        />
      ) : (
        <span className="text-sm text-dark-green">
          {value > 0 ? value : "-"}
        </span>
      )}
    </div>
  );
};
