import { ChevronDownIcon, RotateCcwIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { BackgroundType, BrowserFrameStyle } from "@/store/editor-store";
import { useEditorStore } from "@/store/editor-store";
import { presets } from "@/store/presets";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Collapsible defaultOpen className="border-b border-border last:border-b-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between py-3 text-sm font-semibold tracking-tight hover:text-foreground/80 transition-colors [&[data-state=open]>svg]:rotate-180">
                {title}
                <ChevronDownIcon className="size-4 text-muted-foreground transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pb-4">{children}</CollapsibleContent>
        </Collapsible>
    );
}

function SliderControl({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    suffix = "",
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    step?: number;
    suffix?: string;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <span className="text-xs text-muted-foreground font-mono tabular-nums">
                    {value}
                    {suffix}
                </span>
            </div>
            <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={min} max={max} step={step} />
        </div>
    );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-8 h-8 rounded-md border border-border cursor-pointer bg-transparent p-0.5"
                />
                <span className="text-xs font-mono text-muted-foreground w-16">{value}</span>
            </div>
        </div>
    );
}

export function ControlPanel() {
    const store = useEditorStore();

    return (
        <div className="w-72 shrink-0 border-l border-border bg-card overflow-y-auto h-full">
            <div className="p-4 space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold">Settings</h2>
                    <button
                        type="button"
                        onClick={() => store.resetSettings()}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        title="Reset to defaults"
                    >
                        <RotateCcwIcon className="size-3" />
                        Reset
                    </button>
                </div>

                <Section title="Presets">
                    <div className="grid grid-cols-2 gap-2">
                        {presets.map((preset) => (
                            <button
                                key={preset.name}
                                type="button"
                                onClick={() => store.applySettings(preset.settings)}
                                className="px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </Section>

                <Section title="Corners">
                    <SliderControl
                        label="Border Radius"
                        value={store.borderRadius}
                        onChange={store.setBorderRadius}
                        min={0}
                        max={48}
                        suffix="px"
                    />
                </Section>

                <Section title="Shadow">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Enabled</Label>
                        <Switch checked={store.shadowEnabled} onCheckedChange={store.setShadowEnabled} />
                    </div>
                    {store.shadowEnabled && (
                        <div className="space-y-3">
                            <SliderControl
                                label="Blur"
                                value={store.shadowBlur}
                                onChange={store.setShadowBlur}
                                min={0}
                                max={100}
                                suffix="px"
                            />
                            <SliderControl
                                label="Spread"
                                value={store.shadowSpread}
                                onChange={store.setShadowSpread}
                                min={-20}
                                max={40}
                                suffix="px"
                            />
                            <SliderControl
                                label="Offset X"
                                value={store.shadowOffsetX}
                                onChange={store.setShadowOffsetX}
                                min={-50}
                                max={50}
                                suffix="px"
                            />
                            <SliderControl
                                label="Offset Y"
                                value={store.shadowOffsetY}
                                onChange={store.setShadowOffsetY}
                                min={-50}
                                max={50}
                                suffix="px"
                            />
                            <SliderControl
                                label="Opacity"
                                value={store.shadowOpacity}
                                onChange={store.setShadowOpacity}
                                min={0}
                                max={1}
                                step={0.05}
                            />
                            <ColorInput label="Color" value={store.shadowColor} onChange={store.setShadowColor} />
                        </div>
                    )}
                </Section>

                <Section title="Rotate & Tilt">
                    <SliderControl
                        label="Tilt X"
                        value={store.rotateX}
                        onChange={store.setRotateX}
                        min={-45}
                        max={45}
                        suffix="°"
                    />
                    <SliderControl
                        label="Tilt Y"
                        value={store.rotateY}
                        onChange={store.setRotateY}
                        min={-45}
                        max={45}
                        suffix="°"
                    />
                    <SliderControl
                        label="Rotate"
                        value={store.rotateZ}
                        onChange={store.setRotateZ}
                        min={-180}
                        max={180}
                        suffix="°"
                    />
                    <SliderControl
                        label="Perspective"
                        value={store.perspective}
                        onChange={store.setPerspective}
                        min={200}
                        max={2000}
                        step={50}
                        suffix="px"
                    />
                </Section>

                <Section title="Browser Frame">
                    <Select
                        value={store.browserFrame}
                        onValueChange={(v) => store.setBrowserFrame(v as BrowserFrameStyle)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="macos">macOS</SelectItem>
                            <SelectItem value="windows">Windows</SelectItem>
                        </SelectContent>
                    </Select>
                </Section>

                <Section title="Background">
                    <Select
                        value={store.backgroundType}
                        onValueChange={(v) => store.setBackgroundType(v as BackgroundType)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gradient">Gradient</SelectItem>
                            <SelectItem value="solid">Solid</SelectItem>
                            <SelectItem value="transparent">Transparent</SelectItem>
                        </SelectContent>
                    </Select>

                    {store.backgroundType === "solid" && (
                        <ColorInput label="Color" value={store.backgroundColor} onChange={store.setBackgroundColor} />
                    )}

                    {store.backgroundType === "gradient" && (
                        <div className="space-y-3">
                            <ColorInput label="From" value={store.gradientFrom} onChange={store.setGradientFrom} />
                            <ColorInput label="To" value={store.gradientTo} onChange={store.setGradientTo} />
                            <SliderControl
                                label="Angle"
                                value={store.gradientAngle}
                                onChange={store.setGradientAngle}
                                min={0}
                                max={360}
                                suffix="°"
                            />
                        </div>
                    )}
                </Section>

                <Section title="Spacing & Scale">
                    <SliderControl
                        label="Padding"
                        value={store.padding}
                        onChange={store.setPadding}
                        min={0}
                        max={200}
                        suffix="px"
                    />
                    <SliderControl
                        label="Scale"
                        value={store.scale}
                        onChange={store.setScale}
                        min={0.5}
                        max={2}
                        step={0.05}
                    />
                </Section>
            </div>
        </div>
    );
}
