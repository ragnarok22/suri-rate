import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import OfflinePage from "../../app/_offline/page";

describe("OfflinePage", () => {
  it("renders the offline heading", () => {
    render(<OfflinePage />);
    expect(screen.getByText("You are offline")).toBeTruthy();
  });

  it("renders the connection message", () => {
    render(<OfflinePage />);
    expect(
      screen.getByText("Please check your internet connection and try again."),
    ).toBeTruthy();
  });
});
