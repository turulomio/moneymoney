<template>
    <div>
        <v-data-table density="compact" :headers="table_headers" :items="items" class="elevation-1" :sort-by="[{key:'date',order:'asc'}]" fixed-header :height="$attrs.height" ref="table_transfers">
            <template #item.amount="{item}">
                <div v-html="currency_html(item.amount, product.currency)"></div>
            </template>
            <template #item.origin_investment_name="{item}">
                <div>{{ item.origin_investment_name }}</div>
            </template>
            <template #item.destination_investment_name="{item}">
                <div>{{ item.destination_investment_name }}</div>
            </template>       
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editTransfer(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteTransfer(item)">mdi-delete</v-icon>
            </template>
                <template #bottom ></template>   
        </v-data-table>   
        <!-- InvestmentsTransfersCU DIALOG -->
        <v-dialog v-model="transfer_crud_dialog" width="35%">
            <v-card class="pa-3">
                <InvestmentsTransfersCU :transfer="transfer" :mode="transfer_crud_mode" :key="key"  @cruded="on_InvestmentsTransfersCU_cruded()"></InvestmentsTransfersCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
    import { ref, onMounted, computed } from 'vue'
    import axios from 'axios'
    import { useStore } from "@/store"
    // I'll assume this component exists or will be created.
    import InvestmentsTransfersCU from './InvestmentsTransfersCU.vue'
    import {  parseResponseError, currency_html, myheaders } from '@/functions'
    import { useI18n } from 'vue-i18n'

    const props = defineProps({
        investment: {
            type: Object,
            required: true
        },
    })

    const emit = defineEmits(['cruded'])

    const { t } = useI18n()
    const store = useStore()

    const transfer_crud_dialog = ref(false)
    const transfer_crud_mode = ref(null)
    const transfer = ref(null)
    const items = ref([])
    const key = ref(0)
    const loading = ref(false)
    const table_transfers = ref(null)

    const product = computed(() => {
        if (props.investment && props.investment.products) {
            return store.products.get(props.investment.products)
        }
        return {}
    })

    const table_headers = ref([
        { title: t('Date'), key: 'date', sortable: true, width:"20%"},
        { title: t('Origin'), key: 'origin_investment_name', sortable: true, width:"20%"},
        { title: t('Destination'), key: 'destination_investment_name', sortable: true, width:"20%"},
        { title: t('Shares'), key: 'shares', sortable: true, align:'end' , width:"15%"},
        { title: t('Amount'), key: 'amount', sortable: true, align:'end' , width:"15%"},
        { title: t('Actions'), key: 'actions', sortable: false , width:"10%"},
    ])

    function editTransfer(item){
        transfer.value = item
        transfer_crud_mode.value = "U"
        key.value++
        transfer_crud_dialog.value = true
    }

    function deleteTransfer(item){
        transfer.value = item
        transfer_crud_mode.value = "D"
        key.value++
        transfer_crud_dialog.value = true
    }

    function gotoLastRow(){
        // Not implemented in original, keeping it commented
        // const el = table_transfers.value?.$el
        // if (el) {
        //     this.$vuetify.goTo(10000, { container: el.childNodes[0] })
        // }
    }

    function on_InvestmentsTransfersCU_cruded(){
        refresh()
        emit("cruded")
        transfer_crud_dialog.value = false
    }

    function refresh(){
        loading.value = true
        // Assuming investment object has a `url` property for API filtering
        axios.get(`${store.apiroot}/api/investmentstransfers/?investment=${props.investment.url}`, myheaders())
        .then((response) => {
            items.value = response.data
            loading.value = false
            gotoLastRow()
        }, (error) => {
            parseResponseError(error)
            loading.value = false
        });
    }

    onMounted(() => {
        refresh()
    })
</script>