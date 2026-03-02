import { toPng } from "html-to-image";
import { useCallback, useRef, useState } from "react";
import { useEditorStore } from "@/store/editor-store";

export function useImageExport() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const fileName = useEditorStore((s) => s.fileName);
    const [copyLabel, setCopyLabel] = useState("Copy Image");
    const [downloadLabel, setDownloadLabel] = useState("Download PNG");

    const render = useCallback(async () => {
        if (!canvasRef.current) return null;
        return toPng(canvasRef.current, { pixelRatio: 2, cacheBust: true });
    }, []);

    const copyToClipboard = useCallback(async () => {
        try {
            const dataUrl = await render();
            if (!dataUrl) return;
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            setCopyLabel("Copied!");
            setTimeout(() => setCopyLabel("Copy Image"), 1500);
        } catch (err) {
            console.error("Failed to copy image:", err);
            setCopyLabel("Failed!");
            setTimeout(() => setCopyLabel("Copy Image"), 1500);
        }
    }, [render]);

    const download = useCallback(async () => {
        try {
            const dataUrl = await render();
            if (!dataUrl) return;
            const link = document.createElement("a");
            link.download = fileName ? `shotkit-${fileName}` : "shotkit-screenshot.png";
            link.href = dataUrl;
            link.click();
            setDownloadLabel("Downloaded!");
            setTimeout(() => setDownloadLabel("Download PNG"), 1500);
        } catch (err) {
            console.error("Failed to download image:", err);
            setDownloadLabel("Failed!");
            setTimeout(() => setDownloadLabel("Download PNG"), 1500);
        }
    }, [render, fileName]);

    return { canvasRef, copyToClipboard, download, copyLabel, downloadLabel };
}
