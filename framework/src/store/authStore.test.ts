import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CORRECT_EMAIL, CORRECT_PASSWORD, LOGIN_DELAY_MS } from "../lib/auth";
import type { UserData } from "../types";
import { AUTH_STORAGE_KEY, useAuthStore } from "./authStore";

const credentials: UserData = { email: CORRECT_EMAIL, password: CORRECT_PASSWORD };
const initialState = useAuthStore.getState();

// вызывает login и перематывает время, чтобы дождаться ответа имитированного сервера
async function loginAndWait(data: UserData, remember: boolean): Promise<void> {
    const promise = useAuthStore.getState().login(data, remember);
    await vi.advanceTimersByTimeAsync(LOGIN_DELAY_MS);
    await promise;
}

describe("useAuthStore", () => {
    // перед каждым тестом возвращаем хранилище и localStorage в исходное состояние
    beforeEach(() => {
        vi.useFakeTimers();
        localStorage.clear();
        useAuthStore.setState(initialState, true);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("начинает с пустого состояния", () => {
        const state = useAuthStore.getState();

        expect(state.status).toBe("idle");
        expect(state.user).toBeNull();
        expect(state.remembered).toBeNull();
    });

    it("переходит в loading, пока идёт запрос", async () => {
        const promise = useAuthStore.getState().login(credentials, false);

        expect(useAuthStore.getState().status).toBe("loading");

        await vi.advanceTimersByTimeAsync(LOGIN_DELAY_MS);
        await promise;
    });

    it("входит с верной парой", async () => {
        await loginAndWait(credentials, false);

        const state = useAuthStore.getState();
        expect(state.status).toBe("success");
        expect(state.user).toEqual({ email: CORRECT_EMAIL });
    });

    it("показывает ошибку при неверном пароле", async () => {
        await loginAndWait({ email: CORRECT_EMAIL, password: `${CORRECT_PASSWORD}x` }, false);

        const state = useAuthStore.getState();
        expect(state.status).toBe("error");
        expect(state.user).toBeNull();
    });

    it("сохраняет пару, если отмечено «Запомнить пароль»", async () => {
        await loginAndWait(credentials, true);

        expect(useAuthStore.getState().remembered).toEqual(credentials);
        expect(localStorage.getItem(AUTH_STORAGE_KEY)).toContain(CORRECT_EMAIL);
    });

    it("стирает ранее сохранённую пару, если чекбокс не отмечен", async () => {
        useAuthStore.setState({ remembered: credentials });

        await loginAndWait(credentials, false);

        expect(useAuthStore.getState().remembered).toBeNull();
        expect(localStorage.getItem(AUTH_STORAGE_KEY)).not.toContain(CORRECT_PASSWORD);
    });

    it("не сохраняет пару после неудачного входа", async () => {
        await loginAndWait({ email: CORRECT_EMAIL, password: "wrong-password1" }, true);

        expect(useAuthStore.getState().remembered).toBeNull();
    });

    it("в localStorage попадает только сохранённая пара", async () => {
        await loginAndWait(credentials, true);

        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        expect(raw).not.toContain("status");
        expect(raw).not.toContain("user");
    });

    it("logout сбрасывает пользователя, но оставляет сохранённую пару", async () => {
        await loginAndWait(credentials, true);

        useAuthStore.getState().logout();

        const state = useAuthStore.getState();
        expect(state.status).toBe("idle");
        expect(state.user).toBeNull();
        expect(state.remembered).toEqual(credentials);
    });
});
