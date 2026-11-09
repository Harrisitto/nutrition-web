# recipeTypes

Componentes compartidos para trabajar con tipos de receta (`recipe_type`).

- `input.tsx` — `InputSelectRecipeType`: desplegable para elegir un tipo de receta. Busca por nombre en el idioma actual y carga más tipos al hacer scroll (`useFetchRecipeTypes`, paginado). Muestra kcal y macros de cada tipo. Valor `number | null` (`null` = "Sin tipo").
  - Solo pide la lista cuando está abierto. El tipo seleccionado se carga aparte (`useFetchRecipeType`), así que siempre se muestra aunque no esté en las páginas cargadas.
  - Teclado: flechas para moverse, Enter para elegir, Escape para cerrar.
  - En formularios de `useForm` se usa con el tipo de campo `recipeType` (ver `hooks/form/types.ts`).
