
export function RulesInteger(maxdigits=10,required=true){
    var r
    if (required==false){
        r= [
            v => (v!= null && v.toString().length <=maxdigits) || this.$t("Number must be at most {0} characters").format(maxdigits),
            v => (v!=null && !isNaN(parseInt(v))) || this.$t('Must be a integer number')
        ]
    } else { // required==true
        r= [
            v => (v==0 || !!v) || this.$t('Number is required'),
            v => (v!= null && v.toString().length <=maxdigits) || this.$t("Number must be at most {0} characters").format(maxdigits),
            v => (v!=null && !isNaN(parseInt(v))) || this.$t('Must be a integer number'),
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
            v => (v==null || (v!= null && v.toString().length <=maxdigits)) || this.$t("Number must be at most {0} characters").format(maxdigits),
            v => (v==null || (v!=null && !isNaN(parseFloat(v)))) || this.$t('Must be a decimal number')
        ]
    } else { // required==true
        r= [
            v => (v==0 || !!v) || this.$t('Number is required'),
            v => (v!= null && v.toString().length <=maxdigits) || this.$t("Number must be at most {0} characters").format(maxdigits),
            v => (!isNaN(parseFloat(v))) || this.$t('Must be a decimal number')
        ]
    }
    return r

}
//Float Greaater Zero
export function RulesFloatGZ(maxdigits,required){
    var r
    if (required==false){
        r= [
            v => (v!= null && v.toString().length <=maxdigits) || this.$t("Number must be at most {0} characters").format(maxdigits),
            v => (v==null || v=='' || (v!=null && !isNaN(parseFloat(v)) && v>0)) || this.$t('Must be a number greater than zero'),
        ]
    } else { // required==true
        r= [
            v => (v!= null && v.toString().length <=maxdigits) || this.$t("Number must be at most {0} characters").format(maxdigits),
            v => (v!=null && !isNaN(parseFloat(v)) && v>0) || this.$t('Must be a number greater than zero'),
        ]
    }
    return r
}

//Number Greater Equal Zero
export function RulesFloatGEZ(maxdigits,required){
    var r
    if (required==false){
        r= [
            v => (v!= null && v.toString().length <=maxdigits) || this.$t("Number must be at most {0} characters").format(maxdigits),
            v => (v==null ||  v==''|| (v!=null && !isNaN(parseFloat(v)))) || this.$t('Must be a number greater than and equal to zero'),
        ]
    } else { // required==true
        r= [
            v => (v!= null && v.toString().length <=maxdigits) || this.$t("Number must be at most {0} characters").format(maxdigits),
            v => (v!=null && !isNaN(parseFloat(v)) && v>=0) || this.$t('Must be a number greater than and equal to zero'),
        ]
    }
    return r
}
export function RulesFloatLEZ(maxdigits,required){
    var r= [
        v => (v==0 || !!v) || this.$t('Number is required'),
        v => (v.toString().length <=maxdigits) || this.$t("Number must be at most {0} characters").format(maxdigits),
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
            v => (v==null || v=="" || (v!=null && v.length>0 && v.length<= maxdigits)) ||  this.$t("String must be empty or at most {0} characters").format(maxdigits)
        ]
    } else { // required==true
        r= [
            v => (v!=null && v!="") || this.$t('String is required'),
            v => (v!=null && v.length<= maxdigits) || this.$t("String must be at most {0} characters").format(maxdigits)
        ]
    }
    return r
}

// Si required=true no puede ser ni null ni ""
export function RulesPassword(maxdigits,required){
    var r
    if (required==false){
        r= [
            v => (v==null || v=="" || (v!=null && v.length>=8 && v.length<= maxdigits)) || this.$t("String must have between 8 and {0} characters").format(maxdigits)
        ]
    } else { // required==true
        r= [
            v => (v!=null && v!="") || this.$t('String is required'),
            v => (v!=null && v.length>=8 && v.length<= maxdigits) || this.$t("String must have between 8 and {0} characters").format(maxdigits)
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

