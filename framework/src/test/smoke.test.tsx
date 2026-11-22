// тестовый тест для теста работы тестов
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

it("renders text and jest-dom matchers work", () => {
    render(<p>вацап</p>);
    expect(screen.getByText("вацап")).toBeInTheDocument();
});
