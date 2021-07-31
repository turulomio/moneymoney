import moment from 'moment';
import axios from 'axios'

// Function to use "{0} {1}".format(a, b) style
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};
export function currency_symbol(currency){
    if (currency=='EUR'){
        return '€';
    } 
    else if (currency=='USD'){
        return'$';
    }
    else if (currency=='u'){
        return'u';
    }
    else {
            return "???";
    }
}
export function my_round(num, decimals = 2) {
    return Math.round(num*Math.pow(10, decimals))/Math.pow(10, decimals)
}


export function localtime(value){
    if (value){
        var dateFormat = 'YYYY-MM-DD HH:mm:ss';
        var testDateUtc = moment.utc(value);
        var localDate = testDateUtc.local();
        return (localDate.format(dateFormat)); // 2015-30-01 02:00:00
    }
    console.log("REALLY");
    return null;
}   

export function moment_day_start(isostring){
    if (isostring){
        var testDateUtc = moment.utc(isostring);
        var localDate = testDateUtc.local();
        return localDate
    }
    console.log("REALLY");
    return null;
}   


export function AddressTypeName(value){
    var retypes=this.$store.state.catalogs.addresstype.find(t => t.value==value);
    return retypes.display_name;
}


export function myheaders(){
    return {
        headers:{
            'Authorization': `Token ${this.$store.state.token}`,
            'Accept-Language': `${this.$i18n.locale}-${this.$i18n.locale}`,
            'Content-Type':'application/json'
        }
    }
}
export function myheaders_formdata(){
    return {
        headers:{
            'Authorization': `Token ${this.$store.state.token}`,
            'Accept-Language': `${this.$i18n.locale}-${this.$i18n.locale}`,
            'Content-Type': 'multipart/form-data'
        }
    }
}

export function vuex_update_catalogs(){   
    this.$store.state.catalogs.currencies=[
        {
            id: "EUR",
            name: this.$t("Euro"),
            fullname: this.$t("Euro")+ " (€)",
            symbol: "€",
        },
        {
            id: "USD",
            name: this.$t("American dolar"),
            fullname: this.$t("American dolar")+ " ($)",
            symbol: "$",
        },
    ]


    axios.get(`${this.$store.state.apiroot}/api/banks/`, this.myheaders())
    .then((response) => {
        this.$store.state.catalogs.banks= sortObjectsArray(response.data, "name")
        console.log("Updated banks")
        console.log(response.data)
        console.log(response.data.filter((v)=>v.active==true ))
    }, (error) => {
        this.parseResponseError(error)
    });
    axios.get(`${this.$store.state.apiroot}/api/accounts/`, this.myheaders())
    .then((response) => {
        this.$store.state.catalogs.accounts= sortObjectsArray(response.data, "name")
        console.log("Updated accounts")
    }, (error) => {
        this.parseResponseError(error)
    });
    axios.get(`${this.$store.state.apiroot}/api/investments/`, this.myheaders())
    .then((response) => {
        this.$store.state.catalogs.investments= sortObjectsArray(response.data, "name")
        console.log("Updated investments")
    }, (error) => {
        this.parseResponseError(error)
    });
    axios.get(`${this.$store.state.apiroot}/api/concepts/`, this.myheaders())
    .then((response) => {
        this.$store.state.catalogs.concepts= sortObjectsArray(response.data, "name")
        console.log("Updated concepts")
    }, (error) => {
        this.parseResponseError(error)
    });
}

export function get_concept(url){
    return this.$store.state.catalogs.concepts.find(o => o.url==url)
}

export function logout(){
    const formData = new FormData();
    formData.append('key', this.$store.state.token);
    axios.post(`${this.$store.state.apiroot}/logout/`, formData)
    .then((response) => {
        console.log(response.data);
        this.$store.state.token=null;
        this.$store.state.logged=false;
    }, (error) => {
        this.parseResponseError(error)
        });
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

// returns true if everything is ok
// return false if there is something wrong
export function parseResponse(response){
    if (response.status==200){ //Good connection
        if (response.data == "Invalid user" || response.data == "Wrong password"){
            this.$store.state.token=null;
            this.$store.state.logged=false;
            if (this.$router.currentRoute.name != "home") this.$router.push("home")
            alert(response.data)
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

export function getLocalStorage(key, default_){
    if (localStorage.getItem(key)){
        return localStorage.getItem(key)
    } else {
        return default_
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
            alert (this.$t("You aren't authorized to do this request"))
            this.$store.state.token=null;
            this.$store.state.logged=false;
            if (this.$router.currentRoute.name != "home") this.$router.push("home")
            console.log(error.response)
        } else if (error.response.status == 500){
            alert (this.$t("There is a server error"))
            console.log(error.response)
        } else {
            alert (this.$t("Unknown error"))
            
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

export function arrayobjects_to_stringofstrings(l, key){
    var s=""
    l.forEach(o => s=s+o[key].toString() + ", ")
    return s.slice(0,-2)
}

export function percentage_generic_string(num, locale, decimals=2){
    if (isNaN(num)) return "- - - %"
    return "{0} %".format(my_round(num*100,decimals).toLocaleString(locale,{ minimumFractionDigits: decimals,  }));
}

export function percentage_generic_html(num, locale, decimals=2){
    if (num>=0 || isNaN(num)){
        return "<span>{0}</span>".format(percentage_generic_string(num, locale, decimals))
    } else {
        return "<span class='vuered'>{0}</span>".format(percentage_generic_string(num, locale, decimals));
    }
}
export function currency_generic_string(num, currency, locale, decimals=2){
    return "{0} {1}".format(my_round(num,decimals).toLocaleString(locale, { minimumFractionDigits: decimals,  }), currency_symbol(currency));
}

export function currency_generic_html(num, currency, locale, decimals=2){
    if (num>=0){
        return currency_generic_string(num, currency, locale, decimals)
    } else {
        return "<span class='vuered'>{0}</span>".format(currency_generic_string(num, currency, locale, decimals));
    }
}


export function listobjects_sum(lo,key){
    return lo.reduce((accum,item) => accum + item[key], 0)
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