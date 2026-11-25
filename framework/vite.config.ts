import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: "127.0.0.1",
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        // userEvent + фейковые таймеры зависают, если React не может дотикать
        // свои внутренние таймеры: пусть часы идут вместе с реальным временем
        fakeTimers: {
            shouldAdvanceTime: true,
        },
        // в тестах удобнее видеть исходные имена классов, а не хеши CSS Modules
        css: {
            modules: {
                classNameStrategy: "non-scoped",
            },
        },
        coverage: {
            provider: "v8",
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/main.tsx", "src/test/**", "src/**/*.test.{ts,tsx}"],
        },
    },
});
