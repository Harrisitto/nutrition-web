# Recetas del cliente (dashboard)

Recetas propias del cliente seleccionado (`custom_recipes` con `owner_id` = cliente). Ruta
`APP_ROUTES.FORM_CLIENT_RECIPES`, enlazada desde la cabecera del planing ("Recetas").

Monta `CustomRecipesManager` (`src/components/shared/recipes/`) con `useFetchClientCustomRecipes`
y `toClient`, así las recetas nuevas se guardan con el cliente como dueño. Escribir requiere
suscripción activa (lo comprueba la RLS).
