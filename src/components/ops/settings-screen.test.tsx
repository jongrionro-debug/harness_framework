import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { SettingsScreen } from "@/components/ops/settings-screen";

vi.mock("@/server/actions/settings", () => ({
  createClassAction: vi.fn(),
  createParticipantAction: vi.fn(),
  createProgramAction: vi.fn(),
  createVillageAction: vi.fn(),
  deleteParticipantAction: vi.fn(),
}));

describe("SettingsScreen", () => {
  it("uses business copy instead of program copy in the operator settings flow", () => {
    render(
      <SettingsScreen
        data={{
          villages: [{ id: "village-1", name: "성내마을", isPrimary: true }],
          programs: [
            {
              id: "program-1",
              name: "문해 사업",
              description: "기초 문해 지원",
            },
          ],
          classes: [
            {
              id: "class-1",
              name: "기초 문해 수업",
              description: "오전 반",
              programName: "문해 사업",
              villageName: "성내마을",
            },
          ],
          participants: [],
        }}
      />,
    );

    expect(
      screen.getByText(/기관 생성 직후 사업, 수업, 참여자 명단이 비어 있어도 괜찮게/),
    ).toBeInTheDocument();
    expect(screen.getByText("사업")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("예: 문해 사업")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("사업 설명")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "사업 추가" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "사업 선택 안 함" })).toBeInTheDocument();
    expect(screen.getAllByText("문해 사업")).toHaveLength(2);
    expect(screen.queryByText("프로그램")).not.toBeInTheDocument();
  });
});
