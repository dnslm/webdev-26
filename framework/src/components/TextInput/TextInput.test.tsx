import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { FieldState } from "../../types";
import { TextInput } from "./TextInput";

function createProps() {
    return {
        id: "email",
        type: "email" as const,
        label: "Электронная почта",
        placeholder: "Введите почту",
        autoComplete: "email",
        value: "",
        state: "idle" as FieldState,
        isShaking: false,
        onChange: vi.fn(),
        onBlur: vi.fn(),
        onShakeEnd: vi.fn(),
    };
}

describe("TextInput", () => {
    it("связывает скрытую подпись с полем", () => {
        const props = createProps();
        render(<TextInput {...props} />);

        const input = screen.getByLabelText(props.label);

        expect(input).toHaveAttribute("id", "email");
        expect(input).toHaveAttribute("type", "email");
        expect(input).toHaveAttribute("placeholder", props.placeholder);
        expect(input).toHaveAttribute("autocomplete", "email");
        expect(input).toBeRequired();
    });

    it("показывает переданное значение", () => {
        const props = { ...createProps(), value: "test@email.com" };
        render(<TextInput {...props} />);

        expect(screen.getByLabelText(props.label)).toHaveValue("test@email.com");
    });

    it("передаёт минимальную длину, если она задана", () => {
        render(<TextInput {...createProps()} minLength={8} />);

        expect(screen.getByLabelText("Электронная почта")).toHaveAttribute("minlength", "8");
    });

    it("сообщает введённый текст через onChange", async () => {
        const props = createProps();
        const user = userEvent.setup();
        render(<TextInput {...props} />);

        await user.type(screen.getByLabelText(props.label), "x");

        expect(props.onChange).toHaveBeenCalledWith("x");
    });

    it("вызывает onBlur, когда фокус уходит с поля", async () => {
        const props = createProps();
        const user = userEvent.setup();
        render(<TextInput {...props} />);

        await user.click(screen.getByLabelText(props.label));
        await user.tab();

        expect(props.onBlur).toHaveBeenCalledTimes(1);
    });

    it("в обычном состоянии не помечено как ошибочное", () => {
        render(<TextInput {...createProps()} />);
        const input = screen.getByLabelText("Электронная почта");

        expect(input).toHaveAttribute("aria-invalid", "false");
        expect(input).not.toHaveClass("valid");
        expect(input).not.toHaveClass("invalid");
    });

    it("в состоянии invalid помечено как ошибочное", () => {
        render(<TextInput {...createProps()} state="invalid" />);
        const input = screen.getByLabelText("Электронная почта");

        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveClass("invalid");
    });

    it("в состоянии valid получает класс valid", () => {
        render(<TextInput {...createProps()} state="valid" />);
        const input = screen.getByLabelText("Электронная почта");

        expect(input).toHaveAttribute("aria-invalid", "false");
        expect(input).toHaveClass("valid");
    });

    it("трясётся только пока включён isShaking", () => {
        const { rerender } = render(<TextInput {...createProps()} isShaking />);
        expect(screen.getByLabelText("Электронная почта")).toHaveClass("shake");

        rerender(<TextInput {...createProps()} isShaking={false} />);
        expect(screen.getByLabelText("Электронная почта")).not.toHaveClass("shake");
    });

    it("сообщает об окончании анимации через onShakeEnd", () => {
        const props = createProps();
        render(<TextInput {...props} isShaking />);

        fireEvent.animationEnd(screen.getByLabelText(props.label));

        expect(props.onShakeEnd).toHaveBeenCalledTimes(1);
    });
});
