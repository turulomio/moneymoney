
// Uses .local()
export function zulu2date(value){
    return new Date(value)
}   
// Uses .local()
export function date2zulu(value){
    return value.toISOString()
}   
