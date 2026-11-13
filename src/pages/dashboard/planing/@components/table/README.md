# WeeklyMeals table

Tabla semanal (7 columnas de día + 1 columna de etiqueta) que muestra y edita
la planificación nutricional del usuario: presets del día, comidas, horas de
entrenamiento, kcal de entrenamiento, carreras, kcal ingeridas y gastadas, balance energético, macros por kg y
comentarios/eventos/enlace y el documento adjunto del día. Se monta desde [index.tsx](index.tsx) como
`WeeklyMeals`.

## Piezas principales

- **[index.tsx](index.tsx)** — componente raíz. Junta filas + columnas en una
  instancia de `@tanstack/react-table`, guarda el estado de selección/edición
  y renderiza el `<table>`.
- **[hooks/rows.ts](hooks/rows.ts)** — construye el array de `RowInfo` (una
  entrada por fila) a partir de varias queries de TanStack Query (planning,
  meals, meals del usuario, carreras de la semana y macros diarios). Cada bloque de datos (comidas,
  entrenamiento, balance energético, macros, comentarios/eventos) se monta
  en su propio `useMemo` y luego se concatenan, intercalando filas de
  cabecera (`isFullWidth: true`) entre secciones.
  Las filas fijas se filtran según `state.config.showRowsInTable` (Redux,
  persistido; se edita en Configuración → Teclado). Las claves y su sección
  están en `TABLE_ROW_SECTIONS` del slice `config`. Si una sección se queda
  sin filas visibles, su cabecera tampoco se muestra.
  Las kcal ingeridas (`total_intake_kcal`), las gastadas (`total_burnt_kcal`),
  el balance energético y los macros por kg **no se calculan en el cliente**:
  salen de la RPC `calculate_macros_for_date_range` (`useFetchMacrosForDateRange`
  en `services/tanstack/user/macros.ts`). Cualquier mutación que cambie comidas,
  ingredientes extra, kcal/HC de entrenamiento, carreras o mediciones debe llamar
  a `invalidateMacros(userId)`.
- **[hooks/columns.tsx](hooks/columns.tsx)** — define las columnas de
  `react-table`: una columna fija de etiqueta (`rowLabel`) y una por cada día
  de la semana. La celda de cada columna de día decide qué componente de
  celda renderizar según `rowInfo.getRowId()` (`ALL_IDS`).
- **[hooks/navigation.ts](hooks/navigation.ts)** — navegación por teclado
  (flechas para mover la selección, Enter para abrir el editor, Escape para
  cerrarlo). Las teclas son configurables vía Redux
  (`state.config.keyboardCommands.tableNavigation`).
- **[types/index.ts](types/index.ts)** — `RowInfo` (clase base de fila) y sus
  subclases (`MealRowInfo`, `TrainingHcRowInfo`) para filas generadas
  dinámicamente (una por comida configurada, una por hora de entrenamiento).
- **[@components/cells/](@components/cells)** — un componente de celda por
  tipo de dato (preset, comida, numérico, texto, solo-lectura).
- **[@components/inputs/](@components/inputs)** — los editores que se abren
  en modal (`@portal.tsx`) al pulsar/seleccionar una celda editable.
- **[styles.ts](styles.ts)** — clases Tailwind compartidas (fondos de
  cabecera, chips de celda, anillos de resaltado).

## Modelo de datos: `RowInfo`

Cada fila de la tabla es una instancia de `RowInfo` con:

- `id` — uno de los valores de `ALL_IDS`, identifica el *tipo* de fila.
- `isEditable` — `"numeric" | "text" | "meals" | "presets" | "action" | "document"` si la
  fila se puede editar o abrir, o `undefined` si es de solo lectura.
- `onAction` (opcional, `addAction()`) — en filas `"action"` que no abren
  editor: abrir la celda (click o Enter) ejecuta `onAction(date)` en vez de
  marcarla como `editingCell`. La fila de carreras lo usa para fijar el día y
  navegar a `APP_ROUTES.RACES`.
- `isFullWidth` — `true` para filas de cabecera de sección (ocupan todo el
  ancho, sin columnas de día).
- `map: Map<string, string | number>` — valor de la fila por fecha (clave
  `YYYY-MM-DD` vía `FromDate.save()`).
- `getCellId(date)` — id estable de celda, usado como `key` de React, para
  saber qué celda está en edición/resaltada, y como selector del DOM para el
  autoscroll (ver más abajo). Las subclases lo sobrescriben para incluir un
  discriminador extra (`mealId`, `trainingHour`) porque puede haber varias
  filas del mismo `id` base.

