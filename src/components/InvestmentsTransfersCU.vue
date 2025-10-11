<template>
    <div>    
        <v-card class="pa-6">
            <h1 class="mb-4">{{ title }}</h1>
            <v-form ref="form" v-model="form_valid">
                <v-row>
                    <v-col >
                        <h2 class="mb-2">{{ $t("Origin") }}</h2>
                        <v-autocomplete data-test="InvestmentsTransfersCU_InvestmentsOrigin" :readonly="mode=='D'" :items="getArrayFromMap(store.investments)" v-model="new_transfer.investments_origin" :label="$t('Origin investment')" item-title="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                        <MyDateTimePicker data-test="InvestmentsTransfersCU_DateTimeOrigin" :readonly="mode=='D'" v-model="new_transfer.datetime_origin" :label="$t('Set origin date and time')" />
                        <v-text-field data-test="InvestmentsTransfersCU_SharesOrigin" :readonly="mode=='D'" v-model.number="new_transfer.shares_origin"  :label="$t('Shares')" :rules="RulesFloat(15,true,6)" counter="15"/>
                        <v-text-field data-test="InvestmentsTransfersCU_PriceOrigin" :readonly="mode=='D'" v-model.number="new_transfer.price_origin"  :label="$t('Price')" :rules="RulesFloatGEZ(15,true, origin_investment_product.decimals)" counter="15"/>
                        <v-text-field data-test="InvestmentsTransfersCU_CommissionOrigin" :readonly="mode=='D'" v-model.number="new_transfer.commission_origin"  :label="$t('Commission')" :rules="RulesFloatGEZ(12,true,origin_investment_account.decimals)" counter="12"/>
                        <v-text-field data-test="InvestmentsTransfersCU_TaxesOrigin" :readonly="mode=='D'" v-model.number="new_transfer.taxes_origin"  :label="$t('Taxes')" :rules="RulesFloatGEZ(12,true,origin_investment_account.decimals)" counter="12" />
                        <CurrencyFactor v-if="new_transfer.investments_origin" data-test="InvestmentsTransfersCU_CurrencyConversionOrigin" :readonly="mode=='D'" :label="$t('Currency conversion factor')" v-model="new_transfer.currency_conversion_origin" :currency_from="origin_investment_product.currency" :currency_to="origin_investment_account.currency"></CurrencyFactor>
                    </v-col>
                    <v-col>
                        <h2 class="mb-2">{{ $t("Destination") }}</h2>
                        <v-autocomplete data-test="InvestmentsTransfersCU_InvestmentsDestiny" :readonly="mode=='D'" :items="getArrayFromMap(store.investments)" v-model="new_transfer.investments_destiny" :label="$t('Destination investment')" item-title="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                        <MyDateTimePicker data-test="InvestmentsTransfersCU_DateTimeDestiny" :readonly="mode=='D'" v-model="new_transfer.datetime_destiny" :label="$t('Set destination date and time. Clear for unfinished transfers')" clearable />
                        <v-text-field data-test="InvestmentsTransfersCU_SharesDestiny" :readonly="mode=='D'" v-model.number="new_transfer.shares_destiny"  :label="$t('Shares')" :rules="RulesFloat(15,true,6)" counter="15"/>
                        <v-text-field data-test="InvestmentsTransfersCU_PriceDestiny" :readonly="mode=='D'" v-model.number="new_transfer.price_destiny"  :label="$t('Price')" :rules="RulesFloatGEZ(15,true, destination_investment_product.decimals)" counter="15"/>
                        <v-text-field data-test="InvestmentsTransfersCU_CommissionDestiny" :readonly="mode=='D'" v-model.number="new_transfer.commission_destiny"  :label="$t('Commission')" :rules="RulesFloatGEZ(12,true,destination_investment_account.decimals)" counter="12"/>
                        <v-text-field data-test="InvestmentsTransfersCU_TaxesDestiny" :readonly="mode=='D'" v-model.number="new_transfer.taxes_destiny"  :label="$t('Taxes')" :rules="RulesFloatGEZ(12,true,destination_investment_account.decimals)" counter="12"/>
                        <CurrencyFactor v-if="new_transfer.investments_destiny" data-test="InvestmentsTransfersCU_CurrencyConversionDestiny" :readonly="mode=='D'" :label="$t('Currency conversion factor')" v-model="new_transfer.currency_conversion_destiny" :currency_from="destination_investment_product.currency" :currency_to="destination_investment_account.currency"></CurrencyFactor>
                    </v-col>
                </v-row>
                <v-textarea data-test="InvestmentsTransfersCU_Comment" :readonly="mode=='D'" v-model="new_transfer.comment" type="text" :label="$t('Comment')" :placeholder="$t('Enter a comment')" :rules="RulesString(255,false)" counter="255"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="InvestmentsTransfersCU_Button" color="primary" @click="accept()" >{{ button }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script setup>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import CurrencyFactor from './CurrencyFactor.vue'
    import { RulesSelection,RulesFloat,RulesFloatGEZ,RulesString } from 'vuetify_rules'
    import { newParseResponseError, myheaders, getArrayFromMap } from '@/functions.js'
    import { empty_investment_transfer } from '@/empty_objects.js'
    import { ref, computed } from 'vue'
    import { useI18n } from 'vue-i18n'

    const props = defineProps({
        transfer: { //Null to create, transfer object with all parameters to update
            required: true 
        },
        mode: {
            required: true // Can be CUD
        }
    })

    const emit = defineEmits(['cruded'])
    const { t } = useI18n()
    const store = useStore()
    const form_valid = ref(false)
    const form = ref(null) // For the v-form ref
    const new_transfer = ref(null)

    if (props.transfer == null) {
        new_transfer.value = empty_investment_transfer()
    } else {
        new_transfer.value = Object.assign({}, props.transfer)
    }

    const origin_investment = computed(() => {
        if (new_transfer.value.investments_origin) return store.investments.get(new_transfer.value.investments_origin)
        return null
    })

    const origin_investment_account = computed(() => {
        if (origin_investment.value) return store.accounts.get(origin_investment.value.accounts)
        return {decimals:2} //Default value
    })

    const origin_investment_product = computed(() => {
        if (origin_investment.value) return store.products.get(origin_investment.value.products)
        return {currency: store.profile.currency, decimals:2} //Default value
    })

    const destination_investment = computed(() => {
        if (new_transfer.value.investments_destiny) return store.investments.get(new_transfer.value.investments_destiny)
        return null
    })

    const destination_investment_account = computed(() => {
        if (destination_investment.value) return store.accounts.get(destination_investment.value.accounts)
        return {decimals:2} //Default value
    })

    const destination_investment_product = computed(() => {
        if (destination_investment.value) return store.products.get(destination_investment.value.products)
        return {currency: store.profile.currency, decimals:2} //Default value
    })

    const title = computed(() => {
        if (props.mode=="U"){
            return t("Update an investment transfer")
        } else  if (props.mode=="C"){
            return t("Add a new investment transfer")
        } else  if (props.mode=="D"){
            return t("Delete investment transfer")
        }
        return ""
    })

    const button = computed(() => {
        if (props.mode=="U"){
            return t("Update")
        } else  if (props.mode=="C"){
            return t("Create")
        } else  if (props.mode=="D"){
            return t("Delete")
        }
        return ""
    })

    function accept(){
        if (props.mode=="U"){   
            axios.put(new_transfer.value.url, new_transfer.value,  myheaders())
            .then(() => {
                    emit("cruded")
            }, (error) => {
                newParseResponseError(error,t,useStore())
            })
        } else if (props.mode=="C") {
            axios.post(`${store.apiroot}/api/investmentstransfers/`, new_transfer.value,  myheaders())
            .then(() => {
                    emit("cruded")
            }, (error) => {
                newParseResponseError(error,t,useStore())
            })
        } else if (props.mode=="D") {
            var r = confirm(t("Do you want to delete this investment transfer?"))
            if(r == false) {
                return
            } 
            axios.delete(new_transfer.value.url, myheaders())
            .then(() => {
                emit("cruded")
            }, (error) => {
                newParseResponseError(error,t,useStore())
            })
        }
    }


</script>
