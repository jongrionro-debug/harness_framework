# Step 1 — setup-tooling-and-env

## Read First
- `agent.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `docs/ENV_SETUP.md`
- `phases/0-bootstrap-foundation/index.json`
- `phases/0-bootstrap-foundation/step0-output.json`

## Task
Add the local development tooling needed for TDD and safe environment handling.

Implementation requirements:
- Add a test runner and browser-safe component test setup suitable for this repo.
- Add at least one smoke test so `npm run test` is meaningful after this step.
- Add environment variable parsing and validation using `Zod`.
- Create `.env.example` from the environment guide.
- Separate public and server-only environment variables clearly.
- Keep the initial env requirements focused on the local MVP:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `DATABASE_URL`
- If you add optional mail variables, mark them clearly as optional for later phases.

## Acceptance Criteria
- `test -f .env.example`
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm the app fails fast with a clear error when required local MVP env vars are missing.
- Confirm test setup is documented through package scripts rather than hidden one-off commands.
- Confirm environment access is routed through shared helpers instead of scattered `process.env` reads.

## Forbidden Actions
- Do not require a live Supabase project to make the test suite pass.
- Do not commit secret values from `.env.local`.
- Do not wire real email sending yet.
