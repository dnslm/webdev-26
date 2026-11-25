import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SubmitButton } from "./SubmitButton";

describe("SubmitButton", () => {
    it("показывает текст и отправляет форму", () => {
        render(<SubmitButton isLoading={false}>Войти</SubmitButton>);
        const button = screen.getByRole("button", { name: "Войти" });

        expect(button).toHaveAttribute("type", "submit");
        expect(button).toBeEnabled();
        expect(button).toHaveAttribute("aria-busy", "false");
        expect(button).not.toHaveClass("loading");
    });

    it("во время загрузки заблокирована и помечена как занятая", () => {
        render(<SubmitButton isLoading>Войти</SubmitButton>);
        const button = screen.getByRole("button", { name: "Войти" });

        expect(button).toBeDisabled();
        expect(button).toHaveAttribute("aria-busy", "true");
        expect(button).toHaveClass("loading");
    });
});
