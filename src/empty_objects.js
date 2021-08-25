
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

