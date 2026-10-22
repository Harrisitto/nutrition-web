import { useFetchAppointmentThemeById } from "@src/services/tanstack/data/appointments";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Vertical rounded bar with the theme points placed along it proportionally to their in_days.
 * The page does not scroll, so it is always on screen.
 */
export const PointsTimeline = ({ themeId }: { themeId: number | null }) => {
  const { t } = useTranslation();
  const { data: points, isLoading } = useFetchAppointmentThemeById(themeId ?? 0);

  // Points come ordered by in_days, the last one sets the scale
  const maxDays = points?.length ? points[points.length - 1].in_days : 0;
  const topPercent = (inDays: number) => (maxDays > 0 ? (inDays / maxDays) * 100 : 0);

  return (
    // max-h-full: never taller than the row, which is fixed to the screen height
    <div className="self-start h-[50vh] max-h-full w-48 py-4">
      {/* bar */}
      <div className="relative h-full w-3 rounded-full bg-gray-blue-200">
        {isLoading && themeId !== null && (
          <Loader className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" size={20} />
        )}

        {/* inset keeps the first and last dots inside the rounded ends */}
        <div className="absolute inset-x-0 inset-y-2">
          {themeId !== null && points?.map((point) => (
            <div
              key={point.id}
              className="group absolute left-1/2 flex -translate-x-1.5 -translate-y-1/2 items-center gap-2 hover:z-20"
              style={{ top: `${topPercent(point.in_days)}%` }}
            >
              <span className="h-3 w-3 shrink-0 rounded-full border-2 border-white bg-nutrition-green shadow" />
              <span className="max-w-40 truncate whitespace-nowrap text-xs">
                <span className="font-semibold">{point.point}</span>{" "}
                <span className="text-text-muted">
                  {t("data:configuration.sections.appointmentThemes.forms.point.inDays", { days: point.in_days })}
                </span>
              </span>

              {/* full text on hover, laid over the truncated label (dot 12px + gap 8px = left-5) */}
              <div className="pointer-events-none absolute left-5 top-1/2 hidden w-64 -translate-y-1/2 rounded-md border border-gray-blue-200 bg-white p-2 text-xs shadow-lg group-hover:block">
                <div className="whitespace-normal break-words font-semibold">{point.point}</div>
                <div className="mt-1 text-text-muted">
                  {t("data:configuration.sections.appointmentThemes.forms.point.inDays", { days: point.in_days })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
