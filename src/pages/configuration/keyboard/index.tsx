import { useAppSelector } from "@src/store/store";
import { useTranslation } from "react-i18next";
import { RenderCommandGroup } from "./@components/renderCommandGroup";
import { ConfigurationPages } from "@src/pages/configuration/@components/title";
import DisplayMealsForm from "./@components/displaymealsForm";

export const TableCommands = () => {
  const { t } = useTranslation("data");
  const appControls = useAppSelector((state) => state.config.keyboardCommands);

  const tableNavigationEntries = Object.entries(
    appControls.tableNavigation,
  ) as Array<[keyof typeof appControls.tableNavigation, string]>;
  const selectOptionsEntries = Object.entries(
    appControls.selectOptions,
  ) as Array<[keyof typeof appControls.selectOptions, string]>;
  const commentsEditorEntries = Object.entries(
    appControls.commentsEditor,
  ) as Array<[keyof typeof appControls.commentsEditor, string]>;

  return (
    <ConfigurationPages
      title={t("configuration.sections.keyboard.tableCommands")}
      description={t("configuration.sections.keyboard.description")}
    >
      <div>
        <div className="space-y-4 flex flex-row flex-wrap gap-4 justify-between">
          <RenderCommandGroup
            title={t("configuration.sections.keyboard.groups.table")}
            entries={tableNavigationEntries}
            category="tableNavigation"
          />
          <RenderCommandGroup
            title={t("configuration.sections.keyboard.groups.searchOptions")}
            entries={selectOptionsEntries}
            category="selectOptions"
          />
          <RenderCommandGroup
            title={t("configuration.sections.keyboard.groups.comments")}
            entries={commentsEditorEntries}
            category="commentsEditor"
          />
        </div>
        <div className="my-4 h-px w-full bg-nutrition-green/20" />
        <DisplayMealsForm />
      </div>
    </ConfigurationPages>
  );
};
