
<template>
    <div>    
        <h1 v-if="snackbar_message==''">{{ title() }}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>   
            <v-icon class="ml-2" @click="$emit('cruded')">mdi-close</v-icon> 
        </h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" :readonly="mode=='D'" lazy-validation v-if="snackbar_message==''">
                <MyDatePicker v-model="neworder.date"  :readonly="mode=='D'" :label="$t('Set order date')" :rules="RulesDate(true)"></MyDatePicker>
                <MyDatePicker v-model="neworder.expiration" :readonly="mode=='D'" :label="$t('Set order expiration date')" :rules="RulesDate(false)" />
                <v-autocomplete :items="$store.state.investments" :readonly="mode=='D'" v-model="neworder.investments" :label="$t('Select an investment')" item-text="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker v-model="neworder.executed" :readonly="mode=='D'" v-if="mode=='U'" :label="$t('Set order execution date and time')"></MyDateTimePicker>
                <v-text-field v-model.number="neworder.shares" :readonly="mode=='D'" :label="$t('Set order shares')" :placeholder="$t('Set order shares')" :rules="RulesFloatGEZ(12,true,6)" counter="12"/>
                <v-text-field v-model.number="neworder.price" :readonly="mode=='D'" :label="$t('Set order price')" :placeholder="$t('Set order price')" :rules="RulesFloatGEZ(12,true,product_decimals)" counter="12"/>
            </v-form>
                <div v-html="snackbar_message"></div>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="snackbar_message==''" @click="accept()" :disabled="!form_valid">{{ button() }}</v-btn>
                <v-btn color="error" v-if="!snackbar_message==''" @click="on_message_close()" :disabled="!form_valid">{{ $t("Close message")}}</v-btn>
            </v-card-actions>
        </v-card>

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
    import MyDatePicker from './MyDatePicker.vue'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import InvestmentsoperationsCU from './InvestmentsoperationsCU.vue'
    import {empty_investment_operation} from '../empty_objects.js'
    export default {
        components: {
            InvestmentsoperationsCU,
            MyDatePicker,
            MyDateTimePicker,
            MyMenuInline,
        },
        props: {
            // An order object
            order: {
                required: true // Null to create, order object to update
            },
            mode: {
                required: true // Can be CUD and E for order execution
            }
        },
        data(){ 
            return {
                form_valid:false,
                neworder:null,

                items: [
                    {
                        subheader:this.$t('Options to set shares'),
                        children: [
                            {
                                name:this.$t('Integer shares from price'),
                                code: function(this_){
                                    var amount=this_.parseNumber(prompt( this_.$t("Set the amount to invest in this order"), 10000 ));
                                    this_.neworder.shares=parseInt(amount/this_.neworder.price)
                                },
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Decimal shares from price'),
                                code: function(this_){
                                    var amount=this_.parseNumber(prompt( this_.$t("Set the amount to invest in this order"), 10000 ));
                                    this_.neworder.shares=amount/this_.neworder.price
                                },
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                ],
                snackbar:false,
                snackbar_message:"",
                key:0,

                //Dialog InvestmentsOperationsCU
                dialog_io_cu:false,
                io:null,
                io_investment: null,
            }
        },        
        computed:{
            product_decimals: function(){
                return 6
                // var product=this.$store.getters.getObjectPropertyByUrl("investments",this.neworder.investments,"products")
                // return this.$store.getters.getObjectPropertyByUrl("products",product,"decimals")
            },
        },
        methods: {
            empty_investment_operation,
            title(){
                if (this.mode=="U"){
                    return this.$t("Updating order")
                } else  if (this.mode=="C"){
                    return this.$t("Creating a new order")
                } else  if (this.mode=="E"){
                    return this.$t("Order execution")
                } else  if (this.mode=="D"){
                    return this.$t("Deleting order")
                }
            },
            button(){
                if (this.mode=="U"){
                    return this.$t("Update")
                } else  if (this.mode=="C"){
                    return this.$t("Create")
                } else  if (this.mode=="E"){
                    return this.$t("Execute")
                } else  if (this.mode=="D"){
                    return this.$t("Delete")
                }
            },
            accept(){
                if (this.$refs.form.validate()==false) return
                
                if (this.mode=="U"){
                    axios.put(this.neworder.url, this.neworder,  this.myheaders())
                    .then(() => {
                            this.show_snackbar_message()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/orders/`, this.neworder,  this.myheaders())
                    .then(() => {
                            this.show_snackbar_message()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="E"){
                    this.io_investment={url:this.neworder.investments,currency:this.neworder.currency}
                    this.io=this.empty_investment_operation()
                    this.io.shares=this.neworder.shares
                    this.io.price=this.neworder.price
                    this.io.investments=this.neworder.investments
                    this.key=this.key+1
                    this.dialog_io_cu=true
                } else if (this.mode=="D"){
                    var r = confirm(this.$t("This order will be deleted. Do you want to continue?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.neworder.url, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },
            needs_stop_loss_warning(){
                if (this.neworder.shares>0 && this.neworder.price>this.neworder.current_price){
                    return true
                } else if (this.neworder.shares<0 && this.neworder.price<this.neworder.current_price){
                    return true
                }
                return false
            },
            show_snackbar_message(){
                this.snackbar=true
                var stw =""
                if (this.needs_stop_loss_warning()==true){
                    stw='<p><span class="red">' + this.$t("Remember that is a stop loss order")+'</span></p>'
                }
                var r= "<p>" + this.$t("Order was created sucessfully.") + "</p>"
                r= r + "<p>" + this.$t("Don't forget to set this order in your bank:") + "</p>"
                r=r + stw
                r=r +"<ul>"
                r=r+"<li>" + this.$t("Expiration") + `: ${this.neworder.expiration}</li>`
                r=r+"<li>" + this.$t("Investment") + `: ${this.$store.getters.getObjectPropertyByUrl("investments", this.neworder.investments,"fullname")}</li>`
                r=r+"<li>" + this.$t("Shares") + `: ${this.neworder.shares}</li>`
                r=r+"<li>" + this.$t("Price") + `: ${this.neworder.price}</li>`

                r=r +"</ul>"
                this.snackbar_message=r
                this.key=this.key+1
            },
            on_message_close(){
                this.$emit("cruded")
                this.snackbar_message=""
            },           
            on_InvestmentsoperationsCU_cruded(){
                // Updates order
                this.neworder.executed=new Date().toISOString()
                axios.put(this.neworder.url, this.neworder,  this.myheaders())
                .then(() => {
                    this.$emit("cruded")
                    this.dialog_io_cu=false
                    this.io=null
                    this.io_investment=null
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
        },
        created(){
            this.neworder=Object.assign({},this.order)
        }
    }
</script>

