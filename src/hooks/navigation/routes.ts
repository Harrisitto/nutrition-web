export const APP_ROUTES = {
  // Public routes
  HOME: '/',
  INFO: '/info',
  SIGN_UP: '/sign-up',
  PRIVACY_POLICY: '/privacy-policy',
  REFERENCES: '/references',

  // Protected routes
  DASHBOARD: '/dashboard',
  CONFIG: '/config',
  FORM_PRESET: '/form-preset',
  FORM_MEASURE: '/form-measure',


  // Error routes
  NOT_FOUND: '/404',
} as const

export type AppRoute = typeof APP_ROUTES[keyof typeof APP_ROUTES]
