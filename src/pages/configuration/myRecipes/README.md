# Mis recetas (configuración)

Recetas propias del nutricionista (`custom_recipes` con `owner_id` = nutricionista), hechas con
alimentos del catálogo. Ruta `APP_ROUTES.MY_RECIPES`.

La página solo pone el título y monta `CustomRecipesManager` (`src/components/shared/recipes/`)
con `useFetchMyCustomRecipes`: lista con editar y eliminar, y el formulario de crear/editar.
