
<template>
    <div>    
        <h1>{{ $t('Investments list') }}
            <MyMenuInline :items="menuinline_items" @selected="MyMenuInlineSelection"></MyMenuInline>

        </h1>
        <v-card outlined class="ma-4 pa-4">
            <v-checkbox v-model="showActive" :label="setCheckboxLabel()" @click="on_chkActive()" ></v-checkbox>
            <v-data-table dense :headers="investments_headers" :items="investments_items" sort-by="percentage_selling_point" class="elevation-1" hide-default-footer disable-pagination :loading="loading_investments" :key="key">
                <template v-slot:[`item.last_datetime`]="{ item }">
                    {{localtime(item.last_datetime)}}
                </template>  
                <template v-slot:[`item.last`]="{ item }">
                    <div v-html="currency_html(item.last,item.currency )"></div>
                </template>   
                <template v-slot:[`item.balance_user`]="{ item }">
                    <div v-html="localcurrency_html(item.balance_user )"></div>
                </template>     
                <template v-slot:[`item.invested_user`]="{ item }">
                    <div v-html="localcurrency_html(item.invested_user )"></div>
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
                    <div  :class="item.percentage_selling_point<0.05 ? 'vuegreen' : ''" v-html="percentage_html(item.percentage_selling_point)"></div>
                </template>              
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="ml-1" @click="addQuote(item)">mdi-plus</v-icon>
                    <v-icon small class="ml-1" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon small class="ml-1" @click="viewItem(item)">mdi-eye</v-icon>
                    <v-icon small class="ml-1" @click="deleteItem(item)" v-if="item.is_deletable">mdi-delete</v-icon>
                    <v-icon small class="ml-1" v-if="(new Date()>new Date(item.selling_expiration)) && item.selling_expiration!=null" @click="editInvestment(item)">mdi-alarm</v-icon>     
                </template>                
                <template v-slot:[`body.append`]="{headers}">
                    <tr style="background-color: WhiteSmoke">
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'name'">
                                Total
                            </div>
                            <div v-if="header.value == 'daily_difference'" align="right" v-html="localcurrency_html(listobjects_sum(investments_items,'daily_difference'))">
                            </div>
                            <div v-if="header.value == 'balance_user'" align="right" v-html="localcurrency_html(listobjects_sum(investments_items,'balance_user'))">
                            </div>
                            <div v-if="header.value == 'invested_user'" align="right" v-html="localcurrency_html(listobjects_sum(investments_items,'invested_user'))">
                            </div>
                            <div v-if="header.value == 'gains_user'" align="right" v-html="localcurrency_html(listobjects_sum(investments_items,'gains_user'))">
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <div v-html="foot" class="pa-4"></div>
        </v-card>
        <!-- DIALOG CU INVESTMERNT -->
        <v-dialog v-model="dialog" max-width="550">
            <v-card class="pa-4">
                <v-card-title class="headline">{{dialog_title()}}</v-card-title>
                <v-form ref="form" v-model="form_valid" lazy-validation>
                    <v-autocomplete :items="$store.state.catalogs.accounts.filter(v =>v.active==true)" v-model="investment.accounts" :label="$t('Select an account')" item-text="name" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
                    <v-text-field v-model="investment.name" type="text" :label="$t('Investment name')" required :placeholder="$t('Investment name')" autofocus/>
                    <v-autocomplete :items="$store.state.catalogs.products" v-model="investment.products" :label="$t('Select a product')" item-text="name" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
                    <v-text-field v-model="investment.selling_price" type="number" :label="$t('Set an investment selling price')" required :placeholder="$t('Investment selling price')" :rules="RulesInteger(10,true)" counter="10"/>
                    <MyDatePicker v-model="investment.selling_expiration" :label="$t('Set a selling expiration date')"></MyDatePicker>
                    <v-checkbox v-model="investment.active" :label="$t('Is active?')" ></v-checkbox>
                    <v-checkbox v-model="investment.daily_adjustment" :label="$t('Has daily adjustment?')" ></v-checkbox>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ $t("Log in") }}</v-btn>
                    <v-btn color="error" @click="dialog = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- DIALOG  VIEW INVESTMERNT -->
        <v-dialog v-model="dialog_view">
            <v-card class="pa-4">
                <InvestmentsView :investment="investment" :key="key" @cruded="on_InvestmentView_cruded"></InvestmentsView>
            </v-card>
        </v-dialog>
        <!-- DIALOG  ADD QUOTE -->
        <v-dialog v-model="dialog_quotescu">
            <v-card class="pa-4">
                <QuotesCU :quote="quote" :key="key" @cruded="on_QuotesCU_cruded"></QuotesCU>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import InvestmentsView from './InvestmentsView.vue'
    import QuotesCU from './QuotesCU.vue'
    import MyDatePicker from './MyDatePicker.vue'
    import {localtime} from '../functions.js'
    import {empty_quote, empty_investment} from '../empty_objects.js'
    export default {
        components:{
            MyMenuInline,
            InvestmentsView,
            MyDatePicker,
            QuotesCU,
        },
        data(){ 
            return{
                showActive:true,
                investments_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Last datetime'), value: 'last_datetime',  width: "9%"},
                    { text: this.$t('Last'), value: 'last',  width: "7%", align:'right'},
                    { text: this.$t('Daily difference'), value: 'daily_difference',  width: "7%", align:'right'},
                    { text: this.$t('Daily percentage'), value: 'daily_percentage',  width: "7%", align:'right'},
                    { text: this.$t('Invested'), value: 'invested_user', align:'right',  width: "7%"},
                    { text: this.$t('Gains'), value: 'gains_user', align:'right',  width: "7%"},
                    { text: this.$t('Balance'), value: 'balance_user', align:'right',  width: "7%"},
                    { text: this.$t('% Invested'), value: 'percentage_invested', align:'right',  width: "7%"},
                    { text: this.$t('% Selling point'), value: 'percentage_selling_point', align:'right',  width: "7%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "7%"},
                ],
                investments_items:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Investment options"),
                        children: [
                            {
                                name:"Add a new investment",
                                icon: "mdi-pencil",
                                code: function(this_){
                                    this_.editing=false
                                    this_.investment=this_.empty_investment()
                                    this_.dialog=true
                                },
                            },
                        ]
                    },
                ],
                dialog:false,
                form_valid: false,
                investment: this.empty_investment(),
                editing:false,
                loading_investments:false,

                dialog_view:false,
                foot:"",
                key:0,

                // QuoteCU add
                dialog_quotescu:false,
                quote:null,
            }
        },
        methods: {
            MyMenuInlineSelection(item){
                item.code(this)
            },
            acceptDialog(){
                if (this.$refs.form.validate()==false) return
                if (this.editing==true){               
                    axios.put(this.investment.url, this.investment, this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.update_table()     
                            this.dialog=false
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/investments/`, this.investment,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.update_table()     
                            this.dialog=false
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
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
            dialog_title(){
                if(this.editing==true){
                    return this.$t("Updating investment")
                } else {
                    return this.$t("Creating a new investment")
                }
            },
            editItem (item) {
                this.editing=true
                this.investment=item
                this.dialog=true
            },
            empty_investment,
            empty_quote,
            localtime,
            on_InvestmentView_cruded(){
                this.update_table()
            },
            on_QuotesCU_cruded(){
                this.dialog_quotescu=false
                this.update_table()
            },
            on_chkActive(){
                this.update_table()
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
                this.foot= "<p>" + this.$t(`Positive gains - Negative gains = ${this.localcurrency_html(positives)} ${this.localcurrency_html(negatives)} = ${this.localcurrency_html(positives+negatives)}`) + "</p>"
            },
            update_table(){
                this.loading_investments=true
                axios.get(`${this.$store.state.apiroot}/investments/withbalance?active=${this.showActive}`, this.myheaders())
                .then((response) => {
                    this.investments_items=response.data
                    console.log(response);
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
        },
        mounted(){
            this.update_table()
        }
    }
</script>

