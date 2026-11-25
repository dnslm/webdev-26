import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SocialLogin } from "./SocialLogin";


// socialbutton косвенно тестится тут, всё норм)
describe("SocialLogin", () => {
    it("раздел подписан своим заголовком", () => {
        render(<SocialLogin />);

        expect(screen.getByRole("region", { name: "Войти через соцсети" })).toBeInTheDocument();
    });

    it("содержит кнопки входа через Google и Apple", () => {
        render(<SocialLogin />);
        const section = screen.getByRole("region", { name: "Войти через соцсети" });

        expect(within(section).getAllByRole("button")).toHaveLength(2);
        expect(screen.getByRole("button", { name: "Войти с помощью Google" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Войти с помощью Apple" })).toBeInTheDocument();
    });

    it("кнопки не отправляют форму", () => {
        render(<SocialLogin />);

        expect(screen.getByRole("button", { name: "Войти с помощью Google" })).toHaveAttribute(
            "type",
            "button",
        );
    });
});
