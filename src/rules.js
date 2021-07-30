
export function RulesInteger(maxdigits=10,required=true){
    var r= [
        v => !!v || this.$t('Number is required'),
        v => (v && v.toString().length <=maxdigits) || this.$t(`Number must be at most ${maxdigits} characters`),
        v => (v && !isNaN(parseInt(v))) || this.$t('Must be a integer number')
    ]
    if (required==false){
        r.shift()
    }
    return r
}

export function RulesFloat(maxdigits,required){
    var r= [
        v => !!v || this.$t('Number is required'),
        v => (v && v.toString().length <=maxdigits) || this.$t(`Number must be at most ${maxdigits} characters`),
        v => (v && !isNaN(parseFloat(v))) || this.$t('Must be a number')
    ]
    if (required==false){
        r.shift()
    }
    return r
}

export function RulesString(maxdigits,empty){
    var r= [
        v => !!v || this.$t('String is required'),
        v =>  v && !!v.trim() || this.$t(`String can't be empty`),
        v =>  v.length <= maxdigits || this.$t(`String must be at most ${maxdigits} characters`)
    ]
    if (empty==true){
        r.shift()
        r.shift()
    }
    return r
}

export function RulesSelection(empty){
    var r= []
    if (empty==false){
        r.push((v) => !!v || this.$t('Selection is required'))
    }
    return r
}
export function RulesEmail(required){

    var r=  [
        v => !!v || this.$t('Number is required'),
        v => /.+@.+/.test(v) || this.$t('Invalid Email address') 
    ]
    if (required==false){
        r.shift()
    }
    return r
}