
<template>
    <div>    
        <h1 class="mb-4">{{ title() }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>           
        <v-card class="pa-6">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete dense :items="$store.state.investments" v-model="newio.investments" :label="$t('Select an investment')" item-text="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker v-model="newio.datetime" :label="$t('Set investment operation date and time')"></MyDateTimePicker>
                <v-autocomplete dense :items="$store.getters.getOperationstypesForInvestmentsOperations()" v-model="newio.operationstypes" :label="$t('Select an operation type')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field dense v-model.number="newio.shares" type="number" :label="$t('Set investment operation shares')" :placeholder="$t('Set investment operation shares')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field dense v-model.number="newio.price" type="number" :label="$t('Set investment operation price')" :placeholder="$t('Set investment operation price')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field dense v-model.number="newio.taxes" type="number" :label="$t('Set investment operation taxes')" :placeholder="$t('Set investment operation taxes')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field dense v-model.number="newio.commission" type="number" :label="$t('Set investment operation commission')" :placeholder="$t('Set investment operation commission')" :rules="RulesInteger(10,true)" counter="10"/>            
                <v-text-field dense v-model="newio.comment" type="text" :label="$t('Set investment operation comment')" :placeholder="$t('Set investment operation comment')" :rules="RulesString(255,false)" counter="255"/>
                <CurrencyFactor :label="$t('Set currency conversion factor')" v-model="newio.currency_conversion" :currency_from="investment.currency" :currency_to="investment.currency_account"></CurrencyFactor>
                <v-checkbox dense v-model="newio.show_in_ranges" :label="$t('Show in ranges?')" ></v-checkbox>
            </v-form>
            <div v-html="foot()"></div>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="accept()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import {empty_investment_operation} from '../empty_objects.js'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import CurrencyFactor from './CurrencyFactor.vue'
    export default {
        components: {
            MyDateTimePicker,
            MyMenuInline,
            CurrencyFactor,
        },
        props: {
            io: { //Null to create, io object with all parameters to update
                required: true 
            },
            investment: { // Only needs currrency paramenter
                required: true 
            },
        },
        data(){ 
            return {
                menuinline_items: [
                    {
                        subheader: this.$t("Investment operation options"),
                        children: [
                            {
                                name:"Fill commissions from total balance",
                                icon: "mdi-plus",
                                code: function(this_){
                                    var amount=this_.parseNumber(prompt( this_.$t("Set total balance of this investment operation") ));
                                    this_.newio.commission=Math.abs(Math.abs(amount)-Math.abs(this_.newio.shares*this_.newio.price))
                                },
                            },
                        ]
                    },
                ],  
                form_valid:false,
                newio: null,
                editing:false,
            }
        },
        methods: {
            empty_investment_operation,
            title(){
                if (this.editing){
                    return this.$t("Updating investment operation")
                } else {
                    return this.$t("Creating a new investment operation")
                }
            },
            button(){
                if (this.editing){
                    return this.$t("Update investment operation")
                } else {
                    return this.$t("Add investment operation")
                }
            },
            accept(){
                console.log("Accepting")
                if (this.editing==true){
                    axios.put(this.newio.url, this.newio,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/investmentsoperations/`, this.newio,  this.myheaders())
                    .then((response) => {
                            console.log(response)
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
            foot(){
                var gross=this.newio.shares*this.newio.price
                var net=0
                if (this.newio.shares>0){
                    net=gross+this.newio.taxes+this.newio.commission
                } else {
                    net=gross-this.newio.taxes-this.newio.commission
                }
                return this.$t("Gross balance: {0}. Net balance: {1}").format(
                    this.currency_html(gross, this.investment.currency),
                    this.currency_html(net, this.investment.currency)
                )
            },
            setShares(value){
                this.newio.shares=value
            }

        },
        created(){
            if ( this.io.url!=null){ // EDITING TIENE IO URL
                this.editing=true
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing=false
            }
            this.newio=Object.assign({},this.io)
        }
    }
</script>

