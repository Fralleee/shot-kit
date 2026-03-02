import type { ReactNode } from "react";
import type { BrowserFrameStyle } from "@/store/editor-store";

interface BrowserFrameProps {
    style: BrowserFrameStyle;
    children: ReactNode;
    borderRadius: number;
}

function MacOSFrame({ children, borderRadius }: { children: ReactNode; borderRadius: number }) {
    return (
        <div className="flex flex-col overflow-hidden bg-[#e8e8e8]" style={{ borderRadius }}>
            <div className="flex items-center gap-2 px-4 py-3 bg-[#e0e0e0]">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c940]" />
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="bg-white/60 rounded-md px-12 py-1 text-xs text-gray-500 text-center min-w-[200px]">
                        localhost:3000
                    </div>
                </div>
                <div className="w-[52px]" />
            </div>
            <div className="overflow-hidden">{children}</div>
        </div>
    );
}

function WindowsFrame({ children, borderRadius }: { children: ReactNode; borderRadius: number }) {
    return (
        <div className="flex flex-col overflow-hidden bg-[#f3f3f3]" style={{ borderRadius }}>
            <div className="flex items-center px-3 py-2 bg-[#f3f3f3]">
                <div className="flex items-center gap-2 flex-1">
                    <div className="flex gap-1.5">
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#666"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ccc"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div>
                    <div className="bg-[#e8e8e8] rounded-full px-4 py-1 text-xs text-gray-500 flex-1 text-center">
                        localhost:3000
                    </div>
                </div>
                <div className="flex gap-2 ml-3">
                    <div className="text-gray-400 text-xs">&#8212;</div>
                    <div className="text-gray-400 text-xs">&#9633;</div>
                    <div className="text-gray-400 text-xs">&times;</div>
                </div>
            </div>
            <div className="overflow-hidden">{children}</div>
        </div>
    );
}

export function BrowserFrame({ style, children, borderRadius }: BrowserFrameProps) {
    if (style === "macos") {
        return <MacOSFrame borderRadius={borderRadius}>{children}</MacOSFrame>;
    }
    if (style === "windows") {
        return <WindowsFrame borderRadius={borderRadius}>{children}</WindowsFrame>;
    }
    return <>{children}</>;
}
