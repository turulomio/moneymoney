import { expect, test } from 'vitest'
import { 
    countDecimals,
    isNullOrEmpty,
    isNumber,
    isNumberWithRequired,
    isNumberMaxDigitsWithRequired,
    RulesInteger,
} from "@/rules"


// Due to problems with translations I made this function to help i18n
// Function to use "[0] [1]".format(a, b) style
String.prototype.format = function() {
    var formatted = this
    for (var i = 0; i < arguments.length; i++) {
        var search=`[${i}]`
        var replace=`${arguments[i]}`
        formatted = formatted.replace(search, replace );
    }
    return formatted;
};


test('isNullOrEmpty', () => {
    expect(isNullOrEmpty("")).toBe(true)
    expect(isNullOrEmpty(null)).toBe(true)
    expect(isNullOrEmpty(12)).toBe(false)
})

test('isNumber', () => {
    expect(isNumber("")).toBe(false)
    expect(isNumber(null)).toBe(false)
    expect(isNumber(12)).toBe(true)
    expect(isNumber(12.121)).toBe(true)
    expect(isNumber("12")).toBe(false)
})

test('isNumberWithRequired', () => {
    expect(isNumberWithRequired("",true)).toBe(false)
    expect(isNumberWithRequired(null,true)).toBe(false)
    expect(isNumberWithRequired(12,true)).toBe(true)
    expect(isNumberWithRequired(12.121,true)).toBe(true)
    expect(isNumberWithRequired("12",true)).toBe(false)

    expect(isNumberWithRequired("",false)).toBe(true)
    expect(isNumberWithRequired(null,false)).toBe(true)
    expect(isNumberWithRequired(12,false)).toBe(true)
    expect(isNumberWithRequired(12.121,false)).toBe(true)
    expect(isNumberWithRequired("12",false)).toBe(false)
})

test('isNumberMaxDigitsWithRequired', () => {
    expect(isNumberMaxDigitsWithRequired("",true,6)).toBe(false)
    expect(isNumberMaxDigitsWithRequired(null,true,6)).toBe(false)
    expect(isNumberMaxDigitsWithRequired(12,true,6)).toBe(true)
    expect(isNumberMaxDigitsWithRequired(12.121,true,6)).toBe(true)
    expect(isNumberMaxDigitsWithRequired("12",true,6)).toBe(false)
    expect(isNumberMaxDigitsWithRequired("",false,6)).toBe(true)
    expect(isNumberMaxDigitsWithRequired(null,false,6)).toBe(true)
    expect(isNumberMaxDigitsWithRequired(12,false,6)).toBe(true)
    expect(isNumberMaxDigitsWithRequired(12.121,false,6)).toBe(true)
    expect(isNumberMaxDigitsWithRequired(12.4567,false,6)).toBe(false)
    expect(isNumberMaxDigitsWithRequired("12",false,6)).toBe(false)
})

test('countDecimals', () => {
    expect(countDecimals("")).toBe(0)
    expect(countDecimals(null)).toBe(0)
    expect(countDecimals(12)).toBe(0)
    expect(countDecimals(12.121)).toBe(3)
    expect(countDecimals(12.123,121)).toBe(3)
    expect(countDecimals(12,123.121)).toBe(0)
    expect(countDecimals("12")).toBe(0)
})


function validate_rules(value, rules, log=false){
    var r=true
    rules.forEach(f => {
        if  (f(value) != true){
            if (log) console.log(f(value),true)
            r= false
        }
    });
    return r
    
}

test('RulesInteger',() =>{
    expect (validate_rules(12346,  RulesInteger(6,true),   false)).toBe(true)
    expect (validate_rules(1234611,  RulesInteger(6,true),   false)).toBe(false)
    expect (validate_rules("1231",  RulesInteger(6,true),   false)).toBe(false)
    expect (validate_rules(null,  RulesInteger(6,true),   false)).toBe(false)
    expect (validate_rules("",  RulesInteger(6,true),   false)).toBe(false)

    expect (validate_rules(12346,  RulesInteger(6,false),   false)).toBe(true)
    expect (validate_rules(1234611,  RulesInteger(6,false),   false)).toBe(false)
    expect (validate_rules("1231",  RulesInteger(6,false),   false)).toBe(false)
    expect (validate_rules(null,  RulesInteger(6,false),   false)).toBe(true)
    expect (validate_rules("",  RulesInteger(6,false),   false)).toBe(true)
})