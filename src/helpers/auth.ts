export const composeRedirectUrl = (route: string) => {
    const baseUrl = window.location.href.split('#')[0];
    return `${baseUrl}#${route}`;
}