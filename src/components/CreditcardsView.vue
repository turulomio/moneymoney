
<template>
    <div>    
        <h1>{{ $t(`Credit card details of '${cc.name}'`) }}
            <MyMenuInline :items="menuinline_items" @selected="MyMenuInlineSelection"></MyMenuInline>

        </h1>
        <v-card outlined class="ma-4 pa-4">
            <TableAccountOperations :showselected="paying" homogeneous :items="items_cco" :currency_account="account.currency" height="400" ref="table_cc" class=" flex-grow-1 flex-shrink-0" :locale='this.$i18n.locale' @editAO="editCCO" @deleteAO="deleteCCO" @changeSelected="changeSelected" :key="key"></TableAccountOperations>
        </v-card>
        <v-dialog v-model="dialog" max-width="550">
            <v-card class="pa-4">
                <v-card-title class="headline">{{dialog_title()}}</v-card-title>

                <v-form ref="form_cco" v-model="form_valid_cco" lazy-validation>
                    <v-autocomplete :items="$store.state.creditcards.filter(v =>v.active==true)" v-model="cco.creditcards" :label="$t('Select a credit card')" item-text="name" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
                    <MyDateTimePicker label="Select operation date and time" v-model="cco.datetime" ></MyDateTimePicker>
                    <v-autocomplete :items="$store.state.concepts" v-model="cco.concepts" :label="$t('Select a concept')" item-text="name" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
                    <v-text-field v-model="cco.amount" type="number" :label="$t('Operation amount')" required :placeholder="$t('Account number')" :rules="RulesString(30,true)" counter="30"/>
                    <v-text-field v-model="cco.comment" type="text" :label="$t('Operation comment')" required :placeholder="$t('Operation comment')" autofocus  counter="200"/>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid_cco">{{ $t("Log in") }}</v-btn>
                    <v-btn color="error" @click="dialog = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-card outlined class="ma-4 pa-4" v-if="paying">
            <MyDateTimePicker label="Select payment date and time" v-model="dt_payment" ></MyDateTimePicker>
            <v-btn color="primary" @click="acceptPayment()" :disabled="this.selected_items.length==0">{{ paying_string }}</v-btn>
            <v-btn class="ml-2" color="error" @click="paying=false" >{{ $t("Close payment mode") }}</v-btn>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import TableAccountOperations from './TableAccountOperations.vue'
    import {listobjects_sum, localtime} from '../functions.js'
    export default {
        components:{
            MyMenuInline,
            TableAccountOperations,
            MyDateTimePicker,
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
                                    this_.editing=false
                                    this_.cco=this_.empty_cco()
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
                dialog:false,
                form_valid_cco: false,
                cco: this.empty_cco(),
                editing:false,
                loading_cco:false,

                dialog_view:false,
                key:0,

                //Payment
                paying:false,
                dt_payment:new Date().toISOString(),
                paying_string:this.$t("You cant't pay, please select operations"),
                selected_items:[],

            }
        },
        methods: {
            localtime,
            changeSelected(selected_items){
                this.selected_items=selected_items
                this.paying_string=this.$t(`Make a payment of ${selected_items.length} operations valued in ${listobjects_sum(selected_items,"amount")}`) 
            },
            dialog_title(){
                if(this.editing==true){
                    return this.$t("Updating credit card operation")
                } else {
                    return this.$t("Creating a new credit card operation")
                }
            },
            empty_cco(){
                return {
                    datetime: new Date(),
                    concepts: null,
                    operationstypes:null,
                    amount: 0,
                    comment: "",    
                    creditcards: this.cc.url,
                    paid:false,
                    paid_datetime:null,
                }
            },
            MyMenuInlineSelection(item){
                item.code(this)
            },
            editCCO (item) {
                this.cco=item
                this.editing=true
                this.dialog=true
            },
            viewItem (item) {
                this.cco=item
                this.dialog_view=true
            },
            deleteCCO (item) {
               var r = confirm(this.$t("Do you want to delete this credit card operation?"))
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
            acceptDialog(){
                //Validation
                if( this.$refs.form_cco.validate()==false) return
                var concept=this.get_from_catalog(this.cco.concepts,"concepts")
                var operationtype=this.get_from_catalog(concept.operationstypes,"operationstypes")
                this.cco.operationstypes=operationtype.url
                if (operationtype.id==1 && this.cco.amount>0){
                     alert(this.$t("Amount must be negative"))
                     return
                }
                if (operationtype.id==2 && this.cco.amount<0) {
                    alert(this.$t("Amount must be positive"))
                    return
                }

                //Accept
                if (this.editing==true){               
                    axios.put(this.cco.url, this.cco, this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.update_table()     
                            this.dialog=false
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/creditcardsoperations/`, this.cco,  this.myheaders())
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
                        this.editing=false
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

