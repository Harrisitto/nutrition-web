Esta sección permite personalizar los atajos de teclado que se usan para navegar y editar las tablas de la aplicación (navegación entre celdas, opciones de búsqueda/selección y el editor de comentarios).

Cada atajo se puede reasignar pulsando una nueva tecla sobre el campo correspondiente; los cambios se guardan en el estado global de configuración de la aplicación.

Debajo de los atajos hay tres formularios para la tabla de planificación:

- **Comidas** (`displaymealsForm.tsx`): visibilidad y orden de cada tipo de comida (`showMealsInTable`).
- **Filas** (`displayRowsForm.tsx`): visibilidad de cada fila fija, agrupadas por sección (`showRowsInTable` / `TABLE_ROW_SECTIONS`). Si se ocultan todas las filas de una sección, la tabla oculta también su título.
- **Valores por defecto** (`defaultsForm.tsx`): con qué valor se abren los selectores de la tabla (`config.defaults`). `displayDefaultNutritionistRecipes`: el selector de recetas se abre con las recetas propias del nutricionista y del cliente en vez de las de la base de datos.
