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
            <div className="relative flex items-center justify-center overflow-hidden h-screen p-6 sm:p-8 bg-background text-foreground">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--color-brand-indigo)/0.12,transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--color-brand-indigo)/0.2,transparent_70%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_100%,var(--color-brand-pink)/0.08,transparent_60%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_80%_100%,var(--color-brand-pink)/0.13,transparent_60%)]" />
                <div className="relative z-10 flex flex-col items-center w-full max-w-xl">
                    <div className="flex flex-col items-center gap-4 mb-10">
                        <img
                            src="/favicon.svg"
                            alt=""
                            className="size-16 sm:size-20 drop-shadow-[0_0_30px_var(--color-brand-indigo)]"
                        />
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-linear-to-r from-brand-indigo via-brand-purple to-brand-pink bg-clip-text text-transparent">
                            ShotKit
                        </h1>
                        <p className="text-muted-foreground text-base sm:text-lg">Beautiful screenshots in seconds</p>
                    </div>
                    <DropZone />
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                        <a
                            href="https://github.com/Fralleee/shot-kit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                            </svg>
                            Open source - contributions welcome
                        </a>
                        <span className="text-border hidden sm:inline">|</span>
                        <a
                            href="https://buymeacoffee.com/fralle"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-500 transition-colors"
                        >
                            <span className="text-xl" role="img" aria-label="coffee">
                                ☕
                            </span>
                            Buy me a coffee
                        </a>
                    </div>
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
