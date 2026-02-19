import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../../components/ui/table";

describe("Badge", () => {
  it("renders with default variant", () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText("Default")).toBeTruthy();
  });

  it("renders with outline variant", () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText("Outline");
    expect(badge.className).toContain("border");
  });

  it("renders with secondary variant", () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText("Secondary")).toBeTruthy();
  });

  it("renders with destructive variant", () => {
    render(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText("Destructive")).toBeTruthy();
  });

  it("accepts custom className", () => {
    render(<Badge className="custom-class">Test</Badge>);
    expect(screen.getByText("Test").className).toContain("custom-class");
  });
});

describe("Button", () => {
  it("renders with default variant and size", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByText("Click me");
    expect(btn.tagName).toBe("BUTTON");
  });

  it("renders all variants", () => {
    const variants = [
      "default",
      "destructive",
      "outline",
      "secondary",
      "ghost",
      "link",
    ] as const;
    for (const variant of variants) {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByText(variant)).toBeTruthy();
      unmount();
    }
  });

  it("renders all sizes", () => {
    const sizes = ["default", "sm", "lg", "icon"] as const;
    for (const size of sizes) {
      const { unmount } = render(<Button size={size}>btn</Button>);
      unmount();
    }
  });

  it("passes disabled prop", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByText("Disabled") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});

describe("Card components", () => {
  it("renders Card with children", () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card").textContent).toBe("Content");
  });

  it("renders CardHeader", () => {
    render(<CardHeader data-testid="header">HeaderText</CardHeader>);
    expect(screen.getByTestId("header").textContent).toBe("HeaderText");
  });

  it("renders CardContent", () => {
    render(<CardContent data-testid="content">Body</CardContent>);
    expect(screen.getByTestId("content").textContent).toBe("Body");
  });

  it("renders CardFooter", () => {
    render(<CardFooter data-testid="footer">FooterText</CardFooter>);
    expect(screen.getByTestId("footer").textContent).toBe("FooterText");
  });

  it("renders CardTitle", () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText("Title").tagName).toBe("H3");
  });

  it("renders CardDescription", () => {
    render(<CardDescription>Desc</CardDescription>);
    expect(screen.getByText("Desc").tagName).toBe("P");
  });
});

describe("Table components", () => {
  it("renders a full table structure", () => {
    const { container } = render(
      <Table data-testid="table">
        <TableCaption>MyCaption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Col1</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Data1</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Foot1</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(screen.getByText("MyCaption")).toBeTruthy();
    expect(screen.getByText("Col1")).toBeTruthy();
    expect(screen.getByText("Data1")).toBeTruthy();
    expect(screen.getByText("Foot1")).toBeTruthy();
    expect(container.querySelector("table")).toBeTruthy();
    expect(container.querySelector("thead")).toBeTruthy();
    expect(container.querySelector("tbody")).toBeTruthy();
    expect(container.querySelector("tfoot")).toBeTruthy();
  });
});
