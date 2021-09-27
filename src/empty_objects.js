
export function empty_account_operation(){
    return {
        datetime: new Date().toISOString(),
        concepts: null,
        operationstypes:null,
        amount: 0,
        comment: "",    
        accounts: null,
        url: null,
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


export function empty_io(){
    return {
        datetime: new Date().toISOString(),
        operationstypes: `${this.$store.state.apiroot}/api/operationstypes/4/`,
        shares:0,
        taxes:0,
        commission:0,
        price:0,
        comment:"",
        show_in_ranges:true,
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
    }
}

export function empty_product(){
    return {
        url: null,
        name: null,
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
        operationstypes:null,
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
    }
}

export function empty_products_ranges(){
    return {
        product: null,
        only_first: true,
        percentage_between_ranges: 2500,
        percentage_gains: 2500,
        amount_to_invest: 10000,
        recomendation_methods: 1,
        account: null,
    }
}


export function empty_investments_operations_simulation(){
    return {
        investments: [], //urls
        dt:new Date().toISOString(),
        local_currency: null,
        operations:[],//Empty io
        temporaltable: null, //Null if new simulation
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
    }
}

export function empty_strategy(){
    return {
        dt_from: new Date().toISOString(),
        dt_to: null,
        investments: "",
        name: "",
        type: 3,
        comment: "",
        additional1: null,
        additional2: null,
        additional3: null,
        additional4: null,
        additional5: null,
        additional6: null,
        additional7: null,
        additional8: null,
        additional9: null,
        additional10: null,
    }
}
