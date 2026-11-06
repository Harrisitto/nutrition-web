import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Pencil, X } from "lucide-react";
import InputComponent from "@src/components/input";
import { iconButtonStyle } from "@src/components/styles";
import { useNotification } from "@src/store/slices/notification/hook";
import { useRenameAppointmentPointGroup } from "@src/services/tanstack/data/appointments";
import { GROUP_NAME_MAX_LENGTH, type DayGroup } from "./groups";

// Cabecera de un grupo de puntos del mismo día: su nombre (editable) y el día
export const GroupHeader = ({ themeId, group }: { themeId: number; group: DayGroup }) => {
  const { t } = useTranslation();
  const renameGroup = useRenameAppointmentPointGroup();
  const { addMutationError } = useNotification();
  const [draft, setDraft] = useState<string | null>(null); // null = sin editar

  const save = () => {
    if (draft === null) return;
    renameGroup.mutate(
      { theme_id: themeId, in_days: group.inDays, group_name: draft.trim() || null },
      { onSuccess: () => setDraft(null), onError: addMutationError },
    );
  };

  const days = t("data:configuration.sections.appointmentThemes.forms.point.inDays", {
    days: group.inDays,
  });

  if (draft !== null) {
    return (
      <div className="mb-2 flex items-end gap-1">
        <div className="min-w-0 flex-1">
          <InputComponent.Text.SingleLine
            label={t("data:configuration.sections.appointmentThemes.lists.points.groupName")}
            maxLength={GROUP_NAME_MAX_LENGTH}
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") setDraft(null);
            }}
          />
        </div>
        <button
          type="button"
          onClick={save}
          disabled={renameGroup.isPending}
          title={t("data:configuration.sections.appointmentThemes.forms.point.save")}
          aria-label={t("data:configuration.sections.appointmentThemes.forms.point.save")}
          className={`${iconButtonStyle} mb-1`}
        >
          <Check size={18} />
        </button>
        <button
          type="button"
          onClick={() => setDraft(null)}
          title={t("data:configuration.sections.appointmentThemes.forms.point.cancel")}
          aria-label={t("data:configuration.sections.appointmentThemes.forms.point.cancel")}
          className={`${iconButtonStyle} mb-1`}
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  const editLabel = t("data:configuration.sections.appointmentThemes.lists.points.editGroup");
  return (
    <div className="mb-2 flex items-center justify-between gap-2 px-1">
      <div className="min-w-0">
        {group.groupName ? (
          <div className="truncate font-semibold text-nutrition-green">{group.groupName}</div>
        ) : (
          // Sin nombre el cliente no sabría qué agrupa: se pide que se lo pongan
          <div className="italic text-text-muted">
            {t("data:configuration.sections.appointmentThemes.lists.points.unnamedGroup")}
          </div>
        )}
        <div className="text-xs text-text-muted">
          {days} ·{" "}
          {t("data:configuration.sections.appointmentThemes.lists.points.pointsCount", {
            count: group.points.length,
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setDraft(group.groupName ?? "")}
        title={editLabel}
        aria-label={editLabel}
        className={iconButtonStyle}
      >
        <Pencil size={16} />
      </button>
    </div>
  );
};
