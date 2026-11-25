import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Ticker } from "./Ticker";

describe("Ticker", () => {
    it("повторяет фразу 8 раз в скрытой от скринридера дорожке", () => {
        const { container } = render(<Ticker text="Бегущая строка" />);

        expect(container.querySelectorAll("[aria-hidden='true'] span")).toHaveLength(8);
    });

    it("для скринридера фраза есть один раз, вне скрытой дорожки", () => {
        const { container } = render(<Ticker text="Бегущая строка" />);
        const readable = container.querySelector("p");

        expect(readable).toHaveTextContent("Бегущая строка");
        expect(readable?.closest("[aria-hidden='true']")).toBeNull();
    });

    it("всего текст встречается в разметке 9 раз", () => {
        render(<Ticker text="Бегущая строка" />);

        expect(screen.getAllByText("Бегущая строка")).toHaveLength(9);
    });
});
