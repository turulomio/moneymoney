
<template>
    <div>    
        <h1 class="mb-4">{{ title() }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>           
        <v-card class="pa-6">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :readonly="mode=='D'" dense :items="$store.state.investments" v-model="new_io.investments" :label="$t('Select an investment')" item-text="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker :readonly="mode=='D'" v-model="new_io.datetime" :label="$t('Set investment operation date and time')"></MyDateTimePicker>
                <v-autocomplete :readonly="mode=='D'" dense :items="$store.getters.getOperationstypesForInvestmentsOperations()" v-model="new_io.operationstypes" :label="$t('Select an operation type')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field :readonly="mode=='D'" dense v-model.number="new_io.shares"  :label="$t('Set investment operation shares')" :placeholder="$t('Set investment operation shares')" :rules="RulesFloat(12,true,6)" counter="12"/>
                <v-text-field :readonly="mode=='D'" dense v-model.number="new_io.price"  :label="$t('Set investment operation price')" :placeholder="$t('Set investment operation price')" :rules="RulesFloatGEZ(12,true,product_decimals)" counter="12"/>
                <v-text-field :readonly="mode=='D'" dense v-model.number="new_io.taxes"  :label="$t('Set investment operation taxes')" :placeholder="$t('Set investment operation taxes')" :rules="RulesFloatGEZ(12,true,accounts_decimals)" counter="12"/>
                <v-text-field :readonly="mode=='D'" dense v-model.number="new_io.commission"  :label="$t('Set investment operation commission')" :placeholder="$t('Set investment operation commission')" :rules="RulesFloatGEZ(12,true,accounts_decimals)" counter="12"/>
                <v-text-field :readonly="mode=='D'" dense v-model="new_io.comment" type="text" :label="$t('Set investment operation comment')" :placeholder="$t('Set investment operation comment')" :rules="RulesString(255,false)" counter="255"/>
                <CurrencyFactor :readonly="mode=='D'" :label="$t('Set currency conversion factor')" v-model="new_io.currency_conversion" :currency_from="investment.currency" :currency_to="investment.currency_account"></CurrencyFactor>
                <v-checkbox :readonly="mode=='D'" dense v-model="new_io.show_in_ranges" :label="$t('Show in ranges?')" ></v-checkbox>
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
        name: "InvestmentsoperationsCU",
        components: {
            MyDateTimePicker,
            MyMenuInline,
            CurrencyFactor,
        },
        props: {
            io: { //Null to create, io object with all parameters to update
                required: true 
            },
            mode: {
                required: true // Can be CUD
            }
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
                                    this_.new_io.commission=Math.abs(Math.abs(amount)-Math.abs(this_.new_io.shares*this_.new_io.price))
                                },
                            },
                        ]
                    },
                ],  
                form_valid:false,
                new_io: null,
            }
        },
        computed:{
            product_decimals: function(){
                return 6
                //return this.$store.getters.getObjectPropertyByUrl("products",this.investment.products,"decimals")
            },
            accounts_decimals: function(){
                return this.$store.getters.getObjectPropertyByUrl("accounts",this.investment.accounts,"decimals")
            },
            investment: function(){
                return this.$store.getters.getObjectByUrl("investments",this.new_io.investments)
            }
        },
        methods: {
            empty_investment_operation,
            title(){
                if (this.mode=="U"){
                    return this.$t("Updating an investment operation")
                } else  if (this.mode=="C"){
                    return this.$t("Creating a new investment operation")
                } else  if (this.mode=="D"){
                    return this.$t("Deleting an investment operation")
                }
            },
            button(){
                if (this.mode=="U"){
                    return this.$t("Update")
                } else  if (this.mode=="C"){
                    return this.$t("Create")
                } else  if (this.mode=="D"){
                    return this.$t("Delete")
                }
            }, 
            accept(){
                if (this.mode=="U"){   
                    axios.put(this.new_io.url, this.new_io,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C") {
                    axios.post(`${this.$store.state.apiroot}/api/investmentsoperations/`, this.new_io,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D") {
                    var r = confirm(this.$t("Do you want to delete this investment operation?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.new_io.url, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
            foot(){
                var gross=this.new_io.shares*this.new_io.price
                var net=0
                if (this.new_io.shares>0){
                    net=gross+this.new_io.taxes+this.new_io.commission
                } else {
                    net=gross-this.new_io.taxes-this.new_io.commission
                }
                return this.$t("Gross balance: {0}. Net balance: {1}").format(
                    this.currency_html(gross, this.investment.currency),
                    this.currency_html(net, this.investment.currency)
                )
            },
            setShares(value){
                this.new_io.shares=value
            }

        },
        created(){
            this.new_io=Object.assign({},this.io)
            if ("investments" in this.new_io==false){//Plio misses investments.url
                this.new_io.investments=this.$store.getters.getObjectPropertyById("investments", this.new_io.investments_id,"url")
                this.new_io.url=this.hyperlinked_url("investmentsoperations",this.new_io.id)
                this.new_io.operationstypes=this.$store.getters.getObjectPropertyById("operationstypes", this.new_io.operationstypes_id,"url")
            }
            console.log(this.new_io)
            
        }
    }
</script>
