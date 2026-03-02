import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type BrowserFrameStyle = "none" | "macos" | "windows";
export type BackgroundType = "solid" | "gradient" | "transparent";

export interface EditorSettings {
    borderRadius: number;
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
    resetSettings: () => void;
    reset: () => void;
}

export const defaultSettings: EditorSettings = {
    borderRadius: 12,
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
            resetSettings: () => set({ ...defaultSettings }),
            reset: () => set({ image: null, fileName: null, ...defaultSettings }),
        }),
        {
            name: "shotkit-settings",
            storage: createJSONStorage(() => ({
                getItem: (name) => localStorage.getItem(name),
                setItem: debouncedSetItem,
                removeItem: (name) => localStorage.removeItem(name),
            })),
            partialize: ({ image, fileName, ...settings }) => settings,
        },
    ),
);
