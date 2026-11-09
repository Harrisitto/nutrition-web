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
- `helpers.ts`: tipo del borrador de alimentos, `parseAmount`, y las macros totales de una receta
  (`recipeMacros`) o de un borrador (`draftMacros`) como `Macros`.
- `@components/macrosChart.tsx`: barras horizontales (HTML, con el nombre encima de cada barra) con los gramos de hc, proteína y grasa, y las
  kcal totales al lado y, si la receta tiene `type_id`, el tipo de comida (`recipe_type`). Se muestra en
  cada receta de la lista.
- `list.tsx`: lista de recetas con buscador por nombre (sin distinguir mayúsculas ni acentos),
  editar (carga la receta en el formulario) y eliminar (con confirmación). Recibe la query del padre
  (`CustomRecipesQuery`: una query o la unión de varias). Con `showOwner` cada receta lleva un borde y
  una etiqueta según sea del cliente (verde) o del nutricionista (azul).
- `manager.tsx`: lista + formulario, con el estado de la receta que se edita. Es lo que montan las
  páginas `configuration/myRecipes` y `dashboard/recipes`.
- `@api/matchType.ts`: `doIngredientsMatchRecipeType`, llama a la RPC `custom_ingredients_match_type` para saber
  si las macros de unos alimentos encajan en un `recipe_type`.
- `index.tsx`: el formulario. Sin `recipe` crea una receta y se vacía al guardar; con `recipe` la
  edita (el dueño no cambia). Para cambiar la receta editada, móntalo con otra `key`.

Una receta necesita nombre y al menos un alimento con cantidad mayor que 0.

## Tipo de receta

El formulario tiene un selector de `recipe_type` (`components/shared/recipeTypes/input.tsx`). Con un
tipo del catálogo elegido, `@components/typeFitChart.tsx` compara las macros de la receta con las del
tipo: por cada macro, una franja con el margen en el que encaja (±10 %, mínimo ±2 g), una marca en el
objetivo y una barra con lo que aporta la receta (verde si cae dentro, roja si no). El encaje se
calcula en local con `Macros.fits` (`helpers/macros.ts`), la misma regla que
`recipe_type_matches_macros`, así que se actualiza al momento al cambiar cantidades.

Orden del formulario: selector y gráfico del tipo arriba del todo, luego los alimentos y al final
nombre y descripción. Si la receta no encaja, el botón
"Ajustar cantidades" del gráfico llama a `fitAmountsToMacros` (`fitAmounts.ts`): recalcula las
cantidades de los alimentos elegidos para acercarse al tipo (mínimos cuadrados con cantidades
positivas, cada macro medido en márgenes, lo más parecido posible a las cantidades actuales) y las
redondea (unidades enteras, o décimas si la ración es pequeña). Si con esos alimentos no se puede
encajar, el gráfico dice qué macro falta o sobra.

Al guardar decide la base de datos (`custom_ingredients_match_type`, en `@api/matchType.ts`):

- Tipo del catálogo y los alimentos encajan: se guarda ese tipo.
- No encajan, o no se ha elegido tipo: se guarda el tipo "receta propia" (`custom_recipe_type_id`),
  que la base de datos no comprueba. Así `upsert_custom_recipe` nunca falla por macros (23514).
