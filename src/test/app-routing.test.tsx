import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";

describe("App routing", () => {
  it("renders the home page for /", () => {
    render(<App />);
    expect(screen.getAllByText(/kiwi/i).length).toBeGreaterThan(0);
  });

  it("renders a localized page for /:lang/*", () => {
    window.history.pushState({}, "", "/ro/catalog");
    render(<App />);
    expect(screen.getAllByText("Catalog").length).toBeGreaterThan(0);
  });
});
