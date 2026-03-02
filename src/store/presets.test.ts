import { describe, expect, it } from "vitest";
import { defaultSettings } from "./editor-store";
import { presets } from "./presets";

describe("presets", () => {
    it("has at least 3 presets", () => {
        expect(presets.length).toBeGreaterThanOrEqual(3);
    });

    it("each preset has a name and settings", () => {
        for (const preset of presets) {
            expect(preset.name).toBeTruthy();
            expect(typeof preset.name).toBe("string");
            expect(preset.settings).toBeDefined();
            expect(typeof preset.settings).toBe("object");
        }
    });

    it("each preset has unique name", () => {
        const names = presets.map((p) => p.name);
        expect(new Set(names).size).toBe(names.length);
    });

    it("preset settings only contain valid EditorSettings keys", () => {
        const validKeys = new Set(Object.keys(defaultSettings));
        for (const preset of presets) {
            for (const key of Object.keys(preset.settings)) {
                expect(validKeys.has(key), `Invalid key "${key}" in preset "${preset.name}"`).toBe(true);
            }
        }
    });

    it("Default preset matches defaultSettings", () => {
        const def = presets.find((p) => p.name === "Default");
        expect(def).toBeDefined();
        expect(def?.settings).toEqual(defaultSettings);
    });

    it("Mockup preset uses macos browser frame", () => {
        const mockup = presets.find((p) => p.name === "Mockup");
        expect(mockup).toBeDefined();
        expect(mockup?.settings.browserFrame).toBe("macos");
    });

    it("Minimal preset uses transparent background", () => {
        const minimal = presets.find((p) => p.name === "Minimal");
        expect(minimal).toBeDefined();
        expect(minimal?.settings.backgroundType).toBe("transparent");
    });
});
