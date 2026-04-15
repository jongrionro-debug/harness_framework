import { createElement } from "react";
import { render, screen } from "@testing-library/react";

import { PlaceholderScreen } from "@/components/ui/shell";

describe("PlaceholderScreen", () => {
  it("renders the active route and next action copy", () => {
    render(
      createElement(PlaceholderScreen, {
        eyebrow: "Route scaffold",
        title: "Auth routes are ready",
        description: "This is a browser-safe shell component test.",
        activeRoute: "Auth",
        nextAction: "Wire the real auth forms in the next phase.",
      }),
    );

    expect(screen.getByText("Auth routes are ready")).toBeInTheDocument();
    expect(screen.getByText("Shared shell")).toBeInTheDocument();
    expect(
      screen.getByText("Wire the real auth forms in the next phase."),
    ).toBeInTheDocument();
  });
});
