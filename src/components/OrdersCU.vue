
<template>
    <div>    
        <h1 v-if="snackbar_message==''">{{ title() }}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>    
        </h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation v-if="snackbar_message==''">
                <MyDatePicker v-model="neworder.date" :label="$t('Set order date')" :rules="RulesDate(true)"></MyDatePicker>
                <MyDatePicker v-model="neworder.expiration" :label="$t('Set order expiration date')" :rules="RulesDate(true)" ></MyDatePicker>
                <v-autocomplete :items="$store.state.investments" v-model="neworder.investments" :label="$t('Select an investment')" item-text="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker v-model="neworder.executed" v-if="editing==true" :label="$t('Set order execution date and time')"></MyDateTimePicker>
                <v-text-field v-model="neworder.price" type="number" :label="$t('Set order price')" :placeholder="$t('Set order price')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field v-model="neworder.shares" type="number" :label="$t('Set order shares')" :placeholder="$t('Set order shares')" :rules="RulesInteger(10,true)" counter="10"/>
            </v-form>
                <div v-html="snackbar_message"></div>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="snackbar_message==''" @click="accept()" :disabled="!form_valid">{{ button() }}</v-btn>
                <v-btn color="error" v-if="!snackbar_message==''" @click="on_message_close()" :disabled="!form_valid">{{ $t("Close message")}}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import MyDatePicker from './MyDatePicker.vue'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import {parseNumber} from '../functions.js'
    export default {
        components: {
            MyDatePicker,
            MyDateTimePicker,
            MyMenuInline,
        },
        props: {
            // An account object
            order: {
                required: true // Null to create, order object to update
            }
        },
        data(){ 
            return {
                form_valid:false,
                neworder:null,
                editing:false,

                items: [
                    {
                        subheader:this.$t('Options to set shares'),
                        children: [
                            {
                                name:this.$t('Integer shares from price'),
                                code: function(this_){
                                    var amount=parseNumber(prompt( this_.$t("Please the amount to invest in this order"), 10000 ));
                                    this_.neworder.shares=parseInt(amount/this_.neworder.price)
                                },
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Decimal shares from price'),
                                code: function(this_){
                                    var amount=parseNumber(prompt( this_.$t("Please the amount to invest in this order"), 10000 ));
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
            }
        },
        methods: {
            title(){
                if (this.editing){
                    return this.$t("Updating order")
                } else {
                    return this.$t("Creating a new order")
                }
            },
            button(){
                if (this.editing){
                    return this.$t("Update order")
                } else {
                    return this.$t("Add order")
                }
            },
            accept(){
                if (this.editing==true){
                    axios.put(this.neworder.url, this.neworder,  this.myheaders())
                    .then(() => {
                            this.show_snackbar_message()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/orders/`, this.neworder,  this.myheaders())
                    .then(() => {
                            this.show_snackbar_message()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
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
                var stw
                if (this.needs_stop_loss_warning()==true){
                    stw='<p><span class="red">' + this.$t("Remember that is a stop loss order")+'</span></p>'
                }
                var r= "<p>" + this.$t("Order was created sucessfully.") + "</p>"
                r= r + "<p>" + this.$t("Don't forget to set this order in your bank:") + "</p>"
                r=r + stw
                r=r +"<ul>"
                r=r+"<li>" + this.$t("Expiration") + `: ${this.neworder.expiration}</li>`
                r=r+"<li>" + this.$t("Investment") + `: ${this.$store.getters.getObjectPropertyByUrl("investments", this.neworder.investments,"name")}</li>`
                r=r+"<li>" + this.$t("Shares") + `: ${this.neworder.shares}</li>`
                r=r+"<li>" + this.$t("Price") + `: ${this.neworder.price}</li>`

                r=r +"</ul>"
                this.snackbar_message=r
                this.key=this.key+1
            },
            on_message_close(){
                this.$emit("cruded")
                this.snackbar_message=""
            }
        },
        created(){
            if (this.order.url!=null){
                this.editing=true
            }
            this.neworder=Object.assign({},this.order)
        }
    }
</script>

