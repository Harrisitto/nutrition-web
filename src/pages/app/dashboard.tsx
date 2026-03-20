import { ComponentsAuthManagement } from "@src/components/auth/managementIndex";
import { AppDashboard, IdxDashboard } from "@src/components/dashboard";
import { fromDate } from "@src/helpers/dates";
import { useConfigSelectedDay } from "@src/store/slices/config/hook";

export default function PageDashboard() {
  
  const date = useConfigSelectedDay();
  const thisDateMonday = date ?
    fromDate(date).thisMonday() :
    fromDate().nextMonday();

  return (
    <AppDashboard>
      <div className="p-4">
        <IdxDashboard.Text.Titles.UserName />
       <div className="my-4" />
        <IdxDashboard.Dates.Select />
        <div className="my-4" />
        <IdxDashboard.Metrics.Meals.WeeklyMeals
          startMonday={thisDateMonday}
        />
        <ComponentsAuthManagement.Buttons.SignOut />
        <IdxDashboard.Buttons.NavigateUserPreset />
      </div>
    </AppDashboard>
  );
}
