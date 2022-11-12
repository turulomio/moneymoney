import moment from 'moment-timezone'



// Function to use "{0} {1}".format(a, b) style
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

export function my_round(num, decimals = 2) {
    return Math.round(num*Math.pow(10, decimals))/Math.pow(10, decimals)
}


// Value es un utc iso string with T and Z
export function localtime(value){
    if (value){
        var dateFormat = 'YYYY-MM-DD HH:mm:ss';
        var testDateUtc = moment.utc(value);
        var localDate = testDateUtc.tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
        return (localDate.format(dateFormat)); // 2015-30-01 02:00:00
    }
    return null;
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


export function myheaders_noauth(){
    return {
        headers:{
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

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

export function parseNumber(strg){
    strg = strg.toString().replace(',', '.');
    return parseFloat(strg);
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
        if (response.data == "Wrong credentials"){
            this.$store.state.token=null
            this.$store.state.logged=false
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
            alert (this.$t("You aren't authorized to do this request"))
            this.$store.state.token=null;
            this.$store.state.logged=false;
            if (this.$router.currentRoute.name != "home") this.$router.push("home")
            console.log(error.response)
        } else if (error.response.status == 400){ // Used for developer or app errors
            alert (this.$t("Something wrong with your request"))
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
    if (num==null) return "- - - %"
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

export function get_current_monthpicker_string(){
    return `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,'0')}`
}

export function ifnullempty(value){
    if (value==null) return ""
    return value
}


// Generate a hyperlinked_url (DRF hyperlinked url) from model and id uses $sotre for apiroot
export function hyperlinked_url(model,id){
    return `${this.$store.state.apiroot}/api/${model}/${id}/`
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
