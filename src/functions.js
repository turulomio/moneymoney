import {my_round} from 'vuetify_rules'
import moment from "moment-timezone"


export function string_with_localized_now(tz){
    /**
     * Return a string in YYYYMMDD HHmmSS with localized_now
     */
    let nowInMadrid = moment().tz(tz);
    return nowInMadrid.format('YYYYMMDD HHmmSS');
}

export function yesterday_in_isostring(){
    // Get the current date
    let currentDate = new Date();

    // Subtract one day (86400000 milliseconds = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    let previousDate = new Date(currentDate.getTime() - 86400000);

    // Convert to ISO string
    return previousDate.toISOString().split('T')[0];
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


// Generate a hyperlinked_url (DRF hyperlinked url) from model and id
export function hyperlinked_url(model,id){
    return `${import.meta.env.VITE_DJANGO_MONEYMONEY_URL}/api/${model}/${id}/`
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

export function getArrayFromMap(catalog){
    //Catalog is a map
    return Array.from(catalog).map(([,value]) => (value))
    
}

export function percentage_string(num, decimals=2){
    return percentage_generic_string(num,localStorage.locale,decimals )
}
export function percentage_html(num, decimals=2){
    return percentage_generic_html(num,localStorage.locale,decimals )
}

// Uses .local()
export function zulu2date(value){
    return new Date(value)
}   
// Uses .local()
export function date2zulu(value){
    return value.toISOString()
}   
