import { describe, expect, it } from "vitest";
import { defaultSettings } from "@/store/editor-store";
import { getBackground, getShadow, getTransform } from "./style-utils";

describe("getBackground", () => {
    it("returns 'transparent' for transparent type", () => {
        expect(getBackground({ ...defaultSettings, backgroundType: "transparent" })).toBe("transparent");
    });

    it("returns solid color for solid type", () => {
        expect(getBackground({ ...defaultSettings, backgroundType: "solid", backgroundColor: "#ff0000" })).toBe(
            "#ff0000",
        );
    });

    it("returns linear-gradient for gradient type", () => {
        const result = getBackground({
            ...defaultSettings,
            backgroundType: "gradient",
            gradientFrom: "#aaa",
            gradientTo: "#bbb",
            gradientAngle: 90,
        });
        expect(result).toBe("linear-gradient(90deg, #aaa, #bbb)");
    });

    it("uses default gradient values", () => {
        const result = getBackground(defaultSettings);
        expect(result).toBe(
            `linear-gradient(${defaultSettings.gradientAngle}deg, ${defaultSettings.gradientFrom}, ${defaultSettings.gradientTo})`,
        );
    });
});

describe("getShadow", () => {
    it("returns 'none' when shadow is disabled", () => {
        expect(getShadow({ ...defaultSettings, shadowEnabled: false })).toBe("none");
    });

    it("returns box-shadow string when enabled", () => {
        const result = getShadow({
            ...defaultSettings,
            shadowEnabled: true,
            shadowOffsetX: 5,
            shadowOffsetY: 10,
            shadowBlur: 20,
            shadowSpread: 3,
            shadowColor: "#000000",
            shadowOpacity: 1,
        });
        expect(result).toBe("5px 10px 20px 3px #000000ff");
    });

    it("converts opacity to hex correctly", () => {
        const result = getShadow({
            ...defaultSettings,
            shadowEnabled: true,
            shadowOpacity: 0.5,
            shadowColor: "#000000",
        });
        // 0.5 * 255 = 127.5, rounded = 128 = 0x80
        expect(result).toContain("#00000080");
    });

    it("handles zero opacity", () => {
        const result = getShadow({
            ...defaultSettings,
            shadowEnabled: true,
            shadowOpacity: 0,
            shadowColor: "#000000",
        });
        expect(result).toContain("#00000000");
    });

    it("handles negative offsets", () => {
        const result = getShadow({
            ...defaultSettings,
            shadowEnabled: true,
            shadowOffsetX: -10,
            shadowOffsetY: -5,
            shadowBlur: 0,
            shadowSpread: 0,
            shadowOpacity: 1,
            shadowColor: "#ff0000",
        });
        expect(result).toBe("-10px -5px 0px 0px #ff0000ff");
    });
});

describe("getTransform", () => {
    it("returns 'none' when all values are default (no rotation, scale 1)", () => {
        expect(getTransform(defaultSettings)).toBe("none");
    });

    it("includes perspective and rotateX when rotateX is set", () => {
        const result = getTransform({ ...defaultSettings, rotateX: 15 });
        expect(result).toBe("perspective(1000px) rotateX(15deg)");
    });

    it("includes perspective and rotateY when rotateY is set", () => {
        const result = getTransform({ ...defaultSettings, rotateY: -20 });
        expect(result).toBe("perspective(1000px) rotateY(-20deg)");
    });

    it("includes both rotateX and rotateY with single perspective", () => {
        const result = getTransform({ ...defaultSettings, rotateX: 10, rotateY: 20 });
        expect(result).toBe("perspective(1000px) rotateX(10deg) rotateY(20deg)");
    });

    it("includes rotateZ without perspective", () => {
        const result = getTransform({ ...defaultSettings, rotateZ: 45 });
        expect(result).toBe("rotateZ(45deg)");
    });

    it("includes scale when not 1", () => {
        const result = getTransform({ ...defaultSettings, scale: 0.5 });
        expect(result).toBe("scale(0.5)");
    });

    it("combines all transforms in correct order", () => {
        const result = getTransform({
            ...defaultSettings,
            rotateX: 10,
            rotateY: 20,
            rotateZ: 30,
            scale: 1.5,
            perspective: 800,
        });
        expect(result).toBe("perspective(800px) rotateX(10deg) rotateY(20deg) rotateZ(30deg) scale(1.5)");
    });

    it("uses custom perspective value", () => {
        const result = getTransform({ ...defaultSettings, rotateX: 5, perspective: 500 });
        expect(result).toBe("perspective(500px) rotateX(5deg)");
    });
});
