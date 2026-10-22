import { useChangeAppointmentTheme, useDeleteAppointmentTheme, useFetchAppointmentThemes } from "@src/services/tanstack/data/appointments";
import { deleteButtonStyle, iconButtonStyle } from "@src/components/styles";
import { Check, Loader, Pencil, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { fieldIds, useNewAppointmentForm } from "../newAppointment/form";

type Theme = NonNullable<ReturnType<typeof useFetchAppointmentThemes>["data"]>[number];

export const ListAppointmentThemes = ({
    selectedId,
    onSelect,
}: {
    selectedId: number | null;
    onSelect: (themeId: number | null) => void;
}) => {
    const { t } = useTranslation();
    const { data: appointmentThemes, isLoading: isLoadingThemes, error: errorThemes } = useFetchAppointmentThemes();
    const { mutate: deleteTheme, isPending: isDeleting, variables: deletingId } = useDeleteAppointmentTheme();
    const changeAppointmentTheme = useChangeAppointmentTheme();
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const form = useNewAppointmentForm();

    // Fields read the Form state when they mount, so fill it before rendering the edit block
    const startEditing = (theme: Theme) => {
        form.form.updateField(fieldIds.name, { currentValue: theme.name, errorMsg: "" });
        setIsEditing(theme.id);
    };

    const cancelEditing = () => {
        form.form.reset();
        setIsEditing(null);
    };

    const saveEditing = (id: number) => {
        if (!form.form.validateForm()) return;
        const state = form.form.getState();
        changeAppointmentTheme.mutate(
            { id, name: state[fieldIds.name] as string },
            {
                onSuccess: cancelEditing,
                onError: (error) => console.error("Error updating appointment theme:", error),
            },
        );
    };

    const onDelete = (theme: Theme) => {
        const message = t("data:configuration.sections.appointmentThemes.lists.appointments.confirmDelete", {
            name: theme.name,
        });
        if (!window.confirm(message)) return;
        deleteTheme(theme.id, {
            // The points column belongs to the selected theme, clear it if that one is gone
            onSuccess: () => { if (selectedId === theme.id) onSelect(null); },
            onError: (error) => console.error("Error deleting appointment theme:", error),
        });
    };

    const title = (
        <div className="mb-4 text-lg font-semibold">
            {t("data:configuration.sections.appointmentThemes.lists.appointments.title")}
        </div>
    );

    if (isLoadingThemes) {
        return <>
            {title}
            <div className="flex justify-center items-center h-full">
                <Loader className="animate-spin" size={32} />
            </div>
        </>;
    }

    if (errorThemes) {
        return <>
            {title}
            <div className="flex justify-center items-center h-full">
                <div className="text-red-500 text-lg font-semibold">{t("data:configuration.sections.appointmentThemes.errorLoading")}</div>
            </div>
        </>;
    }

    return (
        // fills the column, only the cards scroll (p-1 keeps the selected ring from being clipped)
        <div className="flex min-h-0 flex-1 flex-col">
        {title}
        <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto p-1">
            {appointmentThemes?.map((theme) => isEditing === theme.id ? (
                <div key={theme.id} className="flex items-end gap-2 border rounded shadow p-2">
                    <div className="min-w-0 flex-1">{form.Fields}</div>
                    {/* mb-4 matches the margin of each field so the icons line up with the input */}
                    <div className="mb-4 flex gap-1">
                        <button
                            type="button"
                            onClick={() => saveEditing(theme.id)}
                            disabled={changeAppointmentTheme.isPending}
                            title={t("data:configuration.sections.appointmentThemes.lists.appointments.save")}
                            aria-label={t("data:configuration.sections.appointmentThemes.lists.appointments.save")}
                            className={iconButtonStyle}
                        >
                            <Check size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={cancelEditing}
                            title={t("data:configuration.sections.appointmentThemes.lists.appointments.cancel")}
                            aria-label={t("data:configuration.sections.appointmentThemes.lists.appointments.cancel")}
                            className={iconButtonStyle}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                // div wrapper: the select button and the action buttons cannot be nested
                <div
                    key={theme.id}
                    className={`flex items-center gap-2 border rounded shadow hover:shadow-md transition-shadow duration-300 ${
                        theme.id === selectedId ? "border-nutrition-green ring-2 ring-nutrition-green" : ""
                    }`}
                >
                    <button
                        type="button"
                        onClick={() => onSelect(theme.id)}
                        className="min-w-0 flex-1 p-4 text-left"
                    >
                        <div className="text-lg font-semibold">{theme.name}</div>
                    </button>
                    <div className="mr-2 flex shrink-0 gap-1">
                        <button
                            type="button"
                            title={t("data:configuration.sections.appointmentThemes.lists.appointments.edit")}
                            aria-label={t("data:configuration.sections.appointmentThemes.lists.appointments.edit")}
                            onClick={() => startEditing(theme)}
                            className={iconButtonStyle}
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            type="button"
                            title={t("data:configuration.sections.appointmentThemes.lists.appointments.delete")}
                            aria-label={t("data:configuration.sections.appointmentThemes.lists.appointments.delete")}
                            disabled={isDeleting && deletingId === theme.id}
                            onClick={() => onDelete(theme)}
                            className={deleteButtonStyle}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
};
