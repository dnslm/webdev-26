import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useField } from "./useField";

const isNotEmpty = (value: string): boolean => value !== "";

describe("useField", () => {
    it("начинает с переданного значения и нейтрального состояния", () => {
        const { result } = renderHook(() => useField(isNotEmpty, "abc"));

        expect(result.current.value).toBe("abc");
        expect(result.current.state).toBe("idle");
        expect(result.current.isShaking).toBe(false);
    });

    it("по умолчанию значение пустое", () => {
        const { result } = renderHook(() => useField(isNotEmpty));

        expect(result.current.value).toBe("");
    });

    it("setValue меняет значение", () => {
        const { result } = renderHook(() => useField(isNotEmpty));

        act(() => {
            result.current.setValue("новое");
        });

        expect(result.current.value).toBe("новое");
    });

    it("validate помечает верное значение как valid", () => {
        const { result } = renderHook(() => useField(isNotEmpty, "abc"));
        let isValid = false;

        act(() => {
            isValid = result.current.validate();
        });

        expect(isValid).toBe(true);
        expect(result.current.state).toBe("valid");
        expect(result.current.isShaking).toBe(false);
    });

    it("validate помечает неверное значение как invalid и включает тряску", () => {
        const { result } = renderHook(() => useField(isNotEmpty, ""));
        let isValid = true;

        act(() => {
            isValid = result.current.validate();
        });

        expect(isValid).toBe(false);
        expect(result.current.state).toBe("invalid");
        expect(result.current.isShaking).toBe(true);
    });

    it("stopShaking выключает тряску, но ошибка остаётся", () => {
        const { result } = renderHook(() => useField(isNotEmpty, ""));

        act(() => {
            result.current.validate();
        });
        act(() => {
            result.current.stopShaking();
        });

        expect(result.current.isShaking).toBe(false);
        expect(result.current.state).toBe("invalid");
    });

    it("после исправления значения повторная проверка снимает ошибку", () => {
        const { result } = renderHook(() => useField(isNotEmpty, ""));

        act(() => {
            result.current.validate();
        });
        act(() => {
            result.current.setValue("исправлено");
        });
        act(() => {
            result.current.validate();
        });

        expect(result.current.state).toBe("valid");
        expect(result.current.isShaking).toBe(false);
    });
});
