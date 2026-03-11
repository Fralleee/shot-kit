import type { Hotkey } from "@tanstack/hotkeys";

export const HOTKEYS = {
    copy: "Mod+C" as Hotkey,
    download: "Mod+S" as Hotkey,
    clear: "Mod+Backspace" as Hotkey,
    randomize: "Mod+D" as Hotkey,
} as const;
