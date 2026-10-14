import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { deleteButtonStyle } from "@src/components/styles";
import type { RaceStepDraft } from "@src/services/tanstack/user/races";
import { useRaceDraft } from "../../context/raceDraftContext";
import { emptyTextStyle, secondaryButtonStyle } from "../../components/formStyles";
import { useItemError } from "../../hooks";
import { roundKm } from "../../validation";
import { fitAltitudeMarks } from "./fitAltitudeMarks";

const numericColumns = [
  "min_altitude",
  "max_altitude",
  "elevation_gain",
  "elevation_loss",
] as const;

type NumericColumn = (typeof numericColumns)[number];

const cellInputStyle =
  "w-full min-w-16 rounded-md border border-gray-blue-300 bg-gray-blue-50 px-2 py-1 text-sm text-gray-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-blue-400";

const emptyStep = (kmStart: number): RaceStepDraft => ({
  km_start: kmStart,
  min_altitude: null,
  min_altitude_at: null,
  max_altitude: null,
  max_altitude_at: null,
  elevation_gain: null,
  elevation_loss: null,
  aprox_time_start: null,
});

// km_start no puede quedar vacío en el borrador: mientras se escribe se guarda
// el texto y el tramo solo se actualiza con números válidos
const KmStartInput = ({
  value,
  label,
  onChange,
}: {
  value: number;
  label: string;
  onChange: (km: number) => void;
}) => {
  const [text, setText] = useState(String(value));
  const [shownValue, setShownValue] = useState(value);

  // El tramo ha cambiado desde fuera (p. ej. al regenerar el gpx)
  if (value !== shownValue) {
    setShownValue(value);
    setText(String(value));
  }

  return (
    <input
      type="number"
      step="any"
      min={0}
      aria-label={label}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        if (e.target.value !== "") {
          setShownValue(Number(e.target.value));
          onChange(Number(e.target.value));
        }
      }}
      onBlur={() => setText(String(value))}
      className={cellInputStyle}
    />
  );
};

export const StepsTable = () => {
  const { t } = useTranslation();
  const { draft, updateDraft } = useRaceDraft();
  const errorOf = useItemError("profile");
  const { steps } = draft;

  // Cambiar o añadir un km_start mueve los límites de los tramos vecinos
  const setSteps = (update: (steps: RaceStepDraft[]) => RaceStepDraft[]) =>
    updateDraft((prev) => ({
      steps: fitAltitudeMarks(update(prev.steps), prev.distanceKm),
    }));

  const updateStep = (index: number, patch: Partial<RaceStepDraft>) =>
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, ...patch } : step)),
    );

  const setNumeric = (index: number, column: NumericColumn, value: string) =>
    updateStep(index, { [column]: value === "" ? null : Number(value) });

  const addStep = () => {
    const lastKm = steps.length
      ? Math.max(...steps.map((step) => step.km_start))
      : undefined;
    let kmStart = lastKm === undefined ? 0 : lastKm + 1;
    // Sin pasarse de la distancia: el último tramo acaba en ella
    if (lastKm !== undefined && draft.distanceKm !== null && kmStart >= draft.distanceKm) {
      kmStart = roundKm((lastKm + draft.distanceKm) / 2);
    }
    setSteps((prev) => [...prev, emptyStep(kmStart)]);
  };

  const removeStep = (index: number) =>
    setSteps((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-title">
          {t("data:races.profile.stepsTitle")}
        </p>
        <button type="button" onClick={addStep} className={secondaryButtonStyle}>
          <Plus size={16} />
          {t("data:races.profile.addStep")}
        </button>
      </div>

      {steps.length === 0 ? (
        <p className={emptyTextStyle}>{t("data:races.profile.noSteps")}</p>
      ) : (
        <div className="max-h-[50vh] overflow-auto rounded-lg border border-nutrition-green/20 bg-white">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white-green text-left text-xs text-text-muted">
              <tr>
                <th className="px-2 py-2 font-semibold">
                  {t("data:races.profile.columns.km_start")}
                </th>
                {numericColumns.map((column) => (
                  <th key={column} className="px-2 py-2 font-semibold">
                    {t(`data:races.profile.columns.${column}`)}
                  </th>
                ))}
                <th className="px-2 py-2 font-semibold">
                  {t("data:races.profile.columns.aprox_time_start")}
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {steps.map((step, index) => {
                const error = errorOf(index);
                return (
                  // km_start puede editarse y repetirse mientras se escribe: se usa el índice
                  <Fragment key={index}>
                    <tr
                      className={`border-t border-nutrition-green/10 ${error ? "bg-red-50" : ""}`}
                    >
                      <td className="px-2 py-1">
                        <KmStartInput
                          value={step.km_start}
                          label={t("data:races.profile.columns.km_start")}
                          onChange={(kmStart) => updateStep(index, { km_start: kmStart })}
                        />
                      </td>
                      {numericColumns.map((column) => (
                        <td key={column} className="px-2 py-1">
                          <input
                            type="number"
                            step="any"
                            aria-label={t(`data:races.profile.columns.${column}`)}
                            value={step[column] ?? ""}
                            onChange={(e) => setNumeric(index, column, e.target.value)}
                            className={cellInputStyle}
                          />
                        </td>
                      ))}
                      <td className="px-2 py-1">
                        <input
                          type="text"
                          placeholder="hh:mm"
                          aria-label={t("data:races.profile.columns.aprox_time_start")}
                          value={step.aprox_time_start ?? ""}
                          onChange={(e) =>
                            updateStep(index, { aprox_time_start: e.target.value || null })
                          }
                          className={cellInputStyle}
                        />
                      </td>
                      <td className="px-2 py-1 text-right">
                        <button
                          type="button"
                          title={t("data:races.profile.removeStep")}
                          aria-label={t("data:races.profile.removeStep")}
                          onClick={() => removeStep(index)}
                          className={deleteButtonStyle}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                    {error && (
                      <tr className="bg-red-50">
                        <td colSpan={7} className="px-2 pb-2 text-xs text-red-500">
                          {error}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
