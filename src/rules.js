
export function RulesInteger(maxdigits=10,required=true){
    var r
    if (required==false){
        r= [
            v => (v!= null && v.toString().length <=maxdigits) || this.$t(`Number must be at most ${maxdigits} characters`),
            v => (v!=null && !isNaN(parseInt(v))) || this.$t('Must be a integer number')
        ]
    } else { // required==true
        r= [
            v => (v==0 || !!v) || this.$t('Number is required'),
            v => (v!= null && v.toString().length <=maxdigits) || this.$t(`Number must be at most ${maxdigits} characters`),
            v => (!isNaN(parseInt(v))) || this.$t('Must be a integer number')
        ]
    }
    return r
}


// If required==true must be 0 or a number
// If required==false can be null,
export function RulesFloat(maxdigits,required){
    var r
    if (required==false){
        r= [
            v => (v==null || (v!= null && v.toString().length <=maxdigits)) || this.$t(`Number must be at most ${maxdigits} characters`),
            v => (v==null || (v!=null && !isNaN(parseFloat(v)))) || this.$t('Must be a decimal number')
        ]
    } else { // required==true
        r= [
            v => (v==0 || !!v) || this.$t('Number is required'),
            v => (v!= null && v.toString().length <=maxdigits) || this.$t(`Number must be at most ${maxdigits} characters`),
            v => (!isNaN(parseFloat(v))) || this.$t('Must be a decimal number')
        ]
    }
    return r

}

export function RulesFloatPositive(maxdigits,required){
    var r= [
        v => (v==0 || !!v) || this.$t('Number is required'),
        v => (v.toString().length <=maxdigits) || this.$t(`Number must be at most ${maxdigits} characters`),
        v => (!isNaN(parseFloat(v))) || this.$t('Must be a number'),
        v => (v>=0) || this.$t('Must be a positive number')
    ]
    if (required==false){
        r.shift()
    }
    return r
}
export function RulesFloatNegative(maxdigits,required){
    var r= [
        v => (v==0 || !!v) || this.$t('Number is required'),
        v => (v.toString().length <=maxdigits) || this.$t(`Number must be at most ${maxdigits} characters`),
        v => (!isNaN(parseFloat(v))) || this.$t('Must be a number'),
        v => (v<=0) || this.$t('Must be a negative number')
    ]
    if (required==false){
        r.shift()
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
            v => (v==null || v=="" || (v!=null && v.length>0 && v.length<= maxdigits)) ||  this.$t(`String must be empty or at most ${maxdigits} characters`)
        ]
    } else { // required==true
        r= [
            v => (v!=null && v!="") || this.$t('String is required'),
            v => (v!=null && v.length<= maxdigits) || this.$t(`String must be at most ${maxdigits} characters`)
        ]
    }
    return r
}

// Si required=true no puede ser ni null ni ""
export function RulesPassword(maxdigits,required){
    var r
    if (required==false){
        r= [
            v => (v==null || v=="" || (v!=null && v.length>=8 && v.length<= maxdigits)) ||  this.$t(`String must be empty or have between 8 and ${maxdigits} characters`)
        ]
    } else { // required==true
        r= [
            v => (v!=null && v!="") || this.$t('String is required'),
            v => (v!=null && v.length>=8 && v.length<= maxdigits) || this.$t(`String must have between 8 and ${maxdigits} characters`)
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

