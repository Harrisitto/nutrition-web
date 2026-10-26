import { useEffect, useState } from "react";
import type { PostgrestError } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";
import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { useAppSelector } from "@src/store/store";
import { useNotification } from "@src/store/slices/notification/hook";
import {
  useFetchSingleAppointment,
  useFetchUndatedAppointment,
  useSaveAppointment,
  useSetAppointmentStatus,
  type AppointmentStatus,
} from "../../../../services/tanstack/user/appointments";
import { BackButton } from "../../races/components/backButton";
import { Title } from "../../races/components/title";
import { StepProgress } from "./components/stepProgress";
import { StepNavigation } from "./components/stepNavigation";
import { StepDetails } from "./steps/details";
import { StepPoints } from "./steps/points";
import { fieldIds, useAppointmentForm } from "./configAppointment";
import type { AppointmentStep } from "./constants";
import StepHistory from "./steps/history";

// 23505: una consulta por dia y cliente, y una sola sin fecha (indice unico
// nutri_appointments_one_per_day, NULLS NOT DISTINCT)
const saveErrorKey = (error: Error, scheduledOn: string | null | undefined) => {
  if ((error as PostgrestError).code !== "23505") {
    return "data:appointments.form.errors.save";
  }
  return scheduledOn
    ? "data:appointments.form.errors.duplicateDay"
    : "data:appointments.form.errors.duplicateUndated";
};

const FormAppointment = () => {
  const { t } = useTranslation();
  const { location, navigateTo } = useAppNavigation();
  const { addFormSubmitSucess } = useNotification();
  const stateAppointmentId =
    (location.state as { appointmentId?: number } | null)?.appointmentId ?? null;
  // Sin appointmentId (botón "Nueva consulta" o URL directa) se abre la consulta sin fecha del
  // cliente: solo puede tener una. Si no la tiene, consulta nueva
  const undatedQuery = useFetchUndatedAppointment({ enabled: stateAppointmentId === null });
  // Id de la consulta creada al guardar el paso 1
  const [savedAppointmentId, setSavedAppointmentId] = useState<number | null>(null);
  const appointmentId =
    savedAppointmentId ?? stateAppointmentId ?? undatedQuery.data?.id ?? null;
  const [step, setStep] = useState<AppointmentStep>("details");

  const appointmentQuery = useFetchSingleAppointment(appointmentId);
  const { form, Fields } = useAppointmentForm(appointmentQuery.data);
  const saveAppointment = useSaveAppointment();
  const setAppointmentStatus = useSetAppointmentStatus();

  const goToList = () => navigateTo(APP_ROUTES.APPOINTMENTS);

  // Guarda los datos del paso 1 y después onSaved. Si no son válidos se vuelve a ese paso para
  // ver los errores (desde puntos o historial estarían ocultos)
  const saveDetails = (onSaved: () => void) => {
    if (!form.validateForm()) {
      setStep("details");
      return;
    }
    const state = form.getState();
    const scheduledOn = (state[fieldIds.scheduledOn] as string) || null;
    const name = (state[fieldIds.name] as string).trim();
    // Sin fecha el nombre es opcional: la lista muestra "Puntos pendientes por programar"
    if (scheduledOn !== null && name === "") {
      form.updateField(fieldIds.name, { errorMsg: "system:form.required" });
      setStep("details");
      return;
    }
    // Entrando por la consulta sin fecha: ponerle fecha crea una consulta aparte y la sin fecha
    // se queda como estaba. Sin fecha, se edita la sin fecha
    const isUndatedEntry = stateAppointmentId === null && savedAppointmentId === null;
    saveAppointment.mutate(
      {
        id: isUndatedEntry && scheduledOn !== null ? null : appointmentId,
        description: name || null,
        scheduled_on: scheduledOn,
        video_url: (state[fieldIds.videoUrl] as string).trim() || null,
      },
      {
        onSuccess: (saved) => {
          setSavedAppointmentId(saved.id);
          addFormSubmitSucess();
          onSaved();
        },
      },
    );
  };

  // La consulta sin fecha solo guarda puntos pendientes: no se empieza ni se termina
  const appointment = appointmentQuery.data;
  const status =
    appointment && appointment.scheduled_on !== null
      ? (appointment.status as AppointmentStatus)
      : null;
  const onChangeStatus = (next: AppointmentStatus) => {
    if (appointmentId === null) return;
    setAppointmentStatus.mutate({ id: appointmentId, status: next });
  };

  // Hasta tener la consulta a editar: si no, el formulario saldría vacío y después se rellenaría.
  // Tras guardar el paso 1 no hace falta esperar: el formulario ya tiene sus datos
  const isLoadingAppointment = appointmentQuery.isLoading && savedAppointmentId === null;
  if (undatedQuery.isLoading || isLoadingAppointment) return null;

  if (appointmentQuery.isError || undatedQuery.isError) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 animate-fade-in">
        <BackButton label={t("data:appointments.form.backToList")} onBack={goToList} />
        <p className="text-sm text-red-500" role="alert">
          {t("data:appointments.form.errors.load")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <BackButton label={t("data:appointments.form.backToList")} onBack={goToList} />
        <Title>
          {appointmentId === null
            ? t("data:appointments.new")
            : t("data:appointments.pending.edit")}
        </Title>
      </div>

      <StepProgress
        currentStep={step}
        canOpenPoints={appointmentId !== null}
        onSelectStep={setStep}
      />

      {/* Los pasos siguen montados al cambiar de paso: no se pierde lo escrito en sus formularios */}
      <div hidden={step !== "details"}>
        <StepDetails fields={Fields} />
      </div>
      <div hidden={step !== "points"}>
        {appointmentId !== null && <StepPoints appointmentId={appointmentId} />}
      </div>
      <div hidden={step !== "history"}>
        {appointmentId !== null && <StepHistory appointmentId={appointmentId} />}
      </div>

      <StepNavigation
        currentStep={step}
        isSaving={saveAppointment.isPending}
        errorKey={
          saveAppointment.error
            ? saveErrorKey(saveAppointment.error, saveAppointment.variables?.scheduled_on)
            : setAppointmentStatus.isError
              ? "data:appointments.form.errors.status"
              : null
        }
        status={status}
        isChangingStatus={setAppointmentStatus.isPending}
        onPrevious={() => setStep("details")}
        onSaveDetails={() => saveDetails(() => setStep("points"))}
        onSave={() => saveDetails(goToList)}
        onChangeStatus={onChangeStatus}
      />
    </div>
  );
};

const PageFormAppointment = () => {
  const selectedUserId = useAppSelector((state) => state.config.selectedUserId);
  const { navigateTo } = useAppNavigation();
  const [openedForUserId] = useState(selectedUserId);

  // La consulta abierta es del cliente con el que se entró: al cambiar de cliente en la barra
  // lateral se vuelve a la lista
  useEffect(() => {
    if (selectedUserId !== openedForUserId) {
      navigateTo(APP_ROUTES.APPOINTMENTS, { replace: true });
    }
  }, [selectedUserId, openedForUserId, navigateTo]);

  // Mientras tanto no se pide la consulta abierta al cliente nuevo
  if (selectedUserId !== openedForUserId) return null;

  return <FormAppointment />;
};

export default PageFormAppointment;
