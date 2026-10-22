import { useLayoutEffect, useState, type RefObject } from "react";

const findScrollParent = (el: HTMLElement) => {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const { overflowY } = getComputedStyle(p);
    if (overflowY === "auto" || overflowY === "scroll") return p;
  }
  return document.documentElement;
};

/**
 * Height that makes the element end exactly at the bottom of its scroll container,
 * so the container has nothing to scroll and only inner lists overflow.
 * Counts the bottom padding/border/margin of every ancestor in between (page paddings).
 */
export const useFitToScrollParent = (ref: RefObject<HTMLElement | null>) => {
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = findScrollParent(el);

    const measure = () => {
      const top = el.getBoundingClientRect().top - parent.getBoundingClientRect().top + parent.scrollTop;
      let bottomSpace = 0;
      for (let p = el.parentElement; p && p !== parent; p = p.parentElement) {
        const s = getComputedStyle(p);
        bottomSpace += parseFloat(s.paddingBottom) + parseFloat(s.borderBottomWidth) + parseFloat(s.marginBottom);
      }
      setHeight(Math.max(0, parent.clientHeight - top - bottomSpace));
    };

    measure();
    // Container resizes on window resize and when the sidebar opens (header text may rewrap)
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [ref]);

  return height;
};
