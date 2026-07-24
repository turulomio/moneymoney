# Gemini / Developer Notes

## Fixed Issues

### Vue Router warning `[VUE_ROUTER_R0004] No match found for location with path ""`

- **Problem:** Route paths in [src/routes.js](file:///home/worky/Proyectos/moneymoney/src/routes.js) prepended `${import.meta.env.BASE_URL}` manually, but `createWebHistory()` was initialized without any argument (defaulting base to `/`). This caused double slash issues (`/moneymoney//...`) and failed to match the base directory without trailing slash (`/moneymoney` would strip base to `""` which wasn't handled).
- **Solution:** Updated [src/routes.js](file:///home/worky/Proyectos/moneymoney/src/routes.js) to:
  1. Pass `import.meta.env.BASE_URL` directly as the base argument to `createWebHistory(import.meta.env.BASE_URL)`.
  2. Simplify all route paths in the routes array to be relative (e.g. `/home/`, `/about/`, `/`). Vue Router now automatically prepends the base URL prefix for routing and correctly handles base prefix stripping.

---

## Workspace & Testing Notes

- **Dev Server:** Configured via Vite to run on host `127.0.0.1` and port `8006` with the base path `/moneymoney`.
- **E2E Tests:** Located in `tests/playwright/`. Run using `npx playwright test`.
- **Unit Tests:** Located in `tests/vitest/`. Run using `npm run vitest`.
- **Testing preference:** The user prefers to run the long test suites themselves. Do not run long test suites locally.
- **Documentation Rule:** Whenever coding or implementing new features, always remember to update the project documentation (such as `README.md`, `GEMINI.md`, and inline code documentation/comments) detailing the features and changes.

