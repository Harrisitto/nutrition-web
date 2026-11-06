import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Plus } from "lucide-react";
import FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { primaryButtonStyle } from "@src/components/styles";
import { SelectField } from "../../../../races/components/selectField";
import { emptyTextStyle } from "../../../../races/components/formStyles";
import type { Points } from "../../configPoints";
import { useNotification } from "@src/store/slices/notification/hook";
import {
  openDocumentInNewTab,
  useFetchMyDocuments,
} from "@src/services/tanstack/data/documents";

// Próximo punto pendiente de la temática (el sugerido)
const nextPointStyle = "font-bold text-nutrition-green";

// Punto de una tematica asignada al cliente: solo ofrece los que aun no estan en ninguna consulta
export const AddThemePointForm = ({
  themes: allThemes,
  addPoint,
  isAdding,
}: Pick<Points, "themes" | "addPoint" | "isAdding">) => {
  const { t } = useTranslation();
  const language = useLanguageCode();
  // Las terminadas no tienen nada que añadir
  const themes = allThemes.filter((option) => !option.isFinished);
  const [clientThemeId, setClientThemeId] = useState("");
  const [themePointId, setThemePointId] = useState("");
  // Nombre y ruta del documento del punto elegido
  const { data: documents } = useFetchMyDocuments();
  const { addFormSubmitError } = useNotification();

  if (!themes.length) {
    return (
      <p className={emptyTextStyle}>
        {allThemes.length
          ? t("data:appointments.form.points.allThemesFinished")
          : t("data:appointments.form.points.noThemes")}
      </p>
    );
  }

  const theme = themes.find((option) => option.id === Number(clientThemeId));
  const availablePoints = theme?.availablePoints ?? [];
  // Sin elegir ninguno se sugiere el próximo pendiente: al cambiar de temática y tras añadir uno
  // (el refetch lo quita de los pendientes y el siguiente pasa a ser el próximo)
  const selectedPointId =
    themePointId || (theme?.nextPointId ? String(theme.nextPointId) : "");
  const canAdd = !!theme && !!selectedPointId && !isAdding;
  const selectedPoint = availablePoints.find((point) => point.id === Number(selectedPointId));
  const selectedDocument = selectedPoint?.document_id
    ? documents?.find((document) => document.id === selectedPoint.document_id)
    : undefined;

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const themePoint = selectedPoint;
    if (!theme || !themePoint) return;
    addPoint(
      {
        point: themePoint.point,
        client_theme_id: theme.id,
        // El grupo y el documento no se guardan en el punto: salen del de la plantilla
        theme_point_id: themePoint.id,
      },
      () => setThemePointId(""),
    );
  };

  return (
    <form
      onSubmit={onAdd}
      className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_2fr_auto]"
    >
      <SelectField
        label={t("data:appointments.form.points.theme")}
        placeholder={t("data:appointments.form.points.selectTheme")}
        // La elegida sale de la lista al terminarse (al añadir su último punto): vuelve al placeholder
        value={theme ? clientThemeId : ""}
        // Con su fecha de inicio: la misma temática puede estar asignada más de una vez
        options={themes.map((option) => ({
          value: option.id,
          label: `${option.theme_name} · ${new FromDate(option.start_date).toLocaleDateString(
            language,
            { day: "numeric", month: "short", year: "numeric" },
          )}`,
        }))}
        onChange={(value) => {
          setClientThemeId(value);
          setThemePointId("");
        }}
      />
      <SelectField
        label={t("data:appointments.form.points.themePoint")}
        placeholder={
          theme && !availablePoints.length
            ? t("data:appointments.form.points.allAdded")
            : t("data:appointments.form.points.selectThemePoint")
        }
        value={selectedPointId}
        options={availablePoints.map((point) => {
          // Con el nombre de su grupo delante, si lo tiene
          const label = point.group_name ? `${point.group_name} · ${point.point}` : point.point;
          return point.id === theme?.nextPointId
            ? {
                value: point.id,
                label: `${t("data:appointments.form.points.next")}: ${label}`,
                className: nextPointStyle,
              }
            : { value: point.id, label };
        })}
        onChange={setThemePointId}
      />
      <button type="submit" disabled={!canAdd} className={primaryButtonStyle}>
        <Plus size={16} />
        {t("data:appointments.form.points.addThemePoint")}
      </button>
      {/* El documento del punto de la plantilla, que se copiará a la consulta */}
      {selectedDocument && (
        <div className="flex items-center gap-2 text-sm text-text-muted md:col-span-3">
          {t("data:appointments.form.points.pointDocument")}
          <button
            type="button"
            title={selectedDocument.name}
            aria-label={`${t("data:configuration.sections.documents.open")}: ${selectedDocument.name}`}
            onClick={() => openDocumentInNewTab(selectedDocument).catch(() => addFormSubmitError())}
            className="flex min-w-0 items-center gap-1 rounded-md border border-fade-green px-2 py-0.5 text-xs text-nutrition-green transition hover:bg-white-green/60"
          >
            <FileText size={14} className="shrink-0" />
            <span className="truncate">{selectedDocument.name}</span>
          </button>
        </div>
      )}
    </form>
  );
};
