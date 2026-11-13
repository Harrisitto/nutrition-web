import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import {
  useFetchRecipeType,
  useFetchRecipeTypes,
} from "@src/services/tanstack/data/recipeTypes";

// Lo que usa el selector: vale para useFetchRecipeType y para las filas de la RPC (useFetchRecipeTypes)
type RecipeType = Pick<
  NonNullable<ReturnType<typeof useFetchRecipeType>["data"]>,
  "id" | "name" | "kcal" | "prot" | "hc" | "fat"
>;

// Distancia (px) al final de la lista a la que se pide la siguiente pagina
const LOAD_MORE_THRESHOLD = 48;

const MacroChips = ({ type }: { type: RecipeType }) => {
  const { t } = useTranslation();
  const macros = [
    { key: "prot", value: type.prot },
    { key: "hc", value: type.hc },
    { key: "fat", value: type.fat },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-1 text-[11px] leading-none">
      <span className="rounded-full bg-nutrition-green/15 px-1.5 py-1 font-semibold text-dark-green">
        {type.kcal} {t("forms:recipeType.macros.kcal")}
      </span>
      {macros.map(({ key, value }) => (
        <span
          key={key}
          className="rounded-full bg-gray-blue-100 px-1.5 py-1 text-gray-blue-600"
        >
          {t(`forms:recipeType.macros.${key}`)} {value}
        </span>
      ))}
    </div>
  );
};

/**
 * Selector de tipo de receta con búsqueda por nombre (en el idioma actual)
 * y carga paginada al hacer scroll.
 */
const InputSelectRecipeType = ({
  recipeTypeId,
  onChange,
  label,
  clearable = true,
}: {
  recipeTypeId: number | null;
  onChange: (recipeTypeId: number | null) => void;
  label?: string;
  /** Muestra la opción "Sin tipo" para dejar el campo vacío */
  clearable?: boolean;
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Solo se cargan las páginas cuando el desplegable está abierto
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useFetchRecipeTypes({ searchStr: search, enabled: isOpen });
  const { data: selected } = useFetchRecipeType(recipeTypeId);

  const recipeTypes = useMemo(() => data?.pages.flat() ?? [], [data]);
  // null = opción "Sin tipo"
  const options = useMemo<(RecipeType | null)[]>(
    () => (clearable ? [null, ...recipeTypes] : recipeTypes),
    [clearable, recipeTypes],
  );

  const close = () => {
    setIsOpen(false);
    setSearch("");
  };

  const select = (option: RecipeType | null) => {
    onChange(option?.id ?? null);
    close();
  };

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isOpen]);

  // Cada búsqueda nueva empieza resaltando la primera opción
  useEffect(() => setHighlighted(0), [search, isOpen]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${highlighted}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  const loadMoreIfNearEnd = (list: HTMLElement) => {
    const distanceToEnd = list.scrollHeight - list.scrollTop - list.clientHeight;
    if (distanceToEnd < LOAD_MORE_THRESHOLD && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlighted((i) => Math.min(i + 1, options.length - 1));
        // Al llegar al final con teclado también se cargan más
        if (highlighted >= options.length - 3 && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlighted((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        event.preventDefault();
        if (highlighted < options.length) select(options[highlighted]);
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative flex w-full flex-col gap-2">
      {label && <span className="text-sm text-gray-blue-600">{label}</span>}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        className={`flex w-full items-center gap-2 rounded-lg border bg-gray-blue-50 px-3 py-2 text-left transition hover:border-nutrition-green/50 focus:outline-none focus:ring-2 focus:ring-nutrition-green/40 ${
          isOpen ? "border-nutrition-green/60" : "border-gray-blue-300"
        }`}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {recipeTypeId !== null && selected ? (
            <>
              <span className="truncate text-sm font-medium text-text-title">
                {selected.name ?? "—"}
              </span>
              <MacroChips type={selected} />
            </>
          ) : (
            <span className="text-sm text-text-muted">
              {recipeTypeId !== null
                ? t("system:messages.loading")
                : t("forms:recipeType.placeholder")}
            </span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-blue-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full z-30 mt-1 w-full min-w-64 overflow-hidden rounded-xl border border-nutrition-green/20 bg-gray-blue-50 shadow-lg">
          <div className="flex items-center gap-2 border-b border-gray-blue-200 px-3 py-2">
            <Search size={16} className="shrink-0 text-gray-blue-400" />
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t("forms:recipeType.search")}
              aria-label={t("forms:recipeType.search")}
              className="min-w-0 flex-1 bg-transparent text-sm text-text-body placeholder:text-text-muted focus:outline-none"
            />
            {isFetching && !isFetchingNextPage ? (
              <Loader2 size={16} className="shrink-0 animate-spin text-gray-blue-400" />
            ) : search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label={t("forms:recipeType.clearSearch")}
                className="shrink-0 rounded p-0.5 text-gray-blue-400 hover:text-gray-blue-600"
              >
                <X size={14} />
              </button>
            ) : null}
          </div>

          <ul
            ref={listRef}
            role="listbox"
            onScroll={(event) => loadMoreIfNearEnd(event.currentTarget)}
            className="max-h-72 overflow-y-auto py-1"
          >
            {options.map((option, index) => {
              const isSelected = (option?.id ?? null) === recipeTypeId;
              const isHighlighted = index === highlighted;
              return (
                <li
                  key={option?.id ?? "none"}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlighted(index)}
                  // mousedown evita que el input pierda el foco antes de seleccionar
                  onMouseDown={(event) => {
                    event.preventDefault();
                    select(option);
                  }}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-2 ${
                    isHighlighted ? "bg-white-green" : ""
                  }`}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    {option ? (
                      <>
                        <span
                          className={`truncate text-sm ${isSelected ? "font-semibold text-nutrition-green" : "text-text-title"}`}
                        >
                          {option.name ?? "—"}
                        </span>
                        <MacroChips type={option} />
                      </>
                    ) : (
                      <span className="text-sm italic text-text-muted">
                        {t("forms:recipeType.none")}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check size={16} className="shrink-0 text-nutrition-green" />
                  )}
                </li>
              );
            })}

            {!isFetching && recipeTypes.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-text-muted">
                {t("forms:recipeType.noResults")}
              </li>
            )}
            {isFetchingNextPage && (
              <li className="flex justify-center py-2">
                <Loader2 size={16} className="animate-spin text-gray-blue-400" />
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InputSelectRecipeType;
