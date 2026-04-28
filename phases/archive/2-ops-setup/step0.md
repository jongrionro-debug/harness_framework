# Step 0 — expand-settings-schema

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `phases/2-ops-setup/index.json`
- `phases/1-auth-onboarding/index.json`
- `phases/1-auth-onboarding/step2-output.json`

## Task
Extend the schema for operator-managed master data and teacher assignment setup.

Implementation requirements:
- Add the schema needed for:
  - `programs`
  - `classes`
  - `participants`
  - `teacher_assignments`
  - any minimal invite or membership-supporting table needed for the next step
- Keep every read/write path organization-scoped.
- Model relationships so classes can connect to programs and villages, and assignments can connect teachers to classes.
- Add validation schemas and tests for the new entities.

## Acceptance Criteria
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm the schema supports empty state after onboarding.
- Confirm master data can be created gradually instead of requiring a giant setup form.
- Confirm there is a clean path from teacher membership to teacher assignment.

## Forbidden Actions
- Do not add sessions or attendance tables yet.
- Do not add analytics-only tables.
- Do not skip tests for validation or mapping logic.
