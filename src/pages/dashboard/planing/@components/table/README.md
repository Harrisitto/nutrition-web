# WeeklyMeals table

Tabla semanal (7 columnas de día + 1 columna de etiqueta) que muestra y edita
la planificación nutricional del usuario: presets del día, comidas, horas de
entrenamiento, kcal de entrenamiento, balance energético, macros por kg y
comentarios/eventos. Se monta desde [index.tsx](index.tsx) como
`WeeklyMeals`.

## Piezas principales

- **[index.tsx](index.tsx)** — componente raíz. Junta filas + columnas en una
  instancia de `@tanstack/react-table`, guarda el estado de selección/edición
  y renderiza el `<table>`.
- **[hooks/rows.ts](hooks/rows.ts)** — construye el array de `RowInfo` (una
  entrada por fila) a partir de varias queries de TanStack Query (planning,
  meals, meals del usuario, BMR, peso). Cada bloque de datos (comidas,
  entrenamiento, balance energético, macros, comentarios/eventos) se calcula
  en su propio `useMemo` y luego se concatenan, intercalando filas de
  cabecera (`isFullWidth: true`) entre secciones.
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
- `isEditable` — `"numeric" | "text" | "meals" | "presets"` si la fila se
  puede editar, o `undefined` si es de solo lectura.
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
| `INPUT_COMMENTS`, `INPUT_EVENTS` | `CellText` | `TextInput` |
| resto (`DISPLAY_*`) | `CellDisplay` | — (solo lectura) |

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
