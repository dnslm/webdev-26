import { useState, type SyntheticEvent } from "react";

import { useField } from "../../hooks/useField";
import { isValidEmail, isValidPassword } from "../../lib/validation";
import { useAuthStore, type AuthStatus } from "../../store/authStore";
import { useEffectsStore } from "../../store/effectsStore";
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
// пасхалка идёт первой: она появляется в момент ввода слова и, как в native,
// перекрывает предыдущее сообщение до следующего действия с формой
function getMessage(
    status: AuthStatus,
    hasFormatError: boolean,
    showRestored: boolean,
    easterEggMessage: string | null,
): Message | null {
    if (easterEggMessage) {
        return { text: easterEggMessage, type: "success" };
    }
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
    const easterEggMessage = useEffectsStore((state) => state.easterEggMessage);
    const clearEasterEgg = useEffectsStore((state) => state.clearEasterEgg);

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

        // пасхалка — сообщение на один раз: при следующем действии с формой убираем его
        clearEasterEgg();
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

            <FormMessage
                message={getMessage(status, hasFormatError, showRestored, easterEggMessage)}
            />

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