## Selección, edición y navegación por teclado

`index.tsx` mantiene dos estados:

- `selection: { row, col }` — índice de fila (dentro de `editableRows`, es
  decir, solo filas con `isEditable`) y de columna (índice de día, 0–6)
  resaltados actualmente.
- `editingCell: string | null` — `getCellId()` de la celda que tiene su editor
  modal abierto, o `null`.

`useKeyboardNavigation` escucha `keydown` a nivel de `window` y traduce las
teclas configuradas en cambios de `selection`/`editingCell`:

- Flechas → mueven `row`/`col` (con wrap-around circular).
- Tecla de selección (Enter por defecto) → abre el editor de la celda
  resaltada, solo si la fila es editable.
- Tecla de salida (Escape por defecto) → cierra el editor sin mover la
  selección.
- Copiar (`copyCell`, "c" por defecto) y pegar (`pasteCell`, "v" por defecto)
  → [hooks/clipboard.ts](hooks/clipboard.ts), sobre la celda resaltada y con el
  editor cerrado. No actúan con Ctrl/Cmd/Alt ni escribiendo en un campo. Cada
  fila copiable tiene un handler en `pasteHandlers` (por su id base): para
  añadir una fila basta con añadir el suyo. Solo se pega en una celda
  compatible según `RowInfo.isSameCell` (mismo id base; si no, aviso de error):
  comida en cualquier comida (`useCopyMeal`), día en día de la fila de presets
  (`useCloneDay`), kcal de entreno en kcal de entreno y cualquier hora de HC en
  cualquier hora de HC (`useSaveTraining`, con su ajuste automático), documento,
  y comentarios/eventos/enlace en su misma fila (`useMutatePlaning`). Comidas y días se copian como referencia:
  al pegar se copia lo que haya en ese momento en el origen. Una comida vacía
  no se copia. Lo copiado vive en estado y se pierde al recargar.
  [@components/clipboardBadge.tsx](@components/clipboardBadge.tsx) lo muestra
  pegado encima de la celda seleccionada (`absolute` dentro de un contenedor
  `relative` fuera del scroll; se recoloca con cada render, al hacer scroll
  horizontal y al redimensionar). Es `pointer-events-none` para no tapar
  clicks, se oculta con un editor abierto y se apaga (gris) si lo copiado no se
  puede pegar en la celda seleccionada (`canPasteInto`). Con el editor cerrado,
  la tecla `exitCell` (Escape) vacía el portapapeles. El texto sale de
  `RowInfo.getDisplayText(date)`: etiqueta de la fila y valor (en las comidas,
  el nombre del tipo, p. ej. CC1). Una fila cuyo valor no es legible le pasa un
  conversor con `addDisplayFormat` (la de documento convierte el id en el nombre).

Al hacer click directamente en una celda (`openEditor` de cada componente de
celda → `selectCell` en `index.tsx`), la selección salta a esa celda y se
abre su editor. `selectCell` busca la fila por **igualdad de contenido**
(`getCellId("")`), no por índice de array ni por referencia, porque `rows` se
reconstruye con instancias nuevas cada vez que las queries revalidan.

## Autoscroll vertical

Cuando `selection.row` cambia (navegación por teclado o click), un efecto en
`index.tsx` centra verticalmente la fila seleccionada en el viewport:

1. Cada `<tr>` no-cabecera lleva `data-row-key={row.original.getCellId("")}`.
2. Un `useMemo` deriva `selectedRowKey` a partir de `editableRows[selection.row]`.
3. Un `useEffect` que depende de `selectedRowKey` busca el `<tr>` por ese
   atributo y llama a `scrollIntoView({ block: "center", behavior: "smooth" })`.
4. El primer render se omite (`hasMountedRef`) para no provocar un salto de
   scroll al montar la tabla.

Como `selectedRowKey` es un string derivado del contenido (no de la
referencia del array), cambiar de columna o que `rows` se reconstruya tras un
refetch no dispara el scroll — solo un cambio real de fila lo hace.

## Renderizado de celdas

`hooks/columns.tsx` hace de switch por `rowInfo.getRowId()`:

| `ALL_IDS` | Componente | Editor |
| --- | --- | --- |
| `INPUT_PRESET` | `CellPresetDay` | `PresetSelectInput` |
| `INPUT_MEAL` | `CellMeal` | `MealSelectInput` |
| `INPUT_TRAINING_HC`, `INPUT_TRAINING_KCAL` | `CellNumeric` | `NumericInput` |
| `INPUT_RACES` | `CellRace` | — (`onAction`: navega a `APP_ROUTES.RACES`) |
| `INPUT_COMMENTS`, `INPUT_EVENTS` | `CellText` | `TextInput` |
| `INPUT_CUSTOM_URL` | `CellText` (solo `https://`) | `TextInput` con `validate` |
| resto (`DISPLAY_*`) | `CellDisplay` | — (solo lectura) |

