import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

const setThemeMock = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: setThemeMock }),
}));

vi.mock("lucide-react", () => ({
  Moon: () => React.createElement("span", { "data-testid": "moon-icon" }),
  Sun: () => React.createElement("span", { "data-testid": "sun-icon" }),
}));

import { ThemeToggle } from "../../components/theme-toggle";

describe("ThemeToggle", () => {
  it("renders a button with sr-only label", () => {
    render(<ThemeToggle />);
    expect(screen.getByText("Toggle theme")).toBeTruthy();
  });

  it("shows moon icon when theme is light (after mount)", () => {
    render(<ThemeToggle />);
    // After the useEffect sets mounted=true, should show Moon for light theme
    expect(screen.getByTestId("moon-icon")).toBeTruthy();
  });

  it("toggles theme on click", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });
});
