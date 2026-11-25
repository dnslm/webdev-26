import { describe, expect, it } from "vitest";

import { classNames } from "./classNames";

describe("classNames", () => {
    it("склеивает имена через пробел", () => {
        expect(classNames("a", "b")).toBe("a b");
    });

    it("пропускает пустые значения", () => {
        expect(classNames("a", false, null, undefined, "", "b")).toBe("a b");
    });

    it("возвращает пустую строку, если имён нет", () => {
        expect(classNames()).toBe("");
        expect(classNames(false, undefined)).toBe("");
    });
});
