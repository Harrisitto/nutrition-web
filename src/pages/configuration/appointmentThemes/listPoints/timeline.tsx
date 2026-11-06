import { useEffect, useRef, useState } from "react";
import { useFetchAppointmentThemeById } from "@src/services/tanstack/data/appointments";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { groupByDay } from "./groups";

// Separación mínima entre marcadores: la altura de una etiqueta (text-xs) con algo de aire
const MIN_GAP_PX = 22;

/**
 * Coloca los marcadores proporcionalmente a su día y, si dos quedan a menos de MIN_GAP_PX, empuja
 * el de abajo. Si así se salen por abajo, los recoloca desde el final hacia arriba. Si ni así
 * caben, los reparte a partes iguales. Los marcadores llegan ordenados por día.
 */
const spreadPositions = (ratios: number[], height: number) => {
  if (ratios.length * MIN_GAP_PX > height) {
    const step = ratios.length > 1 ? height / (ratios.length - 1) : 0;
    return ratios.map((_, index) => index * step);
  }
  const tops = ratios.map((ratio) => ratio * height);
  for (let i = 1; i < tops.length; i++) {
    tops[i] = Math.max(tops[i], tops[i - 1] + MIN_GAP_PX);
  }
  for (let i = tops.length - 1; i >= 0; i--) {
    const limit = i === tops.length - 1 ? height : tops[i + 1] - MIN_GAP_PX;
    tops[i] = Math.min(tops[i], limit);
  }
  return tops;
};

// Alto en px del elemento, actualizado al cambiar de tamaño
const useHeight = (ref: React.RefObject<HTMLElement | null>) => {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return height;
};

/**
 * Vertical rounded bar with the theme points placed along it proportionally to their in_days.
 * Los puntos del mismo día van en un único marcador con el nombre de su grupo.
 * The page does not scroll, so it is always on screen.
 */
export const PointsTimeline = ({ themeId }: { themeId: number | null }) => {
  const { t } = useTranslation();
  const { data: points, isLoading } = useFetchAppointmentThemeById(themeId ?? 0);
  const trackRef = useRef<HTMLDivElement>(null);
  const height = useHeight(trackRef);

  const groups = themeId !== null ? groupByDay(points ?? []) : [];
  // Grupos ordenados por día: el último marca la escala
  const maxDays = groups.length ? groups[groups.length - 1].inDays : 0;
  const tops = spreadPositions(
    groups.map((group) => (maxDays > 0 ? group.inDays / maxDays : 0)),
    height,
  );

  return (
    // max-h-full: never taller than the row, which is fixed to the screen height
    <div className="self-start h-[50vh] max-h-full w-48 py-4">
      {/* bar */}
      <div className="relative h-full w-3 rounded-full bg-gray-blue-200">
        {isLoading && themeId !== null && (
          <Loader className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" size={20} />
        )}

        {/* inset keeps the first and last dots inside the rounded ends */}
        <div ref={trackRef} className="absolute inset-x-0 inset-y-2">
          {height > 0 && groups.map((group, index) => {
            const isGroup = group.points.length > 1;
            const days = t("data:configuration.sections.appointmentThemes.forms.point.inDays", {
              days: group.inDays,
            });
            // Un punto suelto se muestra tal cual; un grupo, por su nombre
            const label = isGroup
              ? group.groupName ?? t("data:configuration.sections.appointmentThemes.lists.points.unnamedGroup")
              : group.points[0].point;

            return (
              <div
                key={group.inDays}
                className="group absolute left-1/2 flex -translate-x-1.5 -translate-y-1/2 items-center gap-2 hover:z-20"
                style={{ top: tops[index] }}
              >
                <span
                  className={`h-3 w-3 shrink-0 rounded-full border-2 border-white shadow ${
                    isGroup ? "bg-dark-green" : "bg-nutrition-green"
                  }`}
                />
                <span className="max-w-40 truncate whitespace-nowrap text-xs">
                  <span className={`font-semibold ${isGroup && !group.groupName ? "italic text-text-muted" : ""}`}>
                    {label}
                  </span>
                  {isGroup && <span className="text-text-muted"> ({group.points.length})</span>}{" "}
                  <span className="text-text-muted">{days}</span>
                </span>

                {/* full text on hover, laid over the truncated label (dot 12px + gap 8px = left-5) */}
                <div className="pointer-events-none absolute left-5 top-1/2 hidden w-64 -translate-y-1/2 rounded-md border border-gray-blue-200 bg-white p-2 text-xs shadow-lg group-hover:block">
                  {isGroup && (
                    <div className="mb-1 font-semibold text-nutrition-green">{label}</div>
                  )}
                  {isGroup ? (
                    <ul className="list-disc pl-4">
                      {group.points.map((point) => (
                        <li key={point.id} className="whitespace-normal break-words">
                          {point.point}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="whitespace-normal break-words font-semibold">{label}</div>
                  )}
                  <div className="mt-1 text-text-muted">{days}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
