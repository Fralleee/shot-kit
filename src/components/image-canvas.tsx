import { ClipboardCopyIcon, DownloadIcon, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { useAppHotkeys } from "@/hooks/use-app-hotkeys";
import { useCanvasZoom } from "@/hooks/use-canvas-zoom";
import { useImageExport } from "@/hooks/use-image-export";
import { useIsMobile } from "@/hooks/use-mobile";
import { getBackground, getBorder, getShadow, getTransform, getTransformOverflow } from "@/lib/style-utils";
import { useEditorStore } from "@/store/editor-store";
import { BrowserFrame } from "./browser-frame";
import { ZoomControls } from "./zoom-controls";

export function ImageCanvas() {
    const store = useEditorStore(
        useShallow((s) => {
            const { setBrowserFrameUrl, ...rest } = s;
            return rest;
        }),
    );
    const isMobile = useIsMobile();
    const { canvasRef, copyToClipboard, download, copyLabel, downloadLabel } = useImageExport();
    const innerRef = useRef<HTMLDivElement>(null);
    const zoomContainerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { zoom, setZoom, zoomIn, zoomOut, resetZoom } = useCanvasZoom(zoomContainerRef, scrollRef);
    useAppHotkeys({
        copy: copyToClipboard,
        download,
        clear: store.reset,
    });
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
                    <span className="hidden sm:inline">{copyLabel}</span>
                </Button>
                <Button variant="outline" onClick={download}>
                    <DownloadIcon className="size-4" />
                    <span className="hidden sm:inline">{downloadLabel}</span>
                </Button>
                <Button variant="destructive" onClick={() => store.reset()}>
                    <Trash2Icon className="size-4" />
                    <span className="hidden sm:inline">Clear</span>
                </Button>
            </div>

            <p className="hidden md:block text-xs text-muted-foreground shrink-0">
                Right-click the image to copy. Paste a new image anytime with Ctrl+V.
            </p>

            <div ref={zoomContainerRef} className="relative flex-1 w-full min-h-0">
                <div ref={scrollRef} className="w-full h-full overflow-auto bg-dot-grid">
                    <div className="min-w-full min-h-full flex p-4">
                        <div className="m-auto" style={{ zoom: zoom / 100 }}>
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
                                        border: getBorder(store),
                                        borderRadius: store.borderRadius,
                                        overflow: "hidden",
                                    }}
                                >
                                    <BrowserFrame
                                        style={store.browserFrame}
                                        borderRadius={
                                            store.browserFrame !== "none"
                                                ? Math.max(0, store.borderRadius - store.borderWidth)
                                                : 0
                                        }
                                    >
                                        <img
                                            src={store.image as string}
                                            alt="Screenshot"
                                            className="block h-auto"
                                            style={{
                                                maxWidth: `calc(100vw - ${isMobile ? 0 : 288}px - ${isMobile ? "2rem" : "6rem"} - ${store.padding * 2}px)`,
                                                maxHeight: `calc(100vh - 12rem - ${store.padding * 2}px)`,
                                                ...(store.browserFrame === "none"
                                                    ? {
                                                          borderRadius: Math.max(
                                                              0,
                                                              store.borderRadius - store.borderWidth,
                                                          ),
                                                      }
                                                    : {}),
                                            }}
                                            draggable={false}
                                        />
                                    </BrowserFrame>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ZoomControls zoom={zoom} setZoom={setZoom} zoomIn={zoomIn} zoomOut={zoomOut} resetZoom={resetZoom} />
            </div>

            {naturalSize && (
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-mono shrink-0">
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
