import { ComponentsLogIn } from "@src/components/auth/logInIndex";
import { useAuth } from "@src/store/slices/auth/hook";
import useAppNavigation from "@src/hooks/navigation";
import { useEffect } from "react";

const LogInPage = () => {
    const { isAuthenticated } = useAuth();
  const { navigateTo, ROUTES } = useAppNavigation();

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigateTo, ROUTES]);
  return (
    <ComponentsLogIn.Fields.Provider>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg ">
          <ComponentsLogIn.Text.Title />
          <ComponentsLogIn.Fields.Fields />
        </div>
        <div className="h-4" />
        <div className="w-full max-w-lg">
          <ComponentsLogIn.Actions.SubmitForm />
        </div>
        <div className="h-4" />
        <div className="w-full max-w-lg flex justify-between">
          <ComponentsLogIn.Actions.RedirectSignUp />
          <ComponentsLogIn.Actions.RedirectForgotPassword />
        </div>

        
      </div>
    </ComponentsLogIn.Fields.Provider>
  );
};

export default LogInPage;
