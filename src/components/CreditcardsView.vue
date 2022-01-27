
<template>
    <div>    
        <h1 class="mb-4">{{ $t("Credit card details of '{0}'").format(cc.name) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>

        </h1>

        <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
            <v-tab key="cco">{{ $t('Current credit card operations') }}</v-tab>
            <v-tab key="oldpayments">{{ $t('Old payments') }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item key="cco">      
                <div>
                    <v-card outlined class="ma-4 pa-4">
                        <TableCreditcardsOperations :showselected="paying" :showactions="true" homogeneous :items="items_cco" :total_currency="account.currency" height="400" ref="table_cc" class=" flex-grow-1 flex-shrink-0" :locale='this.$i18n.locale' @changeSelected="changeSelected" @cruded="on_TableCreditcardsOperations_cruded()" :key="key"></TableCreditcardsOperations>
                    </v-card>
                    <v-card outlined class="ma-4 pa-4" v-if="paying">
                        <MyDateTimePicker label="Select payment date and time" v-model="dt_payment" ></MyDateTimePicker>
                        <v-btn color="primary" @click="acceptPayment()" :disabled="this.selected_items.length==0">{{ paying_string }}</v-btn>
                        <v-btn class="ml-2" color="error" @click="paying=false" >{{ $t("Close payment mode") }}</v-btn>
                    </v-card>
                </div>
            </v-tab-item>
            <v-tab-item key="oldpayments">      
                <div>
                    <CreditcardsPaymentsRefund :cc="cc" @cruded="on_CreditcardsPaymentsRefund_cruded()" :key="key"></CreditcardsPaymentsRefund>
                </div>
            </v-tab-item>
        </v-tabs-items> 

        <!-- CCCO CU -->
        <v-dialog v-model="dialog" max-width="650" class="pa-4" >
            <v-card class="pa-4">
                <CreditcardsoperationsCU :deleting="cco_deleting" :cco="cco" :key="key" @cruded="on_CreditcardsoperationsCU_cruded"></CreditcardsoperationsCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import TableCreditcardsOperations from './TableCreditcardsOperations.vue'
    import CreditcardsoperationsCU from './CreditcardsoperationsCU.vue'
    import CreditcardsPaymentsRefund from './CreditcardsPaymentsRefund.vue'
    import {listobjects_sum} from '../functions.js'
    import {empty_cco} from '../empty_objects.js'
    export default {
        components:{
            MyMenuInline,
            CreditcardsoperationsCU,
            TableCreditcardsOperations,
            MyDateTimePicker,
            CreditcardsPaymentsRefund,         
        },
        props:{
            cc:{
                required:true,
            },
            account:{
                required:true,
            },
        },
        data(){ 
            return{
                menuinline_items: [
                    {
                        subheader: this.$t("Credit card operation options"),
                        children: [
                            {
                                name:"Add a new credit card operation",
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.paying=false
                                    this_.cco=this_.empty_cco()
                                    this_.cco_deleting=false
                                    this_.cco.creditcards=this_.cc.url
                                    this_.key=this_.key+1
                                    this_.dialog=true
                                },
                            },
                            {
                                name:"Make a credit card payment",
                                icon: "mdi-cart",
                                code: function(this_){
                                    this_.paying=true
                                    this_.key=this_.key+1
                                },
                            },
                        ]
                    },
                ],  
                tab:0,

                items_cco:[],
                key:0,

                //Payment
                paying:false,
                dt_payment:new Date().toISOString(),
                paying_string:this.$t("You cant't pay, please select operations"),
                selected_items:[],

                //CreditCardsOperationsCU
                dialog:false,
                cco:null,
                cco_deleting:false,
            

            }
        },
        methods: {
            empty_cco,
            changeSelected(selected_items){
                this.selected_items=selected_items
                this.paying_string=this.$t(`Make a payment of ${selected_items.length} operations valued in ${listobjects_sum(selected_items,"amount")}`) 
            },
            update_table(refresh_key=true){
                this.loading_cco=true
                axios.get(`${this.$store.state.apiroot}/creditcardsoperations/withbalance?paid=false&creditcard=${this.cc.id}`, this.myheaders())
                .then((response) => {
                    this.items_cco=response.data
                    this.loading_cco=false 
                    if(refresh_key==true) this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            acceptPayment(){
                //Validation
                //Accept              
                var ids=[]
                this.selected_items.forEach(item => ids.push(item.id))

                const data= {
                    cco:ids,
                    dt_payment: this.dt_payment,
                }
                axios.post(`${this.$store.state.apiroot}/creditcardsoperations/payment/${this.cc.id}/`, data, this.myheaders())
                .then(() => {
                        this.$emit("cruded")
                        this.update_table()     
                        this.dialog=false
                }, (error) => {
                    this.parseResponseError(error)
                })

            },
            on_TableCreditcardsOperations_cruded(){
                this.$emit("cruded")
                this.update_table()
            },
            on_CreditcardsPaymentsRefund_cruded(){
                this.$emit("cruded")
                this.key=this.key+1
                this.update_table()
            },
            on_CreditcardsoperationsCU_cruded(following){
                this.dialog=following
                this.$emit("cruded")
                if (following==false){ // To retain values in CCO_CU
                    this.key=this.key+1
                }
                this.update_table(!following) // To retain values in CCO_CU
            },
        },
        mounted(){
            this.update_table()
        }
    }
</script>

