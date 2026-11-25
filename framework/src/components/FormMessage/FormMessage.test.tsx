import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormMessage } from "./FormMessage";

describe("FormMessage", () => {
    it("всегда выводит абзац для скринридера (aria-live)", () => {
        const { container } = render(<FormMessage message={null} />);
        const paragraph = container.querySelector("p");

        expect(paragraph).toHaveAttribute("aria-live", "polite");
        expect(paragraph).toBeEmptyDOMElement();
    });

    it("показывает текст ошибки с классом error", () => {
        render(<FormMessage message={{ text: "Что-то пошло не так", type: "error" }} />);
        const message = screen.getByText("Что-то пошло не так");

        expect(message).toHaveClass("error");
        expect(message).not.toHaveClass("success");
    });

    it("показывает успешное сообщение с классом success", () => {
        render(<FormMessage message={{ text: "Готово", type: "success" }} />);
        const message = screen.getByText("Готово");

        expect(message).toHaveClass("success");
        expect(message).not.toHaveClass("error");
    });
});
