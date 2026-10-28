import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import type FromDate from "@src/helpers/dates";
import { useFormatDate, useFormatNumber } from "./format";
import { isInPeriod, type Period } from "./period";
import {
  emptyTextStyle,
  listItemStyle,
  pointTagStyle,
} from "../../../../../races/components/formStyles";

// Espera tras la última tecla antes de lanzar la búsqueda
const SEARCH_DELAY_MS = 400;

export type HistoryPageProps = {
  period: Period;
  // Selecciona la semana de la fecha
  onSelectWeek: (date: FromDate) => void;
};

export type HistoryItem = {
  key: string;
  date: FromDate;
  tag?: string;
  text: ReactNode;
  // Icono delante de la fecha y clases extra de la tarjeta (p. ej. el tipo de nota)
  icon?: ReactNode;
  className?: string;
};

// Valor del periodo y su tendencia semanal (sin tendencia, solo el valor)
export const SummaryStat = ({
  label,
  value,
  trend,
  unit = "",
}: {
  label: string;
  value: number;
  // Cambio por semana, en la misma unidad que value
  trend?: number | null;
  unit?: string;
}) => {
  const { t } = useTranslation();
  const formatNumber = useFormatNumber();

  return (
    <div className="rounded-lg border border-nutrition-green/20 bg-white px-3 py-2">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-lg font-semibold text-text-title">
        {formatNumber(value)} {unit}
      </p>
      {trend != null && (
        <p className="text-xs text-text-muted">
          {t("data:appointments.form.history.perWeek", {
            value: `${trend > 0 ? "+" : ""}${formatNumber(trend)} ${unit}`,
          })}
        </p>
      )}
    </div>
  );
};

// Kcal ganadas (azul) o perdidas (morado) de media por semana
export const BalanceStat = ({
  label,
  kcalPerWeek,
  unit,
}: {
  label: string;
  kcalPerWeek: number;
  unit: string;
}) => {
  const { t } = useTranslation();
  const formatNumber = useFormatNumber();
  const rounded = Math.round(kcalPerWeek);
  const tone =
    rounded > 0 ? "text-blue-600" : rounded < 0 ? "text-purple-600" : "text-text-title";

  return (
    <div className="rounded-lg border border-nutrition-green/20 bg-white px-3 py-2 sm:col-span-2">
      <p className="text-xs text-text-muted">{label}</p>
      <p className={`text-lg font-semibold ${tone}`}>
        {rounded > 0 ? "+" : ""}
        {formatNumber(rounded)} {unit}
      </p>
      {rounded !== 0 && (
        <p className={`text-xs ${tone}`}>
          {t(`data:appointments.form.history.${rounded > 0 ? "gained" : "lost"}`)}
        </p>
      )}
    </div>
  );
};

// Lista de lo ocurrido en el periodo elegido
export const SummaryList = ({
  title,
  items,
  emptyText,
}: {
  title?: string;
  items: HistoryItem[];
  emptyText: string;
}) => {
  const formatDate = useFormatDate();

  return (
    <div className="flex flex-col gap-2">
      {title && <h4 className="text-sm font-semibold text-text-title">{title}</h4>}
      {items.length === 0 ? (
        <p className={emptyTextStyle}>{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.key} className={`${listItemStyle()} ${item.className ?? ""}`}>
              <ItemContent item={item} formattedDate={formatDate(item.date)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ItemContent = ({
  item,
  formattedDate,
}: {
  item: HistoryItem;
  formattedDate: string;
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      {item.icon}
      <span className="text-xs text-text-muted">{formattedDate}</span>
      {item.tag && <span className={pointTagStyle}>{item.tag}</span>}
    </div>
    <div className="whitespace-pre-line text-sm text-text-title">{item.text}</div>
  </div>
);

// Buscador con los resultados en tarjetas: al pulsar una, se elige su semana.
// Se resaltan las que caen dentro del periodo elegido
export const HistorySearch = ({
  placeholder,
  search,
  onSearch,
  results,
  isError,
  period,
  onSelectWeek,
}: {
  placeholder: string;
  search: string;
  // Recibe el texto ya esperado SEARCH_DELAY_MS: tiene que ser estable (un setState)
  onSearch: (search: string) => void;
  results: HistoryItem[] | undefined;
  isError: boolean;
  period: Period;
  onSelectWeek: (date: FromDate) => void;
}) => {
  const { t } = useTranslation();
  const formatDate = useFormatDate();
  const [text, setText] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(text), SEARCH_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [text, onSearch]);

  return (
    <div className="flex flex-col gap-2">
      <label className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="search"
          value={text}
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-md border border-gray-blue-300 bg-gray-blue-50 py-2 pl-9 pr-3 text-gray-blue-700 focus:border-gray-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-blue-400"
        />
      </label>

      {isError && (
        <p className="text-sm text-red-500" role="alert">
          {t("data:appointments.form.errors.load")}
        </p>
      )}
      {search.trim() !== "" && results?.length === 0 && (
        <p className={emptyTextStyle}>{t("data:appointments.form.history.noResults")}</p>
      )}
      {search.trim() !== "" && !!results?.length && (
        <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
          {results.map((item) => {
            const formattedDate = formatDate(item.date, true);
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => onSelectWeek(item.date)}
                  title={t("data:appointments.form.history.goToWeek", { date: formattedDate })}
                  className={`w-full text-left transition hover:border-nutrition-green ${listItemStyle()} ${
                    item.className ?? ""
                  } ${isInPeriod(item.date, period) ? "ring-2 ring-light-green/50" : ""}`}
                >
                  <ItemContent item={item} formattedDate={formattedDate} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
