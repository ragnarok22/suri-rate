import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";

const setThemeMock = vi.fn();
let mockTheme = "light";

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: mockTheme, setTheme: setThemeMock }),
}));

vi.mock("lucide-react", () => ({
  Moon: () => React.createElement("span", { "data-testid": "moon-icon" }),
  Sun: () => React.createElement("span", { "data-testid": "sun-icon" }),
}));

import { ThemeToggle } from "../../components/theme-toggle";

describe("ThemeToggle", () => {
  it("renders a button", async () => {
    await act(async () => {
      render(<ThemeToggle />);
    });
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("shows moon icon when theme is light", async () => {
    mockTheme = "light";
    await act(async () => {
      render(<ThemeToggle />);
    });
    expect(screen.getByTestId("moon-icon")).toBeTruthy();
  });

  it("toggles theme on click", async () => {
    mockTheme = "light";
    await act(async () => {
      render(<ThemeToggle />);
    });
    fireEvent.click(screen.getByRole("button"));
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });
});
