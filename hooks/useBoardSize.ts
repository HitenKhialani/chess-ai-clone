import * as React from "react";

// Computes a responsive board width that fits its container.
// It adapts gracefully under browser zoom (50%, 75%, 80%, 100%).
export function useBoardSize(maxPx: number = 480, minPx: number = 240) {
  const [width, setWidth] = React.useState<number>(Math.min(360, maxPx));
  const [el, setEl] = React.useState<HTMLDivElement | null>(null);

  // Callback ref ensures we capture the element as soon as it's mounted
  const containerRef = React.useCallback((node: HTMLDivElement | null) => {
    setEl(node);
  }, []);

  // Helper to clamp and set width
  const update = React.useCallback(
    (w: number) => setWidth(Math.max(minPx, Math.min(maxPx, Math.floor(w))))
  , [maxPx, minPx]);

  React.useEffect(() => {
    if (!el) return;

    // Initialize immediately on mount
    update(el.clientWidth);

    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        update(entry.contentRect.width);
      }
    });
    ro.observe(el);

    return () => ro.disconnect();
  }, [el, update]);

  return { containerRef, width } as const;
}
