import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import type { PostgrestError } from "@supabase/supabase-js";
import FromDate from "@src/helpers/dates";
import { primaryIconButtonStyle } from "@src/components/styles";
import { useFetchAppointmentThemes } from "../../../../../services/tanstack/data/appointments";
import { useAssignAppointmentTheme } from "../../../../../services/tanstack/user/appointments";

// assign_appointment_theme: 22023 si la tematica no tiene puntos
const assignErrorKey = (error: Error) =>
    (error as PostgrestError).code === "22023"
        ? "data:appointments.assign.errors.noPoints"
        : "data:appointments.assign.errors.generic";

// Primera tarjeta de la fila de progreso: asigna una tematica al cliente desde una fecha
export const AssignThemeCard = () => {
    const { t } = useTranslation();
    const themesQuery = useFetchAppointmentThemes();
    const assignTheme = useAssignAppointmentTheme();
    const [themeId, setThemeId] = useState("");
    const [startDate, setStartDate] = useState(() => new FromDate().save());

    const themes = themesQuery.data ?? [];
    const canAssign = !!themeId && !!startDate && !assignTheme.isPending;

    const onAssign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canAssign) return;
        assignTheme.mutate(
            { theme_id: Number(themeId), start_date: startDate },
            { onSuccess: () => setThemeId("") },
        );
    };

    return (
        <form onSubmit={onAssign} className={assignStyles.card}>
            <span className={assignStyles.title}>{t("data:appointments.assign.title")}</span>

            {themesQuery.isSuccess && themes.length === 0 ? (
                <p className={assignStyles.hint}>{t("data:appointments.assign.noThemes")}</p>
            ) : (
                <>
                    <select
                        required
                        value={themeId}
                        aria-label={t("data:appointments.assign.theme")}
                        onChange={(e) => setThemeId(e.target.value)}
                        className={assignStyles.input}
                    >
                        <option value="" disabled>
                            {t("data:appointments.assign.selectTheme")}
                        </option>
                        {themes.map((theme) => (
                            <option key={theme.id} value={theme.id}>
                                {theme.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex flex-row items-center gap-2">
                        <input
                            type="date"
                            required
                            value={startDate}
                            aria-label={t("data:appointments.assign.startDate")}
                            title={t("data:appointments.assign.startDate")}
                            onChange={(e) => setStartDate(e.target.value)}
                            className={assignStyles.input}
                        />
                        <button
                            type="submit"
                            disabled={!canAssign}
                            title={t("data:appointments.assign.submit")}
                            aria-label={t("data:appointments.assign.submit")}
                            className={primaryIconButtonStyle}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </>
            )}

            {themesQuery.isError && (
                <p className={assignStyles.error} role="alert">
                    {t("data:appointments.assign.errors.load")}
                </p>
            )}
            {assignTheme.error && (
                <p className={assignStyles.error} role="alert">
                    {t(assignErrorKey(assignTheme.error))}
                </p>
            )}
        </form>
    );
};

const assignStyles = {
    // Mismo borde y fondo que las tarjetas de progreso, algo mas ancha para los campos
    card: "flex flex-col justify-center gap-2 px-3 py-2.5 bg-white rounded-xl border border-fade-green shadow-2xs focus-within:border-nutrition-green/60 transition-all duration-200 w-52 shrink-0",

    title: "text-[10px] font-bold uppercase tracking-wider text-text-muted select-none",

    // Como el textarea de Goal en la cabecera
    input: "w-full h-8 px-2 text-xs text-text-body bg-gray-blue-50/60 border border-gray-blue-200/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-nutrition-green focus:bg-white",

    hint: "text-xs text-text-muted",

    error: "text-xs text-red-500",
} as const;
