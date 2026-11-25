import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockMatchMedia } from "../../test/mockMatchMedia";
import { Confetti } from "./Confetti";

describe("Confetti", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("рисует 60 кусочков", () => {
        const { container } = render(<Confetti />);

        expect(container.querySelectorAll("span")).toHaveLength(60);
    });

    it("берёт случайные значения в тех же диапазонах, что в native-версии", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);

        const { container } = render(<Confetti />);
        const firstPiece = container.querySelector<HTMLElement>("span");

        expect(firstPiece?.style.left).toBe("50vw");
        expect(firstPiece?.style.animationDuration).toBe("2.25s");
        expect(firstPiece?.style.animationDelay).toBe("0.15s");
    });

    it("скрыто от скринридеров", () => {
        const { container } = render(<Confetti />);

        expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    });

    it("убирает себя из страницы через несколько секунд", () => {
        const { container } = render(<Confetti />);

        act(() => {
            vi.advanceTimersByTime(3500);
        });

        expect(container).toBeEmptyDOMElement();
    });

    it("ничего не рисует в режиме «уменьшить анимацию»", () => {
        mockMatchMedia(true);

        const { container } = render(<Confetti />);

        expect(container).toBeEmptyDOMElement();
    });
});
