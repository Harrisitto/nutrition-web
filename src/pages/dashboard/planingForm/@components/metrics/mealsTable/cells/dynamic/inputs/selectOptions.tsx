import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTableContext } from "../../../tableContext";
import { useAppSelector } from "@src/store/store";

const formatString = (str: string) => {
  if (!str) return "";
  return str.trim().toLowerCase().replace(/\s+/g, "");
};

const compareStrings = (str1: string, str2: string) => {
  return formatString(str1).includes(formatString(str2));
};

export const SideSelectOptions = ({
  initialId,
  options,
  render,
  onSelect,
}: {
  initialId?: string;
  options: [string, string][];
  render?: (optionId: string) => React.ReactNode;
  onSelect: (optionId: string) => void;
}) => {
  const { cancelFocus } = useTableContext();
  const selectOptionsCommands = useAppSelector(
    (state) => state.config.keyboardCommands.selectOptions,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number>(() => {
    const index = options.findIndex(([id]) => id === initialId);
    return index >= 0 ? index : 0;
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Apuntamos este ref directamente al contenedor con scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return (
      options.filter(([, label]) => compareStrings(label, searchTerm)) || []
    );
  }, [options, searchTerm]);

  // Resetear el índice a 0 si el término de búsqueda cambia y reduce las opciones
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  // 2. EFECTO MAGICO: Centrar el scroll cuando cambia selectedIndex
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    // Buscamos el elemento hijo que tenga nuestro atributo personalizado activo
    const activeElement = scrollContainerRef.current.querySelector(
      '[data-active="true"]',
    ) as HTMLElement;

    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: "smooth", // Cambia a "auto" si prefieres que sea instantáneo
        block: "center",
        inline: "nearest",
      });
    }
  }, [selectedIndex]); // Solo se dispara si cambia la selección

  const applySelection = useCallback(
    (optionId: string) => {
      onSelect(optionId);
      setSearchTerm("");
      cancelFocus();
    },
    [onSelect, cancelFocus],
  );

  useEffect(() => {
    const numOptions = filteredOptions.length;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case selectOptionsCommands.optionDown:
          if (numOptions === 0) break;
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % numOptions);
          break;
        case selectOptionsCommands.optionUp:
          if (numOptions === 0) break;
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + numOptions) % numOptions);
          break;
        case selectOptionsCommands.confirmOption:
          e.preventDefault();
          if (numOptions === 0) break;
          if (selectedIndex >= 0 && selectedIndex < numOptions) {
            applySelection(filteredOptions[selectedIndex][0]);
          }
          setSearchTerm("");
          cancelFocus();
          break;
        case selectOptionsCommands.cancelOption:
          e.preventDefault();
          setSearchTerm("");
          cancelFocus();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    applySelection,
    filteredOptions,
    selectedIndex,
    cancelFocus,
    selectOptionsCommands,
  ]);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-nutrition-green focus:ring-2 focus:ring-nutrition-green/20 mb-3"
        placeholder="..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 3. Colocamos el scrollContainerRef aquí (donde está el overflow-y-auto) */}
      <div
        ref={scrollContainerRef}
        className="max-h-[70vh] space-y-2 overflow-y-auto pr-1"
      >
        {filteredOptions.map(([id, label], index) => {
          const isActive = index === selectedIndex;

          return (
            <div
              key={id}
              // 4. Inyectamos data-active para que el querySelector lo encuentre fácilmente
              data-active={isActive}
              className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition ${
                isActive
                  ? "border-dark-green/40 bg-dark-green/10 text-dark-green shadow-sm"
                  : "border-gray-200 bg-white text-gray-800 hover:border-nutrition-green/40 hover:bg-nutrition-green/5"
              }`}
              onClick={() => applySelection(id)}
            >
              <div className="font-medium">{label}</div>
              {render?.(id)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
