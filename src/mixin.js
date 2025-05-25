import {
    myheaders,
    myheaders_noauth,
    parseResponse,
    parseResponseError,
    listobjects_sum,
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
    }
  }

  
  

export default mixin