import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { render, screen, fireEvent, act } from "@testing-library/react";

const setThemeMock = vi.fn();
let mockTheme: string | undefined = "light";

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: mockTheme, setTheme: setThemeMock }),
}));

vi.mock("lucide-react", () => ({
  Moon: () => React.createElement("span", { "data-testid": "moon-icon" }),
  Sun: () => React.createElement("span", { "data-testid": "sun-icon" }),
}));

import { ThemeToggle } from "../../components/theme-toggle";

describe("ThemeToggle", () => {
  it("enables the toggle on the first client-only commit", () => {
    mockTheme = "light";
    const disabledOnCommit: boolean[] = [];

    render(
      <React.Profiler
        id="theme-toggle"
        onRender={() => {
          const button = screen.getByRole("button") as HTMLButtonElement;
          disabledOnCommit.push(button.disabled);
        }}
      >
        <ThemeToggle />
      </React.Profiler>,
    );

    expect(disabledOnCommit).toEqual([false]);
  });

  it.each(["light", "dark"])(
    "hydrates the server placeholder with the %s theme without a mismatch",
    (theme) => {
      mockTheme = undefined;
      const container = document.createElement("div");
      container.innerHTML = renderToString(<ThemeToggle />);
      document.body.appendChild(container);

      const serverButton = container.querySelector("button");
      expect(serverButton?.disabled).toBe(true);
      expect(
        container.querySelector('[data-testid="sun-icon"]'),
      ).not.toBeNull();

      mockTheme = theme;
      const onRecoverableError = vi.fn();
      render(<ThemeToggle />, {
        container,
        hydrate: true,
        onRecoverableError,
      });

      const button = screen.getByRole("button") as HTMLButtonElement;
      expect(button).toBe(serverButton);
      expect(button.disabled).toBe(false);
      expect(
        screen.getByTestId(theme === "dark" ? "sun-icon" : "moon-icon"),
      ).toBeTruthy();
      expect(onRecoverableError).not.toHaveBeenCalled();

      fireEvent.click(button);
      expect(setThemeMock).toHaveBeenLastCalledWith(
        theme === "dark" ? "light" : "dark",
      );
    },
  );

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
