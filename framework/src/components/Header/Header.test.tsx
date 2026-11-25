import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Header } from "./Header";

describe("Header", () => {
    it("показывает логотип с описанием", () => {
        render(<Header />);

        expect(screen.getByAltText("Логотип")).toBeInTheDocument();
    });

    it("логотип ведёт на главную страницу", () => {
        render(<Header />);

        expect(screen.getByRole("link", { name: "На главную" })).toHaveAttribute("href", "/");
    });
});
