import type { EditorSettings } from "@/store/editor-store";

export function getBackground(s: EditorSettings): string {
    if (s.backgroundType === "transparent") return "transparent";
    if (s.backgroundType === "solid") return s.backgroundColor;
    return `linear-gradient(${s.gradientAngle}deg, ${s.gradientFrom}, ${s.gradientTo})`;
}

export function getShadow(s: EditorSettings): string {
    if (!s.shadowEnabled) return "none";
    const alpha = Math.round(s.shadowOpacity * 255)
        .toString(16)
        .padStart(2, "0");
    return `${s.shadowOffsetX}px ${s.shadowOffsetY}px ${s.shadowBlur}px ${s.shadowSpread}px ${s.shadowColor}${alpha}`;
}

export function getTransform(s: EditorSettings): string {
    const parts: string[] = [];
    if (s.rotateX !== 0 || s.rotateY !== 0) {
        parts.push(`perspective(${s.perspective}px)`);
    }
    if (s.rotateX !== 0) parts.push(`rotateX(${s.rotateX}deg)`);
    if (s.rotateY !== 0) parts.push(`rotateY(${s.rotateY}deg)`);
    if (s.rotateZ !== 0) parts.push(`rotateZ(${s.rotateZ}deg)`);
    if (s.scale !== 1) parts.push(`scale(${s.scale})`);
    return parts.length > 0 ? parts.join(" ") : "none";
}
