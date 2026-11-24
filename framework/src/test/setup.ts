import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom не умеет matchMedia: подставляем заглушку, по умолчанию анимации включены
Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
    }),
});

// размонтируем компоненты после каждого теста, чтобы тесты не влияли друг на друга
afterEach(() => {
    cleanup();
});
