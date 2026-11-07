# Recetas propias (formulario compartido)

`CustomRecipeForm` crea o edita una receta propia: una fila de `custom_recipes` (nombre y
descripción) y su lista de alimentos del catálogo en `custom_recipe_ingredients` (alimento +
cantidad). Se guarda todo junto con la RPC `upsert_custom_recipe` (`useUpsertCustomRecipe`), que
reemplaza la lista entera de alimentos.

Se comparte entre:

- Configuración → mis recetas (`toClient` = false): recetas del nutricionista.
- Dashboard → recetas del cliente seleccionado (`toClient` = true).

Archivos:

- `form.ts`: config de `useForm` para nombre y descripción, inicializada con la receta a editar.
- `@components/ingredients.tsx`: lista de alimentos con su cantidad y macros, y buscador del catálogo
  (`recipe_type_custom_ingredients`). Es controlado: el borrador vive en `index.tsx`.
- `helpers.ts`: tipo del borrador de alimentos y `parseAmount`.
- `@components/macrosChart.tsx`: barras horizontales (HTML, con el nombre encima de cada barra) con los gramos de hc, proteína y grasa, y las
  kcal totales al lado y, si la receta tiene `type_id`, el tipo de comida (`recipe_type`). Se muestra en
  cada receta de la lista. El tipo lo eligen los clientes: el formulario del nutricionista no lo edita.
- `list.tsx`: lista de recetas con editar (carga la receta en el formulario) y eliminar (con
  confirmación). Recibe la query del padre.
- `manager.tsx`: lista + formulario, con el estado de la receta que se edita. Es lo que montan las
  páginas `configuration/myRecipes` y `dashboard/recipes`.
- `index.tsx`: el formulario. Sin `recipe` crea una receta y se vacía al guardar; con `recipe` la
  edita (el dueño no cambia). Para cambiar la receta editada, móntalo con otra `key`.

Una receta necesita nombre y al menos un alimento con cantidad mayor que 0.
