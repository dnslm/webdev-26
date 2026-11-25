import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CORRECT_EMAIL, CORRECT_PASSWORD, LOGIN_DELAY_MS } from "../../lib/auth";
import { useAuthStore } from "../../store/authStore";
import { AuthForm } from "./AuthForm";

const initialState = useAuthStore.getState();

const emailField = () => screen.getByLabelText("Электронная почта");
const passwordField = () => screen.getByLabelText("Пароль");
const rememberCheckbox = () => screen.getByRole("checkbox", { name: "Запомнить пароль?" });
const submitButton = () => screen.getByRole("button", { name: "Войти" });

// пользователь, который «ждёт» вместе с поддельными таймерами
function createUser() {
    return userEvent.setup({
        advanceTimers: (ms) => {
            vi.advanceTimersByTime(ms);
        },
    });
}

type User = ReturnType<typeof createUser>;

async function fillForm(user: User, email: string, password: string): Promise<void> {
    await user.type(emailField(), email);
    await user.type(passwordField(), password);
}

// перематывает время до ответа имитированного сервера
async function finishRequest(): Promise<void> {
    await act(async () => {
        await vi.advanceTimersByTimeAsync(LOGIN_DELAY_MS);
    });
}

describe("AuthForm", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        localStorage.clear();
        useAuthStore.setState(initialState, true);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("показывает поля, чекбокс и кнопку входа", () => {
        render(<AuthForm />);

        expect(emailField()).toHaveValue("");
        expect(passwordField()).toHaveValue("");
        expect(rememberCheckbox()).not.toBeChecked();
        expect(submitButton()).toBeEnabled();
    });

    describe("проверка полей", () => {
        it("при уходе с поля помечает неверный email ошибкой и включает тряску", async () => {
            const user = createUser();
            render(<AuthForm />);

            await user.type(emailField(), "not-an-email");
            await user.tab();

            expect(emailField()).toHaveAttribute("aria-invalid", "true");
            expect(emailField()).toHaveClass("invalid");
            expect(emailField()).toHaveClass("shake");
        });

        it("тряска заканчивается вместе с анимацией, а ошибка остаётся", async () => {
            const user = createUser();
            render(<AuthForm />);
            await user.type(emailField(), "not-an-email");
            await user.tab();

            fireEvent.animationEnd(emailField());

            expect(emailField()).not.toHaveClass("shake");
            expect(emailField()).toHaveAttribute("aria-invalid", "true");
        });

        it("верный email после ухода с поля получает класс valid", async () => {
            const user = createUser();
            render(<AuthForm />);

            await user.type(emailField(), "user@example.com");
            await user.tab();

            expect(emailField()).toHaveClass("valid");
            expect(emailField()).toHaveAttribute("aria-invalid", "false");
        });

        it("короткий пароль считается неверным", async () => {
            const user = createUser();
            render(<AuthForm />);

            await user.type(passwordField(), "abc1");
            await user.tab();

            expect(passwordField()).toHaveAttribute("aria-invalid", "true");
        });

        it("пробелы по краям email не мешают проверке", async () => {
            const user = createUser();
            render(<AuthForm />);

            await user.type(emailField(), "  user@example.com  ");
            await user.tab();

            expect(emailField()).toHaveAttribute("aria-invalid", "false");
        });
    });

    describe("отправка формы", () => {
        it("с пустыми полями показывает ошибку формата и не отправляет запрос", async () => {
            const user = createUser();
            render(<AuthForm />);

            await user.click(submitButton());

            expect(screen.getByText("Проверьте формат email и пароля")).toBeInTheDocument();
            expect(emailField()).toHaveAttribute("aria-invalid", "true");
            expect(passwordField()).toHaveAttribute("aria-invalid", "true");
            expect(useAuthStore.getState().status).toBe("idle");
        });

        it("пока идёт запрос, кнопка заблокирована и помечена как занятая", async () => {
            const user = createUser();
            render(<AuthForm />);
            await fillForm(user, CORRECT_EMAIL, CORRECT_PASSWORD);

            await user.click(submitButton());

            expect(submitButton()).toBeDisabled();
            expect(submitButton()).toHaveAttribute("aria-busy", "true");
            expect(useAuthStore.getState().status).toBe("loading");

            await finishRequest();
        });

        it("при неверных данных показывает ошибку и разблокирует кнопку", async () => {
            const user = createUser();
            render(<AuthForm />);
            await fillForm(user, "wrong@example.com", "Password123");

            await user.click(submitButton());
            await finishRequest();

            expect(screen.getByText("Неверный email или пароль")).toBeInTheDocument();
            expect(submitButton()).toBeEnabled();
            expect(useAuthStore.getState().user).toBeNull();
        });

        it("при верных данных сообщает об успехе и запоминает пользователя", async () => {
            const user = createUser();
            render(<AuthForm />);
            await fillForm(user, CORRECT_EMAIL, CORRECT_PASSWORD);

            await user.click(submitButton());
            await finishRequest();

            expect(screen.getByText("Вход выполнен!")).toBeInTheDocument();
            expect(useAuthStore.getState().status).toBe("success");
            expect(useAuthStore.getState().user).toEqual({ email: CORRECT_EMAIL });
        });

        it("форма отправляется и клавишей Enter", async () => {
            const user = createUser();
            render(<AuthForm />);
            await fillForm(user, CORRECT_EMAIL, CORRECT_PASSWORD);

            await user.type(passwordField(), "{Enter}");

            expect(useAuthStore.getState().status).toBe("loading");
            await finishRequest();
            expect(screen.getByText("Вход выполнен!")).toBeInTheDocument();
        });

        it("после исправления данных сообщение об ошибке формата исчезает", async () => {
            const user = createUser();
            render(<AuthForm />);
            await user.click(submitButton());
            expect(screen.getByText("Проверьте формат email и пароля")).toBeInTheDocument();

            await fillForm(user, CORRECT_EMAIL, CORRECT_PASSWORD);
            await user.click(submitButton());

            expect(screen.queryByText("Проверьте формат email и пароля")).not.toBeInTheDocument();

            await finishRequest();
        });
    });

    describe("запомнить пароль", () => {
        it("с отмеченным чекбоксом сохраняет пару после успешного входа", async () => {
            const user = createUser();
            render(<AuthForm />);
            await fillForm(user, CORRECT_EMAIL, CORRECT_PASSWORD);
            await user.click(rememberCheckbox());

            await user.click(submitButton());
            await finishRequest();

            expect(useAuthStore.getState().remembered).toEqual({
                email: CORRECT_EMAIL,
                password: CORRECT_PASSWORD,
            });
        });

        it("без отметки не сохраняет пару", async () => {
            const user = createUser();
            render(<AuthForm />);
            await fillForm(user, CORRECT_EMAIL, CORRECT_PASSWORD);

            await user.click(submitButton());
            await finishRequest();

            expect(useAuthStore.getState().remembered).toBeNull();
        });

        it("подставляет сохранённую пару в поля и сообщает об этом", () => {
            useAuthStore.setState({
                remembered: { email: CORRECT_EMAIL, password: CORRECT_PASSWORD },
            });

            render(<AuthForm />);

            expect(emailField()).toHaveValue(CORRECT_EMAIL);
            expect(passwordField()).toHaveValue(CORRECT_PASSWORD);
            expect(rememberCheckbox()).toBeChecked();
            expect(screen.getByText("Данные восстановлены")).toBeInTheDocument();
        });

        it("после отправки сообщение о восстановлении данных пропадает", async () => {
            const user = createUser();
            useAuthStore.setState({
                remembered: { email: CORRECT_EMAIL, password: CORRECT_PASSWORD },
            });
            render(<AuthForm />);

            await user.click(submitButton());

            expect(screen.queryByText("Данные восстановлены")).not.toBeInTheDocument();

            await finishRequest();
        });
    });
});
