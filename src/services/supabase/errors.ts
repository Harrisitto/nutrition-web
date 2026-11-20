// 55000: escritura de un nutricionista sin suscripcion activa (shared_check_subscription del API nuevo)
export const isNoSubscriptionError = (error: unknown) =>
    typeof error === "object" && error !== null && "code" in error && error.code === "55000";
