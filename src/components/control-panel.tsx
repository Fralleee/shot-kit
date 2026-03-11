import {
    ChevronDownIcon,
    DicesIcon,
    type LucideIcon,
    MaximizeIcon,
    PaintbrushIcon,
    PanelTopIcon,
    Rotate3dIcon,
    RotateCcwIcon,
    SlidersHorizontalIcon,
    SparklesIcon,
    SquareRoundCornerIcon,
    SunDimIcon,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { BackgroundType, BrowserFrameStyle, EditorSettings } from "@/store/editor-store";
import { defaultSettings, useEditorStore } from "@/store/editor-store";
import { presets } from "@/store/presets";

function hasChanges(store: EditorSettings, keys: (keyof EditorSettings)[]) {
    return keys.some((k) => store[k] !== defaultSettings[k]);
}

function Section({
    title,
    icon: Icon,
    defaultOpen = false,
    children,
}: {
    title: string;
    icon: LucideIcon;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    return (
        <Collapsible defaultOpen={defaultOpen} className="border-b border-border last:border-b-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between py-3 text-sm font-semibold tracking-tight rounded-sm hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors [&[data-state=open]>svg:last-child]:rotate-180">
                <span className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    {title}
                </span>
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
    defaultValue,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    step?: number;
    suffix?: string;
    defaultValue: number;
}) {
    const changed = value !== defaultValue;
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <div className="flex items-center gap-1">
                    {changed && (
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => onChange(defaultValue)}
                            aria-label="Reset to default"
                        >
                            <RotateCcwIcon />
                        </Button>
                    )}
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                            const v = Number.parseFloat(e.target.value);
                            if (!Number.isNaN(v)) onChange(v);
                        }}
                        min={min}
                        max={max}
                        step={step}
                        className="w-16 input-number"
                    />
                    {suffix && <span className="text-xs text-muted-foreground font-mono">{suffix}</span>}
                </div>
            </div>
            <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={min} max={max} step={step} />
        </div>
    );
}

