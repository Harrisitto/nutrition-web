import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { primaryButtonStyle } from "@src/components/styles";
import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { PendingAppointments } from "./list";

const PageAppointments = () => {

    const { t } = useTranslation();
    const { navigateTo } = useAppNavigation();
    // Sin appointmentId: consulta nueva
    const navigateToAppointmentForm = () => {
        navigateTo(APP_ROUTES.FORM_APPOINTMENT);
    };

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex flex-row flex-wrap items-center justify-between gap-4">
                <header className="animate-fade-in border-l-4 border-nutrition-green pl-4">
                    <h1 className="text-2xl font-bold text-text-title md:text-3xl">
                        {t("data:appointments.title")}
                    </h1>
                </header>
                <button
                    type="button"
                    onClick={navigateToAppointmentForm}
                    className={primaryButtonStyle}
                >
                    <Plus size={16} />
                    {t("data:appointments.new")}
                </button>
            </div>


            <PendingAppointments />
            
            
        </div>
    )
}

export default PageAppointments;