Las columnas de día usan siempre el mismo `columnDef.cell`
([cells/dayCell.tsx](@components/cells/dayCell.tsx)) y el contenido sale de
`renderDayCell` por `DayCellContext` ([hooks/dayCellContext.ts](hooks/dayCellContext.ts)).
`FlexRender` hace `createElement(cell)`: si `cell` fuera una función nueva cada vez
que cambian los datos, React remontaría todas las celdas y los editores abiertos
perderían su estado (p.ej. el paso de receta a ingredientes).

Cada celda editable recibe `isEditing`/`isHighlighted` para su estilo y
`openEditor`/`closeEditor` para disparar el modal. El modal en sí vive en
`@components/inputs/@portal.tsx` y se renderiza en un portal; cada input usa
las mismas teclas de guardar/cerrar que la navegación de la tabla
(`saveData`/`exitCell`) para mantener el flujo 100% accesible por teclado.

## Layout

La primera columna es `sticky left-0` para mantener la etiqueta visible al
hacer scroll horizontal (`overflow-x-auto` en el contenedor). Las 7 columnas
de día se reparten el espacio restante a partes iguales (`w-[14.28%]`). Las
filas de cabecera de sección ocupan todo el ancho con `colSpan`.

## Fila de documento

La última fila (`INPUT_DOCUMENT`) adjunta al día uno de los documentos del
nutricionista. Su `map` guarda el `user_planing.document_id` de cada fecha y
[cells/documentCell.tsx](@components/cells/documentCell.tsx) busca el nombre en
`useFetchMyDocuments`. Al abrirla, [inputs/documentSelectInput.tsx](@components/inputs/documentSelectInput.tsx)
muestra un select con todos sus documentos (más "Limpiar", que lo quita) y hace
upsert de `document_id` con `useMutatePlaning`. La base de datos
(`tr_protect_user_planing_document`) solo deja adjuntar documentos propios a
clientes propios con suscripción activa.

## Ingredientes adicionales de una comida

Además del tipo de comida y su receta fija, a cada comida planificada se le
pueden añadir ingredientes sueltos con su cantidad
(`user_planing_meal_ingredients`, queries en `services/tanstack/data/ingredients.ts`).
La fila apunta a la comida por `(meal_id, user_id, date)`, así que la comida tiene
que estar guardada antes de añadirle ingredientes.

Los ingredientes se añaden después de elegir receta (o "Sin receta fija"):

- En [inputs/mealSelectInput.tsx](@components/inputs/mealSelectInput.tsx) se elige
  el tipo y "Elegir receta" abre el selector de recetas de ese tipo. Los tipos salen de la RPC
  `scored_search_recipe_types_for_client` (`useFetchRecipeTypes({ clientId })`), ordenados por las veces
  que se han puesto al cliente en el último mes y paginados al hacer scroll.
  Debajo de la lista hay un campo para comentar la receta (`recipe_comment`,
  máx. 200 caracteres). Empieza con el comentario guardado y se envía con cualquier
  guardado del editor (tipo, receta o "Hecho"); vacío lo borra. `useMutatePlaningMeals`
  solo lo envía si viene en la llamada, así los presets no lo pisan. La tecla de guardar
  dentro del comentario guarda el tipo actual, nunca la opción enfocada de la lista.
