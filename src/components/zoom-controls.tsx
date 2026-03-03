import { MinusIcon, PlusIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MAX_ZOOM, MIN_ZOOM } from "@/hooks/use-canvas-zoom";
import { useIsMobile } from "@/hooks/use-mobile";

interface ZoomControlsProps {
    zoom: number;
    setZoom: (value: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
}

export function ZoomControls({ zoom, setZoom, zoomIn, zoomOut, resetZoom }: ZoomControlsProps) {
    const isMobile = useIsMobile();

    return (
        <div
            className={`absolute left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-sm ${isMobile ? "bottom-16" : "bottom-3"}`}
        >
            <Button variant="ghost" size="icon-xs" onClick={zoomOut} aria-label="Zoom out">
                <MinusIcon />
            </Button>
            <Slider
                value={[zoom]}
                onValueChange={([v]) => setZoom(v)}
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={5}
                className="w-24"
            />
            <Button variant="ghost" size="icon-xs" onClick={zoomIn} aria-label="Zoom in">
                <PlusIcon />
            </Button>
            <input
                type="number"
                value={zoom}
                onChange={(e) => {
                    const v = Number.parseInt(e.target.value, 10);
                    if (!Number.isNaN(v)) setZoom(v);
                }}
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={5}
                className="w-14 input-number"
            />
            <span className="text-xs text-muted-foreground font-mono">%</span>
            {zoom !== 100 && (
                <Button variant="ghost" size="icon-xs" onClick={resetZoom} aria-label="Reset zoom">
                    <RotateCcwIcon />
                </Button>
            )}
        </div>
    );
}
