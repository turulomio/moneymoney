
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
                <v-icon small @click="viewItem(item)">mdi-pencil</v-icon>
                <v-icon small v-if="(new Date()>new Date(item.selling_expiration)) && item.selling_expiration!=null" @click="editInvestment(item)">mdi-alarm</v-icon>          
  
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
        </v-card>
        <v-dialog v-model="dialog" max-width="550">
            <v-card class="pa-4">
                <v-card-title class="headline">{{dialog_title()}}</v-card-title>
                <v-form ref="form" v-model="form_valid" lazy-validation>
                    <v-text-field v-model="investment.name" type="text" :label="$t('Bank name')" required :placeholder="$t('Bank name')" autofocus/>
                    <v-checkbox v-model="investment.active" :label="$t('Is active?')" ></v-checkbox>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ $t("Log in") }}</v-btn>
                    <v-btn color="error" @click="dialog = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog_view">
            <v-card class="pa-4">
                <InvestmentsView :investment="investment" :key="key"></InvestmentsView>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import InvestmentsView from './InvestmentsView.vue'
    import {localtime} from '../functions.js'
    export default {
        components:{
            MyMenuInline,
            InvestmentsView,
        },
        data(){ 
            return{
                showActive:true,
                investments_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Last datetime'), value: 'last_datetime',  width: "8%"},
                    { text: this.$t('Last'), value: 'last',  width: "8%", align:'right'},
                    { text: this.$t('Daily difference'), value: 'daily_difference',  width: "8%", align:'right'},
                    { text: this.$t('Daily percentage'), value: 'daily_percentage',  width: "8%", align:'right'},
                    { text: this.$t('Invested'), value: 'invested_user', align:'right',  width: "8%"},
                    { text: this.$t('Gains'), value: 'gains_user', align:'right',  width: "8%"},
                    { text: this.$t('Balance'), value: 'balance_user', align:'right',  width: "8%"},
                    { text: this.$t('% Invested'), value: 'percentage_invested', align:'right',  width: "8%"},
                    { text: this.$t('% Selling point'), value: 'percentage_selling_point', align:'right',  width: "8%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "8%"},
                ],
                investments_items:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Bank options"),
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
                key:0,
            }
        },
        methods: {
            localtime,
            dialog_title(){
                if(this.editing==true){
                    return this.$t("Updating investment")
                } else {
                    return this.$t("Creating a new investment")
                }
            },
            empty_investment(){
                return {
                    name: "",
                    active: true,
                }
            },
            MyMenuInlineSelection(item){
                item.code(this)
            },
            editItem (item) {
                this.editing=true
                this.investment=item
                this.dialog=true
            },
            viewItem (item) {
                this.key=this.key+1
                this.investment=item
                this.dialog_view=true
            },
            deleteItem (item) {
               var r = confirm(this.$t("Do you want to delete this item?"))
               if(r == false) {
                  return
               } 
               r = confirm(this.$t("This investment will be deleted. Do you want to continue?"))
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
            update_table(){
                this.loading_investments=true
                axios.get(`${this.$store.state.apiroot}/investments/withbalance?active=${this.showActive}`, this.myheaders())
                .then((response) => {
                    this.investments_items=response.data
                    console.log(response);
                    this.loading_investments=false
                }, (error) => {
                    this.parseResponseError(error)
                });
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
            acceptDialog(){
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
        },
        mounted(){
            this.update_table()
        }
    }
</script>

