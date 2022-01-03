<template>
    <div>    
        <h1>{{ $t('Orders list') }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <div class="d-flex justify-center mb-4">
            <v-card width="20%" class="pa-5">
                <v-select dense :label="$t('Filter by order state')" v-model="state" :items="items_state" item-value="id" item-text="name" @change="update_table()" :sort-by="getSort()"></v-select>
            </v-card>
        </div>
        <v-card outlined class="ma-4 pa-4">
            <v-data-table dense :headers="headers" :items="data" :sort-by="getSort()" :sort-desc="getSortDesc()" class="elevation-1" hide-default-footer disable-pagination :loading="loading_table">
                <template v-slot:[`item.price`]="{ item }">
                    <div v-html="currency_html(item.price, item.currency )"></div>
                </template>  
                <template v-slot:[`item.amount`]="{ item }">
                    <div v-html="currency_html(item.amount, item.currency )"></div>
                </template>  
                <template v-slot:[`item.percentage_from_price`]="{ item }">
                    <div v-html="percentage_html(item.percentage_from_price )"></div>
                </template>  
                <template v-slot:[`item.executed`]="{ item }">
                    <div v-html="localtime(item.executed )"></div>
                </template>  
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="executeOrder(item)">mdi-play</v-icon>
                    <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon small class="mr-2" @click="orderView(item)">mdi-eye</v-icon>
                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>                            
            </v-data-table>
        </v-card>
        <!-- Order CU dialog -->
        <v-dialog v-model="dialog_cu" max-width="550" persistent>
            <v-card class="pa-4">
                <OrdersCU :order="order" @cruded="on_OrdersCU_cruded()" :key="key"></OrdersCU>
            </v-card>
        </v-dialog>

        <!-- Order View dialog -->
        <v-dialog v-model="dialog_reinvest">
            <v-card class="pa-4">
                <InvestmentsoperationsReinvest v-if="order!=null" :price="order.price" :shares="order.shares" :investments="new Array(this.order.investments)" :key="key"></InvestmentsoperationsReinvest>
            </v-card>
        </v-dialog>

        <!-- Investments operation CU dialog -->
        <v-dialog v-model="dialog_io_cu" max-width="550" v-if="io" >
            <v-card class="pa-4">
                <InvestmentsoperationsCU :io="io" :investment="io_investment" @cruded="on_InvestmentsoperationsCU_cruded()" :key="key"></InvestmentsoperationsCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import OrdersCU from './OrdersCU.vue'
    import InvestmentsoperationsReinvest from './InvestmentsoperationsReinvest.vue'
    import InvestmentsoperationsCU from './InvestmentsoperationsCU.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import {empty_order,empty_investments_operations_simulation, empty_investment_operation} from '../empty_objects.js'
    export default {
        components:{
            InvestmentsoperationsCU,
            MyMenuInline,
            OrdersCU,
            InvestmentsoperationsReinvest,
        },
        data(){ 
            return{
                items_state: [
                    {"id":0, "name":this.$t("Active")},
                    {"id":1, "name":this.$t("Expired")},
                    {"id":2, "name":this.$t("Executed")},

                ],
                state: 0,
                headers: [
                    { text: this.$t('Date'), sortable: true, value: 'date',  width: "6%"},
                    { text: this.$t('Expiration'), value: 'expiration',  width: "6%"},
                    { text: this.$t('Investment'), value: 'investmentsname'},
                    { text: this.$t('Shares'), value: 'shares', align:'right',  width: "7%"},
                    { text: this.$t('Price'), value: 'price', align:'right',  width: "7%"},
                    { text: this.$t('Amount'), value: 'amount', align:'right',  width: "7%"},
                    { text: this.$t('% from price'), value: 'percentage_from_price', align:'right',  width: "7%"},
                    { text: this.$t('Executed'), value: 'executed', align:'right',  width: "10%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "10%"},
                ],
                data:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Order options"),
                        children: [
                            {
                                name:"Add a new order",
                                icon: "mdi-pencil",
                                code: function(this_){
                                    this_.order=this_.empty_order()
                                    this_.dialog_cu=true
                                    this_.key=this_.key+1
                                },
                            },
                        ]
                    },
                ],
                dialog_cu:false,
                order: null,
                loading_table:false,

                dialog_reinvest:false,
                key:0,

                //Dialog InvestmentsOperationsCU
                dialog_io_cu:false,
                io:null,
                io_investment: null,
            }
        },
        methods: {
            empty_order,
            empty_investments_operations_simulation,
            empty_investment_operation,
            on_OrdersCU_cruded(){
                this.dialog_cu=false
                this.update_table()
            },
            getSort(){
                if (this.state==0){//Active
                    return "percentage_from_price"
                } else if (this.state==1) { //expired
                    return "expiration"
                } else if (this.state==2) { //executed
                    return "executed"
                }
            },
            getSortDesc(){
                
                if (this.state==0){//Active
                    return true 
                } else if (this.state==1) { //expired
                    return true
                } else if (this.state==2) { //executed
                    return true
                }
            },
            dialog_title(){
                if(this.editing==true){
                    return this.$t("Updating order")
                } else {
                    return this.$t("Creating a new order")
                }
            },
            editItem (item) {
                this.order=item
                this.key=this.key+1
                this.dialog_cu=true
            },
            executeOrder (item) {

                // Updates order
                item.executed=new Date().toISOString()
                axios.put(item.url, item,  this.myheaders())
                .then(() => {
                    this.update_table()
                    this.io_investment={url:item.investments,currency:item.currency}
                    this.io=this.empty_investment_operation()
                    this.io.shares=item.shares
                    this.io.price=item.price
                    this.io.investments=item.investments
                    this.key=this.key+1
                    this.dialog_io_cu=true
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            orderView(item) {    
                this.order=item               
                this.key=this.key+1
                this.dialog_reinvest=true
            },
            deleteItem (item) {
               var r = confirm(this.$t("This order will be deleted. Do you want to continue?"))
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
                this.loading_table=true
                var url=""
                if (this.state==0){//Active
                    url=`${this.$store.state.apiroot}/orders/list/?active=true`
                } else if (this.state==1) { //expired
                    url=`${this.$store.state.apiroot}/orders/list/?expired=true`
                } else if (this.state==2) { //executed
                    url=`${this.$store.state.apiroot}/orders/list/?executed=true`
                }


                axios.get(url, this.myheaders())
                .then((response) => {
                    this.data=response.data
                    this.loading_table=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_chkActive(){
                this.update_table()
            },
            on_InvestmentsoperationsCU_cruded(){

                this.dialog_io_cu=false
                this.io=null
                this.io_investment=null
            },
            setCheckboxLabel(){
                if (this.showActive== true){
                    return this.$t("Uncheck to see inactive orders")
                } else {
                    return this.$t("Check to see active orders")
                }
            },

        },
        mounted(){
            this.update_table()
        }
    }
</script>

