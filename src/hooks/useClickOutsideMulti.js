import { useEffect } from "react";


export default function useClickOutsideMulti(refs = [], handler) {
    useEffect(() => {
        if (!Array.isArray(refs)) return;

        const listener = (event) => {
            // jika klik di dalam salah satu ref, abaikan
            if (refs.some((ref) => ref.current && ref.current.contains(event.target))) {
                return;
            }

            handler(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [refs, handler]);
}
