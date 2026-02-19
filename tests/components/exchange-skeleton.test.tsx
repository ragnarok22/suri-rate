import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import ExchangeSkeleton from "../../components/exchange-skeleton";

describe("ExchangeSkeleton", () => {
  it("renders skeleton cards", () => {
    const { container } = render(<ExchangeSkeleton />);
    // Should render 2 skeleton cards
    const cards = container.querySelectorAll(".animate-pulse");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("shows USD and EUR labels", () => {
    render(<ExchangeSkeleton />);
    expect(screen.getAllByText("USD")).toHaveLength(2);
    expect(screen.getAllByText("EUR")).toHaveLength(2);
  });

  it("shows Buy Rate and Sell Rate labels", () => {
    render(<ExchangeSkeleton />);
    expect(screen.getAllByText("Buy Rate:")).toHaveLength(4);
    expect(screen.getAllByText("Sell Rate:")).toHaveLength(4);
  });
});
