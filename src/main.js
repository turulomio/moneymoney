import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import i18n from './i18n'
import VueRouter from 'vue-router';
import {store} from './store.js'

import "echarts";
import ECharts from 'vue-echarts'
Vue.component('v-chart', ECharts)

Vue.use(VueRouter);


import About from './components/about';
import Home from './components/Home';
import AccountsList from './components/AccountsList';
import BanksList from './components/BanksList';
import InvestmentsList from './components/InvestmentsList';
import OrdersList from './components/OrdersList';
import ProductsComparationList from './components/ProductsComparationList';
import ProductsRanges from './components/ProductsRanges';
import ProductsSearch from './components/ProductsSearch';
import ProductsUpdate from './components/ProductsUpdate';
import ReportsAnnual from './components/ReportsAnnual';
import ReportsDividends from './components/ReportsDividends';
import ReportsEvolution from './components/ReportsEvolution';
import ReportsInvestmentsClasses from './components/ReportsInvestmentsClasses';
import ChartEvolutionAssets from './components/ChartEvolutionAssets';
import ReportsInvestmentsLastOperation from './components/ReportsInvestmentsLastOperation';
import ReportsRanking from './components/ReportsRanking';
import Settings from './components/Settings';
import Statistics from './components/Statistics';
import StrategiesList from './components/StrategiesList';




const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/`, redirect: `${process.env.VUE_APP_PUBLIC_PATH}/home/` }, 
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/about/`, name: 'about', component: About },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/home/`, name: 'home', component: Home },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/accounts/list/`, name: 'accounts_list', component: AccountsList },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/banks/list/`, name: 'banks_list', component: BanksList },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/investments/list/`, name: 'investments_list', component: InvestmentsList },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/orders/list/`, name: 'orders_list', component: OrdersList },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/products/ranges/`, name: 'products_ranges', component: ProductsRanges },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/products/comparation/list/`, name: 'products_comparation_list', component: ProductsComparationList },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/products/search/`, name: 'products_search', component: ProductsSearch },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/products/update/`, name: 'products_update', component: ProductsUpdate },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/reports/annual/`, name: 'reports_annual', component: ReportsAnnual },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/reports/dividens/`, name: 'reports_dividends', component: ReportsDividends },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/reports/investmentsclasses/`, name: 'reports_investments_classes', component: ReportsInvestmentsClasses },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/reports/investments/lastoperation/`, name: 'reports_lastoperation', component: ReportsInvestmentsLastOperation },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/reports/ranking/`, name: 'reports_ranking', component: ReportsRanking },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/reports/evolution/`, name: 'reports_evolution', component: ReportsEvolution },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/reports/evolution/chart/`, name: 'reports_evolution_chart', component: ChartEvolutionAssets },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/settings/`, name: 'settings', component: Settings },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/statistics/`, name: 'statistics', component: Statistics },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/strategies/list/`, name: 'strategies_list', component: StrategiesList },
  ]
});

// MIXIN GLOBAL
import {
    localtime,
    myheaders,
    parseResponse,
    parseResponseError,
    getLocalStorage, 
    listobjects_sum,
    myheaders_formdata,
    currency_generic_html,
    currency_generic_string,
    percentage_generic_html,
    percentage_generic_string, 
    get_from_catalog,
    zulu2py,
    date2py,
    zulu2date,
    date2zulu,
    py2date,
} from './functions.js'
import {RulesFloat,RulesDate,RulesDatetime,RulesInteger,RulesString,RulesSelection, RulesFloatPositive, RulesFloatNegative, } from './rules.js'
Vue.mixin({
    data: function () {
        return {
        }
    },
    methods: {
        localtime,
        myheaders,
        myheaders_formdata,
        parseResponse,
        parseResponseError,
        getLocalStorage,
        get_from_catalog,
        zulu2py,
        date2py,
        py2date,
        zulu2date,
        date2zulu,

        listobjects_sum,
        RulesDate,
        RulesDatetime,
        RulesFloat,
        RulesInteger,
        RulesString,
        RulesSelection,
        RulesFloatPositive,
        RulesFloatNegative,


        currency_string(num, currency, decimals=2){
            return currency_generic_string(num, currency, this.$i18n.locale,decimals )
        },
        currency_html(num, currency, decimals=2){
            return currency_generic_html(num, currency, this.$i18n.locale,decimals )
        },
        percentage_string(num, decimals=2){
            return percentage_generic_string(num,this.$i18n.locale,decimals )
        },
        percentage_html(num, decimals=2){
            return percentage_generic_html(num,this.$i18n.locale,decimals )
        },
        localcurrency_string(num, decimals=2){
            return currency_generic_string(num, this.$store.state.local_currency, this.$i18n.locale,decimals )
        },
        localcurrency_html(num, decimals=2){
            return currency_generic_html(num, this.$store.state.local_currency, this.$i18n.locale,decimals )
        },


    }
})

const app=new Vue({
    i18n,
    store:store,
    router,
    vuetify,
    render: h => h(App)
})
store.$app = app
.$mount('#app')




