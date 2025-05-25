import {
    myheaders,
    myheaders_noauth,
    parseResponse,
    parseResponseError,
    listobjects_sum,
    listobjects_average_ponderated,
    myheaders_formdata,
    getConceptsForDividends,
    getInvestmentsActive,
    getInvestmentsByProduct,
    getOperationstypesForInvestmentsOperations,
    getCurrencyByCode,
    getCurrencyPropertyByCode,
    currency_generic_string,
    currency_generic_html,
    getCountryNameByCode,
    currency_string,
    currency_html,
    percentage_string,
    percentage_generic_html,
    percentage_generic_string, 
    percentage_html,
    localcurrency_string,
    localcurrency_html,
    getMapObjectById,
    getArrayFromMap,
    zulu2date,
} from './functions.js'



const mixin = {
    data: function () {
        return {
        }
    },
    methods: {
        myheaders,
        myheaders_noauth,
        myheaders_formdata,
        parseResponse,
        parseResponseError,
        zulu2date,
        listobjects_average_ponderated,
        listobjects_sum,
        currency_generic_string,
        currency_generic_html,
        getConceptsForDividends,
        getInvestmentsActive,
        getInvestmentsByProduct,
        getOperationstypesForInvestmentsOperations,
        getCurrencyByCode,
        getCurrencyPropertyByCode,
        getCountryNameByCode,
        currency_string,
        currency_html,
        percentage_string,
        percentage_generic_html,
        percentage_generic_string, 
        percentage_html,
        localcurrency_string,
        localcurrency_html,

        getMapObjectById,
        getArrayFromMap,
 
 
        // isNullOrEmpty,
        // localtime,
        // capitalizeFirstLetter,
        // parseNumber,
        // ifnullempty,
        // isNumber,
        // isNumberWithRequired,
        // isNumberMaxDigitsWithRequired,
        // countDecimals,
        // translate,
        // isDateIsoString,
        // isDatetimeAwareIsoString,
        // isStringWithMaxDigits,
        // f,
        // my_round,
        // RulesDate,
        // RulesDateIsoString,
        // RulesDatetime,
        // RulesDatetimeAwareIsoString,
        // RulesEmail,
        // RulesFloat,
        // RulesFloatGEZ,
        // RulesFloatGZ,
        // RulesFloatLEZ,
        // RulesInteger,
        // RulesPassword,
        // RulesSelection,
        // RulesString,
    }
  }

  
  

export default mixin