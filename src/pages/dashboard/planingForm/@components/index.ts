import * as Meals from "./metrics/mealsTable/table";
import * as Titles from "./misc/titles";
import * as Navigation from "./misc/navigate";
import { SelectDateHeader } from "./metrics/selectDate/date";
import * as Info from "./metrics/userInfo";
import { CloneLastWeek } from "./misc/cloneWeek";

export const IdxDashboard = {
  Users: {
    Info,
  },
  Metrics: {
    Meals,
  },
  Text: {
    Titles,
  },
  Dates: {
    SelectDateHeader,
  },
  Buttons: {
    ...Navigation,
    CloneLastWeek,
  },
};
