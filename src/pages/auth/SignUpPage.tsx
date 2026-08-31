import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotification } from "@src/store/slices/notification/hook";
import { supabase } from "@src/services/supabase/client";
import { useVerifyAuth } from "@src/services/tanstack/auth/mutate";
import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { useGetAuthInfo } from "@src/services/tanstack/auth/get";
import { Disclaimer, Title as TitleSignIn } from "@src/pages/auth/components/text";


const SignUpPage = () => {
  const { t } = useTranslation();
  const [isNutritionist, setIsNutritionist] = useState(false);
  const [isPendingOtp, setIsPendingOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [tokenDigits, setTokenDigits] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notify = useNotification();
  const verification = useVerifyAuth({ email });
  const infoQuery = useGetAuthInfo();
  const { navigateTo } = useAppNavigation();

  // Redirección para clientes
  const handleClientRedirect = useCallback(() => {
    notify.add({
      type: "info",
      message: t('auth:signUp.downloadApp'),
      duration: 3000,
    })
    setTimeout(() => {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.joseptomas.nutritionapp&hl=ca";
    }, 3000)
  }, [])

  // Envío del email
  const handleSendEmail = useCallback(async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

      const { error } = await supabase.auth.signInWithOtp({
        email,
      })

    if (error) {
      notify.addFormSubmitError();
      setIsSubmitting(false);
      return;
    }

    notify.add({
      type: "success",
      message: t('auth:signUp.otpDisclaimer'),
      duration: 7000,
    })
    setIsSubmitting(false);
    setIsPendingOtp(true);
  }, [t, email, notify])

  const handleVerification = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    verification.mutate({ token: tokenDigits.join("") }, {
      onSuccess: async () => {
        setIsSubmitting(false);
        const { data, error } = await infoQuery.refetch();
        if (error || !data?.name) {
          notify.addFormSubmitError();
          return;
        }
        navigateTo(APP_ROUTES.DASHBOARD, { replace: true });
      }
    })
  }, [verification, tokenDigits, email, notify, navigateTo])

  // Manejo de casillas de token de 6 dígitos
  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const updatedToken = [...tokenDigits];
    updatedToken[index] = value;
    setTokenDigits(updatedToken);

    // Avanza automáticamente al siguiente campo
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !tokenDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  // 1. Pantalla de Selección de Rol (Cliente vs Nutricionista)
  if (!isNutritionist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white-green via-gray-blue-50 to-white-green/50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-blue-200/80 p-8 space-y-6 animate-fade-in">
          <div className="text-center text-text-title">
            <TitleSignIn />
          </div>

          <div className="space-y-4 pt-2">
            <p className="text-sm text-center text-text-subtitle font-medium">
              {t("auth:signUp.selectRole")}
            </p>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={handleClientRedirect}
                className="w-full py-3.5 px-4 bg-gray-blue-50 hover:bg-gray-blue-100 text-text-body font-medium rounded-xl border border-gray-blue-200 transition-all duration-200 flex items-center justify-center hover:border-gray-blue-300 active:scale-[0.99]"
              >
                <span>{t("auth:signUp.iAmClient")}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsNutritionist(true)}
                className="w-full py-3.5 px-4 bg-dark-green hover:bg-nutrition-green text-text-light font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99]"
              >
                <span>{t("auth:signUp.iAmNutritionist")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Pantalla para Nutricionistas
  return (
      <div className="min-h-screen bg-gradient-to-br from-white-green via-gray-blue-50 to-white-green/50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-blue-200/80 p-8 space-y-6 animate-fade-in">

          <div className="text-center text-text-title">
            <TitleSignIn />
          </div>

          {!isPendingOtp ? (
            /* Paso 1: Input de Email */
            <form onSubmit={handleSendEmail} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-text-subtitle uppercase tracking-wider mb-1.5"
                >
                  {t("auth:form.email")}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={"xyz@example.com"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-blue-200 bg-gray-blue-50/50 text-text-body placeholder:text-gray-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-nutrition-green focus:border-transparent transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="w-full py-3.5 px-4 bg-dark-green hover:bg-nutrition-green active:scale-[0.99] text-text-light font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nutrition-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-5 w-5 text-text-light" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                <span>{isSubmitting ? "" : t("system:messages.submit")}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  disabled={!email.trim()}
                  onClick={() => setIsPendingOtp(true)}
                  className="text-xs font-medium text-text-subtitle hover:text-dark-green disabled:opacity-40 disabled:cursor-not-allowed underline underline-offset-4 transition-colors duration-200"
                >
                  {t("auth:signUp.alreadyHaveToken")}
                </button>
              </div>
            </form>
          ) : (
            /* Paso 2: Input personalizado para Token de 6 dígitos */
            <form onSubmit={handleVerification} className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-text-subtitle uppercase tracking-wider">
                    {t("auth:form.token")}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPendingOtp(false)}
                    className="text-xs text-gray-blue-500 hover:text-dark-green transition-colors"
                  >
                    {t("auth:form.changeEmail")}
                  </button>
                </div>

                <div className="flex justify-between gap-2 my-3">
                  {tokenDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-digit-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-gray-blue-200 bg-gray-blue-50/50 text-text-title focus:bg-white focus:outline-none focus:ring-2 focus:ring-nutrition-green focus:border-transparent transition-all duration-200"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || tokenDigits.join("").length !== 6}
                className="w-full py-3.5 px-4 bg-dark-green hover:bg-nutrition-green active:scale-[0.99] text-text-light font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nutrition-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-5 w-5 text-text-light" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                <span>{isSubmitting ? "" : t("auth:form.validate")}</span>
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-gray-blue-100 text-center text-xs text-text-muted">
            <Disclaimer />
          </div>

        </div>
      </div>
  );
};

export default SignUpPage;
