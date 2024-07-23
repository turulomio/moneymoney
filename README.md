# MoneyMoney 

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fturulomio%2Fmoneymoney%2Fbadge%3Fref%3Dmain&style=flat)](https://actions-badge.atrox.dev/turulomio/moneymoney/goto?ref=main)

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

Compiles and hot-reloads for development
```bash
cd moneymoney
npm run dev
```


## Changelog

### 1.2.0 (2023-10-05)
- Added totals to historical concepts report
- Added balance to creditcardoperations
- Assets Report preparation now hides charts

### 1.1.0 (2023-09-27)
- Added zero risk assets to annual chart
- Added creditcard operation copy feature
- Fixed many bugs

### 1.0.0 (2023-09-09)
- MoneyMoney frontend migrated to vue3 and vuetify3
- All features were added

### 0.3.0 (2022-07-03)
- Adding missing features

### 0.2.0 (2022-02-20)
- First version with almost all features migrated from xulpymoney project

