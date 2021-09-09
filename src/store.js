import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {sortObjectsArray} from './functions.js'

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
    },    
    getters:{
        getConceptsForDividends: (state) => { 
            return state.concepts.filter( o => [39, 50,59,62,63,65,66,68,70,72,75,76].includes(o.id))
        },
        getObjectByUrl:(state) => (catalog,url,default_=null) => {
            var r=state[catalog].find(o => o.url==url)
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
    },
    mutations: { // Only sincronous changes data
        updateAccounts: (state, payload) =>{
            state.accounts=payload
            console.log("Updated accounts")
            console.log(state.accounts)
        },
        updateBanks: (state, payload) =>{
            state.banks=payload
            console.log("Updated banks")
            console.log(state.banks)
        },
        updateConcepts: (state, payload) =>{
            state.concepts=payload
            console.log("Updated concepts")
            console.log(state.concepts)
        },
        updateCreditcards: (state, payload) =>{
            state.creditcards=payload
            console.log("Updated credit cards")
            console.log(state.creditcards)
        },
        updateCurrencies: (state, payload) =>{
            state.currencies=payload
            console.log("Updated currencies")
            console.log(state.currencies)
        },
        updateInvestments: (state, payload) =>{
            state.investments=payload
            console.log("Updated investments")
            console.log(state.investments)
        },
        updateOperationstypes: (state, payload) =>{
            state.operationstypes=payload
            console.log("Updated operations types")
            console.log(state.operationstypes)
        },
        updateProducts: (state, payload) =>{
            state.products=payload
            console.log("Updated products")
            console.log(state.products)
        },
        updateSettings: (state, payload) =>{
            state.local_zone=payload.local_zone
            state.local_currency=payload.local_currency
            console.log("Updated settings")
            console.log(state.local_currency)
            console.log(state.local_zone)
        },

    },
    actions: {// Can be asynchronous. Fetch data

        getAll(context){
            console.log(context)
            store.dispatch("getAccounts")
            store.dispatch("getBanks")
            store.dispatch("getConcepts")
            store.dispatch("getCreditcards")
            store.dispatch("getInvestments")
            store.dispatch("getOperationstypes")
            store.dispatch("getProducts")
            store.dispatch("getSettings")
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
            var r=[
                {
                    id: "EUR",
                    name: store.$app.$t("Euro"),
                    fullname: store.$app.$t("Euro")+ " (€)",
                    symbol: "€",
                },
                {
                    id: "USD",
                    name: store.$app.$t("American dolar"),
                    fullname: store.$app.$t("American dolar")+ " ($)",
                    symbol: "$",
                },
            ]
            context.commit("updateCurrencies", r)
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
        }
    }
})



// // If property is null returns object
// // If property is a string returns object.string
// // If property is a string that contains a point return object.string.string
// export function get_from_catalog(url, catalog, property='', default_=''){
//     var arr=property.split(".")
//     let object=this.$store.state.catalogs[catalog].find(o => o.url==url)
//     if (property==''){
//         return object
//     } else if (arr.length==1){
//         if (object==null) return default_
//         return object[property]
//     } else { //(item.url, "concepts", "operationstypes.name")
//         var newcatalog=arr[0] //operationstypes
//         var newproperty=arr[1] //name
//         var newobject= this.$store.state.catalogs[newcatalog].find(o => o.url==object[newcatalog])
//         if (newobject==null) return default_
//         return newobject[newproperty]
//     }
// }