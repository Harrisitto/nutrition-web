export const APP_ROUTES = {
  // Public routes
  HOME: "/",
  INFO: "/info",
  SIGN_UP: "/sign-up",
  PRIVACY_POLICY: "/privacy-policy",
  REFERENCES: "/references",

  // Protected routes
  DASHBOARD: "/dashboard/",
  DASHBOARD_WILD: "/dashboard/*",
  CANCEL_PAYMENT: "/dashboard/cancel-payment",
  CONFIG: "/dashboard/config/",
  CONFIG_WILD: "/dashboard/config/*",

  INVITE_CLIENT: "/dashboard/config/invite-client",
  RECIPES_CONFIG: "/dashboard/config/recipes-config",
  KEYBOARD: "/dashboard/config/keyboard",
  AUTH_MANAGEMENT: "/dashboard/config/auth-management",
  RACE_INGREDIENTS: "/dashboard/config/race-ingredients",
  APPOINTMENT_THEMES: "/dashboard/config/appointment-themes",
  GLOBAL_USER_PRESETS: "/dashboard/config/global-user-presets",

  FORM_PRESET: "/dashboard/form-preset",
  FORM_MEASURE: "/dashboard/form-measure",
  FORM_APPOINTMENT: "/dashboard/form-appointment",
  APPOINTMENTS: "/dashboard/appointments",
  APPOINTMENTS_CALENDAR: "/dashboard/calendar",
  RACES: "/dashboard/races",


  // Error routes
  NOT_FOUND: "/404",
} as const;

export const getTrailingRoute = (route: string) => {
  const split = route.split("/");
  if (split.length === 0) return "";
  if (split[split.length - 1] === "*") {
    return `${split[split.length - 2]}/*`;
  }
  return split[split.length - 1];
};

export const makeWildCardRoute = (route: string) => {
  return `${route}/*`;
};

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
