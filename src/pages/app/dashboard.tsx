import IdxConfiguration from "@src/components/configuration";
import { AppDashboard, IdxDashboard } from "@src/components/dashboard";
import { AnimationLoading } from "@src/components/global/Animations";
import { fromDate, loadDate } from "@src/helpers/dates";
import { useGetAuthInfo } from "@src/services/tanstack/auth/get";
import { useFetchNutritionistUsers } from "@src/services/tanstack/user/profile";
import { useAppSelector } from "@src/store/store";
import { IdxSetUpProfile } from "@src/components/auth/setUpProfileIndex";
import { useEffect, useState } from "react";
import { debounce } from "lodash";


export default function PageDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const d = useAppSelector((state) => state.config.selectedDay);
  const date = loadDate(d ?? '')

  const thisDateMonday = date
    ? fromDate(date).thisMonday()
    : fromDate().nextMonday();

  const allClients = useFetchNutritionistUsers();
  const nutriInfoQuery = useGetAuthInfo();

  const DEBOUNCE_DURATION = 500;

  useEffect(() => {
    // 1. Definimos la función debouncenda
    const handleLoadingDebounced = debounce(() => {
      // Ambas consultas deben haber terminado de cargar (&&)
      const isStillLoading = allClients.isLoading || nutriInfoQuery.isLoading;
      setIsLoading(isStillLoading);
    }, DEBOUNCE_DURATION);

    // 2. IMPORTANTE: ¡Ejecutamos la función!
    handleLoadingDebounced();

    // 3. Cancelamos la ejecución pendiente si las dependencias cambian o el componente se desmonta
    return () => {
      handleLoadingDebounced.cancel();
    };
  }, [allClients.isLoading, nutriInfoQuery.isLoading]);

  if (isLoading) {
    return <div className="w-full min-h-screen flex justify-center items-center">
      <AnimationLoading size={240} />
    </div>;
  }

  if (!nutriInfoQuery.data) {
    return (
      <IdxSetUpProfile.Provider>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg ">
            <IdxSetUpProfile.Text.Title />
            <IdxSetUpProfile.Text.Message />
            <IdxSetUpProfile.Fields />
            <IdxSetUpProfile.Actions.ConfirmSetup />
          </div>
        </div>
      </IdxSetUpProfile.Provider>
    )
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
