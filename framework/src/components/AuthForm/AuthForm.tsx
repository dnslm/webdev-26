import { useState, type SyntheticEvent } from "react";

import { useField } from "../../hooks/useField";
import { isValidEmail, isValidPassword } from "../../lib/validation";
import { useAuthStore, type AuthStatus } from "../../store/authStore";
import type { Message } from "../../types";
import { CardHeading } from "../CardHeading/CardHeading";
import { Checkbox } from "../Checkbox/Checkbox";
import { FormMessage } from "../FormMessage/FormMessage";
import { SubmitButton } from "../SubmitButton/SubmitButton";
import { TextInput } from "../TextInput/TextInput";
import styles from "./AuthForm.module.css";

// email проверяем без пробелов по краям, как в версии без фреймворка
const validateEmail = (value: string): boolean => isValidEmail(value.trim());

// какое сообщение показать под полями: оно выводится из состояния, хранить его отдельно не нужно
function getMessage(
    status: AuthStatus,
    hasFormatError: boolean,
    showRestored: boolean,
): Message | null {
    if (hasFormatError) {
        return { text: "Проверьте формат email и пароля", type: "error" };
    }
    if (status === "success") {
        return { text: "Вход выполнен!", type: "success" };
    }
    if (status === "error") {
        return { text: "Неверный email или пароль", type: "error" };
    }
    if (status === "idle" && showRestored) {
        return { text: "Данные восстановлены", type: "success" };
    }
    return null;
}

export function AuthForm() {
    const status = useAuthStore((state) => state.status);
    const login = useAuthStore((state) => state.login);

    // сохранённая пара нужна только для начальных значений, поэтому читаем её один раз
    const [remembered] = useState(() => useAuthStore.getState().remembered);

    const email = useField(validateEmail, remembered?.email ?? "");
    const password = useField(isValidPassword, remembered?.password ?? "");
    const [remember, setRemember] = useState(remembered !== null);
    const [hasFormatError, setHasFormatError] = useState(false);
    const [showRestored, setShowRestored] = useState(remembered !== null);

    const isLoading = status === "loading";

    const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Enter в поле может отправить форму, даже когда кнопка уже заблокирована
        if (isLoading) return;

        setShowRestored(false);

        const isEmailValid = email.validate();
        const isPasswordValid = password.validate();

        if (!isEmailValid || !isPasswordValid) {
            setHasFormatError(true);
            return;
        }

        setHasFormatError(false);
        void login({ email: email.value.trim(), password: password.value }, remember);
    };

    return (
        <form className={styles["form"]} onSubmit={handleSubmit} noValidate>
            <CardHeading>Вход</CardHeading>

            <TextInput
                id="email"
                type="email"
                label="Электронная почта"
                placeholder="Электронная почта"
                autoComplete="email"
                value={email.value}
                state={email.state}
                isShaking={email.isShaking}
                onChange={email.setValue}
                onBlur={() => {
                    email.validate();
                }}
                onShakeEnd={email.stopShaking}
            />

            <TextInput
                id="password"
                type="password"
                label="Пароль"
                placeholder="Пароль"
                autoComplete="current-password"
                minLength={8}
                value={password.value}
                state={password.state}
                isShaking={password.isShaking}
                onChange={password.setValue}
                onBlur={() => {
                    password.validate();
                }}
                onShakeEnd={password.stopShaking}
            />

            <FormMessage message={getMessage(status, hasFormatError, showRestored)} />

            <div className={styles["row"]}>
                <Checkbox
                    id="remember"
                    label="Запомнить пароль?"
                    checked={remember}
                    onChange={setRemember}
                />
                <SubmitButton isLoading={isLoading}>Войти</SubmitButton>
            </div>
        </form>
    );
}
