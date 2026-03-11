import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type BrowserFrameStyle = "none" | "macos" | "windows";
export type BackgroundType = "solid" | "gradient" | "transparent";

export interface EditorSettings {
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
    borderOpacity: number;
    shadowEnabled: boolean;
    shadowBlur: number;
    shadowSpread: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowColor: string;
    shadowOpacity: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    perspective: number;
    browserFrame: BrowserFrameStyle;
    browserFrameUrl: string;
    backgroundType: BackgroundType;
    backgroundColor: string;
    gradientFrom: string;
    gradientTo: string;
    gradientAngle: number;
    padding: number;
    scale: number;
}

interface EditorState extends EditorSettings {
    image: string | null;
    fileName: string | null;

    setImage: (image: string | null, fileName?: string | null) => void;
    setBorderRadius: (radius: number) => void;
    setBorderWidth: (width: number) => void;
    setBorderColor: (color: string) => void;
    setBorderOpacity: (opacity: number) => void;
    setShadowEnabled: (enabled: boolean) => void;
    setShadowBlur: (blur: number) => void;
    setShadowSpread: (spread: number) => void;
    setShadowOffsetX: (x: number) => void;
    setShadowOffsetY: (y: number) => void;
    setShadowColor: (color: string) => void;
    setShadowOpacity: (opacity: number) => void;
    setRotateX: (x: number) => void;
    setRotateY: (y: number) => void;
    setRotateZ: (z: number) => void;
    setPerspective: (p: number) => void;
    setBrowserFrame: (frame: BrowserFrameStyle) => void;
    setBrowserFrameUrl: (url: string) => void;
    setBackgroundType: (type: BackgroundType) => void;
    setBackgroundColor: (color: string) => void;
    setGradientFrom: (color: string) => void;
    setGradientTo: (color: string) => void;
    setGradientAngle: (angle: number) => void;
    setPadding: (padding: number) => void;
    setScale: (scale: number) => void;
    applySettings: (settings: Partial<EditorSettings>) => void;
    randomizeSettings: () => void;
    resetSettings: () => void;
    reset: () => void;
}

export const defaultSettings: EditorSettings = {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffffff",
    borderOpacity: 0.2,
    shadowEnabled: true,
    shadowBlur: 40,
    shadowSpread: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    perspective: 1000,
    browserFrame: "none",
    browserFrameUrl: "localhost:3000",
    backgroundType: "gradient",
    backgroundColor: "#6366f1",
    gradientFrom: "#6366f1",
    gradientTo: "#ec4899",
    gradientAngle: 135,
    padding: 64,
    scale: 1,
};

const debouncedSetItem = (() => {
    let timer: ReturnType<typeof setTimeout>;
    return (name: string, value: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => localStorage.setItem(name, value), 500);
    };
})();

export const useEditorStore = create<EditorState>()(
    persist(
        (set) => ({
            image: null,
            fileName: null,
            ...defaultSettings,

            setImage: (image, fileName = null) => set({ image, fileName }),
            setBorderRadius: (borderRadius) => set({ borderRadius }),
            setBorderWidth: (borderWidth) => set({ borderWidth }),
            setBorderColor: (borderColor) => set({ borderColor }),
            setBorderOpacity: (borderOpacity) => set({ borderOpacity }),
            setShadowEnabled: (shadowEnabled) => set({ shadowEnabled }),
            setShadowBlur: (shadowBlur) => set({ shadowBlur }),
            setShadowSpread: (shadowSpread) => set({ shadowSpread }),
            setShadowOffsetX: (shadowOffsetX) => set({ shadowOffsetX }),
            setShadowOffsetY: (shadowOffsetY) => set({ shadowOffsetY }),
            setShadowColor: (shadowColor) => set({ shadowColor }),
            setShadowOpacity: (shadowOpacity) => set({ shadowOpacity }),
            setRotateX: (rotateX) => set({ rotateX }),
            setRotateY: (rotateY) => set({ rotateY }),
            setRotateZ: (rotateZ) => set({ rotateZ }),
            setPerspective: (perspective) => set({ perspective }),
            setBrowserFrame: (browserFrame) => set({ browserFrame }),
            setBrowserFrameUrl: (browserFrameUrl) => set({ browserFrameUrl }),
            setBackgroundType: (backgroundType) => set({ backgroundType }),
            setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
            setGradientFrom: (gradientFrom) => set({ gradientFrom }),
            setGradientTo: (gradientTo) => set({ gradientTo }),
            setGradientAngle: (gradientAngle) => set({ gradientAngle }),
            setPadding: (padding) => set({ padding }),
            setScale: (scale) => set({ scale }),
            applySettings: (settings) => set(settings),
            randomizeSettings: () => {
                const rand = (min: number, max: number) => Math.random() * (max - min) + min;
                const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));
                const randColor = () =>
                    `#${Math.floor(Math.random() * 0xffffff)
                        .toString(16)
                        .padStart(6, "0")}`;
                const pick = <T>(items: T[]) => items[randInt(0, items.length - 1)];

                const useTilt = Math.random() < 0.7;
                const useRotate = Math.random() < 0.15;
                const useShadow = Math.random() < 0.8;
                const useBorder = Math.random() < 0.3;
                const bgType = pick<BackgroundType>(["gradient", "gradient", "solid"]);

                set({
                    borderRadius: randInt(0, 24),
                    borderWidth: useBorder ? pick([1, 1, 2, 2, 3]) : 0,
                    borderColor: useBorder ? pick(["#ffffff", "#ffffff", "#000000"]) : defaultSettings.borderColor,
                    borderOpacity: useBorder ? Math.round(rand(0.1, 0.4) * 100) / 100 : defaultSettings.borderOpacity,
                    shadowEnabled: useShadow,
                    shadowBlur: useShadow ? randInt(10, 60) : defaultSettings.shadowBlur,
                    shadowSpread: useShadow ? randInt(-5, 10) : defaultSettings.shadowSpread,
                    shadowOffsetX: useShadow ? randInt(-10, 10) : defaultSettings.shadowOffsetX,
                    shadowOffsetY: useShadow ? randInt(5, 30) : defaultSettings.shadowOffsetY,
                    shadowColor: "#000000",
                    shadowOpacity: useShadow ? Math.round(rand(0.15, 0.5) * 100) / 100 : defaultSettings.shadowOpacity,
                    rotateX: useTilt ? randInt(-10, 10) : 0,
                    rotateY: useTilt ? randInt(-10, 10) : 0,
                    rotateZ: useRotate ? pick([-2, -1, 0, 1, 2]) : 0,
                    perspective: randInt(600, 1400),
                    backgroundType: bgType,
                    backgroundColor: bgType === "solid" ? randColor() : defaultSettings.backgroundColor,
                    gradientFrom: bgType === "gradient" ? randColor() : defaultSettings.gradientFrom,
                    gradientTo: bgType === "gradient" ? randColor() : defaultSettings.gradientTo,
                    gradientAngle: bgType === "gradient" ? randInt(0, 359) : defaultSettings.gradientAngle,
                    padding: randInt(12, 64),
                    scale: 1,
                });
            },
            resetSettings: () => set({ ...defaultSettings }),
            reset: () => set({ image: null, fileName: null, ...defaultSettings }),
        }),
        {
            name: "shotkit-settings:v1",
            storage: createJSONStorage(() => ({
                getItem: (name) => localStorage.getItem(name),
                setItem: debouncedSetItem,
                removeItem: (name) => localStorage.removeItem(name),
            })),
            partialize: ({ image, fileName, ...settings }) => settings,
        },
    ),
);
