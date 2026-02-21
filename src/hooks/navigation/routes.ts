export const APP_ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/log-in',
  SIGN_UP: '/sign-up',
  EMAIL_VERIFICATION: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  PRIVACY_POLICY: '/privacy-policy',

  COMPLETE_PROFILE: '/profile-setup',
  DASHBOARD: '/dashboard',

  
  // Error routes
  NOT_FOUND: '/404',
} as const

export type AppRoute = typeof APP_ROUTES[keyof typeof APP_ROUTES]