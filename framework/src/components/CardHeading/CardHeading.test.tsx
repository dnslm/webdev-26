import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CardHeading } from "./CardHeading";

describe("CardHeading", () => {
    it("выводит заголовок второго уровня", () => {
        render(<CardHeading>Вход</CardHeading>);

        expect(screen.getByRole("heading", { level: 2, name: "Вход" })).toBeInTheDocument();
    });

    it("передаёт id, если он задан", () => {
        render(<CardHeading id="my-heading">Вход</CardHeading>);

        expect(screen.getByRole("heading", { name: "Вход" })).toHaveAttribute("id", "my-heading");
    });

    it("не добавляет id, если он не задан", () => {
        render(<CardHeading>Вход</CardHeading>);

        expect(screen.getByRole("heading", { name: "Вход" })).not.toHaveAttribute("id");
    });
});
