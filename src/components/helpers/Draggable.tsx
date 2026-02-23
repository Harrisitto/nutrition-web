import { useRef, useState, useEffect } from "react";

export const Draggable = ({
    parentRef,
    onMove,
    initialPosition,
    ...props
}: {
    parentRef: React.RefObject<HTMLElement | null>;
    onMove?: (position: { x: number; y: number }) => void;
    initialPosition?: { x: number; y: number };
} & React.HTMLAttributes<HTMLDivElement>) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const movableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && movableRef.current && parentRef?.current) {
                const parentRect = parentRef.current.getBoundingClientRect();
                const divRect = movableRef.current.getBoundingClientRect();

                // Calculate from right and bottom edges
                let newX = parentRect.right - e.clientX - dragOffset.x;
                let newY = parentRect.bottom - e.clientY - dragOffset.y;

                // Constrain within parent bounds
                newX = Math.max(0, Math.min(newX, parentRect.width - divRect.width));
                newY = Math.max(0, Math.min(newY, parentRect.height - divRect.height));

                setPosition({ x: newX, y: newY });
                if (onMove) {
                    onMove({ x: newX, y: newY });
                }
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, dragOffset, parentRef]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (movableRef.current && parentRef?.current) {
            const divRect = movableRef.current.getBoundingClientRect();
            
            setDragOffset({
                x: divRect.right - e.clientX,
                y: divRect.bottom - e.clientY,
            });
            setIsDragging(true);
        }
    };

    return (
        <div
            ref={movableRef}
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                right: `${position.x}px`,
                bottom: `${position.y}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                ...props.style,
            }}
            {...props}
        />
    );
}