# Step 0 — create-core-schema

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `phases/1-auth-onboarding/index.json`
- `phases/0-bootstrap-foundation/index.json`

## Task
Create the first persistence layer for the core identity and onboarding domain.

Implementation requirements:
- Add Drizzle configuration and the initial schema for:
  - `users`
  - `organizations`
  - `organization_memberships`
  - `villages`
- Represent roles so the MVP can distinguish `platform_admin`, `organization_admin`, and `teacher`.
- Design the schema around the rule that MVP users belong to one organization at a time, while keeping the membership table explicit.
- Add tests around schema-level helpers, validation, or domain mapping logic where reasonable.
- Add any migration or generation scripts the repo will use going forward.

## Acceptance Criteria
- `test -f drizzle.config.ts`
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm organization-scoped tables include `organization_id` where required.
- Confirm the design does not skip the membership table even though MVP is single-organization-per-user.
- Confirm the schema supports the onboarding transaction: organization creation, first village creation, first membership creation.

## Forbidden Actions
- Do not add settings, sessions, attendance, or attachments in this step.
- Do not assume platform admin backoffice screens are required yet.
- Do not bypass organization scoping because “there is only one tenant in dev.”
