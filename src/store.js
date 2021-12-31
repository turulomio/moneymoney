import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {sortObjectsArray,capitalizeFirstLetter,my_round} from './functions.js'
import CurrencyList from 'currency-list'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token:null,
        logged:false,
        version: "0.1.0",
        versiondate: new Date(2021, 6, 25, 9, 22),
        apiroot: process.env.VUE_APP_DJANGO_MONEYMONEY_URL,
        publicPath: process.env.VUE_APP_PUBLIC_PATH,
        lastsearch: "",
        local_currency:"EUR",
        local_zone:"Europe/Madrid",
        accounts: [],
        banks: [],
        creditcards:[],
        concepts:[],
        currencies: [],
        investments: [],
        operationstypes: [],
        products: [],
        stockmarkets:[],
        strategiestypes:[],
    },    
    getters:{
        getConceptsForDividends: (state) => () => { 
            return state.concepts.filter( o => [39, 50,59,62,63,65,66,68,70,72,75,76,77].includes(o.id))
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
                return default_
            } else {
                return r[property]
            }
        },
        currency_generic_string:(state,getters) => (num, currency, locale, decimals=2)=>{
            return `${my_round(num,decimals).toLocaleString(locale, { minimumFractionDigits: decimals,  })} ${getters.getCurrencyPropertyByCode(currency,"symbol_native")}`
        },
        
        currency_generic_html:(state,getters) =>(num, currency, locale, decimals=2)=>{
            if (num>=0){
                return getters.currency_generic_string(num, currency, locale, decimals)
            } else {
                return `<span class='vuered'>${getters.currency_generic_string(num, currency, locale, decimals)}</span>`
            }
        }
    },
    mutations: { // Only sincronous changes data
        updateAccounts: (state, payload) =>{
            state.accounts=payload
            console.log(`Updated ${payload.length} accounts`)
        },
        updateBanks: (state, payload) =>{
            state.banks=payload
            console.log(`Updated ${payload.length} banks`)
        },
        updateConcepts: (state, payload) =>{
            state.concepts=payload
            console.log(`Updated ${payload.length} concepts`)
        },
        updateCreditcards: (state, payload) =>{
            state.creditcards=payload
            console.log(`Updated ${payload.length} credit cards`)
        },
        updateCurrencies: (state, payload) =>{
            state.currencies=payload
            console.log(`Updated ${payload.length} currencies`)
        },
        updateInvestments: (state, payload) =>{
            state.investments=payload
            console.log(`Updated ${payload.length} investments`)
        },
        updateOperationstypes: (state, payload) =>{
            state.operationstypes=payload
            console.log(`Updated ${payload.length} operation types`)
        },
        updateProducts: (state, payload) =>{
            state.products=payload
            console.log(`Updated ${payload.length} products`)
        },
        updateSettings: (state, payload) =>{
            state.local_zone=payload.local_zone
            state.local_currency=payload.local_currency
            console.log("Updated settings")
        },
        updateStockmarkets: (state, payload) =>{
            state.stockmarkets=payload
            console.log(`Updated ${payload.length} stock markets`)
        },
        updateStrategiesTypes: (state, payload) =>{
            state.strategiestypes=payload
            console.log(`Updated ${payload.length} strategy types`)
        },

    },
    actions: {// Can be asynchronous. Fetch data

        getAll(context){
            context.dispatch("getProducts")
            context.dispatch("getAccounts")
            context.dispatch("getBanks")
            context.dispatch("getConcepts")
            context.dispatch("getCreditcards")
            context.dispatch("getCurrencies")
            context.dispatch("getInvestments")
            context.dispatch("getOperationstypes")
            context.dispatch("getSettings")
            context.dispatch("getStockmarkets")
            context.dispatch("getStrategiesTypes")
        },
        getAccounts(context){
            axios.get(`${store.state.apiroot}/api/accounts/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateAccounts', sortObjectsArray(response.data, "name"))
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getBanks(context){
            axios.get(`${store.state.apiroot}/api/banks/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateBanks', sortObjectsArray(response.data, "name"))
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getCreditcards(context){
            axios.get(`${store.state.apiroot}/api/creditcards/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateCreditcards', sortObjectsArray(response.data, "name"))
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getCurrencies(context){
            var locale="en_US"
            if (store.$app.$i18n.locale=='es'){
                locale="es_ES"
            }
            var currencies_object=CurrencyList.getAll(locale)
            var currencies_list=[]
            Object.entries(currencies_object).forEach(o => currencies_list.push(o[1]))
            currencies_list.forEach(o=> o["fullname"]=`${capitalizeFirstLetter(o.name)} (${o.code} - ${o.symbol})`)
            context.commit("updateCurrencies", currencies_list)
        },
        getInvestments(context){
            axios.get(`${store.state.apiroot}/api/investments/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateInvestments', sortObjectsArray(response.data, "name"))
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getConcepts(context){
            axios.get(`${store.state.apiroot}/api/concepts/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateConcepts', sortObjectsArray(response.data, "name"))
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getOperationstypes(context){
            axios.get(`${store.state.apiroot}/api/operationstypes/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateOperationstypes', sortObjectsArray(response.data, "name"))
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getProducts(context){
            axios.get(`${store.state.apiroot}/api/products/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateProducts', sortObjectsArray(response.data, "name"))
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getSettings(context){
            axios.get(`${store.state.apiroot}/settings/`, store.$app.myheaders())
            .then((response) => {
                context.commit("updateSettings", response.data)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getStockmarkets(context){
            axios.get(`${store.state.apiroot}/api/stockmarkets/`, store.$app.myheaders())
            .then((response) => {
                context.commit("updateStockmarkets", response.data)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getStrategiesTypes(context){
            var r=[
                {id:1, name: store.$app.$t("Pairs in same account")},
                {id:2, name: store.$app.$t("Product ranges")},
                {id:3, name: store.$app.$t("Generic")},
            ]
            context.commit("updateStrategiesTypes",r)
        },
    }
})
