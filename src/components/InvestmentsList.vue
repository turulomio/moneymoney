<template>
    <div>    
        <h1>{{ $t('Investments list') }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
            <v-row class="pa-4">
                <v-checkbox class="ml-6 mr-10" v-model="showActive" :label="setCheckboxLabel()" @click="on_chkActive()" ></v-checkbox>
                <v-text-field class="ml-10 mr-6" v-model="search" append-icon="mdi-magnify" :label="$t('Filter')" single-line hide-details :placeholder="$t('Add a string to filter table')"></v-text-field>

                <v-btn color="primary" class="mr-4" @click="products_autoupdate()" :loading="products_updating">{{ $t("Products autoupdate")}}
                    <v-badge inline v-show="update_errors>0" color="error" class="ml-2" :content="$t('{0} errors').format(update_errors)"/>
                </v-btn>
                
            </v-row>
            <v-data-table dense :headers="investments_headers" :search="search" :items="investments_items" :sort-by="(showActive)? 'percentage_selling_point': 'fullname' " class="elevation-1 ma-4 cursorpointer" hide-default-footer disable-pagination :loading="loading_investments" fixed-header :key="key" @click:row="viewItem">
                <template v-slot:[`item.fullname`]="{ item }">
                    <v-icon :class="'mr-2 fi fib fi-'+item.flag" small :title="$store.getters.getCountryNameByCode(item.flag)"></v-icon>{{item.fullname}}
                </template>                  
                <template v-slot:[`item.last_datetime`]="{ item }">
                    <div v-html="(item.last_datetime) ? localtime(item.last_datetime) : $t('Update product quotes')" :class="(item.last_datetime) ? '' : 'boldred'"></div>
                </template>  
                <template v-slot:[`item.last`]="{ item }">
                    <div v-html="currency_html(item.last,item.currency )"></div>
                </template>   
                <template v-slot:[`item.balance_user`]="{ item }">
                    <div v-html="localcurrency_html(item.balance_user )"></div>
                </template>     
                <template v-slot:[`item.invested_user`]="{ item }">
                    <v-row class="text-nowrap" justify="end">
                        <div v-html="localcurrency_html(item.invested_user )"></div>
                        <v-icon small class="ml-1" v-if="item.shares>=0" color="blue" :title="$t('Long position')">mdi-arrow-up-circle-outline</v-icon>
                        <v-icon small class="ml-1" v-if="item.shares<0" color="orange" :title="$t('Short position')">mdi-arrow-down-circle-outline</v-icon>
                    </v-row>
                </template>    
                <template v-slot:[`item.gains_user`]="{ item }">
                    <div v-html="localcurrency_html(item.gains_user )"></div>
                </template>     
                <template v-slot:[`item.daily_difference`]="{ item }">
                    <div v-html="localcurrency_html(item.daily_difference )"></div>
                </template>   
                <template v-slot:[`item.daily_percentage`]="{ item }">
                    <div v-html="percentage_html(item.daily_percentage )"></div>
                </template>  
                <template v-slot:[`item.percentage_invested`]="{ item }">
                    <div v-html="percentage_html(item.percentage_invested )"></div>
                </template>  
                <template v-slot:[`item.percentage_selling_point`]="{ item }">  
                        <v-tooltip left>
                        <template v-slot:activator="{ on }">
                            <div v-on="on" :class="item.percentage_selling_point<0.05 ? 'boldgreen' : ''" v-html="percentage_html(item.percentage_selling_point)"></div>
                        </template>
                        <span><div v-html="tooltip_selling_percentage(item)"></div></span>
                    </v-tooltip>   
                </template>              
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="ml-1" @click="addQuote(item)">mdi-plus</v-icon>
                    <v-icon small class="ml-1" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon small class="ml-1" @click="deleteItem(item)" v-if="item.is_deletable">mdi-delete</v-icon>
                    <v-icon small class="ml-1" v-if="(new Date().setHours(0,0,0,0)>new Date(item.selling_expiration).setHours(0,0,0,0)) && item.selling_expiration!=null" @click="changeSellingPrice(item)" color="#9933ff" style="font-weight:bold">mdi-alarm</v-icon>     
                </template>                
                <template v-slot:[`body.append`]="{headers}">
                    <tr class="totalrow" >
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'fullname'">
                                {{ $t("Total ({0}):").format(investments_items.length)}}
                            </div>
                            <div v-if="header.value == 'daily_difference'" class="d-flex justify-end" v-html="localcurrency_html(listobjects_sum(investments_items,'daily_difference'))">
                            </div>
                            <div v-if="header.value == 'daily_percentage'" class="d-flex justify-end" v-html="percentage_html(listobjects_sum(investments_items,'daily_difference')/listobjects_sum(investments_items,'balance_user'))">
                            </div>
                            <div v-if="header.value == 'balance_user'" class="d-flex justify-end" v-html="localcurrency_html(listobjects_sum(investments_items,'balance_user'))">
                            </div>
                            <div v-if="header.value == 'invested_user'" class="d-flex justify-end" v-html="localcurrency_html(listobjects_sum(investments_items,'invested_user'))">
                            </div>
                            <div v-if="header.value == 'gains_user'" class="d-flex justify-end" v-html="localcurrency_html(listobjects_sum(investments_items,'gains_user'))">
                            </div>
                            <div v-if="header.value == 'percentage_invested'" class="d-flex justify-end" v-html="percentage_html(listobjects_sum(investments_items,'gains_user')/listobjects_sum(investments_items,'invested_user'))">
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <div v-html="foot" class="pa-4"></div>
        <!-- DIALOG CU INVESTMERNT -->
        <v-dialog v-model="dialog" max-width="550">
            <v-card class="pa-6">
                <InvestmentsCU :investment="investment" :key="key" @cruded="on_InvestmentsCU_cruded"></InvestmentsCU>
            </v-card>
        </v-dialog>
        <!-- DIALOG  VIEW INVESTMERNT -->
        <v-dialog v-model="dialog_view">
            <v-card class="pa-4">
                <InvestmentsView :investment="investment" :key="key" @cruded="on_InvestmentView_cruded"></InvestmentsView>
            </v-card>
        </v-dialog>
        <!-- DIALOG  ADD QUOTE -->
        <v-dialog v-model="dialog_quotescu" width="450">
            <v-card class="pa-4">
                <QuotesCU :quote="quote" :key="key" @cruded="on_QuotesCU_cruded"></QuotesCU>
            </v-card>
        </v-dialog>

        <!-- INVESTMENT change selling price-->
        <v-dialog v-model="dialog_change_selling_price">
            <v-card class="pa-3">
                <InvestmentsChangeSellingPrice :investment="investment" :key="key" @cruded="on_InvestmentsChangeSellingPrice_cruded()"></InvestmentsChangeSellingPrice>
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
                showActive:true,
                investments_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'fullname'},
                    { text: this.$t('Last datetime'), value: 'last_datetime',  width: "9%"},
                    { text: this.$t('Last'), value: 'last',  width: "7%", align:'right'},
                    { text: this.$t('Daily difference'), value: 'daily_difference',  width: "7%", align:'right'},
                    { text: this.$t('Daily percentage'), value: 'daily_percentage',  width: "7%", align:'right'},
                    { text: this.$t('Invested'), value: 'invested_user', align:'right',  width: "7%"},
                    { text: this.$t('Gains'), value: 'gains_user', align:'right',  width: "7%"},
                    { text: this.$t('Balance'), value: 'balance_user', align:'right',  width: "7%"},
                    { text: this.$t('% Invested'), value: 'percentage_invested', align:'right',  width: "7%"},
                    { text: this.$t('% Selling point'), value: 'percentage_selling_point', align:'right',  width: "7%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "6%"},
                ],
                investments_items:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Investment options"),
                        children: [
                            {
                                name: this.$t("Add a new investment"),
                                icon: "mdi-pencil",
                                code: function(this_){
                                    this_.investment=this_.empty_investment()
                                    this_.key=this_.key+1
                                    this_.dialog=true
                                },
                            },
                        ]
                    },
                ],
                dialog:false,
                investment: null,
                loading_investments:false,
                search:"",

                dialog_view:false,
                foot:"",
                key:0,

                // QuoteCU add
                dialog_quotescu:false,
                quote:null,

                // CHange selling price
                dialog_change_selling_price:false,
                selling_product:null,

                //Products auto update
                products_updating:false,
                update_errors:0,
            }
        },
        methods: { 
            addQuote(item){
                this.quote=this.empty_quote()
                this.quote.products=item.products
                this.dialog_quotescu=true
                this.key=this.key+1

            },
            deleteItem (item) {
               var r = confirm(this.$t("Do you want to delete this investment?"))
               if(r == false) {
                  return
               } 
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    console.log(response);
                    this.update_table()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            editItem (item) {
                this.investment=item
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
                return this.$t("Selling price: {0}.<br>Selling point gains {1}.<br>Order valid until {2}.").format(
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
                this.foot= "<p>" + this.$t("Positive gains - Negative gains = {0} {1} = {2}").format(
                    this.localcurrency_html(positives),
                    this.localcurrency_html(negatives),
                    this.localcurrency_html(positives+negatives)
                 ) + "</p>"
            },
            update_table(){
                this.loading_investments=true
                axios.get(`${this.$store.state.apiroot}/api/investments/withbalance/?active=${this.showActive}`, this.myheaders())
                .then((response) => {
                    this.investments_items=response.data
                    this.update_foot()
                    this.loading_investments=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            viewItem (item) {
                this.key=this.key+1
                this.investment=item
                this.dialog_view=true
            },


            products_autoupdate(){
                this.products_updating=true
                axios.post(`${this.$store.state.apiroot}/products/update/`, {auto:true,}, this.myheaders())
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

