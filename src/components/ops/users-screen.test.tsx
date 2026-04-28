import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { UsersScreen } from "@/components/ops/users-screen";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/server/actions/memberships", () => ({
  approveMemberAction: vi.fn(),
  assignTeacherAction: vi.fn(),
  createInviteAction: vi.fn(),
  updateMemberRoleAction: vi.fn(),
}));

describe("UsersScreen", () => {
  const writeText = vi.fn();

  beforeEach(() => {
    writeText.mockReset();
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText,
      },
    });
  });

  it("shows a dashboard back link and the full invite token with copy support", () => {
    const inviteToken = "invite-token-for-local-first-operators-1234567890";

    render(
      <UsersScreen
        data={{
          members: [
            {
              membershipId: "membership-1",
              userId: "user-1",
              email: "teacher@example.com",
              displayName: "김강사",
              role: "teacher",
              approvedAt: new Date("2026-04-28T09:00:00.000Z"),
            },
          ],
          invites: [
            {
              id: "invite-1",
              email: "teacher@example.com",
              role: "teacher",
              inviteToken,
              expiresAt: new Date("2026-04-29T09:00:00.000Z"),
              acceptedAt: null,
            },
          ],
          assignments: [],
          classes: [{ id: "class-1", name: "기초 문해 수업" }],
        }}
      />,
    );

    const backLink = screen.getByRole("link", { name: "뒤로 가기" });
    expect(backLink).toHaveAttribute("href", "/dashboard");

    const tokenCode = screen.getByText(inviteToken);
    expect(tokenCode).toBeInTheDocument();
    expect(tokenCode).toHaveClass("break-all");

    fireEvent.click(screen.getByRole("button", { name: "토큰 복사" }));

    expect(writeText).toHaveBeenCalledWith(inviteToken);
  });
});