- En [inputs/recipeSelectInput.tsx](@components/inputs/recipeSelectInput.tsx) cada
  receta, y también "Sin receta fija", tiene "+ Ingredientes", que abre el editor de ingredientes **sin guardar
  nada**. Si es la misma elección que la guardada (la misma receta fija, o "Sin receta
  fija" con el mismo tipo), el borrador empieza con los ingredientes guardados; si no,
  vacío (el guardado borrará los antiguos).
  Un toggle encima de la lista cambia entre las recetas de la base de datos (`all_recipes`, RPC
  `get_top_recipes_for_type`, `useFetchTopRecipesForUser`, ordenadas por score) y las propias del
  nutricionista y del cliente de ese tipo (`custom_recipes`, RPC `get_custom_recipes_for_type`,
  `useFetchCustomRecipesForType`, paginadas por id). Solo se pide la lista visible. Se abre
  con el valor de `config.defaults.displayDefaultNutritionistRecipes` (configuración de la tabla).
  Una receta propia se guarda igual que en el tipo "receta propia" (ver más abajo): fija, sin
  `recipe_id`, con su comentario y sus alimentos como ingredientes. La RPC da la receta y su dueño,
  pero no los alimentos: salen de `useFetchClientAndMyCustomRecipes`.
- [inputs/ingredientsSelectInput.tsx](@components/inputs/ingredientsSelectInput.tsx)
  es un borrador local: añadir del catálogo `recipe_type_custom_ingredients` (con su
  cantidad de referencia), cambiar cantidades y quitar. "Volver" descarta el borrador
  y vuelve a las recetas. "Hecho" guarda, en este orden: la comida con su tipo y
  receta (`useMutatePlaningMeals`; con "Sin receta fija" va `recipe_id: null` y
  `is_fixed_recipe: false`, para que el cliente elija la receta) y después sus ingredientes
  (`useReplaceMealIngredients`, que borra los que había e inserta los del borrador).
  Después cierra el modal. Si algo falla, el editor sigue abierto. Los macros se escalan con `mealIngredientMacros`.
- Tipo "receta propia" (su id sale de la RPC `custom_recipe_type_id`, hook
  `useSelectCustomRecipeId`): "Elegir receta" abre
  [inputs/customRecipeSelectInput.tsx](@components/inputs/customRecipeSelectInput.tsx) en vez del
  selector del catálogo. Lista las recetas propias del cliente y del nutricionista
  (`custom_recipes`). Elegir una guarda la comida con ese tipo como receta fija
  (`is_fixed_recipe: true`) pero sin `recipe_id` (no están en `all_recipes`), con
  `recipe_comment` = "Nombre: descripción" (`customRecipeComment`; solo el nombre si no tiene
  descripción, y sustituye lo escrito en el campo de comentario), y copia los
  alimentos de la receta a sus ingredientes adicionales. "+ Ingredientes" abre el editor con esos
  alimentos para ajustarlos antes de guardar; en "Sin receta fija" empieza con los guardados.
- Si la comida cambia de receta, se queda sin receta fija o se borra, sus
  ingredientes adicionales se borran (`useMutatePlaningMeals` compara la elección
  guardada antes del upsert: la receta si es fija, el tipo si no, porque sin receta
  fija el `recipe_id` lo pone el trigger `recommend_recipe`; `useDeletePlaningMeal`
  los borra antes que la comida). Si ese borrado falla tras guardar la comida, se
  avisa con `addMutationError` pero la mutación no falla.
- [cells/mealCell.tsx](@components/cells/mealCell.tsx) muestra `+N` cuando la
  comida tiene ingredientes adicionales. Con hover (o con la celda seleccionada)
  muestra la receta fija, cada ingrediente con su cantidad y el comentario sobre la
  receta (`MealRowInfo.getRecipeComment`); lo mismo va en el `title` de la celda. Aún no se suman a las kcal de la celda
  ni a los totales del día.
- Copiar arrastrando: las celdas de comida y la cabecera de cada día
  ([cells/presetDay.tsx](@components/cells/presetDay.tsx)) van dentro de
  [cells/draggableCell.tsx](@components/cells/draggableCell.tsx) (dnd-kit, `kind: "meal" | "day"`).
  El `DndContext` está en [index.tsx](index.tsx), con un umbral de 6px para que el click siga
  abriendo el editor. Solo se suelta sobre una celda del mismo `kind`. Durante el arrastre, pulsar la tecla `markCell` (Configuración → Teclado, por defecto espacio) sobre
  otra celda del mismo `kind` la marca (otra vez, la desmarca) (anillo discontinuo, `hooks/markedCellsContext.ts`); al soltar
  se copia en las marcadas y en la de destino con una sola mutación: las RPC van en paralelo
  (`Promise.allSettled`) y se invalida una vez, al acabar todas, aunque alguna falle. Cancelar (Escape) no copia nada. Las copias son RPCs
  (una sola transacción: si algo falla no se guarda nada), en
  [hooks/copyMeal.ts](hooks/copyMeal.ts) y `services/tanstack/user/meals.ts`:
  - Comida sobre comida: `useCopyMeal` → `useCopyPlaningMeal` → `copy_planing_meal`. Copia tipo,
    receta, si es fija, comentario e ingredientes; lo que tuviera el destino se sustituye.
  - Día sobre día: `useCloneDay` → `useCloneDayMeals` → `clone_day_planing`. El día de destino
    queda con las mismas comidas e ingredientes que el origen. No copia `user_planing` (entreno,
    comentarios, eventos...).
