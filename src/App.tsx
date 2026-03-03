import { ControlPanel } from "@/components/control-panel";
import { DropZone } from "@/components/drop-zone";
import { ImageCanvas } from "@/components/image-canvas";
import { MobileSettingsDrawer } from "@/components/mobile-settings-drawer";
import { useImagePaste } from "@/hooks/use-image-paste";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEditorStore } from "@/store/editor-store";

function App() {
    const image = useEditorStore((s) => s.image);
    const isMobile = useIsMobile();

    useImagePaste();

    if (!image) {
        return (
            <div className="relative flex items-center justify-center h-screen p-6 sm:p-8 overflow-hidden bg-background text-foreground">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--color-brand-indigo)/0.12,transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--color-brand-indigo)/0.2,transparent_70%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_100%,var(--color-brand-pink)/0.08,transparent_60%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_80%_100%,var(--color-brand-pink)/0.13,transparent_60%)]" />
                <div className="relative w-full max-w-xl z-10">
                    <div className="flex flex-col items-center gap-4 mb-10">
                        <img
                            src="/favicon.svg"
                            alt=""
                            className="size-16 sm:size-20 drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]"
                        />
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-linear-to-r from-brand-indigo via-brand-purple to-brand-pink bg-clip-text text-transparent">
                            ShotKit
                        </h1>
                        <p className="text-muted-foreground text-base sm:text-lg">Beautiful screenshots in seconds</p>
                    </div>
                    <DropZone />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <div className="relative flex-1 overflow-auto flex items-center justify-center p-4">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_-10%,var(--color-brand-indigo)/0.08,transparent_60%)] dark:bg-[radial-gradient(ellipse_70%_50%_at_20%_-10%,var(--color-brand-indigo)/0.12,transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_100%,var(--color-brand-pink)/0.05,transparent_50%)] dark:bg-[radial-gradient(ellipse_50%_40%_at_90%_100%,var(--color-brand-pink)/0.08,transparent_50%)]" />
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <ImageCanvas />
                </div>
            </div>
            {isMobile ? <MobileSettingsDrawer /> : <ControlPanel />}
        </div>
    );
}

export default App;
