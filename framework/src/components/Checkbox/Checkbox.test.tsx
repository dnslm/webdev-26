import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
    it("показывает подпись и снятый флажок", () => {
        render(
            <Checkbox id="remember" label="Запомнить пароль?" checked={false} onChange={vi.fn()} />,
        );

        expect(screen.getByRole("checkbox", { name: "Запомнить пароль?" })).not.toBeChecked();
    });

    it("показывает отмеченный флажок", () => {
        render(<Checkbox id="remember" label="Запомнить пароль?" checked onChange={vi.fn()} />);

        expect(screen.getByRole("checkbox", { name: "Запомнить пароль?" })).toBeChecked();
    });

    it("сообщает true при отметке флажка", async () => {
        const onChange = vi.fn();
        const user = userEvent.setup();
        render(
            <Checkbox
                id="remember"
                label="Запомнить пароль?"
                checked={false}
                onChange={onChange}
            />,
        );

        await user.click(screen.getByRole("checkbox", { name: "Запомнить пароль?" }));

        expect(onChange).toHaveBeenCalledWith(true);
    });

    it("сообщает false при снятии отметки", async () => {
        const onChange = vi.fn();
        const user = userEvent.setup();
        render(<Checkbox id="remember" label="Запомнить пароль?" checked onChange={onChange} />);

        await user.click(screen.getByRole("checkbox", { name: "Запомнить пароль?" }));

        expect(onChange).toHaveBeenCalledWith(false);
    });

    it("переключается и по клику на текст подписи", async () => {
        const onChange = vi.fn();
        const user = userEvent.setup();
        render(
            <Checkbox
                id="remember"
                label="Запомнить пароль?"
                checked={false}
                onChange={onChange}
            />,
        );

        await user.click(screen.getByText("Запомнить пароль?"));

        expect(onChange).toHaveBeenCalledWith(true);
    });
});
