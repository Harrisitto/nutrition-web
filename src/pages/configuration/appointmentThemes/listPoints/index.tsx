import { useChangeAppointmentPoint, useDeleteAppointmentPoint, useFetchAppointmentThemeById } from "@src/services/tanstack/data/appointments";
import { AlertCircle, Check, FileText, Loader, Pencil, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fieldIds, useNewPointForm } from "../newPoint/form";
import { useState } from "react";
import { deleteButtonStyle, iconButtonStyle } from "@src/components/styles";
import { groupByDay, groupNameOfDay, type ThemePoint as Point } from "./groups";
import { GroupHeader } from "./groupHeader";
import { DocumentPicker } from "../@components/documentPicker";
import { openDocumentInNewTab, useFetchMyDocuments } from "@src/services/tanstack/data/documents";
import { useNotification } from "@src/store/slices/notification/hook";

export const ListPointsFrom = ({ themeId }: { themeId: number }) => {
  const { t } = useTranslation();
  const { data: appointmentPoints, isLoading: isLoadingPoints, error: errorPoints } = useFetchAppointmentThemeById(themeId);
  const changeAppointmentPoint = useChangeAppointmentPoint();
  const { mutate: deletePoint, isPending: isDeleting, variables: deletingId } = useDeleteAppointmentPoint();
  const [isEditing, setIsEditing] = useState<number | null>(null);
  // Documento del punto en edición ("" = sin documento): va aparte del Form de useForm
  const [editingDocumentId, setEditingDocumentId] = useState("");
  const form = useNewPointForm();
  // Nombre y ruta de los documentos de los puntos
  const { data: documents } = useFetchMyDocuments();
  const { addFormSubmitError } = useNotification();
  const documentsById = new Map((documents ?? []).map((document) => [document.id, document]));

  // Fields read the Form state when they mount, so fill it before rendering the edit block
  const startEditing = (point: Point) => {
    form.form.updateField(fieldIds.point, { currentValue: point.point, errorMsg: "" });
    form.form.updateField(fieldIds.inDays, { currentValue: point.in_days, errorMsg: "" });
    setEditingDocumentId(point.document_id ?? "");
    setIsEditing(point.id);
  };

  const cancelEditing = () => {
    form.form.reset();
    setIsEditing(null);
  };

  const saveEditing = (point: Point) => {
    if (!form.form.validateForm()) return;
    const state = form.form.getState();
    const inDays = state[fieldIds.inDays] as number;
    changeAppointmentPoint.mutate(
      {
        id: point.id,
        point: state[fieldIds.point] as string,
        in_days: inDays,
        // Pasa al grupo del día de destino; si sigue solo en su día conserva el suyo
        group_name:
          groupNameOfDay(appointmentPoints ?? [], inDays, point.id) ??
          (inDays === point.in_days ? point.group_name : null),
        document_id: editingDocumentId || null,
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

  // Punto suelto o dentro de su grupo: en modo edición, el formulario
  const renderPoint = (point: Point, showDays: boolean) => {
    if (isEditing === point.id) {
      return (
        <div key={point.id} className="mb-2 p-2 border rounded flex items-end gap-2">
          <div className="min-w-0 flex-1">
            {form.Fields}
            <div className="mb-4">
              <DocumentPicker value={editingDocumentId} onChange={setEditingDocumentId} />
            </div>
          </div>
          {/* mb-4 matches the margin of each field so the icons line up with the last input */}
          <div className="mb-4 flex gap-1">
            <button
              type="button"
              onClick={() => saveEditing(point)}
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
    const document = point.document_id ? documentsById.get(point.document_id) : undefined;
    return (
      <div key={point.id} className="mb-2 p-2 border rounded flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold">{point.point}</div>
          {document && (
            <button
              type="button"
              title={document.name}
              aria-label={`${t("data:configuration.sections.documents.open")}: ${document.name}`}
              onClick={() => openDocumentInNewTab(document).catch(() => addFormSubmitError())}
              className="mt-1 flex max-w-full items-center gap-1 rounded-md border border-fade-green px-2 py-0.5 text-xs text-nutrition-green transition hover:bg-white-green/60"
            >
              <FileText size={14} className="shrink-0" />
              <span className="truncate">{document.name}</span>
            </button>
          )}
          {showDays && (
            <div className="text-sm text-gray-500">
              {t("data:configuration.sections.appointmentThemes.forms.point.inDays", { days: point.in_days })}
            </div>
          )}
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
      {groupByDay(appointmentPoints ?? []).map((group) =>
        group.points.length === 1 ? (
          renderPoint(group.points[0], true)
        ) : (
          <div
            key={`day-${group.inDays}`}
            className="mb-2 rounded border border-fade-green bg-white-green/30 p-2"
          >
            <GroupHeader themeId={themeId} group={group} />
            {/* El día ya sale en la cabecera */}
            {group.points.map((point) => renderPoint(point, false))}
          </div>
        ),
      )}
      </div>
    </div>
  );
};
