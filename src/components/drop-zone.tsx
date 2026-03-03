import { useCallback, useState } from "react";
import { useEditorStore } from "@/store/editor-store";

export function DropZone() {
    const setImage = useEditorStore((s) => s.setImage);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback(
        (file: File) => {
            if (!file.type.startsWith("image/")) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string, file.name);
            };
            reader.readAsDataURL(file);
        },
        [setImage],
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile],
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const openFilePicker = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) handleFile(file);
        };
        input.click();
    };

    return (
        <button
            type="button"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center w-full h-full min-h-64 sm:min-h-80 border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer backdrop-blur-sm ${
                isDragging
                    ? "border-brand-indigo bg-brand-indigo/10 scale-[1.01]"
                    : "border-border hover:border-ring/50 bg-muted/30 hover:bg-muted/50 dark:border-white/15 dark:hover:border-white/30 dark:bg-white/3 dark:hover:bg-white/5"
            }`}
            onClick={openFilePicker}
        >
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-40"
                    aria-hidden="true"
                >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <div className="text-center">
                    <p className="text-lg font-medium text-foreground/80">Paste, drop, or click to upload</p>
                    <p className="text-sm mt-1">Ctrl+V to paste from clipboard</p>
                </div>
            </div>
        </button>
    );
}
