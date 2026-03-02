import { ClipboardCopyIcon, DownloadIcon, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useImageExport } from "@/hooks/use-image-export";
import { getBackground, getShadow, getTransform, getTransformOverflow } from "@/lib/style-utils";
import { useEditorStore } from "@/store/editor-store";
import { BrowserFrame } from "./browser-frame";

export function ImageCanvas() {
    const store = useEditorStore();
    const { canvasRef, copyToClipboard, download, copyLabel, downloadLabel } = useImageExport();
    const innerRef = useRef<HTMLDivElement>(null);
    const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
    const [innerSize, setInnerSize] = useState<{ w: number; h: number } | null>(null);

    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const w = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
                const h = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
                setInnerSize({ w, h });
            }
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const overflow = innerSize
        ? getTransformOverflow(innerSize.w, innerSize.h, store)
        : { top: 0, right: 0, bottom: 0, left: 0 };
    const padTop = store.padding + overflow.top;
    const padRight = store.padding + overflow.right;
    const padBottom = store.padding + overflow.bottom;
    const padLeft = store.padding + overflow.left;

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
                <Button onClick={copyToClipboard}>
                    <ClipboardCopyIcon className="size-4" />
                    {copyLabel}
                </Button>
                <Button variant="outline" onClick={download}>
                    <DownloadIcon className="size-4" />
                    {downloadLabel}
                </Button>
                <Button variant="destructive" onClick={() => store.reset()}>
                    <Trash2Icon className="size-4" />
                    Clear
                </Button>
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
                        paddingTop: padTop,
                        paddingRight: padRight,
                        paddingBottom: padBottom,
                        paddingLeft: padLeft,
                    }}
                >
                    <div
                        ref={innerRef}
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
                        Output: {naturalSize.w + padLeft + padRight} x {naturalSize.h + padTop + padBottom}px @2x
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
