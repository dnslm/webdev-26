import { fireEvent, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSecretCode } from "./useSecretCode";

const CODE = ["KeyB", "KeyE", "KeyB", "KeyR", "KeyA"];

// нажимает клавиши по очереди (по физическому коду) на указанном элементе
function press(codes: string[], target: Element = document.body): void {
    for (const code of codes) {
        fireEvent.keyDown(target, { code });
    }
}

describe("useSecretCode", () => {
    it("вызывает функцию, когда набран весь код", () => {
        const onMatch = vi.fn();
        renderHook(() => {
            useSecretCode(CODE, onMatch);
        });

        press(CODE);

        expect(onMatch).toHaveBeenCalledTimes(1);
    });

    it("не вызывает функцию, пока код набран не до конца", () => {
        const onMatch = vi.fn();
        renderHook(() => {
            useSecretCode(CODE, onMatch);
        });

        press(CODE.slice(0, 4));

        expect(onMatch).not.toHaveBeenCalled();
    });

    it("сбрасывает набранное, если нажата неверная клавиша", () => {
        const onMatch = vi.fn();
        renderHook(() => {
            useSecretCode(CODE, onMatch);
        });

        press(["KeyB", "KeyE", "KeyX", "KeyR", "KeyA"]);

        expect(onMatch).not.toHaveBeenCalled();
    });

    it("считает лишнюю первую клавишу началом кода", () => {
        const onMatch = vi.fn();
        renderHook(() => {
            useSecretCode(CODE, onMatch);
        });

        press(["KeyB", ...CODE]);

        expect(onMatch).toHaveBeenCalledTimes(1);
    });

    it("срабатывает при каждом новом вводе кода", () => {
        const onMatch = vi.fn();
        renderHook(() => {
            useSecretCode(CODE, onMatch);
        });

        press(CODE);
        press(CODE);

        expect(onMatch).toHaveBeenCalledTimes(2);
    });

    it("игнорирует клавиши, нажатые в поле ввода", () => {
        const onMatch = vi.fn();
        renderHook(() => {
            useSecretCode(CODE, onMatch);
        });
        const input = document.createElement("input");
        document.body.appendChild(input);

        press(CODE, input);

        expect(onMatch).not.toHaveBeenCalled();
        input.remove();
    });

    it("перестаёт слушать клавиши после размонтирования", () => {
        const onMatch = vi.fn();
        const { unmount } = renderHook(() => {
            useSecretCode(CODE, onMatch);
        });

        unmount();
        press(CODE);

        expect(onMatch).not.toHaveBeenCalled();
    });

    it("вызывает актуальную версию функции после перерисовки", () => {
        const first = vi.fn();
        const second = vi.fn();
        const { rerender } = renderHook(
            ({ callback }) => {
                useSecretCode(CODE, callback);
            },
            { initialProps: { callback: first } },
        );

        rerender({ callback: second });
        press(CODE);

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledTimes(1);
    });
});
