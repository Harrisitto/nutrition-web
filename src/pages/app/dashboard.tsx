import IdxConfiguration from "@src/components/configuration";
import { AppDashboard, IdxDashboard } from "@src/components/dashboard";
import { AnimationLoading } from "@src/components/global/Animations";
import { fromDate, loadDate } from "@src/helpers/dates";
import { useFetchNutritionistUsers } from "@src/services/tanstack/user/profile";
import { useAppSelector } from "@src/store/store";

export default function PageDashboard() {
  const d = useAppSelector((state) => state.config.selectedDay);
  const date = loadDate(d ?? '')

  const thisDateMonday = date
    ? fromDate(date).thisMonday()
    : fromDate().nextMonday();
  const allClients = useFetchNutritionistUsers();

  if (allClients.isLoading) {
    return <AnimationLoading />;
  }

  if (allClients.data?.length === 0 && allClients.isLoading === false) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <IdxConfiguration.AuthManagement.ManageAuthState />
        <IdxConfiguration.Invitations.InviteClient />
        <IdxConfiguration.Invitations.InvitedClients />
      </div>
    );
  }

  return (
    <AppDashboard>
      <div className="p-4">
        <IdxDashboard.Text.Titles.UserName />
        <div className="my-2 h-px w-full bg-nutrition-green/20" />
        <div className="flex flex-row items-center gap-2 m-4 justify-between">
          <IdxDashboard.Dates.SelectDateHeader />
          <div className="flex flex-col gap-2">
            <IdxDashboard.Text.Titles.Navigation />
            <IdxDashboard.Buttons.NavigateInfo />
            <IdxDashboard.Buttons.NavigateUserPreset />
            <IdxDashboard.Buttons.NavigateMeasures />
            <IdxDashboard.Buttons.NavigateConfig />
          </div>
          <div>
            <IdxDashboard.Buttons.CloneLastWeek startMonday={thisDateMonday} />
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
    </AppDashboard>
  );
}
