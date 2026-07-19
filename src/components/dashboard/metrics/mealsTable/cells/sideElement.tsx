import { createPortal } from "react-dom";
import { useTableContext } from "../tableContext";

export const ColSideElement = () => {
  const { tableFragmentIndex, sideElement, cancelFocus } = useTableContext();
  const span = Math.max(
    tableFragmentIndex.mealRows.end - tableFragmentIndex.mealRows.start + 1,
    1,
  );

  const centeredSideElement =
    sideElement && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            data-table-editor-portal="true"
            onMouseDown={(e) => {
              if (e.target !== e.currentTarget) return;
              cancelFocus();
            }}
          >
            <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-4 shadow-2xl">
              {sideElement}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        className={`row-span-${span} border border-nutrition-green/30 bg-nutrition-green p-3 flex items-center justify-center text-white-green font-semibold hover:bg-dark-green transition-colors`}
      >
        <div className="text-sm font-medium"></div>
      </div>
      {centeredSideElement}
    </>
  );
};
