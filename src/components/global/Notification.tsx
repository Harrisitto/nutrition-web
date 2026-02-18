import { useNotification } from "@src/store/slices/notification/hook"
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const getNotificationStyle = (type: string) => {
    switch (type) {
        case "success":
            return {
                bgClass: "bg-nutrition-purple",
                icon: <Check className="w-5 h-5 text-white" />
            };
        case "error":
            return {
                bgClass: "bg-nutrition-red",
                icon: <Check className="w-5 h-5 text-white" />
            }
        case "info":
            return {
                bgClass: "bg-nutrition-blue",
                icon: <Check className="w-5 h-5 text-white" />
            }
        default:
            return {
                bgClass: "bg-[#a0aec0]",
                icon: <Check className="w-5 h-5 text-white" />
            }
    }
}

export const DisplayNotification = () => {
    const { notifications } = useNotification();
    const { t } = useTranslation();

    return (
        <div className="fixed top-4 right-4 space-y-2 z-50 shadow-sm">
            {notifications.map((notification) => {
                const { bgClass, icon } = getNotificationStyle(notification.type);
                return (
                    <div 
                        key={notification.id} 
                        className={`flex items-center space-x-2 px-4 py-2 rounded shadow-md text-white ${bgClass}`}
                    >
                        {icon}
                        {notification.message && <span>{t(notification.message)}</span>}
                    </div>
                )
            })}
        </div>
    )
}