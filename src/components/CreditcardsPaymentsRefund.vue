<template>
    <v-card>   
        <v-select :items="payments" v-model="payment" :label="t('Select an old payment')"  item-title="name" item-value="id" :rules="RulesSelection(true)" />
        <TableCreditcardsOperations showtotal hideactions :items="items_cco" height="400" class=" flex-grow-1 flex-shrink-0" :key="key" />

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="refundPayment()">{{ t("Refund") }}</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup>
    import { ref, watch, onMounted } from 'vue'
    import axios from 'axios'
    import { useStore } from "@/store"
    import { useI18n } from 'vue-i18n'
    import { localtime, RulesSelection, f } from 'vuetify_rules'
    import TableCreditcardsOperations from './TableCreditcardsOperations.vue'
    import { parseResponseError, myheaders, currency_string } from '@/functions'

    const props = defineProps({
        cc: {
            required: true
        },
    })

    const emit = defineEmits(['cruded'])

    const store = useStore()
    const { t } = useI18n()

    const account = ref(null)
    const loading = ref(false)
    const key = ref(0)
    const items_cco = ref([])
    const payments = ref([])
    const payment = ref(null)

    watch(payment, (newValue) => {
        if (newValue) {
            axios.get(`${props.cc.url}operationswithbalance/?accountsoperations_id=${newValue}`, myheaders())
            .then((response) => {
                items_cco.value = response.data
            }, (error) => {
                parseResponseError(error)
            });
        } else {
            items_cco.value = []
        }
    })

    function refundPayment() {
        axios.post(`${store.apiroot}/api/accountsoperations/${payment.value}/ccpaymentrefund/`, {}, myheaders())
        .then(() => {
            items_cco.value = []
            payment.value = null
            updatePayments()
            emit("cruded")
            key.value++
            alert(t("Payment was refund"))
        }, (error) => {
            parseResponseError(error)
        });
    }

    function updatePayments(){
        loading.value = true
        axios.get(`${props.cc.url}payments/`, myheaders())
        .then((response) => {
            payments.value = []
            response.data.forEach(o=> {
                payments.value.push({
                    id: o.accountsoperations_id,
                    name: f(t("[0] were paid [1] ([2] operations)"), [localtime(o.datetime), currency_string(o.amount, account.value.currency), o.count]),
                })
            });
            loading.value = false
        }, (error) => {
            loading.value = false
            parseResponseError(error)
        });
    }

    onMounted(() => {
        account.value = store.accounts.get(props.cc.accounts)
        updatePayments()
    })
</script>
