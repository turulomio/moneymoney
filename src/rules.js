// IMPORTANT
// v-text-field can't be type="number" it doesn't recognized alpha characters
// v-model.number can be used


// TO improve readibility I will emule rules behavier
// Rules returns [] when everything is ok, returns a ['comment'] to show error



var self = {
    isNullOrEmpty: function(n){
        var r=false
        if (n==null) return r=true
        if (n=="") return r=true
        //console.log(`isnullorempty: ${n} ${typeof n}: ${r}`)
        return r
    },
    //Returns if it's a Number, with required attribute
    isNumber: function(n){
        if (isNaN(parseFloat(n))==false) return true
        return false
    },
    isNumberWithRequired: function(n,required){
        var r=false
        if (required==true){
            if (self.isNumber(n)) r= true
        } else {
            if (self.isNullOrEmpty(n) || self.isNumber(n)) r= true
        }
        //console.log(`isnumberwithrequired: ${n} ${required} ${typeof n}: ${r}`)
        return r
    },
    //Returns if it's a Number with max digits, with required attribute
    isNumberMaxDigitsWithRequired: function(n,required,maxdigits){
        var r=false
        if (self.isNumberWithRequired(n,required) && n.toString().length<=maxdigits) r=true
        //console.log(`isnumbermaxdigitswithrequired: ${n} ${required} ${typeof n} ${maxdigits}: ${r}`)
        return r
    },

    //Counts the number of decimals of a number
    countDecimals: function (n) {
        if (isNaN(n)) return 0
        if(Math.floor(n) === n) return 0;
        var arr=String(n).split(".")
        if (arr.length!=2) return 0
        return n.toString().split(".")[1].length || 0; 
    },
       
    
        
    RulesInteger: function(maxdigits,required){
        var r
        if (required==false){
            r= [
                v => self.isNumberMaxDigitsWithRequired(v,required,maxdigits) || this.$t('Field can be empty or a number with {0} digits at most').format(maxdigits),
                v => (self.isNullOrEmpty(v) || self.isNumber(v) && self.countDecimals(v)<=0) || this.$t('Must be an integer number'),
            ]
        } else { // required==true
            r= [
                v => self.isNumberMaxDigitsWithRequired(v,required,maxdigits)|| this.$t('Field must be a number with at most {0} digits').format(maxdigits),
                v => self.countDecimals(v)<=0 || this.$t('Must be an integer number'),
            ]
        }
        return r
    },


    // If required==true must be 0 or a number
    // If required==false can be null,
    RulesFloat: function (maxdigits, required, maxdecimals){
        var r
        if (required==false){
            r= [
                v => self.isNumberMaxDigitsWithRequired(v,required,maxdigits) || this.$t('Field can be empty or a number with {0} digits at most').format(maxdigits),
                v => (self.isNullOrEmpty(v) || self.isNumber(v) && self.countDecimals(v)<=maxdecimals) || this.$t('Must be a number with {0} decimal places at most').format(maxdecimals),
            ]
        } else { // required==true
            r= [
                v => self.isNumberMaxDigitsWithRequired(v,required,maxdigits)|| this.$t('Field must be a number with at most {0} digits').format(maxdigits),
                v => self.countDecimals(v)<=maxdecimals || this.$t('Must be a number with {0} decimal places at most').format(maxdecimals),
            ]
        }
        return r
    },
    //Float Greaater Zero
    RulesFloatGZ: function (maxdigits, required, maxdecimals){
        var r
        if (required==false){
            r= [
                v => self.isNumberMaxDigitsWithRequired(v,required,maxdigits) || this.$t('Field can be empty or a number with {0} digits at most').format(maxdigits),
                v => (self.isNullOrEmpty(v) || self.isNumber(v) && v>0) || this.$t('Must be a number greater than zero'),
                v => (self.isNullOrEmpty(v) || self.isNumber(v) && self.countDecimals(v)<=maxdecimals) || this.$t('Must be a number with {0} decimal places at most').format(maxdecimals),
            ]
        } else { // required==true
            r= [
                v => self.isNumberMaxDigitsWithRequired(v,required,maxdigits)|| this.$t('Field must be a number with at most {0} digits').format(maxdigits),
                v => v>0 || this.$t('Must be a number greater than zero'),
                v => self.countDecimals(v)<=maxdecimals || this.$t('Must be a number with {0} decimal places at most').format(maxdecimals),
            ]
        }
        return r
    },
    //Number Greater Equal Zero
    RulesFloatGEZ: function (maxdigits, required, maxdecimals){
        var r
        if (required==false){
            r= [
                v => self.isNumberMaxDigitsWithRequired(v,required,maxdigits) || this.$t('Field can be empty or a number with {0} digits at most').format(maxdigits),
                v => (self.isNullOrEmpty(v) || self.isNumber(v) && v>=0) || this.$t('Must be a number greater than zero'),
                v => (self.isNullOrEmpty(v) || self.isNumber(v) && self.countDecimals(v)<=maxdecimals) || this.$t('Must be a number with {0} decimal places at most').format(maxdecimals),
            ]
        } else { // required==true
            r= [
                v => self.isNumberMaxDigitsWithRequired(v,required,maxdigits)|| this.$t('Field must be a number with at most {0} digits').format(maxdigits),
                v => v>=0 || this.$t('Must be a number greater than zero'),
                v => self.countDecimals(v)<=maxdecimals || this.$t('Must be a number with {0} decimal places at most').format(maxdecimals),
            ]
        }
        return r
    },
    RulesFloatLEZ: function(maxdigits, required, maxdecimals){
        var r
        if (required==false){
            r= [
                v => self.isNumberMaxDigitsWithRequired(v,required,maxdigits) || this.$t('Field can be empty or a number with {0} digits at most').format(maxdigits),
                v => (self.isNullOrEmpty(v) || self.isNumber(v) && v<=0) || this.$t('Must be a number greater than zero'),
                v => (self.isNullOrEmpty(v) || self.isNumber(v) && self.countDecimals(v)<=maxdecimals) || this.$t('Must be a number with {0} decimal places at most').format(maxdecimals),
            ]
        } else { // required==true
            r= [
                v => self.isNumberMaxDigitsWithRequired(v,required,maxdigits)|| this.$t('Field must be a number with at most {0} digits').format(maxdigits),
                v => v<=0 || this.$t('Must be a number greater than zero'),
                v => self.countDecimals(v)<=maxdecimals || this.$t('Must be a number with {0} decimal places at most').format(maxdecimals),
            ]
        }
        return r
    },


    RulesDatetime: function(required){
        var r= [
            v => (!!v) || this.$t('You must select date and time'),
        ]
        if (required==false){
            r.shift()
        }
        return r
    },
    RulesDate:function(required){
        var r= [
                v => (!!v) || this.$t("You must select a date"),
            ]
        if (required==false){
            r.shift()
        }
        return r
    },


    // Si required=true no puede ser ni null ni ""
    RulesString:function(maxdigits,required){
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
    },

    // Si required=true no puede ser ni null ni ""
    RulesPassword:function(maxdigits,required){
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
    },

    RulesSelection: function(required){
        var r= []
        if (required==true){
            r.push((v) => !!v || this.$t('Selection is required'))
        }
        return r
    },
    RulesEmail: function(required){

        var r=  [
            v => !!v || this.$t('Email is required'),
            v => /.+@.+/.test(v) || this.$t('Invalid Email address') 
        ]
        if (required==false){
            r.shift()
        }
        return r
    },

}

module.exports=self