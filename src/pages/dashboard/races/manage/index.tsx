import { useTranslation } from "react-i18next";
import { Download, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useAppSelector } from "@src/store/store";
import { SectionLoading } from "@src/components/global/Animations";
import { deleteButtonStyle, primaryButtonStyle } from "@src/components/styles";
import { useNotification } from "@src/store/slices/notification/hook";
import {
  isMissingRaceImage,
  useDeleteRace,
  useDownloadRaceImage,
  useFetchRacesForWeek,
} from "@src/services/tanstack/user/races";
import {
  emptyTextStyle,
  listItemStyle,
  secondaryButtonStyle,
  sectionStyle,
} from "../components/formStyles";

/**
 * Carreras del cliente en selectedDay: se puede crear otra, editar o borrar.
 */
export const RaceManager = ({
  onEdit,
}: {
  // null crea una carrera nueva en selectedDay
  onEdit: (raceId: number | null) => void;
}) => {
  const { t } = useTranslation();
  const selectedDay = useAppSelector((state) => state.config.selectedDay);
  const { add: addNotification, addFormSubmitError } = useNotification();
  // La semana ya está cacheada por la fila de carreras de la tabla
  const { data: weekRaces, isLoading, isError, refetch } = useFetchRacesForWeek();
  const { mutate: deleteRace, isPending, variables } = useDeleteRace();
  const downloadImage = useDownloadRaceImage();

  const races = weekRaces?.filter((race) => race.date === selectedDay) ?? [];

  const onDownload = (race: (typeof races)[number]) =>
    downloadImage.mutate(race, {
      onError: (error) =>
        isMissingRaceImage(error)
          ? addNotification({
              type: "error",
              message: "data:races.manage.imageMissing",
              duration: 6000,
            })
          : addFormSubmitError(),
    });

  const onDelete = (race: (typeof races)[number]) => {
    if (!window.confirm(t("data:races.manage.confirmDelete", { name: race.name }))) return;
    deleteRace(
      { id: race.id, nutriId: race.nutriId, gpxPath: race.gpxPath },
      { onError: () => addFormSubmitError() },
    );
  };

  const renderRaces = () => {
    if (isLoading) return <SectionLoading />;

    if (isError) {
      return (
        <div className="flex flex-col items-center gap-2 p-4">
          <p className="text-sm text-red-500">{t("data:races.manage.loadError")}</p>
          <button type="button" className={secondaryButtonStyle} onClick={() => refetch()}>
            <RotateCcw size={16} />
            {t("data:races.retry")}
          </button>
        </div>
      );
    }

    if (!races.length) {
      return <p className={emptyTextStyle}>{t("data:races.manage.empty")}</p>;
    }

    return (
      <ul className="flex flex-col gap-2">
        {races.map((race) => (
          <li key={race.id} className={`${listItemStyle()} flex items-center gap-3`}>
            <button
              type="button"
              onClick={() => onEdit(race.id)}
              className="min-w-0 flex-1 text-left"
            >
              <p className="truncate font-semibold text-text-title">{race.name}</p>
              <p className="text-xs text-text-muted">
                {race.distanceKm} km · {Math.round(race.totalHc)} g HC ·{" "}
                {Math.round(race.totalKcal)} kcal
              </p>
            </button>
            <button
              type="button"
              title={t("data:races.manage.edit")}
              aria-label={t("data:races.manage.edit")}
              onClick={() => onEdit(race.id)}
              className="shrink-0 rounded-md p-1.5 text-nutrition-green transition hover:bg-white-green/60"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              title={t("data:races.manage.download")}
              aria-label={t("data:races.manage.download")}
              disabled={downloadImage.isPending && downloadImage.variables?.id === race.id}
              onClick={() => onDownload(race)}
              className="shrink-0 rounded-md p-1.5 text-nutrition-green transition hover:bg-white-green/60 disabled:opacity-50"
            >
              <Download size={16} />
            </button>
            <button
              type="button"
              title={t("data:races.manage.delete")}
              aria-label={t("data:races.manage.delete")}
              disabled={isPending && variables?.id === race.id}
              onClick={() => onDelete(race)}
              className={deleteButtonStyle}
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className={sectionStyle}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-title">
            {t("data:races.manage.title", { date: selectedDay })}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {t("data:races.manage.description")}
          </p>
        </div>
        <button type="button" className={primaryButtonStyle} onClick={() => onEdit(null)}>
          <Plus size={16} />
          {t("data:races.manage.new")}
        </button>
      </header>

      {renderRaces()}
    </section>
  );
};
