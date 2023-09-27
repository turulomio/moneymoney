# MoneyMoney 

This is the Vue 3 evolution of the branch vue2 of project https://github.com/turulomio/moneymoney/ and it's the frontend app of  https://github.com/turulomio/django_moneymoney backend.

## Installation

### Unogenerator installation
You must configure unogenerator.

If you want to install it in Gentoo you can use my ebuild at myportage.

In other Linux distributions you must run

```bash
    pip install unogenerator
    unogenator_start
```

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

