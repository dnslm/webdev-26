import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// подписка на изменение системной настройки «уменьшить анимацию»
function subscribe(onChange: () => void): () => void {
    const mediaQuery = window.matchMedia(QUERY);
    mediaQuery.addEventListener("change", onChange);

    return () => {
        mediaQuery.removeEventListener("change", onChange);
    };
}

function getSnapshot(): boolean {
    return window.matchMedia(QUERY).matches;
}

// true, если пользователь просит не показывать лишние анимации
export function useReducedMotion(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot);
}
