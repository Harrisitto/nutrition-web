import { useTranslation } from "react-i18next";
import { IntakeCard } from "./intakeCard";
import { formatNumber } from "./format";
import type { PlacedStop } from "./layout";
import { BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE, BOX_PADDING, CARD_GAP } from "./constants";

/**
 * Caja de un km con tomas: el km arriba y las tarjetas de sus ingredientes en fila. Sin borde:
 * un fondo verde muy suave basta para agruparlas y deja el protagonismo a las tarjetas.
 */
export const StopBox = ({ stop, cardSize }: { stop: PlacedStop; cardSize: number }) => {
  const { i18n } = useTranslation();

  return (
    <div
      // Opaco: tapa las líneas que pasan por detrás
      className="absolute rounded-[18px] bg-white-green"
      style={{
        left: stop.x,
        top: stop.y,
        width: stop.width,
        height: stop.height,
        padding: BOX_PADDING,
      }}
    >
      <p
        className="flex items-baseline gap-1.5 whitespace-nowrap pl-1 pt-0.5 leading-none"
        style={{ height: BOX_HEADER_HEIGHT, fontSize: BOX_LABEL_FONT_SIZE }}
      >
        <span className="font-bold text-nutrition-blue">{formatNumber(stop.km, i18n.language, 2)}</span>
        <span className="text-[0.75em] font-semibold text-nutrition-blue/60">km</span>
      </p>
      <div className="flex" style={{ gap: CARD_GAP }}>
        {stop.intakes.map((intake, index) => (
          <IntakeCard key={index} intake={intake} size={cardSize} />
        ))}
      </div>
    </div>
  );
};
