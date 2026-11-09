// @ts-check
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig(
    // НЕ проверяем результат сборки и служебные папки Yarn
    { ignores: ["dist", ".yarn", ".pnp.*"] },

    // базовые правила ESLint для JavaScript
    eslint.configs.recommended,

    // самые строгие готовые наборы typescript-eslint (с учётом типов)
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,

    {
        languageOptions: {
            parserOptions: {
                // правила, которым нужна информация о типах  из tsconfig
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },

    // обычные жс/мжс файлы (например, сам этот конфиг) проверяем без типов (типочков)
    {
        files: ["**/*.js", "**/*.mjs"],
        extends: [tseslint.configs.disableTypeChecked],
    },

    // отключает правила ESLint, которые спорят с Prettier
    eslintConfigPrettier,
);
