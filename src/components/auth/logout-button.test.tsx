import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { LogoutButton } from "@/components/auth/logout-button";

const replace = vi.fn();
const refresh = vi.fn();
const signOut = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
    refresh,
  }),
}));

vi.mock("@/lib/auth/supabase-browser", () => ({
  getSupabaseBrowserClient: () => ({
    auth: {
      signOut,
    },
  }),
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    replace.mockReset();
    refresh.mockReset();
    signOut.mockReset();
  });

  it("signs the user out and redirects to login", async () => {
    signOut.mockResolvedValue({ error: null });

    render(<LogoutButton email="teacher@example.com" />);

    fireEvent.click(screen.getByRole("button", { name: "로그아웃" }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
      expect(replace).toHaveBeenCalledWith("/login");
      expect(refresh).toHaveBeenCalledTimes(1);
    });
  });

  it("renders sign-out errors for the current user", async () => {
    signOut.mockResolvedValue({
      error: {
        message: "세션 정리에 실패했습니다.",
      },
    });

    render(<LogoutButton email="teacher@example.com" />);

    fireEvent.click(screen.getByRole("button", { name: "로그아웃" }));

    expect(
      await screen.findByText("세션 정리에 실패했습니다."),
    ).toBeInTheDocument();
  });
});
