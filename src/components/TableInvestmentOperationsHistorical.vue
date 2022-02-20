<template>
        <v-data-table dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="dt_end" fixed-header :height="$attrs.height" ref="table" :loading="$attrs.loading">
            <template v-slot:[`item.dt_end`]="{ item }">
                {{ localtime(item.dt_end)}}
            </template>                  
            <template v-slot:[`item.name`]="{ item }">
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
                <tr style="background-color: GhostWhite" ref="lastrow" v-if="items.length>0">
                    <td v-for="(header,i) in headers" :key="i" >
                        <div v-if="header.value == 'dt_end'">
                            Total
                        </div>
                        
                        <div v-if="header.value == 'gains_gross_investment'" align="right">
                            <div v-html="currency_html(listobjects_sum(items,'gains_gross_investment'), items[0].currency_investment)"></div>
                        </div>
                        <div v-if="header.value == 'gains_gross_account'" align="right">
                            <div v-html="currency_html(listobjects_sum(items,'gains_gross_account'), items[0].currency_account)"></div>
                        </div>
                        <div v-if="header.value == 'gains_gross_user'" align="right">
                            <div v-html="currency_html(listobjects_sum(items,'gains_gross_user'), items[0].currency_user)"></div>
                        </div>
                        
                        <div v-if="header.value == 'gains_net_investment'" align="right">
                            <div v-html="currency_html(listobjects_sum(items,'gains_net_investment'), items[0].currency_investment)"></div>
                        </div>
                        <div v-if="header.value == 'gains_net_account'" align="right">
                            <div v-html="currency_html(listobjects_sum(items,'gains_net_account'), items[0].currency_account)"></div>
                        </div>
                        <div v-if="header.value == 'gains_net_user'" align="right">
                            <div v-html="currency_html(listobjects_sum(items,'gains_net_user'), items[0].currency_user)"></div>
                        </div>
                        
                        
                        <div v-if="header.value == 'commissions_investment'" align="right">
                            <div v-html="currency_html(listobjects_sum(items,'commissions_investment'), items[0].currency_investment)"></div>
                        </div>
                        <div v-if="header.value == 'commissions_account'" align="right">
                            <div v-html="currency_html(listobjects_sum(items,'commissions_account'), items[0].currency_account)"></div>
                        </div>
                        
                        
                        <div v-if="header.value == 'taxes_investment'" align="right">
                            <div v-html="currency_html(listobjects_sum(items,'taxes_investment'), items[0].currency_investment)"></div>
                        </div>
                        <div v-if="header.value == 'taxes_account'" align="right">
                            <div v-html="currency_html(listobjects_sum(items,'taxes_account'), items[0].currency_account)"></div>
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>  
</template>
<script>    
    export default {
        components:{
        },

        props: {
            items: {
                required: true
            },

            heterogeneus:{
                type: Boolean,
                required:false,
                default:false
            },
            output:{
                required:true,
                default:"account",
            },
        },
        data: function(){
            return {
            }
        },
        methods: {
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
                if (this.heterogeneus==true){
                    r.splice(2, 0, { text: this.$t('Name'), value: 'name',sortable: true });
                }
                return r
            },
            gotoLastRow(){
                this.$vuetify.goTo(this.$refs.lastrow, { container:  this.$refs.table.$el.childNodes[0] }) 
            },
        },
        mounted(){
            this.gotoLastRow()
        }
    }
</script>
