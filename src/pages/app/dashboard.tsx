import { AppDashboard, IdxDashboard } from "@src/components/dashboard";
import { fromDate } from "@src/helpers/dates";
import { useConfigSelectedDay } from "@src/store/slices/config/hook";

export default function PageDashboard() {
  const date = useConfigSelectedDay();
  const thisDateMonday = date
    ? fromDate(date).thisMonday()
    : fromDate().nextMonday();

  return (
    <AppDashboard>
      <div className="p-4">
        <IdxDashboard.Text.Titles.UserName />
        <div className="my-2 h-px w-full bg-nutrition-green/20" />
        <div className="flex flex-row items-center gap-2 m-4 justify-between">
          <IdxDashboard.Dates.SelectDateHeader />
          <div className="flex flex-1 flex-row flex-wrap justify-evenly gap-2">
            <IdxDashboard.Users.Info.LastSeen />
            <IdxDashboard.Users.Info.Email />
            <IdxDashboard.Users.Info.Phone />
            <IdxDashboard.Users.Info.Weight />
            <IdxDashboard.Users.Info.Goal />
          </div>
          <div className="flex flex-col">
            <IdxDashboard.Text.Titles.Navigation />
            <IdxDashboard.Buttons.NavigateUserPreset />
            <IdxDashboard.Buttons.NavigateMeasures />
            <IdxDashboard.Buttons.NavigateConfig />
          </div>
        </div>
        <div className="my-4" />
        <IdxDashboard.Metrics.Meals.WeeklyMeals startMonday={thisDateMonday} />
      </div>
    </AppDashboard>
  );
}
