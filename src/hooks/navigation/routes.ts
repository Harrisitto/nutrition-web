export const APP_ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  VALIDATION_CONFIRMED: '/validation-confirmed',
  REDIRECT: '/redirect',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  
  // Error routes
  NOT_FOUND: '/404',
} as const

export type AppRoute = typeof APP_ROUTES[keyof typeof APP_ROUTES]