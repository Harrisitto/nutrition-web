import { ComponentsAuthManagement } from "@src/components/auth/managementIndex";
import { AppDashboard, IdxDashboard } from "@src/components/dashboard";

export default function PageDashboard() {
  return (
    <AppDashboard>
      <div className="p-4">
        <IdxDashboard.Text.Titles.UserName />
       <div className="my-4" />
        <IdxDashboard.Metrics.Meals.WeeklyMeals />
        <ComponentsAuthManagement.Buttons.SignOut />
      </div>
    </AppDashboard>
  );
}
