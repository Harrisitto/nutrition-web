import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { cardStyle, primaryButtonStyle } from "@src/components/styles";
import { pointTagStyle } from "../../races/components/formStyles";
import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import type { useFetchClientPendingAppointments } from "../../../../services/tanstack/user/appointments";

type PendingAppointment = NonNullable<ReturnType<typeof useFetchClientPendingAppointments>["data"]>[0];

const DAY_MS = 24 * 60 * 60 * 1000;

// Dias desde hoy hasta la fecha (negativo si ya paso). Round: los cambios de hora dan 23 o 25 h
const daysUntil = (date: string) => {
    const today = new FromDate(new FromDate().save());
    return Math.round((new FromDate(date).getTime() - today.getTime()) / DAY_MS);
};

const AppointmentDate = ({
    scheduledOn,
    startTime,
}: {
    scheduledOn: string | null;
    startTime: string | null;
}) => {
    const { t } = useTranslation();
    const language = useLanguageCode();

    if (!scheduledOn) {
        return <span className={itemStyles.noDate}>{t("data:appointments.pending.noDate")}</span>;
    }

    const days = daysUntil(scheduledOn);
    const formattedDate = new FromDate(scheduledOn).toLocaleDateString(language, {
        weekday: "short",
        day: "numeric",
        month: "short",
    });

    return (
        <div className={itemStyles.date}>
            {days === 0 ? (
                <span className={itemStyles.daysNumber}>{t("data:appointments.pending.today")}</span>
            ) : (
                <>
                    <span className={days > 0 ? itemStyles.daysNumber : itemStyles.daysLate}>
                        {Math.abs(days)}
                    </span>
                    <span className={itemStyles.daysLabel}>
                        {days > 0
                            ? t("data:appointments.pending.daysLeft", { count: days })
                            : t("data:appointments.pending.daysLate", { count: -days })}
                    </span>
                </>
            )}
            <span className={itemStyles.dateLabel}>
                {/* start_time es time ("HH:MM:SS"): se muestra sin segundos */}
                {startTime ? `${formattedDate} · ${startTime.slice(0, 5)}` : formattedDate}
            </span>
        </div>
    );
};

export const PendingAppointmentItem = ({ appointment }: { appointment: PendingAppointment }) => {
    const { t } = useTranslation();
    const { navigateTo } = useAppNavigation();

    // Primero los puntos del nutricionista y despues los del cliente, cada uno por su position
    // (ya ordenados por la query)
    const points = [
        ...appointment.appointment_points.map((point) => ({
            key: `nutri-${point.id}`,
            point: point.point,
            tag: point.client_themes?.theme_name ?? null,
        })),
        ...appointment.user_appointment_points.map((point) => ({
            key: `client-${point.id}`,
            point: point.point,
            tag: t("data:appointments.pending.clientPoint"),
        })),
    ];

    // description null = los nombres de las tematicas de sus puntos, en orden alfabetico. La sin
    // fecha junta puntos de cualquier tematica: usa su nombre por defecto
    const themeNames = new Set(
        appointment.appointment_points
            .map((point) => point.client_themes?.theme_name)
            .filter((name): name is string => !!name),
    );
    const description =
        appointment.description ||
        (appointment.scheduled_on
            ? [...themeNames].sort((a, b) => a.localeCompare(b)).join(", ")
            : "");

    return (
        <article className={itemStyles.card}>
            <header className={itemStyles.header}>
                <h2 className={itemStyles.title}>
                    {description ||
                        t(
                            appointment.scheduled_on
                                ? "data:appointments.pending.untitled"
                                : "data:appointments.pending.undatedTitle",
                        )}
                </h2>
                <AppointmentDate scheduledOn={appointment.scheduled_on} startTime={appointment.start_time} />
            </header>

            {points.length === 0 ? (
                <p className={itemStyles.empty}>{t("data:appointments.pending.noPoints")}</p>
            ) : (
                <ul className={itemStyles.list}>
                    {points.map((point) => (
                        <li key={point.key} className={itemStyles.point}>
                            <span className={itemStyles.pointText}>{point.point}</span>
                            {point.tag && <span className={pointTagStyle}>{point.tag}</span>}
                        </li>
                    ))}
                </ul>
            )}

            <footer className={itemStyles.actions}>
                <button
                    type="button"
                    onClick={() =>
                        navigateTo(APP_ROUTES.FORM_APPOINTMENT, { state: { appointmentId: appointment.id } })
                    }
                    className={primaryButtonStyle}
                >
                    <Pencil size={16} />
                    {t("data:appointments.pending.edit")}
                </button>
            </footer>
        </article>
    );
};

const itemStyles = {
    card: `${cardStyle} flex flex-col gap-3 p-4`,

    header: "flex flex-row items-start justify-between gap-4",

    title: "text-base font-semibold text-text-title",

    // Fecha arriba a la derecha: el numero de dias manda, la fecha debajo
    date: "flex flex-col items-end shrink-0 leading-none",
    daysNumber: "text-3xl font-bold text-nutrition-green",
    daysLate: "text-3xl font-bold text-nutrition-red",
    daysLabel: "text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1",
    dateLabel: "text-xs font-semibold text-text-body mt-1 first-letter:uppercase",

    noDate: "shrink-0 rounded-full bg-white-green px-3 py-1 text-xs font-semibold text-text-muted",

    empty: "text-sm text-text-muted",

    list: "flex flex-col divide-y divide-fade-green",
    point: "flex flex-row items-center justify-between gap-3 py-2",
    pointText: "text-sm text-text-body",

    actions: "flex flex-row flex-wrap gap-2 pt-1",
} as const;
