import { useStore } from './store.js'
import {my_round} from 'vuetify_rules'
import moment from "moment-timezone"


export function string_with_localized_now(tz){
    /**
     * Return a string in YYYYMMDD HHmmSS with localized_now
     */
    let nowInMadrid = moment().tz(tz);
    return nowInMadrid.format('YYYYMMDD HHmmSS');
}

export function myheaders(){
    return {
        headers:{
            'Authorization': `Token ${useStore().token}`,
            'Accept-Language': `${localStorage.locale}-${localStorage.locale}`,
            'Content-Type':'application/json'
        }
    }
}

export function yesterday_in_isostring(){
    // Get the current date
    let currentDate = new Date();

    // Subtract one day (86400000 milliseconds = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    let previousDate = new Date(currentDate.getTime() - 86400000);

    // Convert to ISO string
    return previousDate.toISOString().split('T')[0];
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
export function parseResponse(response){
    if (response.status==200){ //Good connection
        if (response.data == "Wrong credentials"){
            this.useStore().token=null
            this.useStore().logged=false
            alert(this.$t("Wrong credentials"))
            return false
        }
        return true
    } else if (response.status==201){// Created
        
    } else if (response.status==204){// Deleted
    } else {
        alert (`${response.status}: ${response.data}`)
        return false
    }
}

export function parseResponseError(error){
    if (error.response) {
      // Request made and server responded
        console.log("made and responded")
//       console.log(error.response.data);
//       console.log(error.response.status);
//       console.log(error.response.headers);
        if (error.response.status == 401){
            if (this.useStore().token==null){ // Not logged yet
                alert(this.$t("Wrong credentials"))
            } else {
                alert (this.$t("You aren't authorized to do this request"))
                this.useStore().token=null;
                this.useStore().logged=false;
                if (this.$router.currentRoute.name != "about") this.$router.push("about")
                console.log(error.response)
            }
        } else if (error.response.status == 400){ // Used for developer or app errors
            alert (this.$t("Something wrong with your request"))
            console.log(error.response)
        } else if (error.response.status == 403){ // Used for developer or app errors
            alert (this.$t("You've done something forbidden"))
            this.useStore().token=null;
            this.useStore().logged=false;
            if (this.$router.currentRoute.name != "about") this.$router.push("about")
            console.log(error.response)
        } else if (error.response.status == 500){
            alert (this.$t("There is a server error"))
            console.log(error.response)
        }
    } else if (error.request) {
        console.log("The request was made but no response was received")
        alert (this.$t("Server couldn't answer this request"))
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
        console.log("OTROS")
        console.log('Error', error.message);
    }
}

export function sortObjectsArray(objectsArray, sortKey)
{
    // Quick Sort:
    var retVal;

    if (1 < objectsArray.length)
    {
        var pivotIndex = Math.floor((objectsArray.length - 1) / 2);  // middle index
        var pivotItem = objectsArray[pivotIndex];                    // value in the middle index
        var less = [], more = [];

        objectsArray.splice(pivotIndex, 1);                          // remove the item in the pivot position
        objectsArray.forEach(function(value)
        {
            value[sortKey] <= pivotItem[sortKey] ?                   // compare the 'sortKey' proiperty
                less.push(value) :
                more.push(value) ;
        });

        retVal = sortObjectsArray(less, sortKey).concat([pivotItem], sortObjectsArray(more, sortKey));
    }
    else
    {
        retVal = objectsArray;
    }
    
    return retVal;
}


export function arrayobjects_to_stringofstrings(l, key){
    var s=""
    l.forEach(o => s=s+o[key].toString() + ", ")
    return s.slice(0,-2)
}


export function arrayofintegers_to_stringofintegers(l){
    var s=""
    l.forEach(o => s=s+o.toString() + ", ")
    return s.slice(0,-2)
}


export function stringofintegers_to_arrayofintegers(s,separator=", "){
    var l=[]
    s.split(separator).forEach(o => l.push(parseInt(o)))
    return l
}


export function arrayobjects_to_array(l, key){
    var s=[]
    l.forEach(o => s.push(o[key]))
    return s
}

export function percentage_generic_string(num, locale, decimals=2){
    if (num==null || isNaN(num)) return "- - - %"
    return `${my_round(num*100,decimals).toLocaleString(locale,{ minimumFractionDigits: decimals,  })} %`
}

export function percentage_generic_html(num, locale, decimals=2){
    if (num==null){
        return percentage_generic_string(num,locale,decimals)
    }

    if (num>=0){
        return `<span>${percentage_generic_string(num, locale, decimals)}</span>`
    } else {
        return `<span class='vuered'>${percentage_generic_string(num, locale, decimals)}</span>`
    }
}


// Find the maximum number of decimal places
export function listobjects_maxdecimals(lo, key){
    let maxDecimals = 0;
    lo.forEach(o => {
        const decimalPart = o[key].toString().split('.')[1];
        if (decimalPart) {
        maxDecimals = Math.max(maxDecimals, decimalPart.length);
        }
    });
    return maxDecimals

}

// Sums values in a lo respecting the max number of decimals
export function listobjects_sum(lo,key,decimals=null){
    if (lo.length==0) return 0
    if (decimals==null) decimals=listobjects_maxdecimals(lo,key)
    return my_round(lo.reduce((accum,item) => accum + item[key], 0), decimals)
}

export function listobjects_average_ponderated(lo,key1, key2){
    var prod=0;
    var total=0;
    var i;
    for (i = 0; i < lo.length; i++) {
        prod=prod+lo[i][key1]*lo[i][key2]
        total=total+lo[i][key2]
    } 
    return prod/total
}


// Generate a hyperlinked_url (DRF hyperlinked url) from model and id uses $sotre for apiroot
export function hyperlinked_url(model,id){
    return `${useStore().apiroot}/api/${model}/${id}/`
}

//Gets id (integer) from an hyperlinked_url(DRF hyperlinked ul)
export function id_from_hyperlinked_url(url){
    let r=url.split("/") //[ "http:", "", "localhost:8011", "api", "additive_risks", "0", "" ]
    return parseInt(r[r.length-2])
}

// file is the value of v-file-input. La funcion donde se pone la función debe ser async y para recibir valor const l= await getBase64(file)
// Returns an object with image in base64, jsimage, and mime parameters
export function getBase64(file) {
    // Returns a promise which gets resolved or rejected based on the reader events
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        // Sets up even listeners BEFORE you call reader.readAsDataURL
        reader.onload = function () {
            const result = reader.result
            var r={
                jsimage: result,
                image: result.split(",")[1],
                mime: result.split(";base64,")[0].split(":")[1],
            }
            return resolve(r)
        };
        reader.onerror = function (error) {
            return reject(error);
        };
        // Calls reader function
        reader.readAsDataURL(file);
    })
}




