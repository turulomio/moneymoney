<template>
    <v-data-table ref="table_oc" dense :headers="table_headers()" :items="items" class="elevation-1" disable-pagination  hide-default-footer sort-by="datetime" fixed-header :height="$attrs.height" :loading="$attrs.loading">
        <template v-slot:[`item.datetime`]="{ item }" >
            <div>{{ localtime(item.datetime)}}</div>
        </template>             
        <template v-slot:[`item.investments`]="{ item }" >
            <div>{{ $store.getters.getObjectPropertyByUrl("investments",item.investments,"fullname")}}</div>
        </template>                    
        <template v-slot:[`item.operationstypes`]="{ item }">
            <div v-html="$store.getters.getObjectPropertyByUrl('operationstypes',item.operationstypes,'localname')"></div>
        </template>
        <template v-slot:[`item.price_account`]="{ item }">
            <div v-html="currency_html(item.price_account, currency(item))"></div>
        </template>        
        <template v-slot:[`item.price_investment`]="{ item }" >
            <div v-html="currency_html(item.price_investment, currency(item))"></div>
        </template>  
        <template v-slot:[`item.price_user`]="{ item }">
            <div v-html="currency_html(item.price_user, currency(item))"></div>
        </template>  
        <template v-slot:[`item.gains_gross_account`]="{ item }">
            <div v-html="currency_html(item.gains_gross_account, currency(item))"></div>
        </template>  
        <template v-slot:[`item.gains_gross_investment`]="{ item }">
            <div v-html="currency_html(item.gains_gross_investment, currency(item))"></div>
        </template>  
        <template v-slot:[`item.gains_gross_user`]="{ item }">
            <div v-html="currency_html(item.gains_gross_user, currency(item))"></div>
        </template>  
        

         
        <template v-slot:[`item.invested_account`]="{ item }">
            <div v-html="currency_html(item.invested_account, currency(item))"></div>
        </template>  
        <template v-slot:[`item.invested_investment`]="{ item }">
            <div v-html="currency_html(item.invested_investment, currency(item))"></div>
        </template>
        <template v-slot:[`item.invested_user`]="{ item }">
            <div v-html="currency_html(item.invested_user, currency(item))"></div>
        </template> 
        
        <template v-slot:[`item.balance_account`]="{ item }">
            <div v-html="currency_html(item.balance_account, currency(item))"></div>
        </template>  
        <template v-slot:[`item.balance_investment`]="{ item }">
            <div v-html="currency_html(item.balance_investment, currency(item))"></div>
        </template>  
        <template v-slot:[`item.balance_user`]="{ item }">
            <div v-html="currency_html(item.balance_user, currency(item))"></div>
        </template> 

        <template v-slot:[`item.percentage_annual_investment`]="{ item }">
            <div v-html="percentage_html(item.percentage_annual_investment)"></div>
        </template>
        <template v-slot:[`item.percentage_apr_investment`]="{ item }">
            <div v-html="percentage_html(item.percentage_apr_investment)"></div>
        </template>
        <template v-slot:[`item.percentage_total_investment`]="{ item }">
            <div v-html="percentage_html(item.percentage_total_investment)"></div>
        </template>   
        
        <template v-slot:[`item.percentage_annual_user`]="{ item }">
            <div v-html="percentage_html(item.percentage_annual_user)"></div>
        </template>
        <template v-slot:[`item.percentage_apr_user`]="{ item }">
            <div v-html="percentage_html(item.percentage_apr_user)"></div>
        </template>
        <template v-slot:[`item.percentage_total_user`]="{ item }">
            <div v-html="percentage_html(item.percentage_total_user)"></div>
        </template>   

        <template v-slot:[`body.append`]="{headers}">
            <tr class="totalrow" v-if="items.length>0 && showtotal">
                <td v-for="(header,i) in headers" :key="'ROW'+i" >
                    <div v-if="header.value == 'datetime'">
                        {{ $t("Total ({0} registers)").format(items.length)}}
                    </div>
                 
                    <div v-if="header.value == 'shares' && all_items_have_same_product" class="d-flex justify-end">
                        <div v-html="items.reduce((accum,item) => accum + item.shares, 0)"></div>
                    </div>
                    
                    <div v-if="header.value == 'price_account' && all_items_have_same_product" class="d-flex justify-end">
                        <div v-html="currency_html(listobjects_average_ponderated(items,'price_account', 'shares'), total_currency)"></div>
                    </div>
                    <div v-if="header.value == 'price_investment' && all_items_have_same_product" class="d-flex justify-end">
                        <div v-html="currency_html(listobjects_average_ponderated(items,'price_investment', 'shares'), total_currency)"></div>
                    </div>
                    <div v-if="header.value == 'price_user' && all_items_have_same_product" class="d-flex justify-end">
                        <div v-html="currency_html(listobjects_average_ponderated(items,'price_user', 'shares'), total_currency)"></div>
                    </div>
                    
                    <div v-if="header.value == 'gains_gross_account' && all_items_has_same_currency" class="d-flex justify-end">
                        <div v-html="currency_html(items.reduce((accum,item) => accum + item.gains_gross_account, 0), total_currency)"></div>
                    </div>
                    <div v-if="header.value == 'gains_gross_investment' && all_items_has_same_currency" class="d-flex justify-end">
                        <div v-html="currency_html(items.reduce((accum,item) => accum + item.gains_gross_investment, 0), total_currency)"></div>
                    </div>
                    <div v-if="header.value == 'gains_gross_user' && all_items_has_same_currency" class="d-flex justify-end">
                        <div v-html="currency_html(items.reduce((accum,item) => accum + item.gains_gross_user, 0), total_currency)"></div>
                    </div>
                    
                    <div v-if="header.value == 'invested_account' && all_items_has_same_currency" class="d-flex justify-end">
                        <div v-html="currency_html(items.reduce((accum,item) => accum + item.invested_account, 0), total_currency)"></div>
                    </div>
                    <div v-if="header.value == 'invested_investment' && all_items_has_same_currency" class="d-flex justify-end">
                        <div v-html="currency_html(items.reduce((accum,item) => accum + item.invested_investment, 0), total_currency)"></div>
                    </div>
                    <div v-if="header.value == 'invested_user' && all_items_has_same_currency" class="d-flex justify-end">
                        <div v-html="currency_html(items.reduce((accum,item) => accum + item.invested_user, 0), total_currency)"></div>
                    </div>
                    
                    <div v-if="header.value == 'balance_account' && all_items_has_same_currency" class="d-flex justify-end">
                        <div v-html="currency_html(items.reduce((accum,item) => accum + item.balance_account, 0), total_currency)"></div>
                    </div>
                     
                    <div v-if="header.value == 'balance_investment' && all_items_has_same_currency" class="d-flex justify-end">
                        <div v-html="currency_html(items.reduce((accum,item) => accum + item.balance_investment, 0), total_currency)"></div>
                    </div>
                    <div v-if="header.value == 'balance_user' && all_items_has_same_currency" class="d-flex justify-end">
                        <div v-html="currency_html(items.reduce((accum,item) => accum + item.balance_user, 0), total_currency)"></div>
                    </div>

                    <div v-if="header.value == 'percentage_total_investment'" class="d-flex justify-end">
                        <div v-html="percentage_html(items.reduce((accum,item) => accum + item.gains_gross_investment, 0)/items.reduce((accum,item) => accum + item.invested_investment, 0))"></div>
                    </div>
  
                </td>
            </tr>
        </template>
    </v-data-table>   
