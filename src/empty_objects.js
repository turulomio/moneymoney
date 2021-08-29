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

export function empty_product(){
    return {
        url: null,
        name: null,
    }
}

export function empty_products_ranges(){
    return {
        product: 0,
        only_first: true,
        percentage_between_ranges: 2500,
        percentage_gains: 2500,
        amount_to_invest: 10000,
        recomendation_methods: 1,
        account: null,
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

