<template>
        <v-data-table dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="dt_end" fixed-header :height="$attrs.height" ref="table">
            <template v-slot:[`item.dt_end`]="{ item }">
                {{ localtime(item.dt_end)}}
            </template>                  
            <template v-slot:[`item.investments`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('investments', item.investments,'fullname')"></div>
            </template>  
            <template v-slot:[`item.operationstypes`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('operationstypes',item.operationstypes,'localname')"></div>
            </template>
            <template v-slot:[`item.gross_start_user`]="{ item }">
                <div v-html="currency_html(item.gross_start_user, item.currency_user)"></div>
            </template>
            <template v-slot:[`item.gross_end_user`]="{ item }">
                <div v-html="currency_html(item.gross_end_user, item.currency_user)"></div>
            </template>
            <template v-slot:[`item.gains_gross_user`]="{ item }">
                <div v-html="currency_html(item.gains_gross_user, item.currency_user)"></div>
            </template>
            <template v-slot:[`item.commissions_user`]="{ item }">
                <div v-html="currency_html(item.commissions_user, item.currency_user)"></div>
            </template>
            <template v-slot:[`item.taxes_user`]="{ item }">
                <div v-html="currency_html(item.taxes_user, item.currency_user)"></div>
            </template>
            <template v-slot:[`item.gains_net_user`]="{ item }">
                <div v-html="currency_html(item.gains_net_user, item.currency_user)"></div>
            </template>
            
            
            <template v-slot:[`item.gross_start_account`]="{ item }">
                <div v-html="currency_html(item.gross_start_account, item.currency_account)"></div>
            </template>
            <template v-slot:[`item.gross_end_account`]="{ item }">
                <div v-html="currency_html(item.gross_end_account, item.currency_account)"></div>
            </template>
            <template v-slot:[`item.gains_gross_account`]="{ item }">
                <div v-html="currency_html(item.gains_gross_account, item.currency_account)"></div>
            </template>
            <template v-slot:[`item.commissions_account`]="{ item }">
                <div v-html="currency_html(item.commissions_account, item.currency_account)"></div>
            </template>
            <template v-slot:[`item.taxes_account`]="{ item }">
                <div v-html="currency_html(item.taxes_account, item.currency_account)"></div>
            </template>
            <template v-slot:[`item.gains_net_account`]="{ item }">
                <div v-html="currency_html(item.gains_net_account, item.currency_account)"></div>
            </template>
            
            
            <template v-slot:[`item.gross_start_investment`]="{ item }">
                <div v-html="currency_html(item.gross_start_investment, item.currency_investment)"></div>
            </template>
            <template v-slot:[`item.gross_end_investment`]="{ item }">
                <div v-html="currency_html(item.gross_end_investment, item.currency_investment)"></div>
            </template>
            <template v-slot:[`item.gains_gross_investment`]="{ item }" >
                <div v-html="currency_html(item.gains_gross_investment, item.currency_investment)"></div>
            </template>
            <template v-slot:[`item.commissions_investment`]="{ item }">
                <div v-html="currency_html(item.commissions_investment, item.currency_investment)"></div>
            </template>
            <template v-slot:[`item.taxes_investment`]="{ item }">
                <div v-html="currency_html(item.taxes_investment, item.currency_investment)"></div>
            </template>
            <template v-slot:[`item.gains_net_investment`]="{ item }">
                <div v-html="currency_html(item.gains_net_investment, item.currency_investment)"></div>
            </template>           
            <template v-slot:[`body.append`]="{headers}">
                <tr class="totalrow" v-if="items.length>0 && showtotal">
                    <td v-for="(header,i) in headers" :key="i" >
                        <div v-if="header.value == 'dt_end'">
                            {{ $t("Total ({0} registers)").format(items.length)}}
                        </div>
                        
                        <div v-if="header.value == 'gains_gross_investment' && all_items_has_same_currency" class="d-flex justify-end">
                            <div v-html="currency_html(listobjects_sum(items,'gains_gross_investment'), total_currency)"></div>
                        </div>
                        <div v-if="header.value == 'gains_gross_user' && all_items_has_same_currency" class="d-flex justify-end">
                            <div v-html="currency_html(listobjects_sum(items,'gains_gross_user'), total_currency)"></div>
                        </div>
                        
                        <div v-if="header.value == 'gains_net_investment' && all_items_has_same_currency" class="d-flex justify-end">
                            <div v-html="currency_html(listobjects_sum(items,'gains_net_investment'), total_currency)"></div>
                        </div>
                        <div v-if="header.value == 'gains_net_account' && all_items_has_same_currency" class="d-flex justify-end">
                            <div v-html="currency_html(listobjects_sum(items,'gains_net_account'), total_currency)"></div>
                        </div>
                        <div v-if="header.value == 'gains_net_user' && all_items_has_same_currency" class="d-flex justify-end">
                            <div v-html="currency_html(listobjects_sum(items,'gains_net_user'), total_currency)"></div>
                        </div>
                        
                        
                        <div v-if="header.value == 'commissions_investment' && all_items_has_same_currency" class="d-flex justify-end">
                            <div v-html="currency_html(listobjects_sum(items,'commissions_investment'), total_currency)"></div>
                        </div>
                        <div v-if="header.value == 'commissions_account' && all_items_has_same_currency" class="d-flex justify-end">
                            <div v-html="currency_html(listobjects_sum(items,'commissions_account'), total_currency)"></div>
                        </div>
                        
                        
                        <div v-if="header.value == 'taxes_investment' && all_items_has_same_currency" class="d-flex justify-end">
                            <div v-html="currency_html(listobjects_sum(items,'taxes_investment'), total_currency)"></div>
                        </div>
                        <div v-if="header.value == 'taxes_account' && all_items_has_same_currency" class="d-flex justify-end">
                            <div v-html="currency_html(listobjects_sum(items,'taxes_account'), total_currency)"></div>
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>  
</template>
<script>    
    export default {
        name: "TableInvestmentOperationsHistorical",
        props: {
            items: {
                required: true
            },
            output:{
                required:true,
            },
            showtotal:{// Items must have currency attribute
                type: Boolean,
                required:false,
                default: false,
            },
            showinvestment:{// Items must have accounts attribute
                type: Boolean,
                required:false,
                default: false,
            },
        },
        data: function(){
            return {
            }
        },        
        computed:{
            // To sum amounts
            all_items_has_same_currency(){
                if (this.items.length==0) return false
                var first_currency=this.currency(this.items[0])
                var r=true
                this.items.forEach(item => {//For Each doesn't allow to return false
                    if (this.currency(item)!=first_currency)  {
                        r=false
                    }
                });
                return r
            },
            total_currency: function(){
                if (this.items.length==0) return "Bad currency"
                return this.currency(this.items[0])
            }
        },
        methods: {
            // Currencies are part of the item
            currency(item){
                if (this.output=="account"){
                    return item.currency_account
                } else if (this.output=="investment"){
                    return item.currency_investment
                } else if (this.output=="user"){
                    return item.currency_user
                }
            },
            table_headers(){
                var r
                if (this.output=="account"){
                    r= [
                        { text: this.$t('Date and time'), value: 'dt_end',sortable: true },
                        { text: this.$t('Years'), value: 'years',sortable: true },
                        { text: this.$t('Operation'), value: 'operationstypes',sortable: true },
                        { text: this.$t('Shares'), value: 'shares',sortable: false, align:"right"},
                        { text: this.$t('Gross start'), value: 'gross_start_account',sortable: false, align:"right"},
                        { text: this.$t('Gross end'), value: 'gross_end_account',sortable: false, align:"right"},
                        { text: this.$t('Gains gross'), value: 'gains_gross_account',sortable: false, align:"right"},
                        { text: this.$t('Commission'), value: 'commissions_account',sortable: false, align:"right"},
                        { text: this.$t('Taxes'), value: 'taxes_account',sortable: false, align:"right"},
                        { text: this.$t('Gains'), value: 'gains_net_account',sortable: false, align:"right"},
                    ]
                } else if (this.output=="investment"){
                    r= [
                        { text: this.$t('Date and time'), value: 'dt_end',sortable: true },
                        { text: this.$t('Years'), value: 'years',sortable: true },
                        { text: this.$t('Operation'), value: 'operationstypes',sortable: true },
                        { text: this.$t('Shares'), value: 'shares',sortable: false, align:"right"},
                        { text: this.$t('Gross start'), value: 'gross_start_investment',sortable: false, align:"right"},
                        { text: this.$t('Gross end'), value: 'gross_end_investment',sortable: false, align:"right"},
                        { text: this.$t('Gains gross'), value: 'gains_gross_investment',sortable: false, align:"right"},
                        { text: this.$t('Commission'), value: 'commissions_investment',sortable: false, align:"right"},
                        { text: this.$t('Taxes'), value: 'taxes_investment',sortable: false, align:"right"},
                        { text: this.$t('Gains'), value: 'gains_net_investment',sortable: false, align:"right"},
                    ]
                } else if (this.output=="user"){
                    r= [
                        { text: this.$t('Date and time'), value: 'dt_end',sortable: true },
                        { text: this.$t('Years'), value: 'years',sortable: true },
                        { text: this.$t('Operation'), value: 'operationstypes',sortable: true },
                        { text: this.$t('Shares'), value: 'shares',sortable: false, align:"right"},
                        { text: this.$t('Gross start'), value: 'gross_start_user',sortable: false, align:"right"},
                        { text: this.$t('Gross end'), value: 'gross_end_user',sortable: false, align:"right"},
                        { text: this.$t('Gains gross'), value: 'gains_gross_user',sortable: false, align:"right"},
                        { text: this.$t('Commission'), value: 'commissions_user',sortable: false, align:"right"},
                        { text: this.$t('Taxes'), value: 'taxes_user',sortable: false, align:"right"},
                        { text: this.$t('Gains'), value: 'gains_net_user',sortable: false, align:"right"},
                    ] 
                }
                if (this.showinvestment==true){
                    r.splice(2, 0, { text: this.$t('Investment'), value: 'investments',sortable: true });
                }
                return r
            },
            gotoLastRow(){
                if (this.$refs.table) this.$vuetify.goTo(1000000, { container:  this.$refs.table.$el.childNodes[0] }) 
            },
        },
        mounted(){
            this.gotoLastRow()
        }
    }
</script>