</template>
<script>    
    export default {
        props: {
            items: {
                required: true
            },
            showinvestment:{// Items must have accounts attribute
                type: Boolean,
                required:false,
                default: false,
            },
            output:{ // account, investment, user
                required:true,
            },
            showtotal:{// Items must have currency attribute
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
            // To sum shares and average price
            all_items_have_same_product: function(){           
                if (this.items.length==0) return false
                var first_investment=this.$store.getters.getObjectByUrl("investments", this.items[0].investments)
                var first_product_url=this.$store.getters.getObjectPropertyByUrl("products", first_investment.products,"url")
                var r=true
                this.items.forEach(item => {//For Each doesn't allow to return false
                    var investment=this.$store.getters.getObjectByUrl("investments", item.investments)
                    var product_url=this.$store.getters.getObjectPropertyByUrl("products", investment.products,"url")
                    if (product_url!=first_product_url)  {
                        r=false
                    }
                });
                return r
            },
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
                        { text: this.$t('Date and time'), value: 'datetime',sortable: true },
                        { text: this.$t('Operation'), value: 'operationstypes',sortable: true },
                        { text: this.$t('Shares'), value: 'shares',sortable: false, align:"right"},
                        { text: this.$t('Price'), value: 'price_account',sortable: false, align:"right"},
                        { text: this.$t('Invested'), value: 'invested_account',sortable: false, align:"right"},
                        { text: this.$t('Balance'), value: 'balance_account',sortable: false, align:"right"},
                        { text: this.$t('Gross gains'), value: 'gains_gross_account',sortable: false, align:"right"},
                        { text: this.$t('% annual'), value: 'percentage_annual_account',sortable: false, align:"right"},
                        { text: this.$t('% APR'), value: 'percentage_apr_account',sortable: false, align:"right"},
                        { text: this.$t('% Total'), value: 'percentage_total_account',sortable: false, align:"right"},
                    ]
                } else if (this.output=="investment"){
                    r= [
                        { text: this.$t('Date and time'), value: 'datetime',sortable: true },
                        { text: this.$t('Operation'), value: 'operationstypes',sortable: true },
                        { text: this.$t('Shares'), value: 'shares',sortable: false, align:"right"},
                        { text: this.$t('Price'), value: 'price_investment',sortable: false, align:"right"},
                        { text: this.$t('Invested'), value: 'invested_investment',sortable: false, align:"right"},
                        { text: this.$t('Balance'), value: 'balance_investment',sortable: false, align:"right"},
                        { text: this.$t('Gross gains'), value: 'gains_gross_investment',sortable: false, align:"right"},
                        { text: this.$t('% annual'), value: 'percentage_annual_investment',sortable: false, align:"right"},
                        { text: this.$t('% TAE'), value: 'percentage_apr_investment',sortable: false, align:"right"},
                        { text: this.$t('% Total'), value: 'percentage_total_investment',sortable: false, align:"right"},
                    ]
                } else if (this.output=="user"){
                    r= [
                        { text: this.$t('Date and time'), value: 'datetime',sortable: true },
                        { text: this.$t('Operation'), value: 'operationstypes',sortable: true },
                        { text: this.$t('Shares'), value: 'shares',sortable: false, align:"right"},
                        { text: this.$t('Price'), value: 'price_user',sortable: false, align:"right"},
                        { text: this.$t('Invested'), value: 'invested_user',sortable: false, align:"right"},
                        { text: this.$t('Balance'), value: 'balance_user',sortable: false, align:"right"},
                        { text: this.$t('Gross gains'), value: 'gains_gross_user',sortable: false, align:"right"},
                        { text: this.$t('% annual'), value: 'percentage_annual_user',sortable: false, align:"right"},
                        { text: this.$t('% TAE'), value: 'percentage_apr_user',sortable: false, align:"right"},
                        { text: this.$t('% Total'), value: 'percentage_total_user',sortable: false, align:"right"},
                    ]
                }            
                if (this.showinvestment==true){
                    r.splice(1, 0, { text: this.$t('Name'), value: 'investments', sortable: true });
                }
                return r
            },
            gotoLastRow(){
                if (this.$refs.table_oc) this.$vuetify.goTo(1000000, { container:  this.$refs.table_oc.$el.childNodes[0] }) 
            },
        },
        mounted(){
            this.gotoLastRow()
        }
    }
</script>
