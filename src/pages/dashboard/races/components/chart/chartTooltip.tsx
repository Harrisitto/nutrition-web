import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { ChartPoint } from "./chartData";

export const ChartTooltip = ({ active, payload }: TooltipContentProps<ValueType, NameType>) => {
  const point = payload?.[0]?.payload as ChartPoint | undefined;
  if (!active || !point) return null;

  return (
    <div className="rounded-lg border border-nutrition-green/20 bg-white-green px-3 py-2 text-xs text-dark-green shadow-sm">
      <p className="font-semibold">
        km {point.km.toFixed(1)} · {Math.round(point.altitude)} m
      </p>
      {/* Puede haber dos tomas iguales en el mismo km: la key es la posición */}
      {point.ingredients?.map((ingredient, index) => (
        <p key={index} className="text-text-muted">
          {ingredient}
        </p>
      ))}
    </div>
  );
};
