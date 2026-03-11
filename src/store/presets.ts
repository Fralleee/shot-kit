import { CircleDotIcon, type LucideIcon, MonitorSmartphoneIcon, SquareIcon } from "lucide-react";
import type { EditorSettings } from "./editor-store";
import { defaultSettings } from "./editor-store";

interface Preset {
    name: string;
    icon: LucideIcon;
    settings: Partial<EditorSettings>;
}

export const presets: Preset[] = [
    {
        name: "Default",
        icon: CircleDotIcon,
        settings: defaultSettings,
    },
    {
        name: "Mockup",
        icon: MonitorSmartphoneIcon,
        settings: {
            ...defaultSettings,
            browserFrame: "macos",
            borderRadius: 12,
            borderWidth: 0,
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
        icon: SquareIcon,
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
            borderWidth: 1,
            borderColor: "#000000",
            borderOpacity: 0.1,
        },
    },
];
