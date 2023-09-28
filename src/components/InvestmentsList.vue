<template>
    <div>    
        <h1>{{ $t('Investments list') }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <v-row class="px-4 mt-2">
            <v-checkbox density="compact" class="ml-6 mr-2" v-model="showActive" :label="setCheckboxLabel()" />
            <v-text-field density="compact" class=" mr-6" v-model="search" append-icon="mdi-magnify" :label="$t('Filter')" :placeholder="$t('Add a string to filter table')" />

            <v-btn color="primary" class="mr-4" @click="products_autoupdate()" :loading="products_updating">{{ $t("Products autoupdate")}}
                <v-badge inline v-show="update_errors>0" color="error" class="ml-2" :content="$t('[0] errors').format(update_errors)"/>
            </v-btn>
        </v-row>
        <v-data-table density="compact" :headers="investments_headers" :items="investments_items" class="elevation-1" :sort-by="table_sort_by()" fixed-header  :items-per-page="items_per_page" fixed-footer @click:row="viewItem" :loading="loading" :search="search">
            <template #item.fullname="{item}">
                <v-icon :class="'fi fib fi-'+item.flag" small :title="this.getCountryNameByCode(item.flag)"></v-icon>
                <v-icon small class="ml-1" v-if="item.shares>=0" color="blue" :title="$t('Long position')">mdi-arrow-up-circle-outline</v-icon>
                <v-icon small class="ml-1" v-if="item.shares<0" color="orange" :title="$t('Short position')">mdi-arrow-down-circle-outline</v-icon>
                {{item.fullname}}
            </template>                  
            <template #item.last_datetime="{item}">
                <div v-html="(item.last_datetime) ? localtime(item.last_datetime) : $t('Update product quotes')" :class="(item.last_datetime) ? '' : 'boldred'"></div>
            </template>  
            <template #item.last="{item}">
                <div class="text-right" v-html="currency_html(item.last,item.currency )"></div>
            </template>   
            <template #item.balance_user="{item}">
                <div class="text-right" v-html="localcurrency_html(item.balance_user )"></div>
            </template>     
            <template #item.invested_user="{item}">
                    <div class="text-right" v-html="localcurrency_html(item.invested_user )"></div>
            </template>    
            <template #item.gains_user="{item}">
                <div class="text-right" v-html="localcurrency_html(item.gains_user )"></div>
            </template>     
            <template #item.daily_difference="{item}">
                <div class="text-right" v-html="localcurrency_html(item.daily_difference )"></div>
            </template>   
            <template #item.daily_percentage="{item}">
                <div class="text-right" v-html="percentage_html(item.daily_percentage )"></div>
            </template>  
            <template #item.percentage_invested="{item}">
                <div class="text-right" v-html="percentage_html(item.percentage_invested )"></div>
            </template>  
            <template #item.percentage_selling_point="{item}">
                <v-tooltip left :text="tooltip_selling_percentage(item)">
                    <template v-slot:activator="{ props }">
                        <div  class="text-right" v-bind="props" :class="item.percentage_selling_point<0.05 ? 'boldgreen' : ''" v-html="percentage_html(item.percentage_selling_point)"></div>
                    </template>
                </v-tooltip>   
            </template>              
            <template #item.actions="{item}">
                <v-icon small class="ml-1" @click.stop="addQuote(item)">mdi-plus</v-icon>
                <v-icon small class="ml-1" @click.stop="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="ml-1" @click.stop="deleteItem(item)" v-if="item.is_deletable">mdi-delete</v-icon>
                <v-icon small class="ml-1" v-if="(new Date().setHours(0,0,0,0)>new Date(item.selling_expiration).setHours(0,0,0,0)) && item.selling_expiration!=null" @click.stop="changeSellingPrice(item)" color="#9933ff" style="font-weight:bold">mdi-alarm</v-icon>     
            </template>
            
         <template #bottom ></template>
            <template #tbody>
                <tr class="totalrow" v-if="investments_items.length>0" >
                    <td>{{ $t("Total ([0] registers)").format(investments_items.length)}}</td>
                    <td></td>
                    <td></td>
                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(investments_items,'daily_difference'))"></td>
                    <td class="text-right" v-html="percentage_html(listobjects_sum(investments_items,'daily_difference')/listobjects_sum(investments_items,'balance_user'))"></td>
                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(investments_items,'invested_user'))"></td>
                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(investments_items,'gains_user'))"></td>                    
                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(investments_items,'balance_user'))"></td>
                    <td class="text-right" v-html="percentage_html(listobjects_sum(investments_items,'gains_user')/listobjects_sum(investments_items,'invested_user'))"></td>
                    <td></td>
                    <td></td>
                </tr>
            </template>
        </v-data-table>
        <div v-html="foot" class="pa-4"></div>
        <!-- DIALOG CU INVESTMERNT -->
        <v-dialog v-model="dialog" max-width="550">
            <v-card class="pa-6">
                <InvestmentsCU :investment="investment" :mode="investment_mode" :key="key" @cruded="on_InvestmentsCU_cruded"></InvestmentsCU>
            </v-card>
        </v-dialog>
        <!-- DIALOG  VIEW INVESTMERNT -->
        <v-dialog v-model="dialog_view" v-if="investment">
            <v-card class="pa-4">
                <InvestmentsView :investment_id="investment.id" :key="key" @cruded="on_InvestmentView_cruded"></InvestmentsView>
            </v-card>
        </v-dialog>
        <!-- DIALOG  ADD QUOTE -->
        <v-dialog v-model="dialog_quotescu" width="450">
            <v-card class="pa-4">
                <QuotesCU :quote="quote" :mode="quote_mode" :key="key" @cruded="on_QuotesCU_cruded"></QuotesCU>
            </v-card>
        </v-dialog>

        <!-- INVESTMENT change selling price-->
        <v-dialog v-model="dialog_change_selling_price">
            <v-card class="pa-3">
                <InvestmentsChangeSellingPrice :investment="investment" :key="key" @cruded="on_InvestmentsChangeSellingPrice_cruded"></InvestmentsChangeSellingPrice>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import InvestmentsCU from './InvestmentsCU.vue'
    import InvestmentsChangeSellingPrice from './InvestmentsChangeSellingPrice.vue'
    import InvestmentsView from './InvestmentsView.vue'
    import QuotesCU from './QuotesCU.vue'
    import {empty_quote, empty_investment} from '../empty_objects.js'
    export default {
        components:{
            MyMenuInline,
            InvestmentsCU,
            InvestmentsView,
            QuotesCU,
            InvestmentsChangeSellingPrice,
        },
        data(){ 
            return{
                items_per_page:5000000,
                showActive:true,
                investments_headers: [
                    { title: this.$t('Name'), sortable: true, key: 'fullname'},
                    { title: this.$t('Last datetime'), key: 'last_datetime',  width: "9%", sortable:true},
                    { title: this.$t('Last'), key: 'last',  width: "7%", align:'end', sortable:true},
                    { title: this.$t('Daily difference'), key: 'daily_difference',  width: "7%", align:'end', sortable:true},
                    { title: this.$t('Daily percentage'), key: 'daily_percentage',  width: "7%", align:'end', sortable:true},
                    { title: this.$t('Invested'), key: 'invested_user', align:'end',  width: "7%", sortable:true},
                    { title: this.$t('Gains'), key: 'gains_user', align:'end',  width: "7%", sortable:true},
                    { title: this.$t('Balance'), key: 'balance_user', align:'end',  width: "7%", sortable:true},
                    { title: this.$t('% Invested'), key: 'percentage_invested', align:'end',  width: "7%", sortable:true},
                    { title: this.$t('% Selling point'), key: 'percentage_selling_point', align:'end',  width: "7%", sortable:true},
                    { title: this.$t('Actions'), key: 'actions', sortable: false , width: "6%"},
                ],
                investments_items:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Investment options"),
                        children: [
                            {
                                name: this.$t("Add a new investment"),
                                icon: "mdi-pencil",
                                code: function(){
                                    this.investment=this.empty_investment()
                                    this.investment_mode="C"
                                    this.key=this.key+1
                                    this.dialog=true
                                }.bind(this),
                            },
                        ]
                    },
                ],
                dialog:false,
                investment: null,
                investment_mode: null,
                loading:false,
                search:"",

                dialog_view:false,
                foot:"",
                key:0,

                // QuoteCU add
                dialog_quotescu:false,
                quote:null,
                quote_mode:null,

                // CHange selling price
                dialog_change_selling_price:false,
                selling_product:null,

                //Products auto update
                products_updating:false,
                update_errors:0,
            }
        },
        watch:{
            showActive () {
                this.update_table()
            },
        },
        methods: { 
            addQuote(item){
                this.quote=this.empty_quote()
                this.quote.products=item.products
                this.quote_mode="C"
                this.dialog_quotescu=true
                this.key=this.key+1

            },
            deleteItem (item) {
                this.investment=item
                this.investment_mode="D"
                this.key=this.key+1
                this.dialog=true
            },
            editItem (item) {
                this.investment=item
                this.investment_mode="U"
                this.key=this.key+1
                this.dialog=true
            },
            changeSellingPrice(item){
                this.investment=item
                this.key=this.key+1
                this.dialog_change_selling_price=true
            },
            empty_investment,
            empty_quote,
            on_InvestmentView_cruded(){
                this.key=this.key+1
                this.update_table()
            },
            on_QuotesCU_cruded(){
                this.dialog_quotescu=false
                this.update_table()
            },
            on_InvestmentsCU_cruded(){
                this.dialog=false
                this.update_table()
            },
            on_InvestmentsChangeSellingPrice_cruded(){
                this.dialog_change_selling_price=false
                this.update_table()
            },
            on_chkActive(){
                this.update_table()
            },
            tooltip_selling_percentage(item){
                return this.$t("Selling price: [0]. Selling point gains [1]. Order valid until [2].").format(
                    this.currency_string(item.selling_price,item.currency),
                    this.currency_string(item.gains_at_selling_point_investment,item.currency),
                    item.selling_expiration
                )
            },
            setCheckboxLabel(){
                if (this.showActive== true){
                    return this.$t("Uncheck to see inactive investments")
                } else {
                    return this.$t("Check to see active investments")
                }
            },
            update_foot(){
                var positives=this.listobjects_sum(this.investments_items.filter((o) => o.gains_user >=0), "gains_user")
                var negatives=this.listobjects_sum(this.investments_items.filter((o) => o.gains_user <0), "gains_user")
                this.foot= "<p>" + this.$t("Positive gains - Negative gains = [0] [1] = [2]").format(
                    this.localcurrency_html(positives),
                    this.localcurrency_html(negatives),
                    this.localcurrency_html(positives+negatives)
                ) + "</p>"
            },
            update_table(){
                this.loading=true
                axios.get(`${this.store().apiroot}/api/investments/withbalance/?active=${this.showActive}`, this.myheaders())
                .then((response) => {
                    this.investments_items=response.data
                    this.update_foot()
                    this.loading=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            viewItem (event,object) {
                this.investment=object.item
                this.key=this.key+1
                this.dialog_view=true
            },
            table_sort_by(){
                if (this.showActive){
                    return [{key:'percentage_selling_point',order:'asc'}, {key:'percentage_invested', order: 'desc'}]
                } else {
                    return [{key:'fullname',order:'asc'}]
                }
            },
            products_autoupdate(){
                this.products_updating=true
                axios.post(`${this.store().apiroot}/products/update/`, {auto:true,}, this.myheaders())
                .then((response) => {
                        this.update_errors=0
                        response.data.forEach(o=>{
                            if (o.log.includes("Product")) this.update_errors=this.update_errors+1
                        })
                        this.update_table()
                        this.products_updating=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
        },
        mounted(){
            this.update_table()
        }
    }
</script>
