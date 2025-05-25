import {
    myheaders,
    getConceptsForDividends,
    getInvestmentsActive,
    getInvestmentsByProduct,
    getOperationstypesForInvestmentsOperations,
    getCurrencyByCode,
    getCurrencyPropertyByCode,
    currency_generic_string,
    currency_generic_html,
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
        currency_generic_string,
        currency_generic_html,
        getConceptsForDividends,
        getInvestmentsActive,
        getInvestmentsByProduct,
        getOperationstypesForInvestmentsOperations,
        getCurrencyByCode,
        getCurrencyPropertyByCode,
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