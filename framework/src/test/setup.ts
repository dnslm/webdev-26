import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// размонтируем компоненты после каждого теста, чтобы тесты не влияли друг на друга
afterEach(() => {
    cleanup();
});
