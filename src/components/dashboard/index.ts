import * as UserList from "./users/list";
import * as Shortcuts from "./shortcut/hook";
import * as ShortcutComponent from "./shortcut/Shortcuts";
import AppDashboard from "./main/dashboard";
import * as Meals from "./metrics/mealsTable/table";
import * as Titles from "./misc/titles";
import { SelectDateHeader } from "./metrics/selectDate/date";
import * as Navigation from "./misc/navigate";

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
    },
    Dates: {
        Select: SelectDateHeader,
    },
    Buttons: {
        ...Navigation,
    },
}

export { AppDashboard }