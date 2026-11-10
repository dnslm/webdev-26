import { describe, expect, it } from "vitest";

import { checkData, CORRECT_EMAIL, CORRECT_PASSWORD } from "./auth";

describe("checkData", () => {
    it("принимает верную пару email/пароль", () => {
        expect(checkData(CORRECT_EMAIL, CORRECT_PASSWORD)).toBe(true);
    });

    it("отклоняет неверный пароль", () => {
        expect(checkData(CORRECT_EMAIL, `${CORRECT_PASSWORD}x`)).toBe(false);
    });

    it("отклоняет неверный email", () => {
        expect(checkData(`x${CORRECT_EMAIL}`, CORRECT_PASSWORD)).toBe(false);
    });

    it("отклоняет пустые поля", () => {
        expect(checkData("", "")).toBe(false);
    });

    it("не принимает email и пароль, перепутанные местами", () => {
        expect(checkData(CORRECT_PASSWORD, CORRECT_EMAIL)).toBe(false);
    });
});
