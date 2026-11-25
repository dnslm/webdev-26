import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FooterLink } from "./FooterLink";

describe("FooterLink", () => {
    it("внешняя ссылка открывается в новой вкладке и защищена", () => {
        render(
            <FooterLink
                href="https://github.com/example"
                icon="/icon.svg"
                label="GitHub"
                external
            />,
        );
        const link = screen.getByRole("link", { name: "GitHub" });

        expect(link).toHaveAttribute("href", "https://github.com/example");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("обычная ссылка не открывается в новой вкладке", () => {
        render(<FooterLink href="mailto:user@example.com" icon="/icon.svg" label="Почта" />);
        const link = screen.getByRole("link", { name: "Почта" });

        expect(link).toHaveAttribute("href", "mailto:user@example.com");
        expect(link).not.toHaveAttribute("target");
        expect(link).not.toHaveAttribute("rel");
    });

    it("иконка декоративная: у неё пустой alt", () => {
        const { container } = render(<FooterLink href="/" icon="/icon.svg" label="Главная" />);
        const icon = container.querySelector("img");

        expect(icon).toHaveAttribute("alt", "");
        expect(icon).toHaveAttribute("src", "/icon.svg");
    });
});
