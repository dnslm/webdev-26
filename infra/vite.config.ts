import { defineConfig } from "vite";

export default defineConfig({
    root: "src",
    server: {
        // по умолчанию с yarn serve страничка не открывалась
        // поэтому принудительно добавляю инфу
        // ссылка http://127.0.0.1:5173/
        host: "127.0.0.1",
        port: 5173,
    },
    build: {
        outDir: "../dist",
        emptyOutDir: true,
    },
});
