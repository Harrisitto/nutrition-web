# Recetas propias (formulario compartido)

`CustomRecipeForm` crea o edita una receta propia: una fila de `user_recipes` (nombre y
descripción) y su lista de alimentos del catálogo en `user_recipe_ingredients` (alimento +
cantidad + unidad). Se guarda todo junto con la RPC `upsert_custom_recipe` con `p_public_recipes`
(`useUpsertCustomRecipe`, provisional), que reemplaza la lista entera de alimentos.

Se comparte entre:

- Configuración → mis recetas (`toClient` = false): recetas del nutricionista.
- Dashboard → recetas del cliente seleccionado (`toClient` = true).

Archivos:

- `form.ts`: config de `useForm` para nombre y descripción, inicializada con la receta a editar.
- `@components/ingredients.tsx`: lista de alimentos con su cantidad, unidad y macros, y buscador del
  catálogo (`catalog_ingredients`, macros por 100 g). La unidad sale de `catalog_ingredient_units`
  (gramos de cada unidad); un alimento nuevo entra con una ración: 1 unidad si tiene alguna que no sea
  g ni ml, si no 100 g. Es controlado: el borrador vive en `index.tsx`.
- `helpers.ts`: tipo del borrador de alimentos, `parseAmount`, y las macros totales de una receta
  (`recipeMacros`) o de un borrador (`draftMacros`) como `Macros`.
- `@components/macrosChart.tsx`: barras horizontales (HTML, con el nombre encima de cada barra) con los gramos de hc, proteína y grasa, y las
  kcal totales al lado. Se muestra en cada receta de la lista.
- `list.tsx`: lista de recetas con buscador por nombre (sin distinguir mayúsculas ni acentos),
  editar (carga la receta en el formulario) y eliminar (con confirmación). Recibe la query del padre
  (`CustomRecipesQuery`: una query o la unión de varias). Con `showOwner` cada receta lleva un borde y
  una etiqueta según sea del cliente (verde) o del nutricionista (azul).
- `manager.tsx`: lista + formulario, con el estado de la receta que se edita. Es lo que montan las
  páginas `configuration/myRecipes` y `dashboard/recipes`.
- `index.tsx`: el formulario. Sin `recipe` crea una receta y se vacía al guardar; con `recipe` la
  edita (el dueño no cambia). Para cambiar la receta editada, móntalo con otra `key`.

Una receta necesita nombre y al menos un alimento con cantidad mayor que 0.

## Tipo de receta (solo para ajustar)

Las recetas no tienen tipo: la base de datos decide a qué tipos llega cada una por sus macros, moviendo
cada alimento entre su mínimo y su máximo, y la planificación la ofrece en esos tipos.

El formulario tiene un selector de `recipe_type` (`components/shared/recipeTypes/input.tsx`) que solo
sirve de guía y no se guarda. Con un tipo del catálogo elegido, `@components/typeFitChart.tsx` compara
las macros de la receta con las del tipo: por cada macro, una franja con el margen en el que encaja
(±10 %, mínimo ±2 g), una marca en el objetivo y una barra con lo que aporta la receta (verde si cae
dentro, roja si no). El encaje se calcula en local con `Macros.fits` (`helpers/macros.ts`) con las
cantidades tal cual; la base de datos es más permisiva (mueve las cantidades dentro de su rango).

Orden del formulario: selector y gráfico del tipo arriba del todo, luego los alimentos y al final
nombre y descripción. Si la receta no encaja, el botón
"Ajustar cantidades" del gráfico llama a `fitAmountsToMacros` (`fitAmounts.ts`): recalcula las
cantidades de los alimentos elegidos para acercarse al tipo (mínimos cuadrados con cantidades
positivas, cada macro medido en márgenes, lo más parecido posible a las cantidades actuales) y las
redondea (g y ml enteros; en otras unidades, `min_scale` o cuartos). Si con esos alimentos no se puede
encajar, el gráfico dice qué macro falta o sobra.

`@api/matchType.ts` (RPC vieja `custom_ingredients_match_type`) ya no se usa: se puede borrar.
