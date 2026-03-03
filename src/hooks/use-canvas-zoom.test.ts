// @ts-expect-error -- React 19 act environment flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { type UseCanvasZoomReturn, useCanvasZoom } from "./use-canvas-zoom";

// Suppress happy-dom's spurious act() warnings (tests are correctly wrapped in act)
const originalError = console.error;
beforeEach(() => {
    console.error = (...args: unknown[]) => {
        if (typeof args[0] === "string" && args[0].includes("not wrapped in act")) return;
        originalError(...args);
    };
});
afterEach(() => {
    console.error = originalError;
});

describe("useCanvasZoom", () => {
    let container: HTMLDivElement;
    let target: HTMLDivElement;
    let scrollEl: HTMLDivElement;
    let root: ReturnType<typeof createRoot>;
    let result: UseCanvasZoomReturn | undefined;

    beforeEach(() => {
        container = document.createElement("div");
        target = document.createElement("div");
        scrollEl = document.createElement("div");
        document.body.appendChild(container);
        document.body.appendChild(target);
        document.body.appendChild(scrollEl);
        root = createRoot(container);
        result = undefined;
    });

    afterEach(() => {
        root.unmount();
        container.remove();
        target.remove();
        scrollEl.remove();
    });

    function TestComponent({
        elRef,
        scrollRef,
    }: {
        elRef: React.RefObject<HTMLDivElement>;
        scrollRef: React.RefObject<HTMLDivElement>;
    }) {
        result = useCanvasZoom(elRef, scrollRef);
        return null;
    }

    async function render() {
        const ref = { current: target };
        const sRef = { current: scrollEl };
        await act(async () => {
            root.render(createElement(TestComponent, { elRef: ref, scrollRef: sRef }));
        });
    }

    it("starts at 100% zoom", async () => {
        await render();
        expect(result?.zoom).toBe(100);
    });

    it("zoomIn increases by 10", async () => {
        await render();
        await act(async () => result?.zoomIn());
        expect(result?.zoom).toBe(110);
    });

    it("zoomOut decreases by 10", async () => {
        await render();
        await act(async () => result?.zoomOut());
        expect(result?.zoom).toBe(90);
    });

    it("clamps zoom to minimum 25", async () => {
        await render();
        await act(async () => result?.setZoom(10));
        expect(result?.zoom).toBe(25);
    });

    it("clamps zoom to maximum 300", async () => {
        await render();
        await act(async () => result?.setZoom(500));
        expect(result?.zoom).toBe(300);
    });

    it("resetZoom returns to 100", async () => {
        await render();
        await act(async () => result?.setZoom(200));
        expect(result?.zoom).toBe(200);
        await act(async () => result?.resetZoom());
        expect(result?.zoom).toBe(100);
    });

    it("setZoom rounds to nearest integer", async () => {
        await render();
        await act(async () => result?.setZoom(75.7));
        expect(result?.zoom).toBe(76);
    });

    // happy-dom's WheelEvent doesn't propagate ctrlKey from init, so we patch it
    function createWheelEvent(deltaY: number, ctrlKey: boolean) {
        const event = new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true });
        Object.defineProperty(event, "ctrlKey", { value: ctrlKey });
        return event;
    }

    it("Ctrl+wheel down zooms out by 5", async () => {
        await render();
        await act(async () => {
            target.dispatchEvent(createWheelEvent(100, true));
        });
        expect(result?.zoom).toBe(95);
    });

    it("Ctrl+wheel up zooms in by 5", async () => {
        await render();
        await act(async () => {
            target.dispatchEvent(createWheelEvent(-100, true));
        });
        expect(result?.zoom).toBe(105);
    });

    it("wheel without Ctrl does not zoom", async () => {
        await render();
        await act(async () => {
            target.dispatchEvent(createWheelEvent(100, false));
        });
        expect(result?.zoom).toBe(100);
    });

    it("zoomIn at boundary clamps to max", async () => {
        await render();
        await act(async () => result?.setZoom(295));
        await act(async () => result?.zoomIn());
        expect(result?.zoom).toBe(300);
    });
});
