import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { deleteButtonStyle } from "@src/components/styles";
import { emptyTextStyle, listItemStyle } from "./formStyles";

/**
 * Elementos colocados en un km (tomas, puntos de interés), ordenados por km.
 * Se conserva el índice del borrador para borrar el elemento correcto y
 * mostrar su error de validación.
 */
export const KmItemList = <T extends { km: number }>({
  items,
  emptyText,
  removeLabel,
  onRemove,
  errorOf,
  renderItem,
}: {
  items: T[];
  emptyText: string;
  removeLabel: string;
  onRemove: (index: number) => void;
  errorOf: (index: number) => string | undefined;
  renderItem: (item: T) => ReactNode;
}) => {
  const sorted = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.km - b.item.km);

  if (!sorted.length) {
    return <p className={emptyTextStyle}>{emptyText}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map(({ item, index }) => {
        const error = errorOf(index);
        return (
          <li key={index} className={`${listItemStyle(!!error)} text-sm`}>
            <div className="flex items-center gap-3">
              <span className="w-20 shrink-0 font-semibold text-dark-green">
                km {item.km}
              </span>
              {renderItem(item)}
              <button
                type="button"
                title={removeLabel}
                aria-label={removeLabel}
                onClick={() => onRemove(index)}
                className={deleteButtonStyle}
              >
                <Trash2 size={16} />
              </button>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </li>
        );
      })}
    </ul>
  );
};
