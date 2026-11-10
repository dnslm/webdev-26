import { describe, expect, it } from "vitest";

import { isValidEmail, isValidPassword } from "./validation";

describe("isValidEmail", () => {
    it.each(["test@email.com", "user.name@mail.ru", "a@b.co", "имя@почта.рф"])(
        "принимает корректный адрес %j",
        (email) => {
            expect(isValidEmail(email)).toBe(true);
        },
    );

    it.each([
        "",
        "plainaddress",
        "@email.com",
        "user@",
        "user@email",
        "us er@email.com",
        "user@@email.com",
        "user@email.",
    ])("отклоняет некорректный адрес %j", (email) => {
        expect(isValidEmail(email)).toBe(false);
    });
});

describe("isValidPassword", () => {
    it.each(["abcdefg1", "Password123", "пароль123", "1234567a"])(
        "принимает пароль %j",
        (password) => {
            expect(isValidPassword(password)).toBe(true);
        },
    );

    it.each([
        "",
        "abc123", // слишком короткий
        "Abc1234", // 7 символов: граница
        "abcdefgh", // нет цифры
        "12345678", // нет буквы
    ])("отклоняет пароль %j", (password) => {
        expect(isValidPassword(password)).toBe(false);
    });

    it("принимает пароль ровно из 8 символов", () => {
        expect(isValidPassword("Abc12345")).toBe(true);
    });
});