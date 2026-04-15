# Step 1 — implement-auth-foundation

## Read First
- `agent.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `docs/ENV_SETUP.md`
- `phases/1-auth-onboarding/index.json`
- `phases/1-auth-onboarding/step0-output.json`

## Task
Implement the authentication foundation for the local MVP.

Implementation requirements:
- Add Supabase client helpers for browser and server usage.
- Implement login and signup screens in the `(auth)` route group.
- Add route protection / redirect logic so authenticated and unauthenticated users land in the right flow.
- Keep the supported login method focused on email/password for the MVP.
- Make local development workable even before email invite delivery exists.
- Add tests for auth-related helpers, guards, or route decisions where feasible.

## Acceptance Criteria
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm OAuth is not introduced.
- Confirm auth flow decisions are centralized instead of scattered across pages.
- Confirm the app can determine whether a signed-in user still needs onboarding.

## Forbidden Actions
- Do not implement organization creation directly inside auth pages.
- Do not add real email invitation delivery here.
- Do not hardcode secrets or fallback credentials in source files.
