En esta pagina los nutricionistas pueden crear días de planificación estandard para ser guardados.
Luego los podrán cargar en la planificación.

Se guardan las recetas, los hidratos por hora de entrenamiento, el comentario.

También se pueden eliminar los preset viejos que ya no se vayan a usar.
El tipo de receta de cada comida se elige con un desplegable con búsqueda por nombre (`components/shared/recipeTypes`).
Cada desplegable lleva el `mealId` de su comida y, en los presets del cliente (no globales), `scoreByClient`: salen
primero los tipos más puestos a ese cliente en esa comida el último mes (RPC `scored_search_recipe_types_for_client`
con `p_meal_id`). En los globales no hay cliente y salen por nombre.
