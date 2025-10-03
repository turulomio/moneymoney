<template>
    <div>
        <v-data-table density="compact" :headers="table_headers" :items="props.items" class="elevation-1" :sort-by="[{key:'datetime_origin',order:'asc'}]" fixed-header :height="$attrs.height" ref="table_transfers" :loading="loading">
            <template #item.origin_investment_name="{item}">
                <div>{{ useStore().investments.get(item.investments_origin).fullname }}</div>
            </template>
            <template #item.destination_investment_name="{item}">
                <div>{{ useStore().investments.get(item.investments_destiny).fullname }}</div>
            </template>   
            <template #item.amount_origin="{item}">
                <div>{{ currency_string( item.shares_origin*item.price_origin, useStore().products.get(useStore().investments.get(item.investments_origin).products).currency) }} </div>
            </template>  
            <template #item.amount_destiny="{item}">
                <div>{{ currency_string( item.shares_destiny*item.price_destiny,  useStore().products.get(useStore().investments.get(item.investments_origin).products).currency) }} </div>
            </template>       
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editTransfer(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteTransfer(item)">mdi-delete</v-icon>
            </template>
                <template #bottom ></template>   
        </v-data-table>   
        <!-- InvestmentsTransfersCU DIALOG -->
        <v-dialog v-model="transfer_crud_dialog" width="80%">
            <v-card class="pa-3">
                <InvestmentsTransfersCU :transfer="transfer" :mode="transfer_crud_mode" :key="key"  @cruded="on_InvestmentsTransfersCU_cruded()"></InvestmentsTransfersCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
    import { ref } from 'vue'
    import { useStore } from "@/store"
    import InvestmentsTransfersCU from './InvestmentsTransfersCU.vue'
    import { useI18n } from 'vue-i18n'
    import { currency_string } from '@/functions'

    const props = defineProps({
        items: {
            required: true
        },
        investment: { // To get the product and currency
            required: true
        },
    })

    const emit = defineEmits(['cruded'])

    const { t } = useI18n()

    const loading = ref(false)
    const transfer_crud_dialog = ref(false)
    const transfer_crud_mode = ref(null)
    const transfer = ref(null)
    const key = ref(0)
    const table_transfers = ref(null)

    const table_headers = ref([
        { title: t('Date'), key: 'datetime_origin', sortable: true, width:"20%"},
        { title: t('Origin'), key: 'origin_investment_name', sortable: true, width:"20%"},
        { title: t('Destination'), key: 'destination_investment_name', sortable: true, width:"20%"},
        { title: t('Amount origin'), key: 'amount_origin', sortable: true, align:'end' , width:"10%"},
        { title: t('Amount destiny'), key: 'amount_destiny', sortable: true, align:'end' , width:"10%"},
        { title: t('Comment'), key: 'comment', sortable: true, width:"10%"},
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

    function on_InvestmentsTransfersCU_cruded(){
        transfer_crud_dialog.value = false
        emit("cruded")
    }

</script>