import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "./App";
import { CORRECT_EMAIL, CORRECT_PASSWORD, LOGIN_DELAY_MS } from "./lib/auth";
import { useAuthStore } from "./store/authStore";
import { useEffectsStore } from "./store/effectsStore";

const authInitialState = useAuthStore.getState();
const effectsInitialState = useEffectsStore.getState();

const SECRET_CODE = ["KeyB", "KeyE", "KeyB", "KeyR", "KeyA"];

function typeSecretCode(target: Element = document.body): void {
    for (const code of SECRET_CODE) {
        fireEvent.keyDown(target, { code });
    }
}

// конфетти и снег лежат в скрытых от скринридера контейнерах и состоят из <span>
const effectPieces = () => document.querySelectorAll("div[aria-hidden='true'] > span");

describe("App", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        localStorage.clear();
        useAuthStore.setState(authInitialState, true);
        useEffectsStore.setState(effectsInitialState, true);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("собирает страницу: заголовок, шапку, форму и подвал", () => {
        render(<App />);

        expect(screen.getByRole("heading", { level: 1, name: "Форма входа" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "На главную" })).toBeInTheDocument();
        expect(screen.getByLabelText("Электронная почта")).toBeInTheDocument();
        expect(screen.getByRole("navigation", { name: "Контакты" })).toBeInTheDocument();
    });

    it("в начале на странице нет ни снега, ни конфетти", () => {
        render(<App />);

        expect(effectPieces()).toHaveLength(0);
    });

    it("секретное слово включает снег, а повторный ввод выключает", () => {
        render(<App />);

        typeSecretCode();
        expect(screen.getAllByText("❄")).toHaveLength(40);

        typeSecretCode();
        expect(screen.queryAllByText("❄")).toHaveLength(0);
    });

    it("секретное слово, набранное в поле ввода, снег не включает", () => {
        render(<App />);

        typeSecretCode(screen.getByLabelText("Электронная почта"));

        expect(screen.queryAllByText("❄")).toHaveLength(0);
    });

    it("после успешного входа идёт конфетти, а потом исчезает", async () => {
        const user = userEvent.setup({
            advanceTimers: (ms) => {
                vi.advanceTimersByTime(ms);
            },
        });
        render(<App />);
        await user.type(screen.getByLabelText("Электронная почта"), CORRECT_EMAIL);
        await user.type(screen.getByLabelText("Пароль"), CORRECT_PASSWORD);

        await user.click(screen.getByRole("button", { name: "Войти" }));
        await act(async () => {
            await vi.advanceTimersByTimeAsync(LOGIN_DELAY_MS);
        });

        expect(screen.getByText("Вход выполнен!")).toBeInTheDocument();
        expect(effectPieces()).toHaveLength(60);

        act(() => {
            vi.advanceTimersByTime(3500);
        });
        expect(effectPieces()).toHaveLength(0);
    });
});
