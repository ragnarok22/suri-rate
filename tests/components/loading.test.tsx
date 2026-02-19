import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "../../components/loading";

describe("Loading", () => {
  it("renders loading text", () => {
    render(<Loading />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });
});
