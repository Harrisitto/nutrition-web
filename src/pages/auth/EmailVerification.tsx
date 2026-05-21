import { ComponentsVerifyEmail } from "@src/components/auth/verifyEmailIndex";
import { AnimationLoading } from "@src/components/global/Animations";
import { useTranslation } from "react-i18next";

const EmailVerificationPage = () => {
  const {
    token,
    isValid,
    loading,
    isNutritionistAccount,
    shouldRedirectToApp,
    redirectToApp,
  } = ComponentsVerifyEmail.useVerificationToken();
  const { t } = useTranslation();

  const handleOpenApp = () => {
    const appDeepLink = redirectToApp || "ezfood://(anon)/settings/account";
    const fallbackUrl = "https://play.google.com/store/apps/details?id=com.joseptomas.nutritionapp&pcampaignid=web_share";

    window.location.href = appDeepLink;
    window.setTimeout(() => {
      window.location.href = fallbackUrl;
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AnimationLoading />
      </div>
    );
  }

  if (!isNutritionistAccount && shouldRedirectToApp && isValid) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <ComponentsVerifyEmail.Text.Title />
          <ComponentsVerifyEmail.Text.MobileVerified />
          <button
            type="button"
            onClick={handleOpenApp}
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {t("auth:verifyEmail.goToApp")} 
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <ComponentsVerifyEmail.Text.Title />
        {isValid ? (
          <>
            <ComponentsVerifyEmail.Text.Sucess />
            <ComponentsVerifyEmail.Actions.NavigateToDashboard />
          </>
        ) : (
          <>
            <ComponentsVerifyEmail.Text.Error />
            {token && <ComponentsVerifyEmail.Actions.ResendEmail />}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
