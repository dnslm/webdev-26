import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "./Footer";

describe("Footer", () => {
    it("содержит бегущую строку с авторским текстом", () => {
        render(<Footer />);

        expect(
            screen.getAllByText("Official denchiee © Licensed Product 2026").length,
        ).toBeGreaterThan(0);
    });

    it("содержит навигацию контакты с тремя ссылками", () => {
        render(<Footer />);
        const nav = screen.getByRole("navigation", { name: "Контакты" });

        expect(within(nav).getAllByRole("link")).toHaveLength(3);
        expect(within(nav).getByRole("link", { name: "GitHub" })).toBeInTheDocument();
        expect(within(nav).getByRole("link", { name: "Telegram" })).toBeInTheDocument();
        expect(within(nav).getByRole("link", { name: "Яндекс Почта" })).toBeInTheDocument();
    });

    it("внешние ссылки открываются в новой вкладке, а почта нет", () => {
        render(<Footer />);

        expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("target", "_blank");
        expect(screen.getByRole("link", { name: "Telegram" })).toHaveAttribute("target", "_blank");
        expect(screen.getByRole("link", { name: "Яндекс Почта" })).not.toHaveAttribute("target");
        expect(screen.getByRole("link", { name: "Яндекс Почта" })).toHaveAttribute(
            "href",
            expect.stringMatching(/^mailto:/),
        );
    });
});
