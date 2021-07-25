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
        version: "0.3.0",
        versiondate: new Date(2021, 3, 23, 9, 22),
        apiroot: process.env.VUE_APP_DJANGO_VIPCONTACTS_URL,
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
    },
})
import About from './components/about';
import Settings from './components/Settings';
import Statistics from './components/Statistics';




const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/about/`, name: 'about', component: About },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/settings/`, name: 'settings', component: Settings },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/statistics/`, name: 'statistics', component: Statistics },
  ]
});

// MIXIN GLOBAL
import {myheaders,parseResponse,parseResponseError,getLocalStorage,myheaders_formdata} from './functions.js'

Vue.mixin({
  methods: {
    myheaders,
    myheaders_formdata,
    parseResponse,
    parseResponseError,
    getLocalStorage,
  }
})

new Vue({
    i18n,
    store:store,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')




