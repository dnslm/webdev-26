import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockMatchMedia } from "../test/mockMatchMedia";
import { useReducedMotion } from "./useReducedMotion";

describe("useReducedMotion", () => {
    it("возвращает false, если пользователь не просил уменьшить анимацию", () => {
        mockMatchMedia(false);

        const { result } = renderHook(() => useReducedMotion());

        expect(result.current).toBe(false);
    });

    it("возвращает true, если режим включён", () => {
        mockMatchMedia(true);

        const { result } = renderHook(() => useReducedMotion());

        expect(result.current).toBe(true);
    });

    it("реагирует на изменение настройки во время работы", () => {
        const media = mockMatchMedia(false);
        const { result } = renderHook(() => useReducedMotion());

        act(() => {
            media.setMatches(true);
        });

        expect(result.current).toBe(true);
    });
});