function ColorInput({
    label,
    value,
    onChange,
    defaultValue,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    defaultValue: string;
}) {
    const changed = value !== defaultValue;
    return (
        <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <div className="flex items-center gap-2">
                {changed && (
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onChange(defaultValue)}
                        title="Reset to default"
                    >
                        <RotateCcwIcon />
                    </Button>
                )}
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

export function ControlPanelContent() {
    const store = useEditorStore(
        useShallow((s) => {
            const { image, fileName, ...rest } = s;
            return rest;
        }),
    );

    return (
        <>
            <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
                <h2 className="flex items-center gap-2 text-base font-semibold">
                    <SlidersHorizontalIcon className="size-4" />
                    Settings
                </h2>
            </div>
            <div className="p-4 space-y-5">
                <Section title="Presets" icon={SparklesIcon} defaultOpen>
                    <div className="grid grid-cols-2 gap-2">
                        {presets.map((preset) => (
                            <Button
                                key={preset.name}
                                variant="outline"
                                size="sm"
                                onClick={() => store.applySettings(preset.settings)}
                            >
                                <preset.icon className="size-3" />
                                {preset.name}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => store.randomizeSettings()}
                    >
                        <DicesIcon className="size-3" />
                        Randomize
                    </Button>
                </Section>

                <Section
                    title="Corners & Border"
                    icon={SquareRoundCornerIcon}
                    defaultOpen={hasChanges(store, ["borderRadius", "borderWidth", "borderColor", "borderOpacity"])}
                >
                    <SliderControl
                        label="Border Radius"
                        value={store.borderRadius}
                        onChange={store.setBorderRadius}
                        min={0}
                        max={48}
                        suffix="px"
                        defaultValue={defaultSettings.borderRadius}
                    />
                    <SliderControl
                        label="Border Width"
                        value={store.borderWidth}
                        onChange={store.setBorderWidth}
                        min={0}
                        max={32}
                        suffix="px"
                        defaultValue={defaultSettings.borderWidth}
                    />
                    {store.borderWidth > 0 && (
                        <div className="space-y-3">
                            <SliderControl
                                label="Border Opacity"
                                value={store.borderOpacity}
                                onChange={store.setBorderOpacity}
                                min={0}
                                max={1}
                                step={0.05}
                                defaultValue={defaultSettings.borderOpacity}
                            />
                            <ColorInput
                                label="Border Color"
                                value={store.borderColor}
                                onChange={store.setBorderColor}
                                defaultValue={defaultSettings.borderColor}
                            />
                        </div>
                    )}
                </Section>

                <Section
                    title="Shadow"
                    icon={SunDimIcon}
                    defaultOpen={hasChanges(store, [
                        "shadowEnabled",
                        "shadowBlur",
                        "shadowSpread",
                        "shadowOffsetX",
                        "shadowOffsetY",
                        "shadowColor",
                        "shadowOpacity",
                    ])}
                >
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Enabled</Label>
                        <div className="flex items-center gap-2">
                            {store.shadowEnabled !== defaultSettings.shadowEnabled && (
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => store.setShadowEnabled(defaultSettings.shadowEnabled)}
                                    aria-label="Reset to default"
                                >
                                    <RotateCcwIcon />
                                </Button>
                            )}
                            <Switch checked={store.shadowEnabled} onCheckedChange={store.setShadowEnabled} />
                        </div>
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
                                defaultValue={defaultSettings.shadowBlur}
                            />
                            <SliderControl
                                label="Spread"
                                value={store.shadowSpread}
                                onChange={store.setShadowSpread}
                                min={-20}
                                max={40}
                                suffix="px"
                                defaultValue={defaultSettings.shadowSpread}
                            />
                            <SliderControl
                                label="Offset X"
                                value={store.shadowOffsetX}
                                onChange={store.setShadowOffsetX}
                                min={-50}
                                max={50}
                                suffix="px"
                                defaultValue={defaultSettings.shadowOffsetX}
                            />
                            <SliderControl
                                label="Offset Y"
                                value={store.shadowOffsetY}
                                onChange={store.setShadowOffsetY}
                                min={-50}
                                max={50}
                                suffix="px"
                                defaultValue={defaultSettings.shadowOffsetY}
                            />
                            <SliderControl
                                label="Opacity"
                                value={store.shadowOpacity}
                                onChange={store.setShadowOpacity}
                                min={0}
                                max={1}
                                step={0.05}
                                defaultValue={defaultSettings.shadowOpacity}
                            />
                            <ColorInput
                                label="Color"
                                value={store.shadowColor}
                                onChange={store.setShadowColor}
                                defaultValue={defaultSettings.shadowColor}
                            />
                        </div>
                    )}
                </Section>

                <Section
                    title="Rotate & Tilt"
                    icon={Rotate3dIcon}
                    defaultOpen={hasChanges(store, ["rotateX", "rotateY", "rotateZ", "perspective"])}
                >
                    <SliderControl
                        label="Tilt X"
                        value={store.rotateX}
                        onChange={store.setRotateX}
                        min={-45}
                        max={45}
                        suffix="°"
                        defaultValue={defaultSettings.rotateX}
                    />
                    <SliderControl
                        label="Tilt Y"
                        value={store.rotateY}
                        onChange={store.setRotateY}
                        min={-45}
                        max={45}
                        suffix="°"
                        defaultValue={defaultSettings.rotateY}
                    />
                    <SliderControl
                        label="Rotate"
                        value={store.rotateZ}
                        onChange={store.setRotateZ}
                        min={-180}
                        max={180}
                        suffix="°"
                        defaultValue={defaultSettings.rotateZ}
                    />
                    <SliderControl
                        label="Perspective"
                        value={store.perspective}
                        onChange={store.setPerspective}
                        min={200}
                        max={2000}
                        step={50}
                        suffix="px"
                        defaultValue={defaultSettings.perspective}
                    />
                </Section>

                <Section title="Browser Frame" icon={PanelTopIcon} defaultOpen={hasChanges(store, ["browserFrame"])}>
                    <div className="flex items-center gap-2">
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
                        {store.browserFrame !== defaultSettings.browserFrame && (
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => store.setBrowserFrame(defaultSettings.browserFrame)}
                                aria-label="Reset to default"
                            >
                                <RotateCcwIcon />
                            </Button>
                        )}
                    </div>
                </Section>

                <Section
                    title="Background"
                    icon={PaintbrushIcon}
                    defaultOpen={hasChanges(store, [
                        "backgroundType",
                        "backgroundColor",
                        "gradientFrom",
                        "gradientTo",
                        "gradientAngle",
                    ])}
                >
                    <div className="flex items-center gap-2">
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
                        {store.backgroundType !== defaultSettings.backgroundType && (
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => store.setBackgroundType(defaultSettings.backgroundType)}
                                aria-label="Reset to default"
                            >
                                <RotateCcwIcon />
                            </Button>
                        )}
                    </div>

                    {store.backgroundType === "solid" && (
                        <ColorInput
                            label="Color"
                            value={store.backgroundColor}
                            onChange={store.setBackgroundColor}
                            defaultValue={defaultSettings.backgroundColor}
                        />
                    )}

                    {store.backgroundType === "gradient" && (
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                    const rand = () =>
                                        `#${Math.floor(Math.random() * 0xffffff)
                                            .toString(16)
                                            .padStart(6, "0")}`;
                                    store.setGradientFrom(rand());
                                    store.setGradientTo(rand());
                                    store.setGradientAngle(Math.floor(Math.random() * 360));
                                }}
                            >
                                <DicesIcon className="size-3" />
                                Randomize
                            </Button>
                            <ColorInput
                                label="From"
                                value={store.gradientFrom}
                                onChange={store.setGradientFrom}
                                defaultValue={defaultSettings.gradientFrom}
                            />
                            <ColorInput
                                label="To"
                                value={store.gradientTo}
                                onChange={store.setGradientTo}
                                defaultValue={defaultSettings.gradientTo}
                            />
                            <SliderControl
                                label="Angle"
                                value={store.gradientAngle}
                                onChange={store.setGradientAngle}
                                min={0}
                                max={360}
                                suffix="°"
                                defaultValue={defaultSettings.gradientAngle}
                            />
                        </div>
                    )}
                </Section>

                <Section
                    title="Spacing & Scale"
                    icon={MaximizeIcon}
                    defaultOpen={hasChanges(store, ["padding", "scale"])}
                >
                    <SliderControl
                        label="Padding"
                        value={store.padding}
                        onChange={store.setPadding}
                        min={0}
                        max={200}
                        suffix="px"
                        defaultValue={defaultSettings.padding}
                    />
                    <SliderControl
                        label="Scale"
                        value={store.scale}
                        onChange={store.setScale}
                        min={0.5}
                        max={2}
                        step={0.05}
                        defaultValue={defaultSettings.scale}
                    />
                </Section>
            </div>
        </>
    );
}

export function ControlPanel() {
    return (
        <div className="hidden md:block w-72 shrink-0 border-l border-border bg-card overflow-y-auto h-full">
            <ControlPanelContent />
        </div>
    );
}
