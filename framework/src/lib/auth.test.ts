import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
    checkCredentials,
    CORRECT_EMAIL,
    CORRECT_PASSWORD,
    LOGIN_DELAY_MS,
    requestLogin,
} from "./auth";

describe("checkCredentials", () => {
    it("принимает верную пару email/пароль", () => {
        expect(checkCredentials(CORRECT_EMAIL, CORRECT_PASSWORD)).toBe(true);
    });

    it("отклоняет неверный пароль", () => {
        expect(checkCredentials(CORRECT_EMAIL, `${CORRECT_PASSWORD}x`)).toBe(false);
    });

    it("отклоняет неверный email", () => {
        expect(checkCredentials(`x${CORRECT_EMAIL}`, CORRECT_PASSWORD)).toBe(false);
    });

    it("отклоняет пустые поля", () => {
        expect(checkCredentials("", "")).toBe(false);
    });

    it("не принимает email и пароль, перепутанные местами", () => {
        expect(checkCredentials(CORRECT_PASSWORD, CORRECT_EMAIL)).toBe(false);
    });
});

describe("requestLogin", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("отвечает только после задержки и сообщает true для верной пары", async () => {
        const promise = requestLogin(CORRECT_EMAIL, CORRECT_PASSWORD);
        let isSettled = false;
        void promise.then(() => {
            isSettled = true;
        });

        await vi.advanceTimersByTimeAsync(LOGIN_DELAY_MS - 1);
        expect(isSettled).toBe(false);

        await vi.advanceTimersByTimeAsync(1);
        expect(isSettled).toBe(true);
        await expect(promise).resolves.toBe(true);
    });

    it("сообщает false для неверной пары", async () => {
        const promise = requestLogin(CORRECT_EMAIL, "wrong-password1");

        await vi.advanceTimersByTimeAsync(LOGIN_DELAY_MS);

        await expect(promise).resolves.toBe(false);
    });
});
