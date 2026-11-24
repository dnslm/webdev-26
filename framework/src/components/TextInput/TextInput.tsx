import { classNames } from "../../lib/classNames";
import type { FieldState } from "../../types";
import styles from "./TextInput.module.css";

interface TextInputProps {
    id: string;
    type: "email" | "password" | "text";
    // подпись скрыта визуально, но нужна скринридеру: placeholder её не заменяет
    label: string;
    placeholder: string;
    autoComplete: string;
    value: string;
    state: FieldState;
    isShaking: boolean;
    minLength?: number;
    onChange: (value: string) => void;
    onBlur: () => void;
    onShakeEnd: () => void;
}

export function TextInput({
    id,
    type,
    label,
    placeholder,
    autoComplete,
    value,
    state,
    isShaking,
    minLength,
    onChange,
    onBlur,
    onShakeEnd,
}: TextInputProps) {
    return (
        <div className={styles["field"]}>
            <label htmlFor={id} className="visually-hidden">
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                className={classNames(
                    styles["input"],
                    state === "valid" && styles["valid"],
                    state === "invalid" && styles["invalid"],
                    isShaking && styles["shake"],
                )}
                placeholder={placeholder}
                autoComplete={autoComplete}
                value={value}
                minLength={minLength}
                required
                aria-required="true"
                aria-invalid={state === "invalid"}
                onChange={(event) => {
                    onChange(event.target.value);
                }}
                onBlur={onBlur}
                onAnimationEnd={onShakeEnd}
            />
        </div>
    );
}
