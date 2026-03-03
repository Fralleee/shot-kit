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

export interface UseCanvasZoomReturn {
    zoom: number;
    setZoom: (value: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
}

export function useCanvasZoom(containerRef: React.RefObject<HTMLElement | null>): UseCanvasZoomReturn {
    const [zoom, setZoomState] = useState(100);

    // Mirror zoom in a ref so imperative touch handlers never see stale values
    const zoomRef = useRef(zoom);
    zoomRef.current = zoom;

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

    // Ctrl/Cmd + scroll wheel → zoom
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            if (!e.ctrlKey && !e.metaKey) return;
            e.preventDefault();
            const direction = e.deltaY > 0 ? -WHEEL_STEP : WHEEL_STEP;
            setZoomState((prev) => clampZoom(prev + direction));
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [containerRef]);

    // Pinch-to-zoom on touch devices
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
    }, [containerRef]);

    return { zoom, setZoom, zoomIn, zoomOut, resetZoom };
}
