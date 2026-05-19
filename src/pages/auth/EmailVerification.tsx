import { ComponentsVerifyEmail } from "@src/components/auth/verifyEmailIndex";

const EmailVerificationPage = () => {
  const { token, isAppVerified } =
    ComponentsVerifyEmail.useVerificationToken();


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
        {token ? (
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
