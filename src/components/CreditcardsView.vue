
<template>
    <div>    
        <h1>{{ $t(`Credit card details of '${cc.name}'`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>

        </h1>
        <v-card outlined class="ma-4 pa-4">
            <TableAccountOperations :showselected="paying" homogeneous :items="items_cco" :total_currency="account.currency" height="400" ref="table_cc" class=" flex-grow-1 flex-shrink-0" :locale='this.$i18n.locale' @editAO="editCCO" @deleteAO="on_TableAccountOperations_deleteAO" @changeSelected="changeSelected" :key="key"></TableAccountOperations>
        </v-card>
        <v-card outlined class="ma-4 pa-4" v-if="paying">
            <MyDateTimePicker label="Select payment date and time" v-model="dt_payment" ></MyDateTimePicker>
            <v-btn color="primary" @click="acceptPayment()" :disabled="this.selected_items.length==0">{{ paying_string }}</v-btn>
            <v-btn class="ml-2" color="error" @click="paying=false" >{{ $t("Close payment mode") }}</v-btn>
        </v-card>

        <!-- CCCO CU -->
        <v-dialog v-model="dialog" max-width="650" class="pa-4" >
            <v-card class="pa-4">
              <CreditcardsoperationsCU  ref="cco_cu" :cco="cco" :key="key" @cruded="on_CreditcardsoperationsCU_cruded()"></CreditcardsoperationsCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import TableAccountOperations from './TableAccountOperations.vue'
    import CreditcardsoperationsCU from './CreditcardsoperationsCU.vue'
    import {listobjects_sum} from '../functions.js'
    import {empty_cco} from '../empty_objects.js'
    export default {
        components:{
            MyMenuInline,
            TableAccountOperations,
            MyDateTimePicker,
            CreditcardsoperationsCU,            
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
                items_cco:[],
                //CCOCU
                dialog:false,
                cco: null,
                loading_cco:false,
                key:0,

                //Payment
                paying:false,
                dt_payment:new Date().toISOString(),
                paying_string:this.$t("You cant't pay, please select operations"),
                selected_items:[],

            }
        },
        methods: {
            empty_cco,
            changeSelected(selected_items){
                this.selected_items=selected_items
                this.paying_string=this.$t(`Make a payment of ${selected_items.length} operations valued in ${listobjects_sum(selected_items,"amount")}`) 
            },
            editCCO (item) {
                this.cco=item
                this.key=this.key+1
                this.dialog=true
            },
            update_table(){
                this.loading_cco=true
                axios.get(`${this.$store.state.apiroot}/creditcardsoperations/withbalance?paid=false&creditcard=${this.cc.id}`, this.myheaders())
                .then((response) => {
                    this.items_cco=response.data
                    console.log(response.data);
                    this.loading_cco=false 
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            acceptPayment(){
                //Validation
                //Accept              
                var ids=[]
                this.selected_items.forEach(item => ids.push(item.id))

                const formData= new FormData()
                formData.append('cco', ids)
                formData.append('dt_payment',this.dt_payment)
                axios.post(`${this.$store.state.apiroot}/creditcardsoperations/payment/${this.cc.id}/`, formData, this.myheaders_formdata())
                .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                        this.update_table()     
                        this.dialog=false
                }, (error) => {
                    this.parseResponseError(error)
                })

            },
            on_CreditcardsoperationsCU_cruded(){
                this.$emit("cruded ")
                this.dialog=false
                this.update_table()
            },
            on_TableAccountOperations_deleteAO(item){
                this.$refs.cco_cu.deleteCCO(item)

            }
        },
        mounted(){
            this.update_table()
        }
    }
</script>

