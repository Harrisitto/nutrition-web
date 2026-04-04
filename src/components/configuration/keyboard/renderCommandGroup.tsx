import { setKeyboardCommand } from "@src/store/slices/config/store";
import type { ConfigState } from "@src/store/slices/config/store";
import { useAppDispatch } from "@src/store/store";
import { useTranslation } from "react-i18next";
import { KeyboardInput } from "./input";

type KeyboardCommandsState = ConfigState["keyboardCommands"];
type KeyboardCategory = keyof KeyboardCommandsState;
type KeyboardCommand<C extends KeyboardCategory> = Extract<keyof KeyboardCommandsState[C], string>;
type AnyKeyboardCommand = Extract<keyof KeyboardCommandsState[keyof KeyboardCommandsState], string>;

type RenderCommandGroupProps<C extends KeyboardCategory> = {
  title: string;
  entries: Array<[KeyboardCommand<C>, string]>;
  category: C;
};

export const RenderCommandGroup = <C extends KeyboardCategory,>({
  title,
  entries,
  category,
}: RenderCommandGroupProps<C>) => {
  const { t } = useTranslation("data");
  const dispatch = useAppDispatch();

  return (
    <section className="rounded-xl border border-nutrition-green/20 bg-white-green/60 p-4 shadow-sm">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-dark-green/85">
        {title}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {entries.map(([command, key]) => (
          <label
            key={String(command)}
            className="rounded-lg border border-nutrition-green/15 bg-white px-3 py-2 transition-colors hover:border-nutrition-green/35"
          >
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted">
              {t(`configuration.sections.keyboard.commands.${String(command)}`)}
            </span>
            <KeyboardInput
              value={key}
              onChange={(newKey) =>
                dispatch(
                  setKeyboardCommand({
                    category,
                    command: command as AnyKeyboardCommand,
                    key: newKey,
                  }),
                )
              }
            />
          </label>
        ))}
      </div>
    </section>
  );
};
