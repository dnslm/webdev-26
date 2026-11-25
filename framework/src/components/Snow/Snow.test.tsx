import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockMatchMedia } from "../../test/mockMatchMedia";
import { Snow } from "./Snow";

describe("Snow", () => {
    it("рисует 40 снежинок", () => {
        render(<Snow />);

        expect(screen.getAllByText("❄")).toHaveLength(40);
    });

    it("скрыт от скринридеров", () => {
        const { container } = render(<Snow />);

        expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    });

    it("ничего не рисует в режиме «уменьшить анимацию»", () => {
        mockMatchMedia(true);

        const { container } = render(<Snow />);

        expect(container).toBeEmptyDOMElement();
    });
});
