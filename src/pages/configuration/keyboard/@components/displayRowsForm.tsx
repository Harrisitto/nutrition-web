import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";
import InputComponent from "@src/components/input";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
  setRowVisibility,
  TABLE_ROW_SECTIONS,
} from "@src/store/slices/config/store";
import type {
  TableRowKey,
  TableRowSection,
} from "@src/store/slices/config/store";

const sections = Object.entries(TABLE_ROW_SECTIONS) as [
  TableRowSection,
  readonly TableRowKey[],
][];

const DisplayRowsForm = () => {
  const { t } = useTranslation("forms");
  const dispatch = useAppDispatch();
  const showRowsInTable = useAppSelector(
    (state) => state.config.showRowsInTable,
  );

  const allRows = sections.flatMap(([, rows]) => rows);
  const visibleCount = allRows.filter((row) => showRowsInTable[row]).length;

  return (
    <section className="overflow-hidden rounded-lg border border-nutrition-green/25 shadow-sm">
      <header className="flex items-start justify-between gap-4 bg-dark-green px-4 py-3 text-white-green">
        <div>
          <h3 className="text-base font-semibold">
            {t("dashboardRows.title")}
          </h3>
          <p className="text-xs text-white-green/70">
            {t("dashboardRows.description")}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-white-green/10 px-2 py-1 text-xs font-semibold tabular-nums">
          <Eye className="h-3.5 w-3.5" aria-hidden />
          {visibleCount}/{allRows.length}
        </span>
      </header>

      {sections.map(([section, rows]) => (
        <div key={section}>
          <div className="flex items-center gap-3 border-b border-nutrition-green/15 bg-white-green px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            <span className="flex-1">
              {t(`dashboardRows.sections.${section}`)}
            </span>
            <span>{t("dashboardOptions.fields.isVisible")}</span>
          </div>

          <ul className="divide-y divide-nutrition-green/10 bg-fade-white-green">
            {rows.map((row) => {
              const isVisible = showRowsInTable[row];
              const label = t(`dashboardRows.rows.${row}`);

              return (
                <li
                  key={row}
                  className="group relative flex items-center gap-3 px-4 py-2 transition-colors hover:bg-white-green"
                >
                  <span
                    className={`absolute inset-y-1.5 left-0 w-1 rounded-r transition-colors ${
                      isVisible ? "bg-nutrition-green" : "bg-nutrition-green/15"
                    }`}
                    aria-hidden
                  />
                  <span
                    className={`flex-1 truncate text-sm font-medium transition-colors ${
                      isVisible
                        ? "text-dark-green"
                        : "text-text-muted line-through"
                    }`}
                  >
                    {label}
                  </span>
                  <InputComponent.Toggle
                    checked={isVisible}
                    label={`${t("dashboardOptions.fields.isVisible")} ${label}`}
                    onChange={(visible) =>
                      dispatch(setRowVisibility({ row, isVisible: visible }))
                    }
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default DisplayRowsForm;
