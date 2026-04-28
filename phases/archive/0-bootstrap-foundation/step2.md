# Step 2 — build-shared-app-shell

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/UI_GUIDE.md`
- `docs/ARCHITECTURE.md`
- `phases/0-bootstrap-foundation/index.json`
- `phases/0-bootstrap-foundation/step0-output.json`
- `phases/0-bootstrap-foundation/step1-output.json`

## Task
Build the shared application shell, styling tokens, and placeholder route groups that later phases will fill in.

Implementation requirements:
- Add route-group placeholders that align with the architecture document:
  - `(auth)`
  - `(onboarding)`
  - `(ops)`
  - `(teacher)`
- Introduce reusable theme tokens for the colors, surfaces, borders, and type scale from `docs/UI_GUIDE.md`.
- Create a shared shell or layout primitives that can support:
  - left navigation / channel-style lists
  - pill tabs / filters
  - warm neutral panels
- Keep the app visually intentional; avoid generic default SaaS styling.
- Add a small test surface for any non-trivial shared UI utility you create.

## Acceptance Criteria
- `test -d src/app/'(auth)'`
- `test -d src/app/'(onboarding)'`
- `test -d src/app/'(ops)'`
- `test -d src/app/'(teacher)'`
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm the visual foundation matches the yellow-accent, warm-neutral direction from the UI guide.
- Confirm shared layout code lives in components/utilities that later slices can reuse.
- Confirm placeholder routes do not yet claim unsupported product behavior.

## Forbidden Actions
- Do not implement authentication or data-fetching logic here.
- Do not hardcode organization-specific copy as if the app were single-tenant.
- Do not add flashy gradients, glassmorphism, or purple SaaS defaults.
