# Editores de la base de datos

Página para los editores de la base de datos (`public_users.database_editors`), en
`APP_ROUTES.DATABASE_EDITORS` (`/database-editors`, fuera del dashboard).

Acceso:

- `useIsDatabaseEditor()` (`services/tanstack/auth/databaseEditor.ts`) dice si el usuario de la sesión es
  editor. Lee la vista de compatibilidad `public.recipe_editors`, que solo devuelve la fila propia. Cuando
  se borre esa vista habrá que pasar a una RPC.
- La ruta va con `<ProtectedRoute databaseEditorRequired>`: quien no es editor vuelve al dashboard.
- En Configuración, la sección "Editores" solo aparece a los editores.

El hook solo sirve para la UI: los permisos de escritura los comprueba la base de datos.

## Recetas (solo lectura por ahora)

- `@components/list.tsx`: tabla de las recetas del catálogo (`catalog_recipes` vía `useFetchRecipes`) con
  id, nombre, foto y macros con las cantidades de la receta. Buscador por nombre.
- `@components/detail.tsx`: ficha de una receta (`useFetchRecipeInfo`): descripción, macros y alimentos con
  su cantidad y unidad.

## Pendiente

El esquema nuevo (`public_recipes`) aún no tiene API de escritura para los editores: `catalog_recipes` y
`catalog_recipe_ingredients` son solo lectura, y `catalog_recipes` no incluye las recetas que publican los
nutricionistas sin revisar. Cuando exista, la página tendrá que:

- Crear recetas nuevas en el catálogo.
- Editar las recetas del catálogo (nombre y descripción por idioma, alimentos).
- Revisar las recetas publicadas por los nutricionistas (`is_global` sin `revised_at`): aprobarlas o
  rechazarlas.
