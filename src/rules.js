// IMPORTANT
// v-text-field can't be type="number" it doesn't recognized alpha characters
// v-model.number can be used


// TO improve readibility I will emule rules behavier
// Rules returns [] when everything is ok, returns a ['comment'] to show error

import moment from 'moment'


export function isNullOrEmpty(n){
    if (n==="") return true
    if (n===0) return false
    if (n===null) return true
    return false
}

//Returns if it's a Number, with required attribute
export function isNumber(n){
    return typeof n === 'number' && isFinite(n);

}

export function isNumberWithRequired(n,required){
    var r=false
    if (required==true){
        if (isNumber(n)) r= true
    } else {
        if (isNullOrEmpty(n) || isNumber(n)) r= true
    }
    return r
}

//Returns if it's a Number with max digits, with required attribute
export function isNumberMaxDigitsWithRequired(n,required,maxdigits){
    if (required==true){
        if (isNumberWithRequired(n,required) && n.toString().length<=maxdigits) return true
    } else { //required false
        if (isNullOrEmpty(n))  return true
        if (isNumberWithRequired(n,required) && n.toString().length<=maxdigits) return true
    }
    return false
}

//Counts the number of decimals of a number
export function countDecimals (n) {
    if (isNaN(n)) return 0
    if(Math.floor(n) === n) return 0;
    var arr=String(n).split(".")
    if (arr.length!=2) return 0
    return n.toString().split(".")[1].length || 0; 
}
    
function translate(s){
    if (this==undefined){
        return s
    } 
    return this.$t(s)

}
    
export function RulesInteger(maxdigits,required){
    var r
    if (required==false){
        r= [
            v => (isNullOrEmpty(v) || isNumberMaxDigitsWithRequired(v,required,maxdigits)) || translate('Field can be empty or a number with [0] digits at most').format(maxdigits),
            v => (isNullOrEmpty(v) || isNumber(v) && countDecimals(v)<=0) || translate('Must be an integer number'),
        ]
    } else { // required==true
        r= [
            v => isNumberMaxDigitsWithRequired(v,required,maxdigits)|| translate('Field must be a number with at most [0] digits').format(maxdigits),
            v => countDecimals(v)<=0 || translate('Must be an integer number'),
        ]
    }
    return r
}


