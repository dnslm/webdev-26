import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoginCard } from "./LoginCard";

describe("LoginCard", () => {
    it("собирает вход через соцсети и форму входа", () => {
        render(<LoginCard />);

        expect(screen.getByRole("heading", { name: "Войти через соцсети" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Вход" })).toBeInTheDocument();
        expect(screen.getByLabelText("Электронная почта")).toBeInTheDocument();
        expect(screen.getByLabelText("Пароль")).toBeInTheDocument();
    });
});
