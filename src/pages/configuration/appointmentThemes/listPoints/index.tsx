import { useChangeAppointmentPoint, useDeleteAppointmentPoint, useFetchAppointmentThemeById } from "@src/services/tanstack/data/appointments";
import { AlertCircle, Check, Loader, Pencil, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fieldIds, useNewPointForm } from "../newPoint/form";
import { useState } from "react";
import { deleteButtonStyle, iconButtonStyle } from "@src/components/styles";

type Point = NonNullable<ReturnType<typeof useFetchAppointmentThemeById>["data"]>[number];

export const ListPointsFrom = ({ themeId }: { themeId: number }) => {
  const { t } = useTranslation();
  const { data: appointmentPoints, isLoading: isLoadingPoints, error: errorPoints } = useFetchAppointmentThemeById(themeId);
  const changeAppointmentPoint = useChangeAppointmentPoint();
  const { mutate: deletePoint, isPending: isDeleting, variables: deletingId } = useDeleteAppointmentPoint();
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const form = useNewPointForm();

  // Fields read the Form state when they mount, so fill it before rendering the edit block
  const startEditing = (point: Point) => {
    form.form.updateField(fieldIds.point, { currentValue: point.point, errorMsg: "" });
    form.form.updateField(fieldIds.inDays, { currentValue: point.in_days, errorMsg: "" });
    setIsEditing(point.id);
  };

  const cancelEditing = () => {
    form.form.reset();
    setIsEditing(null);
  };

  const saveEditing = (id: number) => {
    if (!form.form.validateForm()) return;
    const state = form.form.getState();
    changeAppointmentPoint.mutate(
      {
        id,
        point: state[fieldIds.point] as string,
        in_days: state[fieldIds.inDays] as number,
      },
      {
        onSuccess: cancelEditing,
        onError: (error) => console.error("Error updating appointment point:", error),
      },
    );
  };

  const onDelete = (point: Point) => {
    const message = t("data:configuration.sections.appointmentThemes.forms.point.confirmDelete", {
      name: point.point,
    });
    if (!window.confirm(message)) return;
    deletePoint(point.id, {
      onError: (error) => console.error("Error deleting appointment point:", error),
    });
  };

  const title = (
    <div className="mb-4 text-lg font-semibold">
      {t("data:configuration.sections.appointmentThemes.lists.points.title")}
    </div>
  );

  if (isLoadingPoints) {
    return (
      <>
        {title}
        <Loader className="animate-spin" size={32} />
      </>
    );
  }

  if (errorPoints) {
    return (
      <>
        {title}
        <div className="text-red-500">
          <AlertCircle className="inline-block mr-2" size={32} />
          {t("data:configuration.sections.appointmentThemes.forms.point.error")}
        </div>
      </>
    );
  }

  return (
    // fills the column, only the points scroll
    <div className="flex min-h-0 flex-1 flex-col">
      {title}
      <div className="min-h-0 flex-1 overflow-y-auto">
      {appointmentPoints?.map((point) => {
        if (isEditing === point.id) {
          return (
            <div key={point.id} className="mb-2 p-2 border rounded flex items-end gap-2">
              <div className="min-w-0 flex-1">{form.Fields}</div>
              {/* mb-4 matches the margin of each field so the icons line up with the last input */}
              <div className="mb-4 flex gap-1">
                <button
                  type="button"
                  onClick={() => saveEditing(point.id)}
                  disabled={changeAppointmentPoint.isPending}
                  title={t("data:configuration.sections.appointmentThemes.forms.point.save")}
                  aria-label={t("data:configuration.sections.appointmentThemes.forms.point.save")}
                  className={iconButtonStyle}
                >
                  <Check size={18} />
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  title={t("data:configuration.sections.appointmentThemes.forms.point.cancel")}
                  aria-label={t("data:configuration.sections.appointmentThemes.forms.point.cancel")}
                  className={iconButtonStyle}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          );
        }
        return (
          <div key={point.id} className="mb-2 p-2 border rounded flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold">{point.point}</div>
              <div className="text-sm text-gray-500">
                {t("data:configuration.sections.appointmentThemes.forms.point.inDays", { days: point.in_days })}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => startEditing(point)}
                title={t("data:configuration.sections.appointmentThemes.forms.point.edit")}
                aria-label={t("data:configuration.sections.appointmentThemes.forms.point.edit")}
                className={iconButtonStyle}
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(point)}
                disabled={isDeleting && deletingId === point.id}
                title={t("data:configuration.sections.appointmentThemes.forms.point.delete")}
                aria-label={t("data:configuration.sections.appointmentThemes.forms.point.delete")}
                className={deleteButtonStyle}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};
