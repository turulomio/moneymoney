# Gemini / Developer Notes

## Fixed Issues

### Vue Router warning `[VUE_ROUTER_R0004] No match found for location with path ""`

- **Problem:** Route paths in [src/routes.js](file:///home/worky/Proyectos/moneymoney/src/routes.js) prepended `${import.meta.env.BASE_URL}` manually, but `createWebHistory()` was initialized without any argument (defaulting base to `/`). This caused double slash issues (`/moneymoney//...`) and failed to match the base directory without trailing slash (`/moneymoney` would strip base to `""` which wasn't handled).
- **Solution:** Updated [src/routes.js](file:///home/worky/Proyectos/moneymoney/src/routes.js) to:
  1. Pass `import.meta.env.BASE_URL` directly as the base argument to `createWebHistory(import.meta.env.BASE_URL)`.
  2. Simplify all route paths in the routes array to be relative (e.g. `/home/`, `/about/`, `/`). Vue Router now automatically prepends the base URL prefix for routing and correctly handles base prefix stripping.

### Migrated `round` from `vuetify_rules` to `lodash-es`

- **Change:** Replaced all imports of `round` from `vuetify_rules` across the project with `round` from `lodash-es` (`Currencies.vue`, `CurrencyFactor.vue`, `ReportsInvestmentsClasses.vue`, `InvestmentsChangeSellingPrice.vue`, `ReportsInvestmentsLastOperation.vue`, `AssetsReport.vue`, `ProductsComparation.vue`, `InvestmentsoperationsReinvest.vue`).

### Account Balance Display in AccountsView when Empty

- **Change:** In [src/components/AccountsView.vue](file:///home/keko/Proyectos/moneymoney/src/components/AccountsView.vue), when `TableAccountOperations` has no operations (`items_ao.length === 0`), `TableAccountOperations` is hidden and a request to `/api/accounts/${account.id}/balance/?year=${ym.year}&month=${ym.month}` is performed to display a centered label with the balance formatted via `currency_html`.

### Encapsulated Alerts in Alerts.vue

- **Change:** Extracted the entire alerts logic, display banners, time synchronization checks, and related modals (`ProductsView` dialog and `QuotesCU` dialog) from [src/components/Home.vue](file:///home/worky/Proyectos/moneymoney/src/components/Home.vue) into a reusable dedicated component [src/components/Alerts.vue](file:///home/worky/Proyectos/moneymoney/src/components/Alerts.vue). [src/components/Home.vue](file:///home/worky/Proyectos/moneymoney/src/components/Home.vue) now embeds `<Alerts />`.
- **Products without quotes alert:** Handled the updated backend payload for `alerts.products_without_quotes_before_operations` returning `{ product_url, datetime }` (or first investment operation datetime). The component looks up the product from `store.products` for flag, obsolete style, and fullname display, and configures the `+` button to open [src/components/QuotesCU.vue](file:///home/worky/Proyectos/moneymoney/src/components/QuotesCU.vue) with the datetime set to 1 minute before the first operation datetime.
- **Independent time synchronization:** Separated the time difference calculation into a dedicated, fast independent request (`check_time_diff()`) with RTT adjustment, avoiding false-positive time skew warnings caused by the computation duration of the heavy `/alerts/` endpoint.

### Return to Home on Lack of Credentials / Disconnection / URL Navigation

- **Change:** Added a global `router.beforeEach` navigation guard in [src/routes.js](file:///home/worky/Proyectos/moneymoney/src/routes.js). When a user is not logged in (`!store.logged`) and attempts to access any non-public route (e.g. on F5 refresh, manual URL editing, or unauthenticated navigation), the router redirects the navigation directly to `/home/`.

### Decoupled and Reusable BtnLogIn and BtnLogOut Components

- **Change:** Refactored [src/components/BtnLogIn.vue](file:///home/worky/Proyectos/moneymoney/src/components/BtnLogIn.vue) and [src/components/BtnLogOut.vue](file:///home/worky/Proyectos/moneymoney/src/components/BtnLogOut.vue) into decoupled, reusable `<script setup>` components with complete Javadoc/JSDoc format documentation.
- **Props & Emits:**
  - `BtnLogIn`: accepts `label`, `loginUrl`, `nextRoute`, and optional `customLogin`; emits `@logged-in(token)` and `@error(error)`.
  - `BtnLogOut`: accepts `label`, `logoutUrl`, `token`, `nextRoute`, and optional `customLogout`; emits `@logged-out` and `@error(error)`.
- **Integration:** [src/App.vue](file:///home/worky/Proyectos/moneymoney/src/App.vue) passes `login-url`, `logout-url`, `token`, and handles `@logged-in` / `@logged-out` by synchronizing with the global store (`store.setToken`).

### CI / GitHub Actions Optimization with Backend Docker Image

- **Change:** Updated [.github/workflows/node.js.yml](file:///home/worky/Proyectos/moneymoney/.github/workflows/node.js.yml) to run the Django E2E testserver directly using the standalone Docker image `turulomio/django_moneymoney:e2e`. This eliminates the need for the PostgreSQL service container, PL/Python extension installation, DB initialization, and python setup, reducing workflow complexity and test execution time.

### Playwright E2E Authentication Synchronization Fix

- **Problem:** When running Playwright tests, the login fixture clicked `BtnLogIn_cmd` and immediately evaluated `expect(Home_LoadingOverlay).toBeHidden()`. Because `Home_LoadingOverlay` was already hidden prior to login request resolution, this check returned true instantaneously (0ms), causing tests to start before login finished (`store.logged` remained false while navigating or clicking drawer items). Consequently, elements guarded by `v-if="store.logged"` (like `LateralAccounts`) timed out with 10000ms errors.
- **Solution:** Updated [tests/playwright/fixtures.js](file:///home/worky/Proyectos/moneymoney/tests/playwright/fixtures.js) to explicitly wait for `page.getByTestId('LateralLogOut')` to become visible first (confirming `store.logged = true` has been set), before awaiting `Home_LoadingOverlay` to be hidden (confirming catalog bootstrap is finished).
- **Fail-fast CI execution:** Added `maxFailures: process.env.CI ? 1 : 0` to [playwright.config.js](file:///home/worky/Proyectos/moneymoney/playwright.config.js) to immediately cancel and stop further test execution upon encountering the first failure on GitHub Actions.

---

## Workspace & Testing Notes

- **Dev Server:** Configured via Vite to run on host `127.0.0.1` and port `8006` with the base path `/moneymoney`.
- **E2E Tests:** Located in `tests/playwright/`. Run using `npx playwright test`.
- **Unit Tests:** Located in `tests/vitest/`. Run using `npm run vitest`.
- **Testing preference:** The user prefers to run the long test suites themselves. Do not run long test suites locally.
- **Documentation Rule:** Whenever coding or implementing new features, always remember to update the project documentation (such as `README.md`, `GEMINI.md`, and inline code documentation/comments) detailing the features and changes.
- **`<script setup>` Documentation Rule:** Always document `<script setup>` code in Vue components using standard **Javadoc / JSDoc** format (`/** ... */`), thoroughly documenting reactive state (`ref`, `computed` with `@type`), functions (`@param`, `@returns`), props, emits, exposed APIs, watchers, and lifecycle hooks.
- **Single-Line Template Formatting Rule:** Write Vue components and all their attributes on a single line in template code whenever possible for conciseness and consistency across the codebase.


