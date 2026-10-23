import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { primaryButtonStyle } from "@src/components/styles";
import { SelectField } from "../../../../races/components/selectField";
import { emptyTextStyle } from "../../../../races/components/formStyles";
import type { Points } from "../../configPoints";

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

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const themePoint = availablePoints.find((point) => point.id === Number(selectedPointId));
    if (!theme || !themePoint) return;
    addPoint(
      { point: themePoint.point, client_theme_id: theme.id, theme_point_id: themePoint.id },
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
        options={availablePoints.map((point) =>
          point.id === theme?.nextPointId
            ? {
                value: point.id,
                label: `${t("data:appointments.form.points.next")}: ${point.point}`,
                className: nextPointStyle,
              }
            : { value: point.id, label: point.point },
        )}
        onChange={setThemePointId}
      />
      <button type="submit" disabled={!canAdd} className={primaryButtonStyle}>
        <Plus size={16} />
        {t("data:appointments.form.points.addThemePoint")}
      </button>
    </form>
  );
};
