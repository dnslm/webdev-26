import { vi } from "vitest";

// подменяет window.matchMedia: позволяет задать, включён ли режим «уменьшить анимацию»,
// и переключить его прямо во время теста
export function mockMatchMedia(initialMatches: boolean) {
    let matches = initialMatches;
    const listeners = new Set<() => void>();

    vi.spyOn(window, "matchMedia").mockImplementation(
        (query: string) =>
            ({
                get matches() {
                    return matches;
                },
                media: query,
                addEventListener: (_type: string, listener: () => void) => {
                    listeners.add(listener);
                },
                removeEventListener: (_type: string, listener: () => void) => {
                    listeners.delete(listener);
                },
            }) as unknown as MediaQueryList,
    );

    return {
        setMatches(value: boolean) {
            matches = value;
            listeners.forEach((listener) => {
                listener();
            });
        },
    };
}
