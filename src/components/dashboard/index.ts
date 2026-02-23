import * as UserList from "./users/list";
import * as Shortcuts from "./shortcut/hook";
import * as ShortcutComponent from "./shortcut/Shortcuts";
import AppDashboard from "./main/dashboard";
import * as Meals from "./metrics/meals/meals";
import * as Titles from "./text/titles";

export const IdxDashboard = {
    Users: UserList,
    ...ShortcutComponent,
    Hooks: {
        ...Shortcuts,
    },
    Metrics: {
        Meals,
    },
    Text: {
        Titles,
    }
}

export { AppDashboard }