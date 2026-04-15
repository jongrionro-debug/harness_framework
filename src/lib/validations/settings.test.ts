import {
  classSchema,
  membershipApprovalSchema,
  memberRoleUpdateSchema,
  organizationInviteSchema,
  participantSchema,
  programSchema,
  teacherAssignmentSchema,
  villageSchema,
} from "@/lib/validations/settings";

describe("settings validation", () => {
  it("accepts minimal village input", () => {
    expect(villageSchema.parse({ name: "동네 배움터" })).toEqual({
      name: "동네 배움터",
    });
  });

  it("requires a non-empty program name", () => {
    expect(() => programSchema.parse({ name: "", description: "" })).toThrow();
  });

  it("allows class input with optional program and village links", () => {
    expect(
      classSchema.parse({
        name: "기초 문해 수업",
        description: "",
        programId: "",
        villageId: "",
      }),
    ).toEqual({
      name: "기초 문해 수업",
      description: "",
      programId: "",
      villageId: "",
    });
  });

  it("allows participant notes to be optional", () => {
    expect(
      participantSchema.parse({
        fullName: "홍길동",
        note: "",
        classId: "",
      }),
    ).toEqual({
      fullName: "홍길동",
      note: "",
      classId: "",
    });
  });

  it("limits invite roles to teacher or organization admin", () => {
    expect(
      organizationInviteSchema.parse({
        email: "teacher@example.com",
        role: "teacher",
      }),
    ).toEqual({
      email: "teacher@example.com",
      role: "teacher",
    });
  });

  it("allows membership role updates only inside supported roles", () => {
    expect(
      memberRoleUpdateSchema.parse({
        membershipId: "46a87e1a-9918-4ea1-872f-999999999999",
        role: "organization_admin",
      }),
    ).toEqual({
      membershipId: "46a87e1a-9918-4ea1-872f-999999999999",
      role: "organization_admin",
    });
  });

  it("requires a valid membership id for approval", () => {
    expect(
      membershipApprovalSchema.parse({
        membershipId: "46a87e1a-9918-4ea1-872f-999999999999",
      }),
    ).toEqual({
      membershipId: "46a87e1a-9918-4ea1-872f-999999999999",
    });
  });

  it("requires teacher assignment ids", () => {
    expect(
      teacherAssignmentSchema.parse({
        userId: "46a87e1a-9918-4ea1-872f-999999999999",
        classId: "46a87e1a-9918-4ea1-872f-999999999998",
      }),
    ).toEqual({
      userId: "46a87e1a-9918-4ea1-872f-999999999999",
      classId: "46a87e1a-9918-4ea1-872f-999999999998",
    });
  });
});
