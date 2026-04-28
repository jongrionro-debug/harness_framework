import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { RecordDetailScreen } from "@/components/records/record-detail";

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

describe("RecordDetailScreen", () => {
  it("gives operators a back-navigation link to the records browser", () => {
    render(
      <RecordDetailScreen
        record={{
          id: "session-1",
          sessionDate: "2026-04-28",
          className: "기초 문해 수업",
          villageName: "성내마을",
          programName: "문해 사업",
          teacherName: null,
          teacherEmail: "teacher@example.com",
          submittedAt: new Date("2026-04-28T09:00:00.000Z"),
          updatedAt: new Date("2026-04-28T10:00:00.000Z"),
          lessonJournal: "한글 모음 복습과 받아쓰기 연습을 진행했습니다.",
          attendance: [
            {
              snapshotId: "snapshot-1",
              fullName: "박수강",
              note: null,
              rosterOrder: 0,
              status: "present",
            },
          ],
          attachments: [],
        }}
      />,
    );

    const backLink = screen.getByRole("link", { name: "뒤로 가기" });
    const sessionManagementLink = screen.getByRole("link", {
      name: "세션 관리",
    });

    expect(backLink).toHaveAttribute("href", "/records");
    expect(sessionManagementLink).toHaveAttribute(
      "href",
      "/dashboard/sessions/session-1",
    );
    expect(screen.getByText("기초 문해 수업")).toBeInTheDocument();
    expect(screen.getByText("박수강")).toBeInTheDocument();
  });
});
