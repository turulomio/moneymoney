# Developer Guidelines & Architecture Notes

## Architecture & Conventions

- **Routing & Base URL:** Base path is `/moneymoney`. `createWebHistory(import.meta.env.BASE_URL)` handles the base prefix; route paths in `routes.js` are relative (e.g. `/home/`, `/about/`, `/`).
- **Auth Guard:** Global `router.beforeEach` in `routes.js` redirects unauthenticated users (`!store.logged`) to `/home/`.
- **Store & Catalogs:** Catalogs (`products`, `leverages`, `accounts`, etc.) are cached in `store.js` as Maps keyed by URL. Access related entities via `useStore().<catalog>.get(url)`. Product leverage multiplier is at `store.leverages.get(product.leverages)?.multiplier` and real leverage at `product.real_leveraged_multiplier`.
- **Key Components:**
  - `BtnLogIn` / `BtnLogOut`: Decoupled `<script setup>` components emitting `@logged-in` and `@logged-out`.
  - `Alerts.vue`: Centralized alert banners and independent time synchronization (`check_time_diff()`).
  - `DisplayValues.vue`: Compact key-value summaries with scoped styling. Companion alerts should match its centered 50% width (`class="mx-auto mb-2" style="width: 50%;"`).
- **Math Utilities:** Use `lodash-es` (`round`, etc.) rather than `vuetify_rules` for rounding operations.

## Coding & Formatting Rules

- **Single-Line Templates:** Write Vue components and all their attributes on a single line in template code whenever possible for conciseness and consistency.
- **`<script setup>` Documentation:** Document all `<script setup>` components with standard **Javadoc / JSDoc** (`/** ... */`) covering reactive state (`@type`), functions (`@param`, `@returns`), props, emits, and lifecycle hooks.
- **List Elements:** Do not prefix text with manual hyphens (`-`) inside `<li>` elements in `<ul>` lists (standard bullets are already provided by HTML).
- **Documentation Maintenance:** Keep `README.md`, `GEMINI.md`, and inline comments updated when implementing new features or making architectural changes.

## Workspace & Testing

- **Node.js:** Requires Node >= 22.12.0 (`package.json`, CI workflow).
- **Dev Server:** Vite on `127.0.0.1:8006`, base `/moneymoney`.
- **E2E & Unit Tests:** Playwright in `tests/playwright/` (`npx playwright test`), Vitest in `tests/vitest/` (`npm run vitest`).
- **Testing Preference:** The user prefers to run long test suites themselves. Do not run long test suites locally.
- **CI / Backend Image:** E2E runs against the standalone backend Docker image `turulomio/django_moneymoney:e2e`.
