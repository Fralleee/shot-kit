import type { EditorSettings } from "./editor-store";
import { defaultSettings } from "./editor-store";

interface Preset {
    name: string;
    settings: Partial<EditorSettings>;
}

export const presets: Preset[] = [
    {
        name: "Clean",
        settings: {
            ...defaultSettings,
            shadowEnabled: false,
            backgroundType: "solid",
            backgroundColor: "#ffffff",
            padding: 48,
            borderRadius: 8,
        },
    },
    {
        name: "macOS",
        settings: {
            ...defaultSettings,
            browserFrame: "macos",
            borderRadius: 12,
            shadowBlur: 60,
            shadowOffsetY: 30,
            shadowOpacity: 0.35,
            padding: 80,
        },
    },
    {
        name: "Presentation",
        settings: {
            ...defaultSettings,
            padding: 100,
            borderRadius: 16,
            shadowBlur: 50,
            shadowOffsetY: 25,
            shadowOpacity: 0.25,
            gradientFrom: "#1e1b4b",
            gradientTo: "#312e81",
            gradientAngle: 160,
        },
    },
    {
        name: "Social",
        settings: {
            ...defaultSettings,
            padding: 80,
            borderRadius: 20,
            shadowBlur: 40,
            shadowOpacity: 0.2,
            gradientFrom: "#f97316",
            gradientTo: "#ec4899",
            gradientAngle: 135,
        },
    },
    {
        name: "Minimal",
        settings: {
            ...defaultSettings,
            backgroundType: "transparent",
            shadowEnabled: true,
            shadowBlur: 20,
            shadowSpread: 0,
            shadowOffsetY: 10,
            shadowOpacity: 0.15,
            padding: 32,
            borderRadius: 8,
        },
    },
];
