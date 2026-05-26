import { defineStore } from 'pinia'
import axios from 'axios'
import { sortObjectsArray, getArrayFromMap } from './functions.js'
import { capitalizeFirstLetter, my_round } from 'vuetify_rules'
import { useDialogStore } from './dialogStore.js'
import i18n from './i18n'

import countries from 'flag-icons/country.json' with { type: 'json' };

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
          parseResponseError(error)
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

export function myheaders(){
    return {
        headers:{
            'Authorization': `Token ${useStore().token}`,
            'Accept-Language': `${localStorage.locale}-${localStorage.locale}`,
            'Content-Type':'application/json'
        }
    }
}

export function myheaders_noauth(){
    return {
        headers:{
            'Accept-Language': `${localStorage.locale}-${localStorage.locale}`,
            'Content-Type':'application/json'
        }
    }
}

export function myheaders_formdata(){
    return {
        headers:{
            'Authorization': `Token ${useStore().token}`,
            'Accept-Language': `${localStorage.locale}-${localStorage.locale}`,
            'Content-Type': 'multipart/form-data'
        }
    }
}

// returns true if everything is ok
// return false if there is something wrong
export async function parseResponse(response){
    if (response._parsed) return response._parsed_ok
    const dialogStore = useDialogStore()
    const store = useStore()
    const { t } = i18n.global
    let result = false
    if (response.status==200){ //Good connection
        if (response.data == "Wrong credentials"){
            store.setToken(null)
            await dialogStore.alert(t("Wrong credentials"))
            result = false
        } else {
            result = true
        }
    } else if (response.status==201){// Created
        result = true
    } else if (response.status==204){// Deleted
        result = true
    } else {
        await dialogStore.alert (`${response.status}: ${response.data}`)
        result = false
    }
    response._parsed = true
    response._parsed_ok = result
    return result
}

export async function parseResponseError(error){
    if (error._handled) return
    const dialogStore = useDialogStore()
    const store = useStore()
    const { t } = i18n.global
    if (error.response) {
        if (error.response.status == 401){
            if (store.token==null){ // Not logged yet
                await dialogStore.alert(t("Wrong credentials"))
            } else {
                await dialogStore.alert (t("You aren't authorized to do this request"))
                store.setToken(null)
                const { router } = await import('./routes.js')
                if (router.currentRoute.name != "about") router.push("about")
                console.log(error.response)
            }
        } else if (error.response.status == 400){ // Used for developer or app errors
            await dialogStore.alert (t("Something wrong with your request")+ "\n" + JSON.stringify(error.response.data));
            console.log(error.response)
        } else if (error.response.status == 403){ // Used for developer or app errors
            await dialogStore.alert (t("You've done something forbidden"))
            store.setToken(null)
            const { router } = await import('./routes.js')
            if (router.currentRoute.name != "about") router.push("about")
            console.log(error.response)
        } else if (error.response.status == 500){
            await dialogStore.alert (t("There is a server error"))
            console.log(error.response)
        }
    } else if (error.request) {
        console.log("The request was made but no response was received")
        await dialogStore.alert (t("Server couldn't answer this request"))
      console.log(error.request);
    } else {
        console.log('Error', error.message);
    }
    error._handled = true
}

export function getConceptsForDividends() { 
    return getArrayFromMap(useStore().concepts).filter( o => [39,50,59,62,63,65,66,68,70,72,75,76,77].includes(o.id))
}

export function getInvestmentsActive() { 
    return getArrayFromMap(useStore().investments).filter(o => o.active==true)
}
export function getInvestmentsByProduct(product) { 
    return getArrayFromMap(useStore().investments).filter(o => o.products==product)
}

export function getMapObjectById(catalog,id) { 
    const store = useStore()
    const url = `${store.apiroot}/api/${catalog}/${id}/`
    return store[catalog].get(url)
}

export function getCurrencyByCode(code,default_=null) {
    var r=useStore()['currencies'].find(o => o.code==code)
    if (r==null){
        return default_
    } else {
        return r
    }
}
export function getCurrencyPropertyByCode(code,property,default_="???") {
    var r=getCurrencyByCode(code)
    if (r==null){
        if (code=='u') return "u"
        return default_
    } else {
        return r[property]
    }
}
export function currency_generic_string(num, currency, locale, decimals=2){
    if (num ==null || isNaN(num)){
        return `- - - ${getCurrencyPropertyByCode(currency,"symbol_native")}`
    } else {
        return `${my_round(num,decimals).toLocaleString(locale, { minimumFractionDigits: decimals,  })} ${getCurrencyPropertyByCode(currency,"symbol_native")}`
    }
}
export function currency_generic_html(num, currency, locale, decimals=2){
    if (num<0){
        return `<span class='vuered'>${currency_generic_string(num, currency, locale, decimals)}</span>`
    } else {
        return currency_generic_string(num, currency, locale, decimals)
    }
}
export function getCountryNameByCode(code) { 
    var r=useStore()['countries'].find(o => o.code==code)
    if (r==null){
        return ""
    } else {
        return r.name
    }
}
  
export function currency_string(num, currency, decimals=2){
    return currency_generic_string(num, currency, localStorage.locale,decimals )
}
export function currency_html(num, currency, decimals=2){
    return currency_generic_html(num, currency, localStorage.locale,decimals )
}
export function localcurrency_string(num, decimals=2){
    return currency_generic_string(num, useStore().profile.currency, localStorage.locale,decimals )
}
export function localcurrency_html(num, decimals=2){
    return currency_generic_html(num, useStore().profile.currency, localStorage.locale,decimals )
}

export function amount_to_invest( invested ){
    let s=useStore().profile

    let sum_1=s.invest_amount_1
    let sum_2=(s.invest_amount_1+s.invest_amount_2)
    let sum_3=(s.invest_amount_1+s.invest_amount_2+s.invest_amount_3)
    let sum_4=(s.invest_amount_1+s.invest_amount_2+s.invest_amount_3+s.invest_amount_4)
    let sum_5=(s.invest_amount_1+s.invest_amount_2+s.invest_amount_3+s.invest_amount_4+s.invest_amount_5)

    let limit_01=sum_1*1/2
    let limit_12=sum_1+(sum_2-sum_1)*1/2
    let limit_23=sum_2+(sum_3-sum_2)*1/2
    let limit_34=sum_3+(sum_4-sum_3)*1/2
    let limit_45=sum_4+(sum_5-sum_4)*1/2


    if (0< invested && invested < limit_01) return s.invest_amount_1
    if (limit_01<=invested && invested < limit_12) return s.invest_amount_2
    if (limit_12<=invested && invested < limit_23) return s.invest_amount_3
    if (limit_23<=invested && invested < limit_34) return s.invest_amount_4
    if (limit_34<=invested && invested < limit_45) return s.invest_amount_5
}

// Global interceptors
axios.interceptors.request.use((config) => {
    if (config.noheaders) return config;
    const store = useStore();
    if (store.token && !config.headers.Authorization) {
        config.headers.Authorization = `Token ${store.token}`;
    }
    if (!config.headers['Accept-Language']) {
        config.headers['Accept-Language'] = `${localStorage.locale}-${localStorage.locale}`;
    }
    if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});

axios.interceptors.response.use(
    async (response) => {
        if (response.config.noparse) return response;
        const ok = await parseResponse(response);
        if (ok) return response;
        return Promise.reject(response);
    },
    async (error) => {
        if (error.config && error.config.noparse) return Promise.reject(error);
        await parseResponseError(error);
        return Promise.reject(error);
    }
);
