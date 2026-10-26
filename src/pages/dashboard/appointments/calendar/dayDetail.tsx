import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { useAppDispatch } from "@src/store/store";
import { setSelectedUserId } from "@src/store/slices/config/store";
import {
  emptyTextStyle,
  listItemStyle,
  pointTagStyle,
} from "../../races/components/formStyles";
import { NoteItem } from "../../@components/notes/noteItem";
import { formatTime, type CalendarAppointment, type CalendarNote } from "./calendarDays";

// Consultas pendientes y notas del dia elegido, de todos los clientes
export const DayDetail = ({
  day,
  appointments,
  notes,
}: {
  // "YYYY-MM-DD"
  day: string;
  appointments: CalendarAppointment[];
  notes: CalendarNote[];
}) => {
  const { t } = useTranslation();
  const language = useLanguageCode();
  const dispatch = useAppDispatch();
  const { navigateTo } = useAppNavigation();
  const isPast = day < new FromDate().save();

  // El formulario trabaja con el cliente seleccionado: se selecciona el de la consulta antes de abrirla
  const openAppointment = (appointment: CalendarAppointment) => {
    dispatch(setSelectedUserId(appointment.user_id));
    navigateTo(APP_ROUTES.FORM_APPOINTMENT, { state: { appointmentId: appointment.id } });
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold capitalize text-text-title">
        {new FromDate(day).toLocaleDateString(language, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </h2>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-text-title">
          {t("data:calendar.appointments")}
        </h3>
        {appointments.length === 0 ? (
          <p className={emptyTextStyle}>{t("data:calendar.noAppointments")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                <button
                  type="button"
                  onClick={() => openAppointment(appointment)}
                  title={t("data:calendar.openAppointment")}
                  className={`flex w-full items-center gap-3 text-left transition hover:border-nutrition-green ${listItemStyle()}`}
                >
                  <span className="w-12 shrink-0 text-sm font-semibold text-text-title">
                    {formatTime(appointment.start_time) ?? t("data:calendar.noTime")}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-semibold text-text-title">
                      {appointment.client?.name}
                    </span>
                    {appointment.description && (
                      <span className="truncate text-xs text-text-muted">
                        {appointment.description}
                      </span>
                    )}
                  </span>
                  {appointment.status === "in_progress" ? (
                    <span className={pointTagStyle}>{t("data:calendar.inProgress")}</span>
                  ) : (
                    isPast && <span className={pointTagStyle}>{t("data:calendar.late")}</span>
                  )}
                  <ChevronRight size={16} className="shrink-0 text-text-muted" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-text-title">{t("data:calendar.notes")}</h3>
        {notes.length === 0 ? (
          <p className={emptyTextStyle}>{t("data:calendar.noNotes")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {/* Ya vienen de la query de mayor a menor prioridad */}
            {notes.map((note) => (
              <li key={note.id}>
                <NoteItem note={note} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
