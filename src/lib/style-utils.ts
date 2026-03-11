import type { EditorSettings } from "@/store/editor-store";

export function getBackground(s: EditorSettings): string {
    if (s.backgroundType === "transparent") return "transparent";
    if (s.backgroundType === "solid") return s.backgroundColor;
    return `linear-gradient(${s.gradientAngle}deg, ${s.gradientFrom}, ${s.gradientTo})`;
}

export function getBorder(s: EditorSettings): string {
    if (s.borderWidth === 0) return "none";
    const alpha = Math.round(s.borderOpacity * 255)
        .toString(16)
        .padStart(2, "0");
    return `${s.borderWidth}px solid ${s.borderColor}${alpha}`;
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

export interface TransformOverflow {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export function getTransformOverflow(
    width: number,
    height: number,
    s: Pick<
        EditorSettings,
        | "rotateX"
        | "rotateY"
        | "rotateZ"
        | "perspective"
        | "scale"
        | "shadowEnabled"
        | "shadowOffsetX"
        | "shadowOffsetY"
        | "shadowBlur"
        | "shadowSpread"
    >,
): TransformOverflow {
    const zero: TransformOverflow = { top: 0, right: 0, bottom: 0, left: 0 };
    const noTransform = s.rotateX === 0 && s.rotateY === 0 && s.rotateZ === 0 && s.scale === 1;
    if (noTransform && !s.shadowEnabled) {
        return zero;
    }

    const hw = width / 2;
    const hh = height / 2;

    // Shadow-expanded bounding box in local space
    let boxLeft = -hw;
    let boxRight = hw;
    let boxTop = -hh;
    let boxBottom = hh;

    if (s.shadowEnabled) {
        const extent = s.shadowBlur + s.shadowSpread;
        boxLeft = Math.min(boxLeft, s.shadowOffsetX - hw - extent);
        boxRight = Math.max(boxRight, s.shadowOffsetX + hw + extent);
        boxTop = Math.min(boxTop, s.shadowOffsetY - hh - extent);
        boxBottom = Math.max(boxBottom, s.shadowOffsetY + hh + extent);
    }

    const corners: [number, number][] = [
        [boxLeft, boxTop],
        [boxRight, boxTop],
        [boxRight, boxBottom],
        [boxLeft, boxBottom],
    ];

    if (noTransform) {
        return {
            top: Math.max(0, Math.ceil(-boxTop - hh)),
            right: Math.max(0, Math.ceil(boxRight - hw)),
            bottom: Math.max(0, Math.ceil(boxBottom - hh)),
            left: Math.max(0, Math.ceil(-boxLeft - hw)),
        };
    }

    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const ax = toRad(s.rotateX);
    const ay = toRad(s.rotateY);
    const az = toRad(s.rotateZ);
    const sc = s.scale;
    const d = s.perspective;

    const cosX = Math.cos(ax),
        sinX = Math.sin(ax);
    const cosY = Math.cos(ay),
        sinY = Math.sin(ay);
    const cosZ = Math.cos(az),
        sinZ = Math.sin(az);

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const [cx, cy] of corners) {
        // Scale
        let x = cx * sc;
        let y = cy * sc;
        let z = 0;

        // RotateZ
        const rzX = x * cosZ - y * sinZ;
        const rzY = x * sinZ + y * cosZ;
        x = rzX;
        y = rzY;

        // RotateY
        const ryX = x * cosY + z * sinY;
        const ryZ = -x * sinY + z * cosY;
        x = ryX;
        z = ryZ;

        // RotateX
        const rxY = y * cosX - z * sinX;
        const rxZ = y * sinX + z * cosX;
        y = rxY;
        z = rxZ;

        // Perspective projection
        const denom = d - z;
        if (denom > 0) {
            x = (x * d) / denom;
            y = (y * d) / denom;
        }

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    }

    return {
        top: Math.max(0, Math.ceil(-minY - hh)),
        right: Math.max(0, Math.ceil(maxX - hw)),
        bottom: Math.max(0, Math.ceil(maxY - hh)),
        left: Math.max(0, Math.ceil(-minX - hw)),
    };
}
