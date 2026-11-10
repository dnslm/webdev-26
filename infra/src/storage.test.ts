import { beforeEach, describe, expect, it } from "vitest";

import { clearData, loadData, saveData, STORAGE_KEY } from "./storage";

describe("хранилище данных входа", () => {
    // перед каждым тестом очищаем localStorage, чтобы тесты не влияли друг на друга
    beforeEach(() => {
        localStorage.clear();
    });

    it("возвращает null, если ничего не сохранено", () => {
        expect(loadData()).toBeNull();
    });

    it("сохраняет и читает пару email/пароль", () => {
        saveData("test@email.com", "secret123");

        expect(loadData()).toEqual({ email: "test@email.com", password: "secret123" });
    });

    it("clearData удаляет сохранённые данные", () => {
        saveData("test@email.com", "secret123");
        clearData();

        expect(loadData()).toBeNull();
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("возвращает null, если в хранилище повреждённый JSON", () => {
        localStorage.setItem(STORAGE_KEY, "{not valid json");

        expect(loadData()).toBeNull();
    });

    it.each([
        ["не объект", JSON.stringify("просто строка")],
        ["null", "null"],
        ["нет пароля", JSON.stringify({ email: "a@b.co" })],
        ["пароль не строка", JSON.stringify({ email: "a@b.co", password: 12345 })],
    ])("возвращает null, если данные неверной формы: %s", (_description, raw) => {
        localStorage.setItem(STORAGE_KEY, raw);

        expect(loadData()).toBeNull();
    });
});