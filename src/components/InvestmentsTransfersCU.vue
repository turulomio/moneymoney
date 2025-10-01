<template>
    <div>    
        <v-card class="pa-6">
            <h1 class="mb-4">{{ title() }}</h1>
            <v-form ref="form" v-model="form_valid">
                <v-row>
                    <v-col cols="12" sm="6">
                        <h2 class="mb-2">{{ $t("Origin") }}</h2>
                        <v-autocomplete data-test="InvestmentsTransfersCU_InvestmentsOrigin" :readonly="mode=='D'" :items="getArrayFromMap(useStore().investments)" v-model="new_transfer.investments_origin" :label="$t('Origin investment')" item-title="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                        <MyDateTimePicker data-test="InvestmentsTransfersCU_DateTimeOrigin" :readonly="mode=='D'" v-model="new_transfer.datetime_origin" :label="$t('Set origin date and time')" />
                        <v-text-field data-test="InvestmentsTransfersCU_SharesOrigin" :readonly="mode=='D'" v-model.number="new_transfer.shares_origin"  :label="$t('Shares')" :rules="RulesFloat(15,true,6)" counter="15"/>
                        <v-text-field data-test="InvestmentsTransfersCU_PriceOrigin" :readonly="mode=='D'" v-model.number="new_transfer.price_origin"  :label="$t('Price')" :rules="RulesFloatGEZ(15,true, origin_investment_product.decimals)" counter="15"/>
                        <v-text-field data-test="InvestmentsTransfersCU_CommissionOrigin" :readonly="mode=='D'" v-model.number="new_transfer.commission_origin"  :label="$t('Commission')" :rules="RulesFloatGEZ(12,true,origin_investment_account.decimals)" counter="12"/>
                        <v-text-field data-test="InvestmentsTransfersCU_TaxesOrigin" :readonly="mode=='D'" v-model.number="new_transfer.taxes_origin"  :label="$t('Taxes')" :rules="RulesFloatGEZ(12,true,origin_investment_account.decimals)" counter="12"/>
                        <CurrencyFactor data-test="InvestmentsTransfersCU_CurrencyConversionOrigin" :readonly="mode=='D'" :label="$t('Currency conversion factor')" v-model="new_transfer.currency_conversion_origin" :currency_from="origin_investment_product.currency" :currency_to="origin_investment_account.currency"></CurrencyFactor>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <h2 class="mb-2">{{ $t("Destination") }}</h2>
                        <v-autocomplete data-test="InvestmentsTransfersCU_InvestmentsDestiny" :readonly="mode=='D'" :items="getArrayFromMap(useStore().investments)" v-model="new_transfer.investments_destiny" :label="$t('Destination investment')" item-title="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                        <MyDateTimePicker data-test="InvestmentsTransfersCU_DateTimeDestiny" :readonly="mode=='D'" v-model="new_transfer.datetime_destiny" :label="$t('Set destination date and time')" />
                        <v-text-field data-test="InvestmentsTransfersCU_SharesDestiny" :readonly="mode=='D'" v-model.number="new_transfer.shares_destiny"  :label="$t('Shares')" :rules="RulesFloat(15,true,6)" counter="15"/>
                        <v-text-field data-test="InvestmentsTransfersCU_PriceDestiny" :readonly="mode=='D'" v-model.number="new_transfer.price_destiny"  :label="$t('Price')" :rules="RulesFloatGEZ(15,true, destination_investment_product.decimals)" counter="15"/>
                        <v-text-field data-test="InvestmentsTransfersCU_CommissionDestiny" :readonly="mode=='D'" v-model.number="new_transfer.commission_destiny"  :label="$t('Commission')" :rules="RulesFloatGEZ(12,true,destination_investment_account.decimals)" counter="12"/>
                        <v-text-field data-test="InvestmentsTransfersCU_TaxesDestiny" :readonly="mode=='D'" v-model.number="new_transfer.taxes_destiny"  :label="$t('Taxes')" :rules="RulesFloatGEZ(12,true,destination_investment_account.decimals)" counter="12"/>
                        <CurrencyFactor data-test="InvestmentsTransfersCU_CurrencyConversionDestiny" :readonly="mode=='D'" :label="$t('Currency conversion factor')" v-model="new_transfer.currency_conversion_destiny" :currency_from="destination_investment_product.currency" :currency_to="destination_investment_account.currency"></CurrencyFactor>
                    </v-col>
                </v-row>
                <v-textarea data-test="InvestmentsTransfersCU_Comment" :readonly="mode=='D'" v-model="new_transfer.comment" type="text" :label="$t('Comment')" :placeholder="$t('Enter a comment')" :rules="RulesString(255,false)" counter="255"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="InvestmentsTransfersCU_Button" color="primary" @click="accept()" >{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import CurrencyFactor from './CurrencyFactor.vue'
    import { RulesSelection,RulesFloat,RulesFloatGEZ,RulesString } from 'vuetify_rules'
    import { parseResponseError, myheaders, getArrayFromMap } from '@/functions.js'
    import { empty_investment_transfer } from '@/empty_objects'


    export default {
        name: "InvestmentsTransfersCU",
        components: {
            MyDateTimePicker,
            CurrencyFactor,
        },
        props: {
            transfer: { //Null to create, transfer object with all parameters to update
                required: true 
            },
            mode: {
                required: true // Can be CUD
            }
        },
        data(){ 
            return {
                form_valid:false,
                new_transfer: null,
            }
        },
        computed:{
            origin_investment: function(){
                if (this.new_transfer.investments_origin) return this.useStore().investments.get(this.new_transfer.investments_origin)
                return null
            },
            origin_investment_account: function(){
                if (this.origin_investment) return this.useStore().accounts.get(this.origin_investment.accounts)
                return {decimals:2} //Default value
            },
            origin_investment_product: function(){
                if (this.origin_investment) return this.useStore().products.get(this.origin_investment.products)
                return {currency: this.useStore().profile.currency, decimals:2} //Default value
            },
            destination_investment: function(){
                if (this.new_transfer.investments_destiny) return this.useStore().investments.get(this.new_transfer.investments_destiny)
                return null
            },
            destination_investment_account: function(){
                if (this.destination_investment) return this.useStore().accounts.get(this.destination_investment.accounts)
                return {decimals:2} //Default value
            },
            destination_investment_product: function(){
                if (this.destination_investment) return this.useStore().products.get(this.destination_investment.products)
                return {currency: this.useStore().profile.currency, decimals:2} //Default value
            },
        },
        methods: {
            useStore,
            RulesSelection,
            RulesFloat,
            RulesFloatGEZ,
            RulesString,
            parseResponseError,
            myheaders,
            getArrayFromMap,
            title(){
                if (this.mode=="U"){
                    return this.$t("Update an investment transfer")
                } else  if (this.mode=="C"){
                    return this.$t("Add a new investment transfer")
                } else  if (this.mode=="D"){
                    return this.$t("Delete investment transfer")
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
                    axios.put(this.new_transfer.url, this.new_transfer,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="C") {
                    axios.post(`${this.useStore().apiroot}/api/investmentstransfers/`, this.new_transfer,  this.myheaders())
                    .then(() => {
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="D") {
                    var r = confirm(this.$t("Do you want to delete this investment transfer?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.new_transfer.url, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            }
        },
        created(){
            if (this.transfer == null) this.new_transfer = empty_investment_transfer()
            else this.new_transfer=Object.assign({},this.transfer)
            console.log(this.new_transfer)
        }
    }
</script>
