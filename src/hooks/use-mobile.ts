import { useEffect, useState } from "react";

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 767px)");
        const onChange = () => setIsMobile(mql.matches);
        onChange();
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return isMobile;
}
