import { useEffect, useRef } from "react";

// вызывает onMatch, когда на странице набрана последовательность клавиш code
// клавиши сравниваются по физическому коду (KeyB и т.д.), поэтому раскладка не важна
export function useSecretCode(code: readonly string[], onMatch: () => void): void {
    const progress = useRef(0);

    // всегда вызываем актуальную версию колбэка, не пересоздавая слушатель
    const latestOnMatch = useRef(onMatch);
    useEffect(() => {
        latestOnMatch.current = onMatch;
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // не срабатываем, пока пользователь печатает в поле формы
            if (event.target instanceof Element && event.target.matches("input, textarea")) return;

            if (event.code === code[progress.current]) {
                progress.current += 1;

                if (progress.current === code.length) {
                    progress.current = 0;
                    latestOnMatch.current();
                }
            } else {
                // если нажата не та клавиша, но это начало кода, считаем её первой
                progress.current = event.code === code[0] ? 1 : 0;
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [code]);
}
