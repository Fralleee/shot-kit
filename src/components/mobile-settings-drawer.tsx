import { SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { ControlPanelContent } from "@/components/control-panel";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export function MobileSettingsDrawer() {
    const [open, setOpen] = useState(false);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    size="icon-lg"
                    variant="outline"
                    className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg md:hidden bg-background"
                    aria-label="Open settings"
                >
                    <SlidersHorizontalIcon className="size-5" />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
                <div className="overflow-y-auto flex-1">
                    <ControlPanelContent />
                </div>
            </DrawerContent>
        </Drawer>
    );
}