/// OLD GETTERS

export function getConceptsForDividends() { 
    return getArrayFromMap(useStore().concepts).filter( o => [39,50,59,62,63,65,66,68,70,72,75,76,77].includes(o.id))
}

export function getInvestmentsActive() { 
    return getArrayFromMap(useStore().investments).filter(o => o.active==true)
}
export function getInvestmentsByProduct(product) { 
    return getArrayFromMap(useStore().investments).filter(o => o.products==product)
}


export function getOperationstypesForInvestmentsOperations() { 
    return getArrayFromMap(useStore().operationstypes).filter( o => [4,5,6,8,9,10].includes(o.id))
}


export function getMapObjectById(catalog,id) { 
    // If id doesn't exists return undefined
    var url=hyperlinked_url(catalog,id)
    var r= useStore()[catalog].get(url)
    return r
}

export function getArrayFromMap(catalog){
    //Catalog is a map
    return Array.from(catalog).map(([,value]) => (value))
    
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
export function percentage_string(num, decimals=2){
    return percentage_generic_string(num,localStorage.locale,decimals )
}
export function percentage_html(num, decimals=2){
    return percentage_generic_html(num,localStorage.locale,decimals )
}
export function localcurrency_string(num, decimals=2){
    return currency_generic_string(num, useStore().profile.currency, localStorage.locale,decimals )
}
export function localcurrency_html(num, decimals=2){
    return currency_generic_html(num, useStore().profile.currency, localStorage.locale,decimals )
}
// Uses .local()
export function zulu2date(value){
    return new Date(value)
}   
// Uses .local()
export function date2zulu(value){
    return value.toISOString()
}   

// invested is the amount to invest in local currency
// Se aplica un margin del 10%  
export function amount_to_invest( invested ){
    let s=this.useStore().profile

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

