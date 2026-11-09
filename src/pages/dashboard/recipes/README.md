# Recetas del cliente (dashboard)

Recetas propias del cliente seleccionado y del nutricionista, juntas y ordenadas por nombre. Ruta
`APP_ROUTES.FORM_CLIENT_RECIPES`, enlazada desde la cabecera del planing ("Recetas").

Monta `CustomRecipesManager` (`src/components/shared/recipes/`) con
`useFetchClientAndMyCustomRecipes`, `toClient` y `showOwner`: la lista se puede buscar por nombre e
indica de quién es cada receta, y las recetas nuevas se guardan con el cliente como dueño. Editar
una receta no cambia su dueño. Escribir requiere suscripción activa (lo comprueba la RLS).
