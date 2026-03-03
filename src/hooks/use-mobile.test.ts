// @ts-expect-error -- React 19 act environment flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIsMobile } from "./use-mobile";

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

describe("useIsMobile", () => {
    let listeners: Array<(e: MediaQueryListEvent) => void>;
    let matches: boolean;
    let container: HTMLDivElement;
    let root: ReturnType<typeof createRoot>;
    let lastValue: boolean | undefined;

    beforeEach(() => {
        listeners = [];
        matches = false;
        lastValue = undefined;

        vi.stubGlobal(
            "matchMedia",
            vi.fn().mockImplementation(() => ({
                get matches() {
                    return matches;
                },
                addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
                    listeners.push(cb);
                },
                removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
                    listeners = listeners.filter((l) => l !== cb);
                },
            })),
        );

        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        root.unmount();
        container.remove();
        vi.restoreAllMocks();
    });

    function TestComponent() {
        lastValue = useIsMobile();
        return null;
    }

    async function render() {
        await act(async () => {
            root.render(createElement(TestComponent));
        });
    }

    it("returns false on desktop-width viewport", async () => {
        matches = false;
        await render();
        expect(lastValue).toBe(false);
    });

    it("returns true on mobile-width viewport", async () => {
        matches = true;
        await render();
        expect(lastValue).toBe(true);
    });

    it("updates when media query changes", async () => {
        matches = false;
        await render();
        expect(lastValue).toBe(false);

        matches = true;
        await act(async () => {
            for (const listener of listeners) {
                listener({ matches: true } as MediaQueryListEvent);
            }
        });
        expect(lastValue).toBe(true);
    });

    it("queries max-width: 767px", async () => {
        await render();
        expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 767px)");
    });

    it("cleans up listener on unmount", async () => {
        await render();
        expect(listeners).toHaveLength(1);

        root.unmount();
        expect(listeners).toHaveLength(0);
    });
});
