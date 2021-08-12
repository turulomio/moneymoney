import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import i18n from './i18n'
import VueRouter from 'vue-router';

import "echarts";
import ECharts from 'vue-echarts'
Vue.component('v-chart', ECharts)

Vue.use(VueRouter);
Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token:null,
        logged:false,
        version: "0.1.0",
        versiondate: new Date(2021, 6, 25, 9, 22),
        apiroot: process.env.VUE_APP_DJANGO_MONEYMONEY_URL,
        publicPath: process.env.VUE_APP_PUBLIC_PATH,
        catalogs: {
            addresstype: [],
            countries: [],
            persongender: [],
            mailtype: [],
            phonetype: [],
            logtype: [],
            mimetype:[],
        },
        lastsearch: "",
        localcurrency:"EUR",
        localzone:"Europe/Madrid",
    },
})
import About from './components/about';
import Home from './components/Home';
import AccountsList from './components/AccountsList';
import BanksList from './components/BanksList';
import InvestmentsList from './components/InvestmentsList';
import ProductsUpdate from './components/ProductsUpdate';
import ReportsAnnual from './components/ReportsAnnual';
import Settings from './components/Settings';
import Statistics from './components/Statistics';




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
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/products/update/`, name: 'products_update', component: ProductsUpdate },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/reports/annual/`, name: 'reports_annual', component: ReportsAnnual },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/settings/`, name: 'settings', component: Settings },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/statistics/`, name: 'statistics', component: Statistics },
  ]
});

// MIXIN GLOBAL
import {
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
    get_concept,
    get_operationstypes_from_concept,
    zulu2py,
    date2py,
    zulu2date,
    date2zulu,
    py2date,
} from './functions.js'
import {RulesFloat,RulesInteger,RulesString,RulesSelection, RulesFloatPositive, RulesFloatNegative, } from './rules.js'
Vue.mixin({
    data: function () {
        return {
        }
    },
    methods: {
        myheaders,
        myheaders_formdata,
        parseResponse,
        parseResponseError,
        getLocalStorage,
        get_concept,
        get_operationstypes_from_concept,
        zulu2py,
        date2py,
        py2date,
        zulu2date,
        date2zulu,

        listobjects_sum,
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
            return currency_generic_string(num, this.$store.state.localcurrency, this.$i18n.locale,decimals )
        },
        localcurrency_html(num, decimals=2){
            return currency_generic_html(num, this.$store.state.localcurrency, this.$i18n.locale,decimals )
        },


    }
})

new Vue({
    i18n,
    store:store,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')




