import useForm from "@src/hooks/form";
import { ValidateMaxLength } from "@src/hooks/form/service/validate";
import type { InputState } from "@src/hooks/form/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { useFetchSingleAppointment } from "../../../../services/tanstack/user/appointments";

type Appointment = NonNullable<ReturnType<typeof useFetchSingleAppointment>["data"]>;

export const fieldIds = {
  name: "name",
  scheduledOn: "scheduledOn",
  videoUrl: "videoUrl",
  startTime: "startTime",
} as const;

// El nombre se guarda en nutri_appointments.description (titulo de la consulta). Obligatorio solo
// con fecha: depende de otro campo, asi que lo comprueba la pagina al guardar
const createNameField = (currentValue: string) =>
  ({
    id: fieldIds.name,
    type: "text",
    currentValue,
    validation: [(value) => ValidateMaxLength(value as string, 100)],
    inputProps: {
      label: "forms:appointments.fields.name", // text inputs translate their label
      placeholder: "...",
    },
  }) as InputState<"text">;

// Opcional: "" = consulta sin fecha (scheduled_on null)
const createScheduledOnField = (label: string, currentValue: string) =>
  ({
    id: fieldIds.scheduledOn,
    type: "date",
    currentValue,
    inputProps: {
      label, // date inputs render the label as is, so it arrives translated
    },
  }) as InputState<"date">;

// Opcional. La tabla solo admite https:// (nada de javascript: ni http:)
const createVideoUrlField = (currentValue: string) =>
  ({
    id: fieldIds.videoUrl,
    type: "text",
    currentValue,
    validation: [
      (value) => {
        const url = (value as string).trim();
        return url === "" || url.startsWith("https://") ? "" : "forms:appointments.errors.videoUrl";
      },
      (value) => ValidateMaxLength(value as string, 500),
    ],
    inputProps: {
      label: "forms:appointments.fields.videoUrl", // text inputs translate their label
      placeholder: "https://",
    },
  }) as InputState<"text">;

// Opcional: "" = sin hora (start_time null). Sin fecha no se guarda
const createStartTimeField = (label: string, currentValue: string) =>
  ({
    id: fieldIds.startTime,
    type: "time",
    currentValue,
    inputProps: {
      label, // time inputs render the label as is, so it arrives translated
    },
  }) as InputState<"time">;

// appointment undefined = consulta nueva (o aun cargando): campos vacios
const useConfig = (appointment: Appointment | undefined) => {
  const { t } = useTranslation();
  // Solo los valores: un refetch con los mismos datos no reinicia el formulario
  const description = appointment?.description ?? "";
  const scheduledOn = appointment?.scheduled_on ?? "";
  const videoUrl = appointment?.video_url ?? "";
  // La columna es time: llega como "HH:MM:SS" y el input usa "HH:MM"
  const startTime = appointment?.start_time?.slice(0, 5) ?? "";

  return useMemo(
    () =>
      [
        createNameField(description),
        createScheduledOnField(t("forms:appointments.fields.scheduledOn"), scheduledOn),
        createVideoUrlField(videoUrl),
        createStartTimeField(t("forms:appointments.fields.startTime"), startTime),
      ] as InputState<"text" | "date" | "time">[],
    [t, description, scheduledOn, videoUrl, startTime],
  );
};

export const useAppointmentForm = (appointment: Appointment | undefined) => {
  const config = useConfig(appointment);
  return useForm({ config });
};
