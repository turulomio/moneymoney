import {RecomendationMethods, StrategiesTypes} from '@/types.js'


export function empty_account(){
    return {
        name: "",
        active: true,
        number: "",
        currency: "EUR",    
        banks:null,
        url:null,
        decimals:2,
    }
}

export function empty_account_operation(){
    return {
        datetime: new Date().toISOString(),
        concepts: null,
        // operationstypes:null,
        amount: 0,
        comment: "",    
        accounts: null,
        url: null,
    }
}

export function empty_account_transfer(){
    return {
        datetime: new Date().toISOString(),
        origin: null,
        destiny: null,
        ao_origin:null,
        ao_destiny:null,
        ao_commission:null,
        amount: 0,
        commission:0,
    }
}

export function empty_bank(){
    return {
        name: "",
        active: true,
    }
}

export function empty_concept(){
    return {
        name: "",
        editable: true,
        operationstypes: null,
    }
}
export function empty_credit_card(){
    return {
        name: "",
        number: "",
        deferred: false,
        maximumbalance: 0,
        active: true,   
        accounts: null,
        url: null,
    }
}

export function empty_dps(){
    return {
        date: new Date().toISOString().slice(0,10),
        paydate: new Date().toISOString().slice(0,10),
        gross: 0,
        products: null,
        url: null,
    }
}

export function empty_estimation_dps(){
    return {
        year: new Date().getFullYear(),
        estimation: 0,
        products: null,
    }
}


export function empty_investment_operation(){
    return {
        datetime: new Date(),
        operationstypes: `${this.useStore().apiroot}/api/operationstypes/4/`,
        shares:0,
        taxes:0,
        commission:0,
        price:0,
        comment:"",
        currency_conversion:1,
        investments: null,
        url: null,
    }
}

      
export function empty_order(){
    return {
        date: new Date().toISOString().split("T")[0],
        executed: null,
        expiration: null,
        investments: null,
        price: 0,
        shares: 0,
        url: null,
        current_price: null, // Needed to alert from stoploss
    }
}

export function empty_product(){
    return {
        url: null,
        name: null,
        isin: null,
        currency:null,
        productstypes:null,
        agrupations:null,
        web:null,
        address:null,
        phone:null,
        mail:null,
        productsstrategies:`${this.useStore().apiroot}/api/productsstrategies/1/`,
        leverages:`${this.useStore().apiroot}/api/leverages/1/`,
        percentage:100,
        stockmarkets: null,
        comment: null,
        decimals: 2,
        obsolete: false,
        ticker_yahoo: null,
        ticker_morningstar: null,
        ticker_google: null,
        ticker_quefondos: null,
        ticker_investingcom: null,
    }
}

export function empty_products_comparation(){
    return {
        url: null,
        name: null,
        a:null,
        b:null,
    }
}

export function empty_cco(){
    return {
        datetime: new Date(),
        concepts: null,
        amount: 0,
        comment: "",    
        creditcards: null,
        paid:false,
        paid_datetime:null,
    }
}

export function empty_quote(){
    return {
        url: null,
        datetime: new Date().toISOString(),
        quote: 0,
        products: null
    }
}

export function empty_products_ranges(){
    return {
        product: null, //Integer not url
        totalized_operations: true,
        percentage_between_ranges: 2500,
        percentage_gains: 2500,
        amount_to_invest: 10000,
        recomendation_methods: 1,
        investments: [], // List of integers. In db is strategy einvestmeents is a string of integers
        additional_ranges: 3,
    }
}


export function empty_ios(){
    return {
        datetime: new Date().toISOString(), 
        classmethod_str: "from_ids", 
        investments: [],//Array of ids 
        mode:1, 
        currency: "EUR", 
        simulation:[], //Array of empty_ios_simulation_operation
        addition_current_year_gains:false,
    }
}

export function empty_ios_simulation_operation(){
    return {
        datetime: new Date(),
        operationstypes_id: 4,
        shares:0,
        taxes:0,
        commission:0,
        price:0,
        comment:"",
        currency_conversion:1,
        investments_id: null,
        id: -1
    }
}


export function empty_strategy_simulation(){
    return {
        strategy: null, //strategy url
        dt:null, //If null dt_end is dt_for_comparation
        operations:[],//Empty io must specifi investments_id
    }
}

export function empty_investments_chart(){
    return {
        ohcls:[],
        ios_id: null, //ios_id
        limitlines:[],//empty_investments_chart_limit_line
    }
}
export function empty_investments_chart_limit_line(){
    return {
        buy:null,
        average: null, 
        sell:null,
    }
}


export function empty_dividend(){
    return {
        datetime: new Date().toISOString(),
        gross: 0,
        net:0,
        taxes: 0,
        commission: 0,
        dps: 0,
        investments: null,
        accountsoperations: null,
        concepts: null,
        currency_conversion:1,
        url: null,
    }
}

export function empty_investment(){
    return {
        name: "",
        active: true,
        daily_adjustment: false,
        selling_price: 0,
        products: null,
        selling_expiration: null,
        balance_percentage: 100,
        accounts: null,
        url: null,
        decimals: 2,
    }
}

export function empty_strategy_fast_operations(){
    return {
        strategy: {
            dt_from: new Date().toISOString(),
            dt_to: null,
            name: "",
            type: StrategiesTypes.FastOperations,
            comment: "",
        },
        accounts: [],
    }
}

export function empty_strategy_products_range(){
    return {
        strategy: {
            dt_from: new Date().toISOString(),
            dt_to: null,
            name: "",
            type: StrategiesTypes.Ranges,
            comment: "",
        },
        product: null,
        investments: [],
        percentage_between_ranges: 0.5,
        percentage_gains: 0.10,
        amount: 10000,
        recomendation_method: RecomendationMethods.All,
        only_first: false,
    }
}

export function empty_strategy_generic(){
    return {
        strategy: {
            dt_from: new Date().toISOString(),
            dt_to: null,
            name: "",
            type: StrategiesTypes.Generic,
            comment: "",
        },
        investments: [],
    }
}

export function empty_strategy_pairs(){
    return {
        strategy: {
            dt_from: new Date().toISOString(),
            dt_to: null,
            name: "",
            type: StrategiesTypes.PairsInSameAccount,
            comment: "",
        },
        worse_product: null,
        better_product: null,
        account: null,
    }
}


export function empty_chart_scatter_pair_prices(){
    return{
        product_a: null, //Object with url, name, currency
        product_b: null, //Object with url, name, currency
        prices: [], //Array of price_a, price_b values
    }
}

export function empty_fast_operations_coverage(){
    return {
        datetime:new Date(),
        investments: null,
        amount:0,
        comment:""
    }
}



export function empty_investment_transfer(){
    return {
        id: null,
        url: null,
        investments_origin: null,
        datetime_origin: new Date(),
        shares_origin: null,
        price_origin: null,
        commission_origin: 0,
        taxes_origin: 0,
        currency_conversion_origin: 1,

        investments_destiny: null,
        datetime_destiny: null,
        shares_destiny: null,
        price_destiny: null,
        commission_destiny: 0,
        taxes_destiny: 0,
        currency_conversion_destiny: 1,

        comment: "",
    }
}