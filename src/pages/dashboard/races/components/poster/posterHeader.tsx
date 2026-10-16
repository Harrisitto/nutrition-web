import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import FromDate from "@src/helpers/dates";
import { Coffee, Droplet, Flame, Wheat } from "lucide-react";
import { formatNumber } from "./format";
import type { RacePosterData } from "./posterData";
import {
  EYEBROW_FONT_SIZE,
  HEADER_HEIGHT,
  LABEL_FONT_SIZE,
  STAT_FONT_SIZE,
  SUBTITLE_FONT_SIZE,
  TITLE_FONT_SIZE,
} from "./constants";

const ICON_SIZE = 26;

// Total de la carrera: icono, valor y unidad, sin texto ni contenedor
const TotalStat = ({ icon, value, unit }: { icon: ReactNode; value: string; unit: string }) => (
  <div className="flex items-center gap-2.5 whitespace-nowrap">
    {icon}
    <span className="font-bold leading-none text-dark-green" style={{ fontSize: STAT_FONT_SIZE }}>
      {value}
    </span>
    <span className="font-medium leading-none text-text-muted" style={{ fontSize: LABEL_FONT_SIZE }}>
      {unit}
    </span>
  </div>
);

/**
 * Nombre de la carrera (con una etiqueta encima) con su distancia, desnivel y fecha y, a la
 * derecha, los totales de lo que se toma en ella. Los que valen 0 no se muestran (salvo los
 * hidratos).
 */
export const PosterHeader = ({ data }: { data: RacePosterData }) => {
  const { t, i18n } = useTranslation();
  const number = (value: number) => formatNumber(Math.round(value), i18n.language);

  const date = new FromDate(data.date).toLocaleDateString(i18n.language, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const details = [
    data.distanceKm !== null && `${formatNumber(data.distanceKm, i18n.language)} km`,
    data.elevationGain !== null && `+${number(data.elevationGain)} m`,
    date,
  ].filter(Boolean);

  const { hc_amount, kcal, caffeine_amount, liquid_amount, sodium_amount } = data.totals;
  const totals = [
    {
      key: "hc",
      icon: <Wheat size={ICON_SIZE} className="text-nutrition-green" />,
      value: number(hc_amount),
      unit: "g",
    },
    {
      key: "kcal",
      icon: <Flame size={ICON_SIZE} className="text-nutrition-red" />,
      value: number(kcal),
      unit: "kcal",
    },
    caffeine_amount > 0 && {
      key: "caffeine",
      icon: <Coffee size={ICON_SIZE} className="text-nutrition-purple" />,
      value: number(caffeine_amount),
      unit: "mg",
    },
    sodium_amount > 0 && {
      key: "sodium",
      icon: <span className="text-[19px] font-extrabold leading-none text-gray-blue-600">Na</span>,
      value: number(sodium_amount),
      unit: "mg",
    },
    liquid_amount > 0 && {
      key: "liquid",
      icon: <Droplet size={ICON_SIZE} className="fill-nutrition-blue text-nutrition-blue" />,
      value: number(liquid_amount),
      unit: "ml",
    },
  ].filter((total) => total !== false);

  return (
    <header className="flex items-start justify-between gap-12" style={{ height: HEADER_HEIGHT }}>
      <div className="min-w-0">
        <p
          className="mb-3 flex items-center gap-3 font-bold uppercase leading-none tracking-[0.18em] text-nutrition-green"
          style={{ fontSize: EYEBROW_FONT_SIZE }}
        >
          <span className="h-[3px] w-8 rounded-full bg-nutrition-green" />
          {t("data:races.poster.eyebrow")}
        </p>
        <h1
          className="truncate font-extrabold leading-[1.1] tracking-[-0.01em] text-nutrition-blue"
          style={{ fontSize: TITLE_FONT_SIZE }}
        >
          {data.name}
        </h1>
        <p
          className="mt-2 truncate text-gray-blue-600"
          style={{ fontSize: SUBTITLE_FONT_SIZE }}
        >
          {details.join(" · ")}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-10 pt-9">
        {totals.map(({ key, ...total }) => (
          <TotalStat key={key} {...total} />
        ))}
      </div>
    </header>
  );
};
