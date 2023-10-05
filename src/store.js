import { defineStore } from 'pinia'
import axios from 'axios'
import { myheaders, capitalizeFirstLetter, sortObjectsArray} from './my_commons.js'
import CurrencyList from 'currency-list'

import countries from 'flag-icons/country.json'

export const useStore = defineStore('global', {
  state: () => {
    return { 
        token:null,
        logged:false,
        count:0,
        apiroot: import.meta.env.VITE_DJANGO_MONEYMONEY_URL,
        version: "1.2.0",
        versiondate: new Date(2023, 9, 5, 7, 54),
        publicPath: import.meta.env.VUE_APP_PUBLIC_PATH,
        catalog_manager: false,
        accounts: new Map(),
        banks: new Map(),
        creditcards: new Map(),
        concepts: new Map(),
        countries:countries,
        currencies: [],
        investments: new Map(),
        leverages: new Map(),
        operationstypes: new Map(),
        products: new Map(),
        productstypes: new Map(),
        profile: null,
        stockmarkets:new Map(),
        strategiestypes:new Map(),
        recomendation_methods:new Map(),
    }
  },

  actions: {
    increment() {
        this.count=this.count+1
    },
    setToken(token){
      this.token=token
      if (this.token){
        this.logged=true
      } else {
        this.logged=false
      }
    },
    updateAccounts() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/accounts/`, myheaders())
        .then((response)=>{
          this.accounts.clear()
          response.data.forEach(o=>{
            this.accounts.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} accounts in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateBanks() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/banks/`, myheaders())
        .then((response)=>{
          this.banks.clear()
          response.data.forEach(o=>{
            this.banks.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} banks in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },

    updateCatalogManager(){
      var start=new Date()
      return axios.get(`${this.apiroot}/catalog_manager/`, myheaders())
      .then((response) => {
          this.catalog_manager=response.data
          console.log(`Updated catalog manager in ${new Date()-start} ms`)
      }, (error) => {
          this.$app.parseResponseError(error)
      });
    },
    updateCreditCards() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/creditcards/`, myheaders())
        .then((response)=>{
          this.creditcards.clear()
          response.data.forEach(o=>{
            this.creditcards.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} credit cards in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateCurrencies(){
        var start=new Date()
        if (!localStorage.locale || localStorage.locale==null) {
         localStorage.locale="en"
        }
        console.log(localStorage.locale)
        var currencies_object=CurrencyList.getAll(localStorage.locale)
        var currencies_list=[]
        Object.entries(currencies_object).forEach(o => currencies_list.push(o[1]))
        currencies_list.forEach(o=> o["fullname"]=`${capitalizeFirstLetter(o.name)} (${o.code} - ${o.symbol})`)
        this.currencies=currencies_list
        console.log(`Updated ${currencies_list.length} currencies in ${new Date()-start} ms`)
    },
    updateInvestments() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/investments/`, myheaders())
        .then((response)=>{
          this.investments.clear()
          response.data.forEach(o=>{
            this.investments.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} investments in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateLeverages() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/leverages/`, myheaders())
        .then((response)=>{
          this.leverages.clear()
          response.data.forEach(o=>{
            this.leverages.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} leverages in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateConcepts() {
        var start=new Date()
        this.concepts.clear()
        return axios.get(`${this.apiroot}/api/concepts/`, myheaders())
        .then((response)=>{
          response.data.forEach(o=>{
            this.concepts.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} concepts in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateOperationstypes() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/operationstypes/`, myheaders())
        .then((response)=>{
          this.operationstypes.clear()
          response.data.forEach(o=>{
            this.operationstypes.set(o.url, o)
          })
          console.log(`Updated ${response.data.length} operations types in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateProducts() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/products/`, myheaders())
        .then((response)=>{
          this.products.clear()
          response.data.forEach(o=>{
            this.products.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} products in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateProductstypes() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/productstypes/`, myheaders())
        .then((response)=>{
          this.productstypes.clear()
          response.data.forEach(o=>{
            this.productstypes.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} products types in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateRecomendationsMethos() {
        var start=new Date()
        return axios.get(`${this.apiroot}/recomendationmethods/`, myheaders())
        .then((response)=>{
          this.recomendation_methods.clear()
          sortObjectsArray(response.data, "name").forEach(o=>{
            this.recomendation_methods.set(o.id, o)
          })  
          console.log(`Updated ${response.data.length} recomendation methods in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateProfile() {
        var start=new Date()
        return axios.get(`${this.apiroot}/profile/`, myheaders())
        .then((response)=>{
          this.profile = response.data
          console.log(`Updated profile in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateStockmarkets() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/stockmarkets/`, myheaders())
        .then((response)=>{
          this.stockmarkets.clear()
          response.data.forEach(o=>{
            this.stockmarkets.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} stock markets in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateStrategiestypes() {
        var start=new Date()
        this.strategiestypes.clear()
        this.strategiestypes.set(1, {id:1, name: "Pairs in same account"})
        this.strategiestypes.set(2, {id:2, name: "Product ranges"})
        this.strategiestypes.set(3,{id:3, name: "Generic"})
        console.log(`Updated ${this.strategiestypes.size} strategies types in ${new Date()-start} ms`)
    },
    updateAll(){
      return Promise.all([
        this.updateAccounts(),
        this.updateBanks(),
        this.updateCatalogManager(),
        this.updateCreditCards(),
        this.updateCurrencies(),
        this.updateInvestments(),
        this.updateLeverages(),
        this.updateConcepts(),
        this.updateOperationstypes(),
        this.updateProducts(),
        this.updateProductstypes(),
        this.updateRecomendationsMethos(),
        this.updateProfile(),
        this.updateStockmarkets(),
        this.updateStrategiestypes(),
      ])
    },
  }
})
