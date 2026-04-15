# Step 2 — implement-organization-onboarding

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `docs/UI_GUIDE.md`
- `phases/1-auth-onboarding/index.json`
- `phases/1-auth-onboarding/step0-output.json`
- `phases/1-auth-onboarding/step1-output.json`

## Task
Implement the onboarding flow that creates a new organization after authentication.

Implementation requirements:
- Build the `(onboarding)/organization` flow and completion screen.
- Collect only the minimum inputs required by the ADR:
  - organization name
  - first village name
- Persist organization, first village, and the creator’s `organization_admin` membership atomically.
- After successful onboarding, redirect the user into the operator workspace rather than back to auth.
- If the user already belongs to an organization, block or redirect them safely.
- Add tests for the onboarding service or action logic.

## Acceptance Criteria
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm the flow keeps product copy short and action-oriented.
- Confirm onboarding does not auto-create default programs.
- Confirm the completion screen clearly points to the next operator setup task.

## Forbidden Actions
- Do not collect unnecessary setup data in onboarding.
- Do not create classes, participants, or sessions automatically.
- Do not implement multi-organization membership switching in this step.
