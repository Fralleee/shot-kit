import type { EditorSettings } from "./editor-store";
import { defaultSettings } from "./editor-store";

interface Preset {
    name: string;
    settings: Partial<EditorSettings>;
}

export const presets: Preset[] = [
    {
        name: "Default",
        settings: defaultSettings,
    },
    {
        name: "Mockup",
        settings: {
            ...defaultSettings,
            browserFrame: "macos",
            borderRadius: 12,
            shadowBlur: 24,
            rotateX: 4,
            rotateY: -4,
            backgroundType: "transparent",
            shadowOffsetY: 12,
            shadowOpacity: 0.3,
            padding: 0,
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
