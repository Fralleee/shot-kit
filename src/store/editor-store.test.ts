import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { defaultSettings, useEditorStore } from "./editor-store";

describe("editor-store", () => {
    beforeEach(() => {
        localStorage.clear();
        useEditorStore.setState({ image: null, fileName: null, ...defaultSettings });
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe("default state", () => {
        it("has no image loaded initially", () => {
            const { image, fileName } = useEditorStore.getState();
            expect(image).toBeNull();
            expect(fileName).toBeNull();
        });

        it("has correct default settings", () => {
            const state = useEditorStore.getState();
            expect(state.borderRadius).toBe(12);
            expect(state.shadowEnabled).toBe(true);
            expect(state.shadowBlur).toBe(40);
            expect(state.padding).toBe(64);
            expect(state.scale).toBe(1);
            expect(state.backgroundType).toBe("gradient");
            expect(state.browserFrame).toBe("none");
        });
    });

    describe("setImage", () => {
        it("sets image and fileName", () => {
            useEditorStore.getState().setImage("data:image/png;base64,abc", "test.png");
            const { image, fileName } = useEditorStore.getState();
            expect(image).toBe("data:image/png;base64,abc");
            expect(fileName).toBe("test.png");
        });

        it("defaults fileName to null", () => {
            useEditorStore.getState().setImage("data:image/png;base64,abc");
            expect(useEditorStore.getState().fileName).toBeNull();
        });

        it("clears image when set to null", () => {
            useEditorStore.getState().setImage("data:image/png;base64,abc", "test.png");
            useEditorStore.getState().setImage(null);
            const { image, fileName } = useEditorStore.getState();
            expect(image).toBeNull();
            expect(fileName).toBeNull();
        });
    });

    describe("individual setters", () => {
        it("setBorderRadius", () => {
            useEditorStore.getState().setBorderRadius(24);
            expect(useEditorStore.getState().borderRadius).toBe(24);
        });

        it("setShadowEnabled", () => {
            useEditorStore.getState().setShadowEnabled(false);
            expect(useEditorStore.getState().shadowEnabled).toBe(false);
        });

        it("setShadowBlur", () => {
            useEditorStore.getState().setShadowBlur(80);
            expect(useEditorStore.getState().shadowBlur).toBe(80);
        });

        it("setShadowSpread", () => {
            useEditorStore.getState().setShadowSpread(10);
            expect(useEditorStore.getState().shadowSpread).toBe(10);
        });

        it("setShadowOffsetX / setShadowOffsetY", () => {
            useEditorStore.getState().setShadowOffsetX(5);
            useEditorStore.getState().setShadowOffsetY(-10);
            expect(useEditorStore.getState().shadowOffsetX).toBe(5);
            expect(useEditorStore.getState().shadowOffsetY).toBe(-10);
        });

        it("setShadowColor / setShadowOpacity", () => {
            useEditorStore.getState().setShadowColor("#ff0000");
            useEditorStore.getState().setShadowOpacity(0.5);
            expect(useEditorStore.getState().shadowColor).toBe("#ff0000");
            expect(useEditorStore.getState().shadowOpacity).toBe(0.5);
        });

        it("setRotateX / setRotateY / setRotateZ", () => {
            useEditorStore.getState().setRotateX(15);
            useEditorStore.getState().setRotateY(-20);
            useEditorStore.getState().setRotateZ(45);
            expect(useEditorStore.getState().rotateX).toBe(15);
            expect(useEditorStore.getState().rotateY).toBe(-20);
            expect(useEditorStore.getState().rotateZ).toBe(45);
        });

        it("setPerspective", () => {
            useEditorStore.getState().setPerspective(500);
            expect(useEditorStore.getState().perspective).toBe(500);
        });

        it("setBrowserFrame", () => {
            useEditorStore.getState().setBrowserFrame("macos");
            expect(useEditorStore.getState().browserFrame).toBe("macos");
        });

        it("setBackgroundType / setBackgroundColor", () => {
            useEditorStore.getState().setBackgroundType("solid");
            useEditorStore.getState().setBackgroundColor("#00ff00");
            expect(useEditorStore.getState().backgroundType).toBe("solid");
            expect(useEditorStore.getState().backgroundColor).toBe("#00ff00");
        });

        it("setGradientFrom / setGradientTo / setGradientAngle", () => {
            useEditorStore.getState().setGradientFrom("#aaa");
            useEditorStore.getState().setGradientTo("#bbb");
            useEditorStore.getState().setGradientAngle(90);
            expect(useEditorStore.getState().gradientFrom).toBe("#aaa");
            expect(useEditorStore.getState().gradientTo).toBe("#bbb");
            expect(useEditorStore.getState().gradientAngle).toBe(90);
        });

        it("setPadding / setScale", () => {
            useEditorStore.getState().setPadding(100);
            useEditorStore.getState().setScale(1.5);
            expect(useEditorStore.getState().padding).toBe(100);
            expect(useEditorStore.getState().scale).toBe(1.5);
        });
    });

    describe("applySettings", () => {
        it("applies partial settings without affecting other state", () => {
            useEditorStore.getState().setImage("data:image/png;base64,abc", "test.png");
            useEditorStore.getState().applySettings({ padding: 100, borderRadius: 24 });
            const state = useEditorStore.getState();
            expect(state.padding).toBe(100);
            expect(state.borderRadius).toBe(24);
            expect(state.image).toBe("data:image/png;base64,abc");
            expect(state.shadowBlur).toBe(defaultSettings.shadowBlur);
        });
    });

    describe("resetSettings", () => {
        it("resets all settings to defaults", () => {
            useEditorStore.getState().setBorderRadius(99);
            useEditorStore.getState().setPadding(200);
            useEditorStore.getState().setShadowEnabled(false);
            useEditorStore.getState().resetSettings();
            const state = useEditorStore.getState();
            expect(state.borderRadius).toBe(defaultSettings.borderRadius);
            expect(state.padding).toBe(defaultSettings.padding);
            expect(state.shadowEnabled).toBe(defaultSettings.shadowEnabled);
        });

        it("preserves image when resetting settings", () => {
            useEditorStore.getState().setImage("data:image/png;base64,abc", "test.png");
            useEditorStore.getState().setBorderRadius(99);
            useEditorStore.getState().resetSettings();
            const state = useEditorStore.getState();
            expect(state.image).toBe("data:image/png;base64,abc");
            expect(state.fileName).toBe("test.png");
            expect(state.borderRadius).toBe(defaultSettings.borderRadius);
        });
    });

    describe("reset", () => {
        it("resets everything including image", () => {
            useEditorStore.getState().setImage("data:image/png;base64,abc", "test.png");
            useEditorStore.getState().setBorderRadius(99);
            useEditorStore.getState().reset();
            const state = useEditorStore.getState();
            expect(state.image).toBeNull();
            expect(state.fileName).toBeNull();
            expect(state.borderRadius).toBe(defaultSettings.borderRadius);
        });
    });
});
