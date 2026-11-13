import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown, ImageOff, Loader2, Search, X } from "lucide-react";
import {
  useFetchScoredRaceIngredients,
  type RaceIngredient,
  type ScoredRaceIngredient,
} from "@src/services/tanstack/data/raceIngredients";

// Lo que se pinta de un ingrediente: sirve para las filas de la RPC y para el catálogo
type IngredientView = {
  id: number;
  name: string;
  image_url: string | null;
  carbs: number | null;
  sodium: number | null;
  caffeine: number | null;
  liquid: number | null;
};

const fromScored = (i: ScoredRaceIngredient): IngredientView => ({
  id: i.id,
  name: i.name,
  image_url: i.image_url,
  carbs: i.carbs_amount,
  sodium: i.sodium_amount,
  caffeine: i.caffeine_amount,
  liquid: i.liquid_amount,
});

const fromCatalog = (i: RaceIngredient): IngredientView => ({
  id: i.id,
  name: i.name,
  image_url: i.image_url,
  carbs: i.hc_amount,
  sodium: i.sodium_amount,
  caffeine: i.caffeine_amount,
  liquid: i.liquid_amount,
});

// Mismas etiquetas que en Configuración → Ingredientes de carrera
const AMOUNTS = [
  { key: "carbs", field: "hc_amount", unit: "g", style: "bg-amber-500/10 text-amber-700" },
  { key: "sodium", field: "sodium_amount", unit: "mg", style: "bg-sky-500/10 text-sky-700" },
  { key: "caffeine", field: "caffeine_amount", unit: "mg", style: "bg-rose-500/10 text-rose-700" },
  { key: "liquid", field: "liquid_amount", unit: "ml", style: "bg-gray-blue-100 text-gray-blue-600" },
] as const;

const Thumbnail = ({ ingredient }: { ingredient: IngredientView }) => (
  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white-green">
    {ingredient.image_url ? (
      <img alt="" src={ingredient.image_url} className="h-full w-full object-cover" />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-text-muted/60">
        <ImageOff size={16} />
      </div>
    )}
  </div>
);

const AmountChips = ({ ingredient }: { ingredient: IngredientView }) => {
  const { t } = useTranslation();
  const amounts = AMOUNTS.filter(({ key }) => ingredient[key] !== null);
  if (!amounts.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 text-[11px] leading-none">
      {amounts.map(({ key, field, unit, style }) => (
        <span key={key} className={`rounded px-1.5 py-1 font-medium ${style}`}>
          {t(`data:configuration.sections.raceIngredients.fields.${field}`)}{" "}
          <strong className="font-bold">
            {ingredient[key]} {unit}
          </strong>
        </span>
      ))}
    </div>
  );
};

const IngredientSummary = ({ ingredient }: { ingredient: IngredientView }) => (
  <div className="flex min-w-0 flex-1 items-center gap-3">
    <Thumbnail ingredient={ingredient} />
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="truncate text-sm font-semibold text-text-title">{ingredient.name}</span>
      <AmountChips ingredient={ingredient} />
    </div>
  </div>
);

/**
 * Selector de ingrediente para una toma: imagen, cantidades y búsqueda por nombre.
 * La lista sale de la RPC scored_search_race_ingredients_for_user (sin borrados, por score para el
 * cliente); el elegido se pinta desde el catálogo, así se ve aunque la búsqueda lo deje fuera.
 */
export const IngredientSelect = ({
  clientId,
  value,
  onChange,
  catalog,
}: {
  clientId: string | null;
  /** id del ingrediente como string ("" = ninguno), como el resto del formulario */
  value: string;
  onChange: (value: string) => void;
  catalog: Map<number, RaceIngredient>;
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { data, isFetching } = useFetchScoredRaceIngredients({ clientId, searchStr: search });
  const options = (data ?? []).map(fromScored);
  const selectedRow = value ? catalog.get(Number(value)) : undefined;
  const selected = selectedRow ? fromCatalog(selectedRow) : undefined;

  const close = () => {
    setIsOpen(false);
    setSearch("");
  };

  const select = (option: IngredientView) => {
    onChange(String(option.id));
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

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlighted((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlighted((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        // Sin esto Enter enviaría el formulario de la toma
        event.preventDefault();
        if (options[highlighted]) select(options[highlighted]);
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      <span className="text-sm text-gray-blue-600">{t("data:races.ingredients.ingredient")}</span>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        className={`flex min-h-[2.625rem] w-full items-center gap-2 rounded-md border bg-gray-blue-50 px-3 py-1.5 text-left transition hover:border-nutrition-green/50 focus:outline-none focus:ring-2 focus:ring-nutrition-green/40 ${
          isOpen ? "border-nutrition-green/60" : "border-gray-blue-300"
        }`}
      >
        {selected ? (
          <IngredientSummary ingredient={selected} />
        ) : (
          <span className="flex-1 text-sm text-text-muted">
            {t("data:races.ingredients.selectIngredient")}
          </span>
        )}
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-blue-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full z-30 mt-1 w-full min-w-72 overflow-hidden rounded-xl border border-nutrition-green/20 bg-gray-blue-50 shadow-lg">
          <div className="flex items-center gap-2 border-b border-gray-blue-200 px-3 py-2">
            <Search size={16} className="shrink-0 text-gray-blue-400" />
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t("data:races.ingredients.search")}
              aria-label={t("data:races.ingredients.search")}
              className="min-w-0 flex-1 bg-transparent text-sm text-text-body placeholder:text-text-muted focus:outline-none"
            />
            {isFetching ? (
              <Loader2 size={16} className="shrink-0 animate-spin text-gray-blue-400" />
            ) : search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label={t("data:races.ingredients.clearSearch")}
                className="shrink-0 rounded p-0.5 text-gray-blue-400 hover:text-gray-blue-600"
              >
                <X size={14} />
              </button>
            ) : null}
          </div>

          <ul ref={listRef} role="listbox" className="max-h-80 overflow-y-auto py-1">
            {options.map((option, index) => {
              const isSelected = String(option.id) === value;
              return (
                <li
                  key={option.id}
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
                    index === highlighted ? "bg-white-green" : ""
                  }`}
                >
                  <IngredientSummary ingredient={option} />
                  {isSelected && <Check size={16} className="shrink-0 text-nutrition-green" />}
                </li>
              );
            })}

            {!isFetching && options.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-text-muted">
                {t("data:races.ingredients.noResults")}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
