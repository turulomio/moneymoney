
<template>
    <div>    
        <h1>{{ title() }}
            <MyMenuInline v-if="snackbar_message==''" :items="items" :context="this"></MyMenuInline>
        </h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" :readonly="mode=='D'" v-if="snackbar_message==''">
                <MyDatePicker v-model="new_order.date"  :readonly="mode=='D'" :label="$t('Set order date')"/>
                <MyDatePicker v-model="new_order.expiration" :readonly="mode=='D'" :label="$t('Set order expiration date')" :clearable="true"/>
                <v-autocomplete :items="getArrayFromMap(store().investments)" :readonly="mode=='D'" v-model="new_order.investments" :label="$t('Select an investment')" item-title="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker v-model="new_order.executed" :readonly="mode=='D'" v-if="mode=='U'" :label="$t('Set order execution date and time')" :clearable="true" />
                <v-text-field v-model.number="new_order.shares" :readonly="mode=='D'" :label="$t('Set order shares')" :placeholder="$t('Set order shares')" :rules="RulesFloatGEZ(12,true,6)" counter="12"/>
                <v-text-field v-model.number="new_order.price" :readonly="mode=='D'" :label="$t('Set order price')" :placeholder="$t('Set order price')" :rules="RulesFloatGEZ(12,true,product_decimals)" counter="12"/>
            </v-form>
            <div v-html="snackbar_message"></div>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="snackbar_message==''" @click="accept()" >{{ button() }}</v-btn>
                <v-btn color="error" v-if="!snackbar_message==''" @click="on_message_close()">{{ $t("Close message")}}</v-btn>
            </v-card-actions>
        </v-card>

        <!-- Investments operation CU dialog -->
        <v-dialog v-model="dialog_io_cu" max-width="40%" v-if="io" >
            <v-card class="pa-4">
                <InvestmentsoperationsCU :io="io" :mode="io_mode" @cruded="on_InvestmentsoperationsCU_cruded()" :key="key" />
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
    import { RulesSelection ,RulesFloatGEZ} from 'vuetify_rules'
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
                new_order:null,

                items: [
                    {
                        subheader:this.$t('Options to set shares'),
                        children: [
                            {
                                name:this.$t('Integer shares from price'),
                                code: function(){
                                    var amount=this.parseNumber(prompt( this.$t("Set the amount to invest in this order"), 10000 ));
                                    this.new_order.shares=parseInt(amount/this.new_order.price)
                                }.bind(this),
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Decimal shares from price'),
                                code: function(){
                                    var amount=this.parseNumber(prompt( this.$t("Set the amount to invest in this order"), 10000 ));
                                    this.new_order.shares=amount/this.new_order.price
                                }.bind(this),
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
                io_mode: null,
            }
        },        
        computed:{
            product_decimals: function(){
                return 6
            },
        },
        methods: {
            RulesSelection,
            RulesFloatGEZ,
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
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                
                if (this.mode=="U"){
                    axios.put(this.new_order.url, this.new_order,  this.myheaders())
                    .then(() => {
                            this.show_snackbar_message()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C"){
                    axios.post(`${this.store().apiroot}/api/orders/`, this.new_order,  this.myheaders())
                    .then(() => {
                            this.show_snackbar_message()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="E"){
                    this.io=this.empty_investment_operation()
                    this.io.shares=this.new_order.shares
                    this.io.price=this.new_order.price
                    this.io.investments=this.new_order.investments
                    this.io_mode="C"
                    this.key=this.key+1
                    this.dialog_io_cu=true
                } else if (this.mode=="D"){
                    var r = confirm(this.$t("This order will be deleted. Do you want to continue?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.new_order.url, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },
            needs_stop_loss_warning(){
                if (this.new_order.shares>0 && this.new_order.price>this.new_order.current_price){
                    return true
                } else if (this.new_order.shares<0 && this.new_order.price<this.new_order.current_price){
                    return true
                }
                return false
            },
            show_snackbar_message(){
                this.snackbar=true
                var stw =""
                if (this.needs_stop_loss_warning()==true){
                    stw='<p><span class="boldred">' + this.$t("Remember that is a stop loss order")+'</span></p>'
                }
                var r= "<p>" + this.$t("Order was created sucessfully.") + "</p>"
                r= r + "<p>" + this.$t("Don't forget to set this order in your bank:") + "</p>"
                r=r + stw
                r=r +"<ul>"
                r=r+"<li>" + this.$t("Expiration") + `: ${this.new_order.expiration}</li>`
                r=r+"<li>" + this.$t("Investment") + `: ${this.store().investments.get(this.new_order.investments).fullname}</li>`
                r=r+"<li>" + this.$t("Shares") + `: ${this.new_order.shares}</li>`
                r=r+"<li>" + this.$t("Price") + `: ${this.new_order.price}</li>`

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
                this.new_order.executed=new Date().toISOString()
                axios.put(this.new_order.url, this.new_order,  this.myheaders())
                .then(() => {
                    //Backend changes investments status active, I set it here for frontend
                    var investment=this.store().investments.get(this.new_order.investments)
                    investment.active=true
                    this.store().investments.set(this.new_order.investments,investment)
                    this.$emit("cruded")
                    this.dialog_io_cu=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
        },
        created(){
            this.new_order=Object.assign({},this.order)
        }
    }
</script>

