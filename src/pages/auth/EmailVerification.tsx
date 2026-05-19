import { ComponentsVerifyEmail } from "@src/components/auth/verifyEmailIndex";
import { AnimationLoading } from "@src/components/global/Animations";

const EmailVerificationPage = () => {
  const { token, isValid, loading, isAppVerified } =
    ComponentsVerifyEmail.useVerificationToken();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AnimationLoading />
      </div>
    );
  }

  if (token && isAppVerified) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <ComponentsVerifyEmail.Text.Title />
          <ComponentsVerifyEmail.Text.MobileVerified />
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
