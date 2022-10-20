import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {sortObjectsArray, my_round,capitalizeFirstLetter} from './my_commons.js'
import CurrencyList from 'currency-list'

import countries from 'flag-icons/country.json'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token:null,
        logged:false,
        version: "0.3.0",
        versiondate: new Date(2022, 6, 3, 7, 5),
        apiroot: process.env.VUE_APP_DJANGO_MONEYMONEY_URL,
        publicPath: process.env.VUE_APP_PUBLIC_PATH,
        catalog_manager: false,
        accounts: [],
        banks: [],
        creditcards:[],
        concepts:[],
        countries:countries,
        currencies: [],
        investments: [],
        leverages: [],
        operationstypes: [],
        products: [],
        productstypes: [],
        settings: null,
        stockmarkets:[],
        strategiestypes:[],
        recomendation_methods:[],
    },    
    getters:{
        getConceptsForDividends: (state) => () => { 
            return state.concepts.filter( o => [39,50,59,62,63,65,66,68,70,72,75,76,77].includes(o.id))
        },
        getInvestmentsActive:(state) => () => {
            return state.investments.filter(o => o.active==true)
        },
        getInvestmentsByProduct:(state) => (product) => {
            return state.investments.filter(o => o.products==product)
        },
        getOperationstypesForNewConcepts: (state) => () => { 
            return state.operationstypes.filter( o => [1,2].includes(o.id))
        },
        getOperationstypesForInvestmentsOperations: (state) => () => { 
            return state.operationstypes.filter( o => [4,5,6,8,9,10].includes(o.id))
        },
        getObjectByUrl:(state) => (catalog,url,default_=null) => {
            var r=state[catalog].find(o => o.url==url)
            if (r==null){
                return default_
            } else {
                return r
            }
        },
        getObjectById:(state) => (catalog,id,default_=null) => {
            var r=state[catalog].find(o => o.id==id)
            if (r==null){
                return default_
            } else {
                return r
            }
        },
        getObjectPropertyByUrl:(state,getters) => (catalog,url,property,default_=null) => {
            var r=getters.getObjectByUrl(catalog,url)
            if (r==null){
                return default_
            } else {
                return r[property]
            }
        },
        getObjectPropertyById:(state,getters) => (catalog,id,property,default_=null) => {
            var r=getters.getObjectById(catalog,id)
            if (r==null){
                return default_
            } else {
                return r[property]
            }
        },
        getCurrencyByCode:(state) => (code,default_=null) => {
            var r=state['currencies'].find(o => o.code==code)
            if (r==null){
                return default_
            } else {
                return r
            }
        },
        getCurrencyPropertyByCode:(state,getters) => (code,property,default_="???") => {
            var r=getters.getCurrencyByCode(code)
            if (r==null){
                if (code=='u') return "u"
                return default_
            } else {
                return r[property]
            }
        },
        currency_generic_string:(state,getters) => (num, currency, locale, decimals=2)=>{
            if (num ==null){
                return `- - - ${getters.getCurrencyPropertyByCode(currency,"symbol_native")}`
            } else {
                return `${my_round(num,decimals).toLocaleString(locale, { minimumFractionDigits: decimals,  })} ${getters.getCurrencyPropertyByCode(currency,"symbol_native")}`
            }
        },
        
        currency_generic_html:(state,getters) =>(num, currency, locale, decimals=2)=>{
            if (num<0){
                return `<span class='vuered'>${getters.currency_generic_string(num, currency, locale, decimals)}</span>`
            } else {
                return getters.currency_generic_string(num, currency, locale, decimals)
            }
        },
        getCountryNameByCode:(state) => (code) => {
            var r=state['countries'].find(o => o.code==code)
            if (r==null){
                return ""
            } else {
                return r.name
            }
        },
    },
    mutations: { // Only sincronous changes data
        updateAccounts: (state, payload) =>{
            state.accounts=payload
        },
        updateBanks: (state, payload) =>{
            state.banks=payload
        },
        updateCatalogManager: (state, payload) =>{
            state.catalog_manager=payload
        },
        updateConcepts: (state, payload) =>{
            state.concepts=payload
        },

        updateCreditcards: (state, payload) =>{
            state.creditcards=payload
        },
        updateCurrencies: (state, payload) =>{
            state.currencies=payload
        },
        updateInvestments: (state, payload) =>{
            state.investments=payload
        },
        updateLeverages: (state, payload) =>{
            state.leverages=payload
        },
        updateOperationstypes: (state, payload) =>{
            state.operationstypes=payload
        },
        updateRecomendationMethods: (state, payload) =>{
            state.recomendation_methods=payload
        },
        updateProducts: (state, payload) =>{
            state.products=payload
        },
        updateProductstypes: (state, payload) =>{
            state.productstypes=payload
        },
        updateSettings: (state, payload) =>{
            state.settings=payload
        },
        updateStockmarkets: (state, payload) =>{
            state.stockmarkets=payload
        },
        updateStrategiesTypes: (state, payload) =>{
            state.strategiestypes=payload
        },

    },
    actions: {// Can be asynchronous. Fetch data

        getAll(context){
            return Promise.all([
                context.dispatch("getAccounts"),
                context.dispatch("getBanks"),
                context.dispatch("getCatalogManager"),
                context.dispatch("getConcepts"),
                context.dispatch("getCreditcards"),
                context.dispatch("getCurrencies"),
                context.dispatch("getInvestments"),
                context.dispatch("getLeverages"),
                context.dispatch("getOperationstypes"),
                context.dispatch("getProductstypes"),
                context.dispatch("getRecomendationMethods"),
                context.dispatch("getSettings"),
                context.dispatch("getStockmarkets"),
                context.dispatch("getStrategiesTypes"),
                context.dispatch("getProducts")
            ])
        },
        getAccounts(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/accounts/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateAccounts', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} accounts in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getBanks(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/banks/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateBanks', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} banks in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getCatalogManager(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/catalog_manager/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateCatalogManager', response.data)
                console.log(`Updated catalog manager in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },

        getCreditcards(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/creditcards/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateCreditcards', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} credit cards in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getCurrencies(context){
            var start=new Date()
            var locale="en_US"
            if (store.$app.$i18n.locale=='es'){
                locale="es_ES"
            }
            // CurrencyList falló en versión 1.0.7 y se arreglo en 1.0.8
            var currencies_object=CurrencyList.getAll(locale)
            var currencies_list=[]
            Object.entries(currencies_object).forEach(o => currencies_list.push(o[1]))
            currencies_list.forEach(o=> o["fullname"]=`${capitalizeFirstLetter(o.name)} (${o.code} - ${o.symbol})`)
            context.commit("updateCurrencies", currencies_list)
            console.log(`Updated ${currencies_list.length} currencies in ${new Date()-start} ms`)
        },
        getInvestments(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/investments/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateInvestments', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} investments in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getLeverages(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/leverages/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateLeverages', sortObjectsArray(response.data, "multiplier"))
                console.log(`Updated ${response.data.length} leverages in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getConcepts(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/concepts/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateConcepts', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} concepts in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getOperationstypes(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/operationstypes/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateOperationstypes', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} operations types in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getProducts(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/products/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateProducts', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} products in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getProductstypes(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/productstypes/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateProductstypes', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} products types in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getRecomendationMethods(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/recomendationmethods/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateRecomendationMethods', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} recomendation methods in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getSettings(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/settings/`, store.$app.myheaders())
            .then((response) => {
                context.commit("updateSettings", response.data)
                console.log(`Updated settings in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getStockmarkets(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/stockmarkets/`, store.$app.myheaders())
            .then((response) => {
                context.commit("updateStockmarkets", sortObjectsArray(response.data, "localname"))
                console.log(`Updated ${response.data.length} stock markets in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getStrategiesTypes(context){
            var start=new Date()
            var r=[
                {id:1, name: store.$app.$t("Pairs in same account")},
                {id:2, name: store.$app.$t("Product ranges")},
                {id:3, name: store.$app.$t("Generic")},
            ]
            context.commit("updateStrategiesTypes",r)
            console.log(`Updated ${r.length} strategy types in ${new Date()-start} ms`)
        },
    }
})
