import { useCallback, useEffect } from "react";
import { useEditorStore } from "@/store/editor-store";

export function useImagePaste() {
    const setImage = useEditorStore((s) => s.setImage);

    const handlePaste = useCallback(
        (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setImage(ev.target?.result as string, file.name);
                        reader.readAsDataURL(file);
                    }
                    return;
                }
            }
        },
        [setImage],
    );

    useEffect(() => {
        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, [handlePaste]);
}
