import { describe, expect, it } from "vitest";

import { toCss } from "./toCss";

describe("toCss", () => {
    it("добавляет единицу измерения и два знака после запятой", () => {
        expect(toCss(37.5, "vw")).toBe("37.50vw");
        expect(toCss(1.5, "s")).toBe("1.50s");
    });

    it("округляет длинные дроби", () => {
        expect(toCss(10.126, "px")).toBe("10.13px");
    });

    it("работает с нулём и отрицательными числами", () => {
        expect(toCss(0, "s")).toBe("0.00s");
        expect(toCss(-3, "s")).toBe("-3.00s");
    });
});
