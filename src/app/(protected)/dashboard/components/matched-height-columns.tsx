"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const LG_MIN = "(min-width: 1024px)";

type MatchedHeightColumnsProps = {
  left: ReactNode;
  right: ReactNode;
};

/**
 * Two columns on lg+: row height follows the left column; the right column is
 * capped to that height so long content scrolls inside instead of stretching the row.
 */
export function MatchedHeightColumns({
  left,
  right,
}: MatchedHeightColumnsProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const [rightMaxPx, setRightMaxPx] = useState<number | undefined>(undefined);

  const sync = useCallback(() => {
    const el = leftRef.current;
    if (!el) return;
    const wide = window.matchMedia(LG_MIN).matches;
    if (!wide) {
      setRightMaxPx(undefined);
      return;
    }
    setRightMaxPx(Math.round(el.getBoundingClientRect().height));
  }, []);

  useLayoutEffect(() => {
    sync();
  }, [sync]);

  useEffect(() => {
    const el = leftRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => sync());
    ro.observe(el);

    const mq = window.matchMedia(LG_MIN);
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);

    return () => {
      ro.disconnect();
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div ref={leftRef} className="min-h-0 min-w-0 self-start">
        {left}
      </div>
      <div
        className="flex min-h-0 min-w-0 flex-col overflow-hidden self-start"
        style={rightMaxPx != null ? { height: rightMaxPx } : undefined}
      >
        {right}
      </div>
    </div>
  );
}
