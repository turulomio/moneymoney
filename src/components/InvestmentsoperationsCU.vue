<template>
    <div>    
        <v-card class="pa-6">
            <h1 class="mb-4">{{ title }}
                <MyMenuInline :items="menuinline_items"/>
            </h1>           
            <v-form ref="form" v-model="form_valid">
                <v-autocomplete :readonly="props.mode=='D'" :items="getArrayFromMap(store.investments)" v-model="new_io.investments" :label="$t('Select an investment')" item-title="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <div class="d-flex mx-auto">
                    <MyDateTimePicker :readonly="props.mode=='D'" v-model="new_io.datetime" :label="$t('Set investment operation date and time')" />
                </div>
                <div class="d-flex mx-auto">
                    <AutocompleteOperationstypes :readonly="props.mode=='D'" v-model="new_io.operationstypes" :label="$t('Select an operation type')" :type="2" :rules="RulesSelection(true)" />
                </div>
                <div class="d-flex flex-row">
                    <v-text-field data-test="InvestmentsoperationsCU_Shares" class="mr-5" :readonly="props.mode=='D'" v-model.number="new_io.shares"  :label="$t('Set investment operation shares')" :placeholder="$t('Set investment operation shares')" :rules="RulesFloat(15,true,6)" counter="15"/>
                    <v-text-field data-test="InvestmentsoperationsCU_Price" :readonly="props.mode=='D'" v-model.number="new_io.price"  :label="$t('Set investment operation price')" :placeholder="$t('Set investment operation price')" :rules="RulesFloatGEZ(15,true,product.decimals)" counter="15"/>
                </div>
                <div class="d-flex flex-row">
                    <v-text-field class="mr-5" :readonly="props.mode=='D'" v-model.number="new_io.taxes"  :label="$t('Set investment operation taxes')" :placeholder="$t('Set investment operation taxes')" :rules="RulesFloatGEZ(12,true,account.decimals)" counter="12"/>
                    <v-text-field :readonly="props.mode=='D'" v-model.number="new_io.commission"  :label="$t('Set investment operation commission')" :placeholder="$t('Set investment operation commission')" :rules="RulesFloatGEZ(12,true, account.decimals)" counter="12"/>
                </div>
                <v-textarea :readonly="props.mode=='D'" v-model="new_io.comment" type="text" :label="$t('Set investment operation comment')" :placeholder="$t('Set investment operation comment')" :rules="RulesString(255,false)" counter="255"/>
                <CurrencyFactor v-if="new_io.investments" :readonly="props.mode=='D'" :label="$t('Set currency conversion factor')" v-model="new_io.currency_conversion" :currency_from="product.currency" :currency_to="account.currency"></CurrencyFactor>
            </v-form>
            <div v-html="change_foot"></div>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="InvestmentsoperationsCU_Button" color="primary" @click="accept" >{{ button }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script setup>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import CurrencyFactor from './CurrencyFactor.vue'
    import AutocompleteOperationstypes from './AutocompleteOperationstypes.vue'
    import { RulesSelection,RulesFloat,RulesFloatGEZ,RulesString, parseNumber,f} from 'vuetify_rules'
    import { round } from "lodash-es"
    import { hyperlinked_url, newParseResponseError, myheaders, getMapObjectById, getArrayFromMap, currency_html } from '@/functions.js'
    import { ref, computed } from 'vue'
    import { useI18n } from 'vue-i18n'

    const props = defineProps({
        io: { //Null to create, io object with all parameters to update
            required: true 
        },
        mode: {
            required: true // Can be CUD
        }
    })

    const emit = defineEmits(['cruded'])
    const { t } = useI18n()
    const store = useStore()

    const form_valid=ref(false)

    const menuinline_items = [
        {
            subheader: t("Investment operation options"),
            children: [
                {
                    name: t("Fill commissions from total balance"),
                    icon: "mdi-plus",
                    code: () => {
                        var amount=parseNumber(prompt( t("Set total balance of this investment operation") ));
                        new_io.value.commission=round(Math.abs(Math.abs(amount)-Math.abs(new_io.value.shares*new_io.value.price)), account.value.decimals)
                    },
                },
                {
                    name: t("Fill price from shares and amount"),
                    icon: "mdi-plus",
                    code: () => {
                        var amount=round(parseNumber(prompt( t("Set gross amount operation") )), account.value.decimals)
                        var shares=round(parseNumber(prompt( t("Set shares operation") )), product.value.decimals)
                        new_io.value.shares=shares
                        new_io.value.price=round(amount/new_io.value.shares, product.value.decimals)
                    },
                },
            ]
        },
    ]

    const investment = computed(() => {
        if (new_io.value?.investments) return store.investments.get(new_io.value.investments)
        return null
    })

    const product = computed(() => {
        if (investment.value) return store.products.get(investment.value.products)
        return {currency: store.profile.currency, decimals:2} //Default value
    })

    const account = computed(() => {
        if (investment.value) return store.accounts.get(investment.value.accounts)
        return {decimals:2} //Default value
    })


    const new_io=ref(null)
    new_io.value=Object.assign({},props.io) //Can come from plio or empty_investment_operation
    if ("investments" in new_io.value==false){//Plio misses investments it has investments_id, url and operationstypes
        new_io.value.investments=getMapObjectById("investments", new_io.value.investments_id).url
        new_io.value.url=hyperlinked_url("investmentsoperations",new_io.value.id)
        new_io.value.operationstypes=getMapObjectById("operationstypes", new_io.value.operationstypes_id).url
    }



    const title = computed(() => {
        if (props.mode=="U"){
            return t("Updating an investment operation")
        } else  if (props.mode=="C"){
            return t("Creating a new investment operation")
        } else  if (props.mode=="D"){
            return t("Deleting an investment operation")
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

    const change_foot = computed(() => {
        if (!new_io.value) return ""
        var gross=new_io.value.shares*new_io.value.price
        var net=0
        if (new_io.value.shares>0){
            net=gross+new_io.value.taxes+new_io.value.commission
        } else {
            net=gross-new_io.value.taxes-new_io.value.commission
        }
        return f(t("Operation gross balance: [0]<br>Operation net balance: [1]"), [
             currency_html(gross, product.value.currency),
             currency_html(net, product.value.currency)
        ])
    })

    function accept(){
        if (props.mode=="U"){   
            axios.put(new_io.value.url, new_io.value,  myheaders())
            .then(() => {
                    emit("cruded")
            }, (error) => {
                newParseResponseError(error, t, store)
            })
        } else if (props.mode=="C") {
            axios.post(`${store.apiroot}/api/investmentsoperations/`, new_io.value,  myheaders())
            .then(() => {
                    emit("cruded")
            }, (error) => {
                newParseResponseError(error, t, store)
            })
        } else if (props.mode=="D") {
            var r = confirm(t("Do you want to delete this investment operation?"))
            if(r == false) {
                return
            } 
            axios.delete(new_io.value.url, myheaders())
            .then(() => {
                emit("cruded")
            }, (error) => {
                newParseResponseError(error, t, store)
            })
        }
    }


</script>
