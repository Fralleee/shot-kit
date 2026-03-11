import { useHotkey } from "@tanstack/react-hotkeys";
import { HOTKEYS } from "@/lib/hotkeys";
import { useEditorStore } from "@/store/editor-store";

interface AppHotkeyActions {
    copy: () => void;
    download: () => void;
    clear: () => void;
}

const IGNORE_INPUTS = { ignoreInputs: true } as const;

export function useAppHotkeys(actions: AppHotkeyActions) {
    const randomizeSettings = useEditorStore((s) => s.randomizeSettings);

    useHotkey(
        HOTKEYS.copy,
        (e) => {
            e.preventDefault();
            actions.copy();
        },
        IGNORE_INPUTS,
    );

    useHotkey(
        HOTKEYS.download,
        (e) => {
            e.preventDefault();
            actions.download();
        },
        IGNORE_INPUTS,
    );

    useHotkey(
        HOTKEYS.clear,
        (e) => {
            e.preventDefault();
            actions.clear();
        },
        IGNORE_INPUTS,
    );

    useHotkey(
        HOTKEYS.randomize,
        (e) => {
            e.preventDefault();
            randomizeSettings();
        },
        IGNORE_INPUTS,
    );
}
