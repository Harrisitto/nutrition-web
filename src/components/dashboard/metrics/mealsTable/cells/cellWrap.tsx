import { useEffect, useRef } from "react";
import { useTableContext } from "../tableContext";

export const CellWrapper = ({
  children,
  SideElement = null,
  sideElementKey = null,
  posX,
  posY,
  ...props
}: {
  children: (props: { isSelected: boolean }) => React.ReactNode;
  SideElement?: React.ReactNode;
  sideElementKey?: string | number | null;
  posX: number;
  posY: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { selectedCell, addCell } = useTableContext();
  const isSelected = selectedCell.x === posX && selectedCell.y === posY;

  useEffect(() => {
    if (!ref.current) return;
    addCell(ref.current, posX, posY, SideElement);
  }, [addCell, posX, posY, sideElementKey]);

  return (
    <div ref={ref} {...props}>
      {children({ isSelected })}
    </div>
  );
};
