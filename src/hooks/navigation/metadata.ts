import { APP_ROUTES, type AppRoute } from "./routes"

export type RouteMetadata = {
  isProtected: boolean
  isAdminOnly: boolean
}

export const DEFAULT_ROUTE_METADATA: RouteMetadata = {
  isProtected: false,
  isAdminOnly: false,
}

export const ROUTE_METADATA: Partial<Record<Partial<AppRoute>, RouteMetadata>> = {
  [APP_ROUTES.DASHBOARD]: {
    isProtected: true,
    isAdminOnly: false,
  },
  [APP_ROUTES.PROFILE]: {
    isProtected: true,
    isAdminOnly: false,
  },
  [APP_ROUTES.NOT_FOUND]: {
    isProtected: false,
    isAdminOnly: false,
  },
} as const
