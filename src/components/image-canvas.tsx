import { useCallback, useEffect, useState } from "react";
import { useImageExport } from "@/hooks/use-image-export";
import { getBackground, getShadow, getTransform } from "@/lib/style-utils";
import { useEditorStore } from "@/store/editor-store";
import { BrowserFrame } from "./browser-frame";

export function ImageCanvas() {
    const store = useEditorStore();
    const { canvasRef, copyToClipboard, download, copyLabel, downloadLabel } = useImageExport();
    const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);

    useEffect(() => {
        if (!store.image) {
            setNaturalSize(null);
            return;
        }
        const img = new Image();
        img.onload = () => setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = () => setNaturalSize(null);
        img.src = store.image;
    }, [store.image]);

    const handleContextMenu = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            copyToClipboard();
        },
        [copyToClipboard],
    );

    return (
        <div className="flex flex-col items-center gap-4 w-full h-full">
            <div className="flex gap-2 shrink-0">
                <button
                    type="button"
                    onClick={copyToClipboard}
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    {copyLabel}
                </button>
                <button
                    type="button"
                    onClick={download}
                    className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                    {downloadLabel}
                </button>
                <button
                    type="button"
                    onClick={() => store.reset()}
                    className="px-4 py-2 text-sm font-medium bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                >
                    Clear
                </button>
            </div>

            <p className="text-xs text-muted-foreground shrink-0">
                Right-click the image to copy. Paste a new image anytime with Ctrl+V.
            </p>

            <div className="relative flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden">
                <div
                    ref={canvasRef}
                    role="img"
                    aria-label="Styled screenshot preview"
                    onContextMenu={handleContextMenu}
                    className="relative flex items-center justify-center shrink-0"
                    style={{
                        background: getBackground(store),
                        padding: store.padding,
                    }}
                >
                    <div
                        style={{
                            transform: getTransform(store),
                            boxShadow: getShadow(store),
                            borderRadius: store.borderRadius,
                            overflow: "hidden",
                        }}
                    >
                        <BrowserFrame
                            style={store.browserFrame}
                            borderRadius={store.browserFrame !== "none" ? store.borderRadius : 0}
                        >
                            <img
                                src={store.image as string}
                                alt="Screenshot"
                                className="block h-auto"
                                style={{
                                    maxWidth: `calc(100vw - 288px - 6rem - ${store.padding * 2}px)`,
                                    maxHeight: `calc(100vh - 12rem - ${store.padding * 2}px)`,
                                    ...(store.browserFrame === "none" ? { borderRadius: store.borderRadius } : {}),
                                }}
                                draggable={false}
                            />
                        </BrowserFrame>
                    </div>
                </div>
            </div>

            {naturalSize && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono shrink-0">
                    <span>
                        {naturalSize.w} x {naturalSize.h}px
                    </span>
                    <span className="text-border">|</span>
                    <span>
                        Output: {naturalSize.w + store.padding * 2} x {naturalSize.h + store.padding * 2}px @2x
                    </span>
                    {store.fileName && (
                        <>
                            <span className="text-border">|</span>
                            <span>{store.fileName}</span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
