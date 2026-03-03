import { useCallback, useEffect, useRef, useState } from "react";

export const MIN_ZOOM = 25;
export const MAX_ZOOM = 300;
const WHEEL_STEP = 5;
const BUTTON_STEP = 10;

function clampZoom(value: number): number {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value)));
}

function fingerDistance(a: Touch, b: Touch): number {
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

interface ScrollTarget {
    scrollX: number;
    scrollY: number;
    cursorX: number;
    cursorY: number;
    prevZoom: number;
}

export interface UseCanvasZoomReturn {
    zoom: number;
    setZoom: (value: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
}

export function useCanvasZoom(
    containerRef: React.RefObject<HTMLElement | null>,
    scrollRef: React.RefObject<HTMLElement | null>,
): UseCanvasZoomReturn {
    const [zoom, setZoomState] = useState(100);

    // Mirror zoom in a ref so imperative touch handlers never see stale values
    const zoomRef = useRef(zoom);
    zoomRef.current = zoom;

    // Stores the point to keep stationary after a zoom change
    const scrollTargetRef = useRef<ScrollTarget | null>(null);

    const setZoom = useCallback((value: number) => {
        setZoomState(clampZoom(value));
    }, []);

    const zoomIn = useCallback(() => {
        setZoomState((prev) => clampZoom(prev + BUTTON_STEP));
    }, []);

    const zoomOut = useCallback(() => {
        setZoomState((prev) => clampZoom(prev - BUTTON_STEP));
    }, []);

    const resetZoom = useCallback(() => {
        setZoomState(100);
    }, []);

    // After React commits the new zoom to the DOM, adjust scroll to keep
    // the target point (cursor or pinch midpoint) stationary on screen.
    useEffect(() => {
        const target = scrollTargetRef.current;
        const scrollEl = scrollRef.current;
        if (!target || !scrollEl) return;

        const scale = zoom / target.prevZoom;
        scrollEl.scrollLeft = target.scrollX * scale - target.cursorX;
        scrollEl.scrollTop = target.scrollY * scale - target.cursorY;
        scrollTargetRef.current = null;
    }, [zoom, scrollRef]);

    // Ctrl/Cmd + scroll wheel → zoom toward cursor
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            if (!e.ctrlKey && !e.metaKey) return;
            e.preventDefault();

            const scrollEl = scrollRef.current;
            if (scrollEl) {
                const rect = scrollEl.getBoundingClientRect();
                const cursorX = e.clientX - rect.left;
                const cursorY = e.clientY - rect.top;
                scrollTargetRef.current = {
                    scrollX: scrollEl.scrollLeft + cursorX,
                    scrollY: scrollEl.scrollTop + cursorY,
                    cursorX,
                    cursorY,
                    prevZoom: zoomRef.current,
                };
            }

            const direction = e.deltaY > 0 ? -WHEEL_STEP : WHEEL_STEP;
            setZoomState((prev) => clampZoom(prev + direction));
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [containerRef, scrollRef]);

    // Pinch-to-zoom toward pinch midpoint
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let initialDistance = 0;
        let initialZoom = 100;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                initialDistance = fingerDistance(e.touches[0], e.touches[1]);
                initialZoom = zoomRef.current;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length !== 2 || initialDistance === 0) return;
            e.preventDefault();

            const scrollEl = scrollRef.current;
            if (scrollEl) {
                const rect = scrollEl.getBoundingClientRect();
                const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                const cursorX = midX - rect.left;
                const cursorY = midY - rect.top;
                scrollTargetRef.current = {
                    scrollX: scrollEl.scrollLeft + cursorX,
                    scrollY: scrollEl.scrollTop + cursorY,
                    cursorX,
                    cursorY,
                    prevZoom: zoomRef.current,
                };
            }

            const current = fingerDistance(e.touches[0], e.touches[1]);
            const ratio = current / initialDistance;
            setZoomState(clampZoom(initialZoom * ratio));
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (e.touches.length < 2) {
                initialDistance = 0;
            }
        };

        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchmove", handleTouchMove, { passive: false });
        el.addEventListener("touchend", handleTouchEnd, { passive: true });
        return () => {
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchmove", handleTouchMove);
            el.removeEventListener("touchend", handleTouchEnd);
        };
    }, [containerRef, scrollRef]);

    return { zoom, setZoom, zoomIn, zoomOut, resetZoom };
}
