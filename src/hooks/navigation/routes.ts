export const APP_ROUTES = {
  // Public routes
  HOME: "/",
  INFO: "/info",
  SIGN_UP: "/sign-up",
  PRIVACY_POLICY: "/privacy-policy",
  REFERENCES: "/references",

  // Protected routes
  DASHBOARD: "/dashboard",
  CANCEL_PAYMENT: "/dashboard/cancel-payment",
  CONFIG: "/dashboard/config",
  FORM_PRESET: "/dashboard/form-preset",
  FORM_MEASURE: "/dashboard/form-measure",

  // Error routes
  NOT_FOUND: "/404",
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
