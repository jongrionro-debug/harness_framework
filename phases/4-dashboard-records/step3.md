# Step 3 — document-local-smoke-path

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/ENV_SETUP.md`
- `phases/4-dashboard-records/index.json`
- `phases/4-dashboard-records/step2-output.json`
- `scripts/execute.py`

## Task
Document and support the end-to-end local MVP verification path.

Implementation requirements:
- Add a concise local smoke-test document covering:
  - environment setup
  - auth flow
  - organization onboarding
  - settings CRUD
  - session creation
  - teacher submission
  - operator dashboard and records verification
- Add any seed or setup helper scripts needed to make the local smoke path practical.
- Keep the smoke path aligned with the documented MVP, not with stretch features.
- Add or update tests if you introduce helper code.

## Acceptance Criteria
- `test -f docs/LOCAL_SMOKE_TEST.md`
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm a new contributor could follow the document without guessing hidden steps.
- Confirm the smoke path does not require Vercel, OAuth, or real email delivery.
- Confirm the verification flow matches the product priorities in `agent.md`.

## Forbidden Actions
- Do not write aspirational docs for features that are not actually implemented.
- Do not require manual database surgery as the normal happy path.
- Do not skip validation just because this is “only documentation.”
