// IMPORTANT
// v-text-field can't be type="number" it doesn't recognized alpha characters
// v-model.number can be used


// TO improve readibility I will emule rules behavier
// Rules returns [] when everything is ok, returns a ['comment'] to show error




export function isNullOrEmpty(n){
        var r=false
        if (n==null) return r=true
        if (n=="") return r=true
        //console.log(`isnullorempty: ${n} ${typeof n}: ${r}`)
        return r
    }
//Returns if it's a Number, with required attribute
export function isNumber(n){
    if (isNaN(parseFloat(n))==false) return true
    return false
}
export function isNumberWithRequired(n,required){
    var r=false
    if (required==true){
        if (isNumber(n)) r= true
    } else {
        if (isNullOrEmpty(n) || isNumber(n)) r= true
    }
    //console.log(`isnumberwithrequired: ${n} ${required} ${typeof n}: ${r}`)
    return r
}
//Returns if it's a Number with max digits, with required attribute
export function isNumberMaxDigitsWithRequired(n,required,maxdigits){
    var r=false
    if (isNumberWithRequired(n,required) && n.toString().length<=maxdigits) r=true
    //console.log(`isnumbermaxdigitswithrequired: ${n} ${required} ${typeof n} ${maxdigits}: ${r}`)
    return r
}

//Counts the number of decimals of a number
export function countDecimals (n) {
    if (isNaN(n)) return 0
    if(Math.floor(n) === n) return 0;
    var arr=String(n).split(".")
    if (arr.length!=2) return 0
    return n.toString().split(".")[1].length || 0; 
}
    

    
export function RulesInteger(maxdigits,required){
    var r
    if (required==false){
        r= [
            v => (isNullOrEmpty(v) || isNumberMaxDigitsWithRequired(v,required,maxdigits)) || this.$t('Field can be empty or a number with [0] digits at most').format(maxdigits),
            v => (isNullOrEmpty(v) || isNumber(v) && countDecimals(v)<=0) || this.$t('Must be an integer number'),
        ]
    } else { // required==true
        r= [
            v => isNumberMaxDigitsWithRequired(v,required,maxdigits)|| this.$t('Field must be a number with at most [0] digits').format(maxdigits),
            v => countDecimals(v)<=0 || this.$t('Must be an integer number'),
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
            v => (isNullOrEmpty(v) || isNumberMaxDigitsWithRequired(v,required,maxdigits)) || this.$t('Field can be empty or a number with [0] digits at most').format(maxdigits),
            v => (isNullOrEmpty(v) || isNumber(v) && countDecimals(v)<=maxdecimals) || this.$t('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    } else { // required==true
        r= [
            v => isNumberMaxDigitsWithRequired(v,required,maxdigits)|| this.$t('Field must be a number with at most [0] digits').format(maxdigits),
            v => countDecimals(v)<=maxdecimals || this.$t('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    }
    return r
}
//Float Greaater Zero
export function RulesFloatGZ (maxdigits, required, maxdecimals){
    var r
    if (required==false){
        r= [
            v => (isNullOrEmpty(v) || isNumberMaxDigitsWithRequired(v,required,maxdigits)) || this.$t('Field can be empty or a number with [0] digits at most').format(maxdigits),
            v => (isNullOrEmpty(v) || isNumber(v) && v>0) || this.$t('Must be a number greater than zero'),
            v => (isNullOrEmpty(v) || isNumber(v) && countDecimals(v)<=maxdecimals) || this.$t('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    } else { // required==true
        r= [
            v => isNumberMaxDigitsWithRequired(v,required,maxdigits)|| this.$t('Field must be a number with at most [0] digits').format(maxdigits),
            v => v>0 || this.$t('Must be a number greater than zero'),
            v => countDecimals(v)<=maxdecimals || this.$t('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    }
    return r
}
//Number Greater Equal Zero
export function RulesFloatGEZ (maxdigits, required, maxdecimals){
    var r
    if (required==false){
        r= [
            v => (isNullOrEmpty(v) || isNumberMaxDigitsWithRequired(v,required,maxdigits)) || this.$t('Field can be empty or a number with [0] digits at most').format(maxdigits),
            v => (isNullOrEmpty(v) || isNumber(v) && v>=0) || this.$t('Must be a number greater than zero'),
            v => (isNullOrEmpty(v) || isNumber(v) && countDecimals(v)<=maxdecimals) || this.$t('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    } else { // required==true
        r= [
            v => isNumberMaxDigitsWithRequired(v,required,maxdigits)|| this.$t('Field must be a number with at most [0] digits').format(maxdigits),
            v => v>=0 || this.$t('Must be a number greater than zero'),
            v => countDecimals(v)<=maxdecimals || this.$t('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    }
    return r
}
export function RulesFloatLEZ(maxdigits, required, maxdecimals){
    var r
    if (required==false){
        r= [
            v => (isNullOrEmpty(v) || isNumberMaxDigitsWithRequired(v,required,maxdigits)) || this.$t('Field can be empty or a number with [0] digits at most').format(maxdigits),
            v => (isNullOrEmpty(v) || isNumber(v) && v<=0) || this.$t('Must be a number greater than zero'),
            v => (isNullOrEmpty(v) || isNumber(v) && countDecimals(v)<=maxdecimals) || this.$t('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    } else { // required==true
        r= [
            v => isNumberMaxDigitsWithRequired(v,required,maxdigits)|| this.$t('Field must be a number with at most [0] digits').format(maxdigits),
            v => v<=0 || this.$t('Must be a number greater than zero'),
            v => countDecimals(v)<=maxdecimals || this.$t('Must be a number with [0] decimal places at most').format(maxdecimals),
        ]
    }
    return r
}


export function RulesDatetime(required){
    var r= [
        v => (!!v) || this.$t('You must select date and time'),
    ]
    if (required==false){
        r.shift()
    }
    return r
}
export function RulesDate(required){
    var r= [
            v => (!!v) || this.$t("You must select a date"),
        ]
    if (required==false){
        r.shift()
    }
    return r
}


// Si required=true no puede ser ni null ni ""
export function RulesString(maxdigits,required){
    var r
    if (required==false){
        r= [
            v => (v==null || v=="" || (v!=null && v.length>0 && v.length<= maxdigits)) ||  this.$t("String must be empty or at most [0] characters").format(maxdigits)
        ]
    } else { // required==true
        r= [
            v => (v!=null && v!="") || this.$t('String is required'),
            v => (v!=null && v.length<= maxdigits) || this.$t("String must be at most [0] characters").format(maxdigits)
        ]
    }
    return r
}

// Si required=true no puede ser ni null ni ""
export function RulesPassword(maxdigits,required){
    var r
    if (required==false){
        r= [
            v => (v==null || v=="" || (v!=null && v.length>=8 && v.length<= maxdigits)) || this.$t("String must have between 8 and [0] characters").format(maxdigits)
        ]
    } else { // required==true
        r= [
            v => (v!=null && v!="") || this.$t('String is required'),
            v => (v!=null && v.length>=8 && v.length<= maxdigits) || this.$t("String must have between 8 and [0] characters").format(maxdigits)
        ]
    }

    return r
}

export function RulesSelection(required){
    var r= []
    if (required==true){
        r.push((v) => !!v || this.$t('Selection is required'))
    }
    return r
}
export function RulesEmail(required){

    var r=  [
        v => !!v || this.$t('Email is required'),
        v => /.+@.+/.test(v) || this.$t('Invalid Email address') 
    ]
    if (required==false){
        r.shift()
    }
    return r
}

