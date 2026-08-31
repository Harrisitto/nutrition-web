import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import ModalShell from "./@portal";
import { useAppSelector } from "@src/store/store";

export interface SelectEditorProps<T> {
  title: string;
  options: T[];
  initialValue?: T;
  getOptionId: (option: T) => string | number;
  getOptionLabel?: (option: T) => string;
  renderOption?: (
    option: T,
    state: { isSelected: boolean; isFocused: boolean },
  ) => ReactNode;
  onSave: (value: T) => void;
  onClose: () => void;
  searchable?: boolean;
}

export function SelectEditor<T>({
  title,
  options,
  initialValue,
  getOptionId,
  getOptionLabel = (item) => String(item),
  renderOption,
  onSave,
  onClose,
  searchable = true,
}: SelectEditorProps<T>) {
  const saveKey = useAppSelector(
    (state) => state.config.keyboardCommands.tableNavigation.saveData,
  );
  const closeKey = useAppSelector(
    (state) => state.config.keyboardCommands.tableNavigation.exitCell,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) =>
      getOptionLabel(opt).toLowerCase().includes(query),
    );
  }, [options, searchQuery, getOptionLabel]);

  const initialIndex = useMemo(() => {
    if (initialValue === undefined) return 0;
    const targetId = getOptionId(initialValue);
    const idx = options.findIndex((opt) => getOptionId(opt) === targetId);
    return idx !== -1 ? idx : 0;
  }, [options, initialValue, getOptionId]);

  const [focusedIndex, setFocusedIndex] = useState<number>(initialIndex);
  const [selectedValue, setSelectedValue] = useState<T | undefined>(
    initialValue,
  );

  useEffect(() => {
    setFocusedIndex(0);
  }, [searchQuery]);

  // Ajuste de scroll garantizando medidas correctas en el DOM
  useEffect(() => {
    if (!listRef.current) return;

    const frameId = requestAnimationFrame(() => {
      const container = listRef.current;
      if (!container) return;

      const focusedElement = container.children[focusedIndex] as HTMLElement;

      if (focusedElement) {
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;
        const elemTop = focusedElement.offsetTop;
        const elemBottom = elemTop + focusedElement.offsetHeight;

        if (elemTop < containerTop) {
          container.scrollTop = elemTop;
        } else if (elemBottom > containerBottom) {
          container.scrollTop = elemBottom - container.clientHeight;
        }
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [focusedIndex, filteredOptions]);

  const handleSave = useCallback(
    (itemToSave?: T) => {
      const item = itemToSave ?? filteredOptions[focusedIndex];
      if (item !== undefined) {
        onSave(item);
        onClose();
      }
    },
    [filteredOptions, focusedIndex, onSave, onClose],
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === saveKey) {
      e.preventDefault();
      handleSave();
      return;
    }

    if (e.key === closeKey) {
      e.preventDefault();
      onClose();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0,
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1,
        );
        break;

      case "Enter":
        e.preventDefault();
        handleSave();
        break;
    }
  };

  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="space-y-3" onKeyDown={handleKeyDown}>
        {searchable && (
          <input
            autoFocus
            type="text"
            value={searchQuery}
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-nutrition-green/30 px-3 py-2 text-sm text-dark-green outline-none focus:border-dark-green"
          />
        )}

        <div
          ref={listRef}
          tabIndex={searchable ? -1 : 0}
          autoFocus={!searchable}
          className="relative max-h-60 overflow-y-auto rounded-lg outline-none"
        >
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-center text-xs text-gray-500">
              No options found
            </div>
          ) : (
            filteredOptions.map((option, index) => {
              const isSelected =
                selectedValue !== undefined &&
                getOptionId(selectedValue) === getOptionId(option);
              const isFocused = index === focusedIndex;

              return (
                <div
                  key={getOptionId(option)}
                  onClick={() => {
                    setSelectedValue(option);
                    handleSave(option);
                  }}
                  onMouseMove={() => {
                    if (focusedIndex !== index) {
                      setFocusedIndex(index);
                    }
                  }}
                  className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors ${
                    isFocused ? "bg-nutrition-green/20" : ""
                  } ${
                    isSelected
                      ? "font-semibold text-dark-green"
                      : "text-gray-700"
                  }`}
                >
                  {renderOption
                    ? renderOption(option, { isSelected, isFocused })
                    : getOptionLabel(option)}
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-nutrition-green/30 px-3 py-2 text-xs font-semibold text-dark-green"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={filteredOptions.length === 0}
            className="rounded-md bg-dark-green px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

export default SelectEditor;
