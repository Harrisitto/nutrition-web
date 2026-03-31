import { useCallback, useEffect, useRef, useState } from "react";
import { useTableContext } from "../../../tableContext";

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
  const { isFocused } = useTableContext();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wasActiveRef = useRef(false);
  const dirtyRef = useRef(false);

  const [text, setText] = useState(textValue);

  const saveHandler = useCallback(
    (str: string) => {
      if (!dirtyRef.current) return;
      onSave(str);
      dirtyRef.current = false;
    },
    [onSave],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Escape") {
        e.stopPropagation();
        return;
      };
      e.preventDefault();
      e.stopPropagation();
      saveHandler(text);
      inputRef.current?.blur();
    },
    [saveHandler, text],
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
      setText(textValue);
    } else {
      setText("");
    }
    dirtyRef.current = false;
  }, [setText, textValue]);

  return (
    <div
      className={`border transition-colors h-full w-full p-2 ${
        isSelected
          ? "border-dark-green bg-light-green text-white"
          : "border-nutrition-green/30 bg-nutrition-green/20 text-white-green hover:bg-nutrition-green/30"
      }`}
    >
      {isSelected ? (
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
          className="h-full min-h-[3.5rem] w-full resize-none bg-transparent text-sm leading-relaxed text-white placeholder:text-white/60 focus:outline-none"
        />
      ) : (
        <div className="min-h-[3.5rem] w-full whitespace-pre-wrap break-words text-sm leading-relaxed text-dark-green">
          {text?.trim() ? text : <span className="italic text-dark-green/60">{placeholder || "-"}</span>}
        </div>
      )}
    </div>
  );
};
