import { setKeyboardCommand } from "@src/store/slices/config/store";
import type { ConfigState } from "@src/store/slices/config/store";
import { useAppDispatch } from "@src/store/store";
import { useTranslation } from "react-i18next";
import { KeyboardInput } from "./input";

type KeyboardCommandsState = ConfigState["keyboardCommands"];
type KeyboardCategory = keyof KeyboardCommandsState;
type KeyboardCommand<C extends KeyboardCategory> = Extract<
  keyof KeyboardCommandsState[C],
  string
>;
type AnyKeyboardCommand = Extract<
  keyof KeyboardCommandsState[keyof KeyboardCommandsState],
  string
>;

type RenderCommandGroupProps<C extends KeyboardCategory> = {
  title: string;
  entries: Array<[KeyboardCommand<C>, string]>;
  category: C;
};

export const RenderCommandGroup = <C extends KeyboardCategory>({
  title,
  entries,
  category,
}: RenderCommandGroupProps<C>) => {
  const { t } = useTranslation("data");
  const dispatch = useAppDispatch();

  return (
    <section className="min-w-64 flex-1 overflow-hidden rounded-lg border border-nutrition-green/25 shadow-sm">
      <header className="bg-dark-green px-4 py-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white-green">
          {title}
        </h3>
      </header>
      <ul className="divide-y divide-nutrition-green/10 bg-fade-white-green">
        {entries.map(([command, key]) => (
          <li key={String(command)}>
            <label className="flex items-center justify-between gap-3 px-4 py-2 transition-colors hover:bg-white-green">
              <span className="text-sm font-medium text-dark-green">
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
          </li>
        ))}
      </ul>
    </section>
  );
};
