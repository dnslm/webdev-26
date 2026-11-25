// полифил должен выполниться раньше, чем загрузится React DOM
import "./polyfills";

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom не умеет matchMedia: подставляем заглушку, по умолчанию анимации включены
// configurable нужен, чтобы тесты могли подменять функцию через vi.spyOn
Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
    }),
});

afterEach(() => {
    // размонтируем компоненты, чтобы тесты не влияли друг на друга
    cleanup();
    // возвращаем подменённые в тестах функции (например, matchMedia) в исходное состояние
    vi.restoreAllMocks();
});
