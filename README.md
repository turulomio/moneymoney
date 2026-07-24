# MoneyMoney 

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fturulomio%2Fmoneymoney%2Fbadge%3Fref%3Dmain&style=flat)](https://actions-badge.atrox.dev/turulomio/moneymoney/goto?ref=main)

## Architecture & Relationship with `django_moneymoney`

MoneyMoney is split into two main repositories:
1. **Frontend (this repository):** A single-page web application built with **Vue 3**, **Vuetify 3**, and **Pinia** for state management. It communicates with the backend via Axios requests.
2. **Backend ([django_moneymoney](https://github.com/turulomio/django_moneymoney)):** A REST API built with **Django** and Django Rest Framework (DRF) that manages the PostgreSQL database, user authentication, and business logic.

Both parts work together using a unified REST API layer where the frontend automatically handles authorization tokens and localization headers via centralized Axios interceptors (configured in `src/store.js`).

## Key Features

- **Bank & Account Management:** Add and update banks, checking/savings accounts, and track transactions/transfers.
- **Investment Tracking:** Monitor stock/fund/ETF portfolios, register operations (buy/sell), update daily quotes, and track revaluation history.
- **Order Management:** Manage active and expired orders with alerts.
- **Comprehensive Reports:** Generate annual financial summaries, asset evolution charts (powered by ECharts), concept summaries, zero-risk summaries, asset classes, and ranking tables.
- **Multi-Currency Support:** Convert and visualize values in different currencies with automatic/manual exchange rates.
- **Investment Strategies:** Set up custom investment rules, product ranges, and catalog catalog update routines.

## Installation

### Django_moneymoney installation

 You need to create a new database. I recommend postgresql.

`createdb -U postgres moneymoney -h 127.0.0.1`

Clone https://github.com/turulomio/django_moneymoney and https://github.com/turulomio/moneymoney repositories or download same version releases

```bash
cd django_moneymoney
poetry shell
poetry install
```

Edit settings.py if needed and run backend

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py loaddata_catalogs
python manage.py runserver
```


### MoneyMoney installation

Compiles and hot-reloads for development:
```bash
cd moneymoney
npm run dev
```

### Running Tests

- **Unit Tests (Vitest):**
  ```bash
  npm run vitest
  ```
- **End-to-End Tests (Playwright):**
  ```bash
  npx playwright test
  ```

### Developer Guidelines

- **Translations:**
  To extract and update translation strings, run:
  ```bash
  npm run translate
  ```
- **Developer Notes & Fixed Issues:**
  See [GEMINI.md](file:///home/worky/Proyectos/moneymoney/GEMINI.md) for local dev guidelines, routing issues, and configuration notes.
