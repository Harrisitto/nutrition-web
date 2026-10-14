import { INK, LANDMARK_LANE_HEIGHT } from "./constants";

// Icono y nombre del punto de interés en la parte inferior de su línea, a la altura de su carril
export const LandmarkLabel = ({
  viewBox,
  iconUrl,
  name,
  lane,
}: {
  viewBox?: { x?: number; y?: number; height?: number };
  iconUrl?: string;
  name: string;
  lane: number;
}) => {
  if (viewBox?.x === undefined || viewBox.y === undefined || viewBox.height === undefined) {
    return null;
  }
  const bottom = viewBox.y + viewBox.height - lane * LANDMARK_LANE_HEIGHT;
  return (
    <g>
      {iconUrl && (
        <image href={iconUrl} x={viewBox.x - 9} y={bottom - 34} width={18} height={18} />
      )}
      <text
        x={viewBox.x}
        y={bottom - 5}
        textAnchor="middle"
        fill={INK}
        fontSize={10}
        paintOrder="stroke"
        stroke="white"
        strokeWidth={3}
      >
        {name}
      </text>
    </g>
  );
};
