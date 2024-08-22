<template>
    <div>    
        <v-card class="pa-6">
            <h1 class="mb-4">{{ title() }}
                <MyMenuInline :items="menuinline_items"/>
            </h1>           
            <v-form ref="form" v-model="form_valid">
                <v-autocomplete :readonly="mode=='D'" :items="getArrayFromMap(useStore().investments)" v-model="new_io.investments" :label="$t('Select an investment')" item-title="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <div class="d-flex mx-auto">
                    <MyDateTimePicker :readonly="mode=='D'" v-model="new_io.datetime" :label="$t('Set investment operation date and time')" />
                </div>
                <div class="d-flex mx-auto">
                    <v-autocomplete :readonly="mode=='D'" :items="getOperationstypesForInvestmentsOperations()" v-model="new_io.operationstypes" :label="$t('Select an operation type')" item-title="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                </div>
                <div class="d-flex flex-row">
                    <v-text-field data-test="InvestmentsoperationsCU_Shares" class="mr-5" :readonly="mode=='D'" v-model.number="new_io.shares"  :label="$t('Set investment operation shares')" :placeholder="$t('Set investment operation shares')" :rules="RulesFloat(12,true,6)" counter="12"/>
                    <v-text-field data-test="InvestmentsoperationsCU_Price" :readonly="mode=='D'" v-model.number="new_io.price"  :label="$t('Set investment operation price')" :placeholder="$t('Set investment operation price')" :rules="RulesFloatGEZ(12,true,product.decimals)" counter="12"/>
                </div>
                <div class="d-flex flex-row">
                    <v-text-field class="mr-5" :readonly="mode=='D'" v-model.number="new_io.taxes"  :label="$t('Set investment operation taxes')" :placeholder="$t('Set investment operation taxes')" :rules="RulesFloatGEZ(12,true,account.decimals)" counter="12"/>
                    <v-text-field :readonly="mode=='D'" v-model.number="new_io.commission"  :label="$t('Set investment operation commission')" :placeholder="$t('Set investment operation commission')" :rules="RulesFloatGEZ(12,true, account.decimals)" counter="12"/>
                </div>
                <v-textarea :readonly="mode=='D'" v-model="new_io.comment" type="text" :label="$t('Set investment operation comment')" :placeholder="$t('Set investment operation comment')" :rules="RulesString(255,false)" counter="255"/>
                <CurrencyFactor :readonly="mode=='D'" :label="$t('Set currency conversion factor')" v-model="new_io.currency_conversion" :currency_from="product.currency" :currency_to="account.currency"></CurrencyFactor>
            </v-form>
            <div v-html="change_foot()"></div>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="InvestmentsoperationsCU_Button" color="primary" @click="accept()" >{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import {empty_investment_operation} from '../empty_objects.js'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import CurrencyFactor from './CurrencyFactor.vue'
    import { RulesSelection,RulesFloat,RulesFloatGEZ,RulesString, parseNumber,f} from 'vuetify_rules'
    import { round } from "lodash-es"
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
                                code: function(){
                                    var amount=this.parseNumber(prompt( this.$t("Set total balance of this investment operation") ));
                                    this.new_io.commission=this.round(Math.abs(Math.abs(amount)-Math.abs(this.new_io.shares*this.new_io.price)),this.account.decimals)
                                }.bind(this),
                            },
                        ]
                    },
                ],  
                form_valid:false,
                new_io: null,
            }
        },
        computed:{
            product: function(){
                return this.useStore().products.get(this.investment.products)
            },
            account: function(){
                return this.useStore().accounts.get(this.investment.accounts)
            },
            investment: function(){
                return this.useStore().investments.get(this.new_io.investments)
            },
        },
        methods: {
            useStore,
            RulesSelection,
            RulesFloat,
            RulesFloatGEZ,
            RulesString,
            parseNumber,
            round,
            f,
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
                    axios.post(`${this.useStore().apiroot}/api/investmentsoperations/`, this.new_io,  this.myheaders())
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
            setShares(value){
                this.new_io.shares=value
            },
            change_foot(){
                var gross=this.new_io.shares*this.new_io.price
                var net=0
                if (this.new_io.shares>0){
                    net=gross+this.new_io.taxes+this.new_io.commission
                } else {
                    net=gross-this.new_io.taxes-this.new_io.commission
                }
                return f(this.$t("Operation gross balance: [0]<br>Operation net balance: [1]"), [
                     this.currency_html(gross, this.product.currency),
                     this.currency_html(net, this.product.currency)
                ])
            },
        },
        created(){
            this.new_io=Object.assign({},this.io) //Can come from plio or empty_investment_operation
            if ("investments" in this.new_io==false){//Plio misses investments it has investments_id, url and operationstypes
                this.new_io.investments=this.getMapObjectById("investments", this.new_io.investments_id).url
                this.new_io.url=this.hyperlinked_url("investmentsoperations",this.new_io.id)
                this.new_io.operationstypes=this.getMapObjectById("operationstypes", this.new_io.operationstypes_id).url
            }           
        }
    }
</script>
