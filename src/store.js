import { defineStore } from 'pinia'
import axios from 'axios'
import { myheaders, sortObjectsArray, getArrayFromMap} from './functions.js'
import { capitalizeFirstLetter } from 'vuetify_rules'

import countries from 'flag-icons/country.json'

export const useStore = defineStore('global', {
  state: () => {
    return { 
        token:null,
        logged:false,
        count:0,
        apiroot: import.meta.env.VITE_DJANGO_MONEYMONEY_URL,
        version: "1.4.0",
        versiondate: new Date(2026, 2, 22, 12, 30),
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
        productsstrategies: new Map(),
        productstypes: new Map(),
        profile: null,
        stockmarkets:new Map(),
        strategiestypes:new Map(),
        recomendation_methods:new Map(),
    }
  },
  getters:{
    getOperationstypesForNewConcepts(state) { 
      return getArrayFromMap(state.operationstypes).filter( o => [1,2].includes(o.id))
    },
    getProfileUppercaseChars(state) {
      // Helper function to get uppercase characters from a string
      function getUppercaseChars(str) {
          return str.replace(/[^A-Z]/g, '');
      }
  
      // Get the uppercase characters of each string
      const upperChars1 = getUppercaseChars(state.profile.first_name);
      const upperChars2 = getUppercaseChars(state.profile.last_name);
  
      // Join the uppercase characters together
      return upperChars1 + upperChars2
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
        
        const locale = localStorage.locale;
        const currencyCodes = Intl.supportedValuesOf("currency");
        const currencies_list = [];

        // Intl.DisplayNames se usa para obtener nombres de moneda localizados
        const displayNames = new Intl.DisplayNames([locale], { type: 'currency' });

        currencyCodes.forEach(code => {
            let symbol = code; // Valor de respaldo predeterminado para el símbolo
            let decimal_digits = 2; // Valor de respaldo predeterminado para los dígitos decimales
            let name = code.toLowerCase(); // Valor de respaldo predeterminado para el nombre
            let name_plural = code.toLowerCase() + 's'; // Heurística predeterminada para el nombre en plural

            try {
                // Usar Intl.NumberFormat para obtener el símbolo de la moneda y los dígitos decimales
                const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: code, minimumFractionDigits: 0, maximumFractionDigits: 0 });
                const parts = formatter.formatToParts(0);
                const symbolPart = parts.find(part => part.type === 'currency');
                if (symbolPart) {
                    symbol = symbolPart.value;
                }

                const resolvedOptions = new Intl.NumberFormat(locale, { style: 'currency', currency: code }).resolvedOptions();
                decimal_digits = resolvedOptions.minimumFractionDigits;

                // Obtener el nombre localizado de la moneda
                const intlName = displayNames.of(code);
                if (intlName) {
                    name = intlName.toLowerCase();
                    // Nota: Intl no proporciona formas plurales directamente. Esta es una heurística simple.
                    name_plural = name + 's'; 
                }

            } catch (e) {
                console.warn(`Error procesando la moneda ${code} para el locale ${locale}: ${e.message}`);
                // Los valores de respaldo ya están establecidos arriba
            }

            currencies_list.push({
                code: code,
                decimal_digits: decimal_digits,
                name: name,
                name_plural: name_plural,
                rounding: 0, // Intl no proporciona directamente una propiedad 'rounding' para las monedas
                symbol: symbol,
                symbol_native: symbol, // Intl no proporciona un 'symbol_native' distinto fácilmente, se usa 'symbol'
                fullname: `${capitalizeFirstLetter(name)} (${code} - ${symbol})`
            });
        });
        this.currencies=currencies_list
        console.log(this.currencies)
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
    updateProductsstrategies() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/productsstrategies/`, myheaders())
        .then((response)=>{
          this.productsstrategies.clear()
          response.data.forEach(o=>{
            this.productsstrategies.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} products strategies in ${new Date()-start} ms`)
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
        this.strategiestypes.set(4,{id:4, name: "Fast operations"})
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
        this.updateProductsstrategies(),
        this.updateRecomendationsMethos(),
        this.updateProfile(),
        this.updateStockmarkets(),
        this.updateStrategiestypes(),
      ])
    },
  }
})
