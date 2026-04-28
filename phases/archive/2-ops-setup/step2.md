# Step 2 — implement-teacher-memberships

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/ADR.md`
- `docs/ENV_SETUP.md`
- `phases/2-ops-setup/index.json`
- `phases/2-ops-setup/step0-output.json`
- `phases/2-ops-setup/step1-output.json`

## Task
Implement teacher user management for the local MVP.

Implementation requirements:
- Add operator-facing user management under `(ops)` for:
  - viewing organization members
  - assigning teacher role within the organization
  - linking teachers to classes through assignments
- Implement invitation support in a local-first way:
  - create invite records or tokens if needed
  - expose copyable invite links or local placeholders
  - do not require real email delivery yet
- Keep the model aligned with the ADR that future invite links may be delivered by email.
- Add tests for role checks and assignment rules.

## Acceptance Criteria
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm `organization_admin` can manage teacher access inside their own organization only.
- Confirm there is a path to assign teachers to classes before sessions are created.
- Confirm the implementation remains usable without `RESEND_API_KEY`.

## Forbidden Actions
- Do not wire production email sending in this step.
- Do not let teachers escalate their own role.
- Do not introduce platform-wide member management UI unless strictly needed for the MVP flow.
