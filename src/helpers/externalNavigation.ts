const iosUrl = "https://apps.apple.com/es/app/ezfood/id6745104372";
const androidUrl = "https://play.google.com/store/apps/details?id=com.joseptomas.nutritionapp&pcampaignid=web_share";

const isIOS = () => {
    if (typeof navigator === "undefined") {
        return false;
    }

    const ua = navigator.userAgent || navigator.vendor || "";
    const isAppleDevice = /iPad|iPhone|iPod/i.test(ua);
    const isIpadOs = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;

    return isAppleDevice || isIpadOs;
};

export const fallbackUrl = () => {
    const app = isIOS() ? iosUrl : androidUrl;
    return app;
};

export const verificationEmailRedirectUrl = ({
    isNutritionist = true,
    redirectToApp = false
}: {
    isNutritionist: boolean;
    redirectToApp: boolean;
}) => {
    // https://ezfood.fit/#/verify-email?shouldRedirectToApp=false&isNutritionistAccount=true
    const base = "https://ezfood.fit/#/verify-email";
    const params = new URLSearchParams({
        isNutritionistAccount: isNutritionist.toString(),
        shouldRedirectToApp: redirectToApp.toString()
    });

    return `${base}?${params.toString()}`;
};

export const passwordResetEmailRedirectUrl = ({
    redirectToApp = false
}: {
    redirectToApp: boolean;
}) => {
    // https://ezfood.fit/#/reset-password?shouldRedirectToApp=false
    const base = "https://ezfood.fit/#/reset-password";
    const params = new URLSearchParams({
        shouldRedirectToApp: redirectToApp.toString()
    });

    return `${base}?${params.toString()}`;
};