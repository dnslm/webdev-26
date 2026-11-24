import { useState } from "react";

import type { FieldState } from "../types";

export interface Field {
    value: string;
    setValue: (value: string) => void;
    state: FieldState;
    // идёт ли сейчас анимация «тряски» поля
    isShaking: boolean;
    // проверяет текущее значение и обновляет состояние; возвращает результат проверки
    validate: () => boolean;
    stopShaking: () => void;
}

// всё, что нужно одному полю формы: значение, состояние проверки и тряска
export function useField(validator: (value: string) => boolean, initialValue = ""): Field {
    const [value, setValue] = useState(initialValue);
    const [state, setState] = useState<FieldState>("idle");
    const [isShaking, setIsShaking] = useState(false);

    const validate = (): boolean => {
        const isValid = validator(value);
        setState(isValid ? "valid" : "invalid");
        // тряска включается при ошибке и выключается по окончании анимации,
        // поэтому при следующей ошибке она запускается заново
        setIsShaking(!isValid);
        return isValid;
    };

    const stopShaking = (): void => {
        setIsShaking(false);
    };

    return { value, setValue, state, isShaking, validate, stopShaking };
}
