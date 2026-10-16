import { INK, type ChartSizes } from "./constants";

// Icono y nombre del punto de interés en la parte inferior de su línea, a la altura de su carril
export const LandmarkLabel = ({
  viewBox,
  iconUrl,
  name,
  lane,
  sizes,
}: {
  viewBox?: { x?: number; y?: number; height?: number };
  iconUrl?: string;
  name: string;
  lane: number;
  sizes: ChartSizes;
}) => {
  if (viewBox?.x === undefined || viewBox.y === undefined || viewBox.height === undefined) {
    return null;
  }
  const bottom = viewBox.y + viewBox.height - lane * sizes.landmarkLaneHeight;
  const textGap = sizes.landmarkFontSize / 2;
  const icon = sizes.landmarkIcon;
  return (
    <g>
      {iconUrl && (
        <image
          href={iconUrl}
          x={viewBox.x - icon / 2}
          y={bottom - textGap - sizes.landmarkFontSize - icon - textGap}
          width={icon}
          height={icon}
        />
      )}
      <text
        x={viewBox.x}
        y={bottom - textGap}
        textAnchor="middle"
        fill={INK}
        fontSize={sizes.landmarkFontSize}
        paintOrder="stroke"
        stroke="white"
        strokeWidth={sizes.landmarkFontSize / 3}
      >
        {name}
      </text>
    </g>
  );
};
