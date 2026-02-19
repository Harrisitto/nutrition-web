import { IdxForgotPassword } from "@src/components/auth/forgotPasswordIndex";

const PageForgotPassword = () => {
    const {
        token,
    } = IdxForgotPassword.Url.useRecoveryParams();

    if (!token) {
        // Render email form
        return (
            <IdxForgotPassword.Form.Provider>
            <div className="p-6">
                <IdxForgotPassword.Text.Title />
                <IdxForgotPassword.Text.MessageEmail />
                <IdxForgotPassword.Form.FieldsEmail />
                <div className="h-4" />
                <IdxForgotPassword.Actions.NavigateLogIn />
                <IdxForgotPassword.Actions.SubmitEmail />
            </div>
            </IdxForgotPassword.Form.Provider>
        );
    }

    // Render new password form
    return (
        <IdxForgotPassword.Form.Provider>
        <div className="p-6">
            <IdxForgotPassword.Text.Title />
            <IdxForgotPassword.Text.MessageNewPassword />
            <IdxForgotPassword.Form.FieldsNewPassword />
            <div className="h-4" />
            <IdxForgotPassword.Actions.SubmitPassword token={token} />
            <IdxForgotPassword.Actions.NavigateLogIn />
        </div>
        </IdxForgotPassword.Form.Provider>
    );
}

export default PageForgotPassword;