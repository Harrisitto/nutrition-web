# recipeTypes

Componentes compartidos para trabajar con tipos de receta (`recipe_type`).

- `input.tsx` — `InputSelectRecipeType`: desplegable para elegir un tipo de receta. Busca por nombre y carga más tipos al hacer scroll (`useFetchRecipeTypes`, paginado, RPC `scored_search_recipe_types_for_client` sin cliente: todos con score 0, por nombre). El idioma de los nombres es el `language_code` del nutricionista, que `useSyncProfileLanguage` (montado en el dashboard) mantiene igual al de la web. Muestra kcal y macros de cada tipo. Valor `number | null` (`null` = "Sin tipo").
  - Solo pide la lista cuando está abierto. El tipo seleccionado se carga aparte (`useFetchRecipeType`), así que siempre se muestra aunque no esté en las páginas cargadas.
  - Teclado: flechas para moverse, Enter para elegir, Escape para cerrar.
  - En formularios de `useForm` se usa con el tipo de campo `recipeType` (ver `hooks/form/types.ts`).
