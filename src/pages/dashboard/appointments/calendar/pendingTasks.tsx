import { useTranslation } from "react-i18next";
import { useFetchPendingNutritionistTasks } from "@src/services/tanstack/data/notes";
import { emptyTextStyle } from "../../races/components/formStyles";
import { NoteItem } from "../../@components/notes/noteItem";

// Tareas sin completar de todos los clientes, sean del dia que sean: al marcarlas desaparecen
export const PendingTasks = () => {
  const { t } = useTranslation();
  const pendingQuery = useFetchPendingNutritionistTasks();
  const tasks = pendingQuery.data ?? [];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-text-title">{t("data:calendar.pendingTasks")}</h2>
      {pendingQuery.isError ? (
        <p className="text-sm text-red-500" role="alert">
          {t("data:calendar.errors.load")}
        </p>
      ) : tasks.length === 0 ? (
        !pendingQuery.isPending && <p className={emptyTextStyle}>{t("data:calendar.noPendingTasks")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {/* Ya vienen de la query de mayor a menor prioridad */}
          {tasks.map((note) => (
            <li key={note.id}>
              <NoteItem note={note} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
