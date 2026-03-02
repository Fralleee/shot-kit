import { ControlPanel } from "@/components/control-panel";
import { DropZone } from "@/components/drop-zone";
import { ImageCanvas } from "@/components/image-canvas";
import { useImagePaste } from "@/hooks/use-image-paste";
import { useEditorStore } from "@/store/editor-store";

function App() {
    const image = useEditorStore((s) => s.image);

    useImagePaste();

    if (!image) {
        return (
            <div className="flex items-center justify-center h-screen bg-background p-8">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">ShotKit</h1>
                        <p className="text-muted-foreground mt-2">Beautiful screenshots in seconds</p>
                    </div>
                    <DropZone />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background">
            <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                <ImageCanvas />
            </div>
            <ControlPanel />
        </div>
    );
}

export default App;
