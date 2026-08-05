# Módulo de Calendario y Gestión de Semanas

Módulo encargado de renderizar la cuadrícula del calendario mensual, la selección de semanas y el clonado mediante arrastrar y soltar (Drag and Drop).

## 🏗️ Arquitectura de Componentes

1. **`CalendarView.tsx`**: Componente principal. Define el contenedor `<DndContext/>`, intercepta el evento al soltar una semana (`onDragEnd`) y renderiza la insignia flotante `<DragOverlay/>`.
2. **`DraggableWeekRow.tsx`**: Contenedor con hooks de `@dnd-kit/core` (`useDraggable` y `useDroppable`). Inyecta los eventos de física y el icono de agarre (`GripVertical`).
3. **`WeekRowVisual.tsx`**: Fila pura de la semana. Gestiona la consulta a TanStack Query (`useFetchPlanning`) y mapea los datos a la celda en $O(1)$ mediante un `Map`.
4. **`DayCell.tsx`**: Componente atómico memorizado (`React.memo`) que pinta cada día, los indicadores de eventos y la selección.

## ⚡ Decisiones Técnicas y Optimización

- **Selección Instantánea de Semana:** Para evitar que la franja verde parpadee o no se pinte al montar, se comparan cadenas `YYYY-MM-DD` (`Set<string>`) mediante el helper `saveDate()` en lugar de instancias de `Date` nativas.
- **Búsqueda $O(1)$:** Los datos de la consulta (`planningQuery.data`) se procesan en un `Map` para evitar llamar a `.find()` $42$ veces por render.
- **Separación de Agarre:** Los listeners de arrastre solo existen en el icono del tirador para no interferir con el clic habitual de selección del día.

## 🚀 Uso del Componente Principal

```tsx
import { CalendarView } from './CalendarView';

<CalendarView onCloneWeek="{(sourceWeek," viewMonth="{currentMonth}" weeksGrid="{weeksGridArray}"> {
    // Disparar mutación o API para clonar
  }}
/>
```
