import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import OfflinePage from "../../app/_offline/page";

describe("OfflinePage", () => {
  it("renders the offline heading", () => {
    const { container } = render(<OfflinePage />);
    expect(container.textContent).toContain("You are offline");
  });

  it("renders the connection message", () => {
    const { container } = render(<OfflinePage />);
    expect(container.textContent).toContain(
      "Please check your internet connection and try again.",
    );
  });
});
