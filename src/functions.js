
// Uses .local()
export function zulu2date(value){
    return new Date(value)
}   
// Uses .local()
export function date2zulu(value){
    return value.toISOString()
}   

// invested is the amount to invest in local currency
// Se aplica un margin del 10%  
export function amount_to_invest( invested ){
    let s=this.store().profile

    let sum_1=s.invest_amount_1
    let sum_2=(s.invest_amount_1+s.invest_amount_2)
    let sum_3=(s.invest_amount_1+s.invest_amount_2+s.invest_amount_3)
    let sum_4=(s.invest_amount_1+s.invest_amount_2+s.invest_amount_3+s.invest_amount_4)
    let sum_5=(s.invest_amount_1+s.invest_amount_2+s.invest_amount_3+s.invest_amount_4+s.invest_amount_5)

    let limit_01=sum_1*1/2
    let limit_12=sum_1+(sum_2-sum_1)*1/2
    let limit_23=sum_2+(sum_3-sum_2)*1/2
    let limit_34=sum_3+(sum_4-sum_3)*1/2
    let limit_45=sum_4+(sum_5-sum_4)*1/2


    if (0< invested && invested < limit_01) return s.invest_amount_1
    if (limit_01<=invested && invested < limit_12) return s.invest_amount_2
    if (limit_12<=invested && invested < limit_23) return s.invest_amount_3
    if (limit_23<=invested && invested < limit_34) return s.invest_amount_4
    if (limit_34<=invested && invested < limit_45) return s.invest_amount_5

}