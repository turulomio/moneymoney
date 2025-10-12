<template>
    <div>
        <h1>{{dialog_title_ao}}</h1>
        <v-form ref="form" v-model="form_valid">
            <v-autocomplete :readonly="['D','F'].includes(props.mode)" autoindex="5" :items="getArrayFromMap(store.accounts).filter(v =>v.active==true)" v-model="newao.accounts" :label="$t('Select an account')" item-title="localname" item-value="url" :rules="RulesSelection(true)" @change="on_account_change"></v-autocomplete>
            <MyDateTimePicker :readonly="props.mode=='D'" autoindex="6" label="Select operation date and time" v-model="newao.datetime" />
            <v-autocomplete data-test="AccountsoperationsCU_Concepts" :readonly="['D','F'].includes(props.mode)" autoindex="0" autofocus :items="getArrayFromMap(store.concepts)" v-model="newao.concepts" :label="$t('Select a concept')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
            <v-text-field data-test="AccountsoperationsCU_Amount" :readonly="props.mode=='D'" autoindex="1" v-model.number="newao.amount"  :label="$t('Operation amount')" :placeholder="$t('Account number')" :rules="RulesFloat(30,true,account.decimals)" counter="30"/>
            <v-text-field data-test="AccountsoperationsCU_Comment" :readonly="mode=='D'" autoindex="2" v-model="newao.comment" type="text" :label="$t('Operation comment')" :placeholder="$t('Operation comment')" counter="200"/>

        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn  data-test="AccountsoperationsCU_Button" color="primary" autoindex="3" @click="following_ao=false;acceptDialogAO()">{{ button_label }}</v-btn>
            <v-btn data-test="AccountsoperationsCU_ButtonFollowing" v-if="props.mode=='C'" autoindex="4" color="primary" @click="following_ao=true;acceptDialogAO()">{{ $t("Add and follow") }}</v-btn>
        </v-card-actions>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import axios from 'axios' 
    import { useStore } from "@/store"
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import { RulesSelection, RulesFloat } from 'vuetify_rules'
    import { date2zulu , zulu2date, myheaders, getArrayFromMap, newParseResponseError, hyperlinked_url } from '@/functions'
    import { useI18n } from 'vue-i18n'
    import { ConceptsTypes } from '@/types.js'


    const props = defineProps({
        ao:{
            required:true,
        },
        mode:{ // CRUD F:Refund
            required:true,
        }
    })

    const emit = defineEmits(['cruded'])

    const { t } = useI18n()
    const store = useStore()

    const form = ref(null)
    const account = ref(null)
    const newao = ref(Object.assign({},props.ao))

    if (props.mode=="F"){
        newao.value.url=null // New ao
        newao.value.accounts=props.ao.accounts
        newao.value.datetime=new Date()
        newao.value.amount=0
        newao.value.concepts=useStore().concepts.get(hyperlinked_url("concepts", ConceptsTypes.AccountOperationRefund))
    }



    const form_valid = ref(true)
    const following_ao = ref(false)

    function on_account_change(){
        account.value = store.accounts.get(newao.value.accounts)
    }

    async function acceptDialogAO(){
        //Validation
        const { valid } = await form.value.validate()
        if (!valid) {
            return
        }
        // var concept = store.concepts.get(newao.value.concepts)
        // var operationtype = store.operationstypes.get(concept.operationstypes)
        // newao.value.operationstypes = operationtype.url
        // if (operationtype.id==1 && newao.value.amount > 0){
        //         alert(t("Amount must be negative"))
        //         return
        // }
        // if (operationtype.id==2 && newao.value.amount < 0) {
        //     alert(t("Amount must be positive"))
        //     return
        // }

        //Accept
        if (props.mode=='U'){               
            axios.put(newao.value.url, newao.value, myheaders())
            .then(() => {
                    emit('cruded', following_ao.value)
            }, (error) => {
                newParseResponseError(error, t,useStore())
            })
        } else if (props.mode=='C'){ 
            axios.post(`${store.apiroot}/api/accountsoperations/`, newao.value,  myheaders())
            .then(() => {             
                if (following_ao.value == true){
                    var dt = zulu2date(newao.value.datetime)
                    var olddtseconds = zulu2date(newao.value.datetime).getSeconds()
                    dt.setSeconds(olddtseconds+2)
                    newao.value.datetime = date2zulu(dt)
                }
                emit('cruded', following_ao.value)
            }, (error) => {
                newParseResponseError(error, t,useStore())
            })
        } else if (props.mode=='D'){
            if (!confirm(t("Do you want to delete this account operation?"))) {
                return
            }  
            following_ao.value = false
            axios.delete(newao.value.url, myheaders())
            .then(() => {
                emit('cruded', following_ao.value)
            }, (error) => {
                newParseResponseError(error, t,useStore())
            });
        } else if (props.mode=='F'){

            let payload={
                datetime:newao.value.datetime,
                refund_amount:newao.value.amount,
                comment:newao.value.comment,
            }

            following_ao.value = false
            axios.post(props.ao.url+ "create_refund/", payload,  myheaders())
            .then(() => {
                emit('cruded', following_ao.value)
            }, (error) => {
                newParseResponseError(error, t,useStore())
            });
        }
    }

    const button_label = computed(() => {
        if (props.mode=="U"){
            return t("Update")
        } else  if (props.mode=="C"){
            return t("Create")
        } else  if (props.mode=="D"){
            return t("Delete")
        } else  if (props.mode=="F"){
            return t("Refund")
        }
        return ""
    })

    const dialog_title_ao = computed(() => {
        if (props.mode=='D'){
            return t("Deleting account operation")
        } else if (props.mode=='U'){
            return t("Updating account operation")
        } else if (props.mode=='C'){
            return t("Creating a new account operation")
        } else if (props.mode=='F'){
            return t("Making an account operation refund")
        }
        return ""
    })

    on_account_change() //Initializes account object

</script>
