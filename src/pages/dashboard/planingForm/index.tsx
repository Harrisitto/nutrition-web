import { IdxDashboard } from "./@components";
import { SelectDateCalendar } from "./@components/calendar";

const PagePlaningForm = ({ thisDateMonday }: { thisDateMonday: Date }) => {
  return (
    <div>
      <IdxDashboard.Text.Titles.UserName />
      <div className="my-2 h-px w-full bg-nutrition-green/20" />
      <div className="flex flex-row items-center gap-2 m-4 justify-between">
        <SelectDateCalendar />
        <div className="flex flex-col gap-2">
          <IdxDashboard.Text.Titles.Navigation />
          <IdxDashboard.Buttons.NavigateUserPreset />
          <IdxDashboard.Buttons.NavigateMeasures />
        </div>
        <div className="flex flex-1 flex-row flex-wrap justify-evenly gap-2">
          <IdxDashboard.Users.Info.LastSeen />
          <IdxDashboard.Users.Info.Email />
          <IdxDashboard.Users.Info.Phone />
          <IdxDashboard.Users.Info.Weight />
          <IdxDashboard.Users.Info.Goal />
        </div>
      </div>
      <div className="my-4" />
      <IdxDashboard.Metrics.Meals.WeeklyMeals startMonday={thisDateMonday} />
    </div>
  );
};

export default PagePlaningForm;