// If required==true must be 0 or a number
// If required==false can be null,
export function RulesFloat (maxdigits, required, maxdecimals){
    var r
    if (required==false){
        r= [
            v => (isNullOrEmpty(v) || isNumberMaxDigitsWithRequired(v,required,maxdigits)) || translate('Field can be empty or a number with [0] digits at most').format(maxdigits),
            v => (isNullOrEmpty(v) || isNumber(v) && countDecimals(v)<=maxdecimals) || translate('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    } else { // required==true
        r= [
            v => isNumberMaxDigitsWithRequired(v,required,maxdigits)|| translate('Field must be a number with at most [0] digits').format(maxdigits),
            v => countDecimals(v)<=maxdecimals || translate('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    }
    return r
}
//Float Greaater Zero
export function RulesFloatGZ (maxdigits, required, maxdecimals){
    var r
    if (required==false){
        r= [
            v => (isNullOrEmpty(v) || isNumberMaxDigitsWithRequired(v,required,maxdigits)) || translate('Field can be empty or a number with [0] digits at most').format(maxdigits),
            v => (isNullOrEmpty(v) || (isNumber(v) && v>0)) || translate('Must be a number greater than zero'),
            v => (isNullOrEmpty(v) || (isNumber(v) && countDecimals(v)<=maxdecimals)) || translate('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    } else { // required==true
        r= [
            v => isNumberMaxDigitsWithRequired(v,required,maxdigits)|| translate('Field must be a number with at most [0] digits').format(maxdigits),
            v => v>0 || translate('Must be a number greater than zero'),
            v => countDecimals(v)<=maxdecimals || translate('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    }
    return r
}
//Number Greater Equal Zero
export function RulesFloatGEZ (maxdigits, required, maxdecimals){
    var r
    if (required==false){
        r= [
            v => (isNullOrEmpty(v) || isNumberMaxDigitsWithRequired(v,required,maxdigits)) || translate('Field can be empty or a number with [0] digits at most').format(maxdigits),
            v => (isNullOrEmpty(v) || isNumber(v) && v>=0) || translate('Must be a number greater than zero'),
            v => (isNullOrEmpty(v) || isNumber(v) && countDecimals(v)<=maxdecimals) || translate('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    } else { // required==true
        r= [
            v => isNumberMaxDigitsWithRequired(v,required,maxdigits)|| translate('Field must be a number with at most [0] digits').format(maxdigits),
            v => v>=0 || translate('Must be a number greater than zero'),
            v => countDecimals(v)<=maxdecimals || translate('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    }
    return r
}
export function RulesFloatLEZ(maxdigits, required, maxdecimals){
    var r
    if (required==false){
        r= [
            v => (isNullOrEmpty(v) || isNumberMaxDigitsWithRequired(v,required,maxdigits)) || translate('Field can be empty or a number with [0] digits at most').format(maxdigits),
            v => (isNullOrEmpty(v) || isNumber(v) && v<=0) || translate('Must be a number greater than zero'),
            v => (isNullOrEmpty(v) || isNumber(v) && countDecimals(v)<=maxdecimals) || translate('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    } else { // required==true
        r= [
            v => isNumberMaxDigitsWithRequired(v,required,maxdigits)|| translate('Field must be a number with at most [0] digits').format(maxdigits),
            v => v<=0 || translate('Must be a number greater than zero'),
            v => countDecimals(v)<=maxdecimals || translate('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    }
    return r
}

// Returns if string has this format 'YYYY-mm-DD'
export function isDateIsoString(s){
    if (typeof s!="string") return false
    if (s.split("-").length!=3) return false
    if ( moment(s, moment.ISO_8601).isValid()==false) return false 
    return true

}

export function RulesDateIsoString(required){
    var error=translate("Field must be a string representig a date in iso format")
    var r
    if (required==true){
        r= [
            v => (!isNullOrEmpty(v) && isDateIsoString(v))|| error,
        ]
    } else {
        r= [
            v => (isNullOrEmpty(v) || isDateIsoString(v))|| error,
        ]
    }

    return r
}

// Returns if string has this format '2016-10-10T15:35:52.764Z'
export function isDatetimeAwareIsoString(s){
    if (typeof s!="string") return false
    if (s.split("-").length!=3) return false
    if (s.split(":").length!=3) return false
    if (s.includes("T")==false) return false
    if (s.endsWith("Z")==false) return false
    if ( moment(s, moment.ISO_8601).isValid()==false) return false 
    return true

}

export function RulesDatetimeAwareIsoString(required){
    var error=translate("Field must be a string representig a date time with timezone in iso format")
    var r
    if (required==true){
        r= [
            v => (!isNullOrEmpty(v) && isDatetimeAwareIsoString(v))|| error,
        ]
    } else {
        r= [
            v => (isNullOrEmpty(v) || isDatetimeAwareIsoString(v))|| error,
        ]
    }

    return r
}



export function RulesDatetime(required){
    console.log("Deprecated, will remove in 2024-03-01: RulesDatetime should change to RulesDatetimeAwareIsoString")
    var r= [
        v => (!!v) || translate('You must select date and time'),
    ]
    if (required==false){
        r.shift()
    }
    return r
}
export function RulesDate(required){
    console.log("Deprecated, will remove in 2024-03-01: RulesDate should change to RulesDateIsoString")
    var r= [
            v => (!!v) || translate("You must select a date"),
        ]
    if (required==false){
        r.shift()
    }
    return r
}

export function isStringWithMaxDigits(s,mindigits,maxdigits){
    if (typeof s!="string") return false
    if (s.length<mindigits || s.length>maxdigits) return false
    return true
}


// Si required=true no puede ser ni null ni ""
export function RulesString(maxdigits,required){
    var error_required=translate("Field must be a string with at most [0] characters").format(maxdigits)
    var error_not_required=translate("Field must be empty or a string with at most [0] characters").format(maxdigits)
    var r

    translate("String must be empty or at most [0] characters").format(maxdigits)
    if (required==true){
        r= [
            v => (!isNullOrEmpty(v) && isStringWithMaxDigits(v,1,maxdigits))|| error_required,
        ]
    } else {
        r= [
            v => (isNullOrEmpty(v) || isStringWithMaxDigits(v,0,maxdigits))|| error_not_required,
        ]
    }
    return r
}

// Si required=true no puede ser ni null ni ""
export function RulesPassword(maxdigits,required){
    var error_required=translate("Field must be a string between 8 and [0] characters").format(maxdigits)
    var error_not_required=translate("Field must be empty or a string between 8 and [0] characters").format(maxdigits)
    var r
    if (required==true){
        r= [
            v => (!isNullOrEmpty(v) && isStringWithMaxDigits(v,8,maxdigits))|| error_required,
        ]
    } else {
        r= [
            v => (isNullOrEmpty(v) || isStringWithMaxDigits(v,8,maxdigits))|| error_not_required,
        ]
    }
    return r
}

export function RulesSelection(required){
    var r= []
    if (required==true){
        r.push((v) => !!v || translate('Selection is required'))
    }
    return r
}
export function RulesEmail(required){

    var r=  [
        v => !!v || translate('Email is required'),
        v => /.+@.+/.test(v) || translate('Invalid Email address') 
    ]
    if (required==false){
        r.shift()
    }
    return r
}

