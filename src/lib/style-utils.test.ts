import { describe, expect, it } from "vitest";
import { defaultSettings } from "@/store/editor-store";
import { getBackground, getShadow, getTransform, getTransformOverflow } from "./style-utils";

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

describe("getTransformOverflow", () => {
    const noShadow = {
        shadowEnabled: false,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,
        shadowSpread: 0,
    };

    const base = {
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        perspective: 1000,
        scale: 1,
        ...noShadow,
    };

    const zero = { top: 0, right: 0, bottom: 0, left: 0 };

    it("returns zero overflow when no transforms and no shadow", () => {
        expect(getTransformOverflow(400, 300, base)).toEqual(zero);
    });

    it("returns positive overflow for scale > 1", () => {
        const result = getTransformOverflow(400, 300, { ...base, scale: 2 });
        expect(result.left).toBe(200);
        expect(result.right).toBe(200);
        expect(result.top).toBe(150);
        expect(result.bottom).toBe(150);
    });

    it("returns zero overflow for scale < 1", () => {
        expect(getTransformOverflow(400, 300, { ...base, scale: 0.5 })).toEqual(zero);
    });

    it("computes symmetric overflow for rotateZ on a square", () => {
        const result = getTransformOverflow(100, 100, { ...base, rotateZ: 45 });
        expect(result.top).toBeGreaterThan(0);
        expect(result.right).toBeGreaterThan(0);
        expect(result.top).toBe(result.right);
        expect(result.top).toBe(result.bottom);
        expect(result.top).toBe(result.left);
    });

    it("computes overflow for rotateZ on a rectangle", () => {
        const result = getTransformOverflow(400, 200, { ...base, rotateZ: 30 });
        expect(result.left).toBeGreaterThan(0);
        expect(result.top).toBeGreaterThan(0);
    });

    it("computes overflow for rotateY with perspective", () => {
        const result = getTransformOverflow(400, 300, { ...base, rotateY: 30, perspective: 1000 });
        // rotateY reduces X extent, so left/right are 0
        expect(result.left).toBe(0);
        expect(result.right).toBe(0);
        // Perspective magnifies Y symmetrically (same z-depth for matching Y corners)
        expect(result.top).toBeGreaterThan(0);
        expect(result.bottom).toBeGreaterThan(0);
    });

    it("computes overflow for rotateX with perspective", () => {
        const result = getTransformOverflow(400, 300, { ...base, rotateX: 30, perspective: 1000 });
        // Perspective magnifies X symmetrically
        expect(result.left).toBeGreaterThan(0);
        expect(result.right).toBeGreaterThan(0);
        // rotateX reduces Y extent, so top/bottom are 0
        expect(result.top).toBe(0);
        expect(result.bottom).toBe(0);
    });

    it("handles combined transforms", () => {
        const result = getTransformOverflow(400, 300, {
            ...base,
            rotateX: 15,
            rotateY: 20,
            rotateZ: 10,
            perspective: 800,
            scale: 1.2,
        });
        expect(result.left + result.right).toBeGreaterThan(0);
        expect(result.top + result.bottom).toBeGreaterThan(0);
    });

    it("returns ceiled integer values", () => {
        const result = getTransformOverflow(400, 300, { ...base, rotateZ: 5 });
        expect(Number.isInteger(result.top)).toBe(true);
        expect(Number.isInteger(result.right)).toBe(true);
        expect(Number.isInteger(result.bottom)).toBe(true);
        expect(Number.isInteger(result.left)).toBe(true);
    });

    it("handles zero-dimension inputs", () => {
        expect(getTransformOverflow(0, 0, { ...base, rotateZ: 45 })).toEqual(zero);
    });

    it("accounts for shadow offset direction without transforms", () => {
        const result = getTransformOverflow(400, 300, {
            ...base,
            shadowEnabled: true,
            shadowOffsetX: 0,
            shadowOffsetY: 20,
            shadowBlur: 40,
            shadowSpread: 0,
        });
        // Shadow extends blur(40) in all directions + offset(20) downward
        // Top: blur only = 20, Bottom: offset + blur = 60
        expect(result.top).toBe(20);
        expect(result.bottom).toBe(60);
        expect(result.left).toBe(40);
        expect(result.right).toBe(40);
    });

    it("accounts for shadow with transforms", () => {
        const withoutShadow = getTransformOverflow(400, 300, { ...base, rotateZ: 30 });
        const withShadow = getTransformOverflow(400, 300, {
            ...base,
            rotateZ: 30,
            shadowEnabled: true,
            shadowOffsetX: 0,
            shadowOffsetY: 20,
            shadowBlur: 40,
            shadowSpread: 0,
        });
        const totalXWithout = withoutShadow.left + withoutShadow.right;
        const totalXWith = withShadow.left + withShadow.right;
        const totalYWithout = withoutShadow.top + withoutShadow.bottom;
        const totalYWith = withShadow.top + withShadow.bottom;
        expect(totalXWith).toBeGreaterThan(totalXWithout);
        expect(totalYWith).toBeGreaterThan(totalYWithout);
    });

    it("returns zero shadow overflow when shadow is disabled", () => {
        const result = getTransformOverflow(400, 300, {
            ...base,
            shadowEnabled: false,
            shadowBlur: 40,
            shadowOffsetY: 20,
            shadowSpread: 5,
        });
        expect(result).toEqual(zero);
    });

    it("accounts for shadow spread", () => {
        const withoutSpread = getTransformOverflow(400, 300, {
            ...base,
            shadowEnabled: true,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 20,
            shadowSpread: 0,
        });
        const withSpread = getTransformOverflow(400, 300, {
            ...base,
            shadowEnabled: true,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 20,
            shadowSpread: 10,
        });
        expect(withSpread.left).toBe(withoutSpread.left + 10);
        expect(withSpread.top).toBe(withoutSpread.top + 10);
    });
});
