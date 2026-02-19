import { IdxForgotPassword } from "@src/components/auth/forgotPasswordIndex";

const PageForgotPassword = () => {
  const { token } = IdxForgotPassword.Url.useRecoveryParams();
  if (!token) {
    // Render email form
    return (
      <IdxForgotPassword.Form.Provider>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
            <IdxForgotPassword.Text.Title />
            <IdxForgotPassword.Text.MessageEmail />
            <IdxForgotPassword.Form.FieldsEmail />
            <div className="h-4" />
            <IdxForgotPassword.Actions.SubmitEmail />
          </div>
          <div className="h-4" />
          <IdxForgotPassword.Actions.NavigateLogIn />
        </div>
      </IdxForgotPassword.Form.Provider>
    );
  }

  // Render new password form
  return (
    <IdxForgotPassword.Form.Provider>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
          <IdxForgotPassword.Text.Title />
          <IdxForgotPassword.Text.MessageNewPassword />
          <IdxForgotPassword.Form.FieldsNewPassword />
          <div className="h-4" />
          <IdxForgotPassword.Actions.SubmitPassword token={token} />
        </div>
        <div className="h-4" />
        <IdxForgotPassword.Actions.NavigateLogIn />
      </div>
    </IdxForgotPassword.Form.Provider>
  );
};

export default PageForgotPassword;
