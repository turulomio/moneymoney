<template>
    <div>
        <v-data-table density="compact" :headers="table_headers" :items="props.items" class="elevation-1" :sort-by="[{key:'datetime_origin',order:'asc'}]" fixed-header :height="$attrs.height" ref="table_transfers" :loading="loading">
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
        <v-dialog v-model="transfer_crud_dialog" width="80%">
            <v-card class="pa-3">
                <InvestmentsTransfersCU :transfer="transfer" :mode="transfer_crud_mode" :key="key"  @cruded="on_InvestmentsTransfersCU_cruded()"></InvestmentsTransfersCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
    import { ref, computed } from 'vue'
    import { useStore } from "@/store"
    import InvestmentsTransfersCU from './InvestmentsTransfersCU.vue'
    import { useI18n } from 'vue-i18n'

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
    const store = useStore()

    const loading = ref(false)
    const transfer_crud_dialog = ref(false)
    const transfer_crud_mode = ref(null)
    const transfer = ref(null)
    const key = ref(0)
    const table_transfers = ref(null)

    const product = computed(() => {
        if (props.investment && props.investment.products) {
            return store.products.get(props.investment.products)
        }
        return {}
    })

    console.log(product.value)

    const table_headers = ref([
        { title: t('Date'), key: 'datetime_origin', sortable: true, width:"20%"},
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

    function on_InvestmentsTransfersCU_cruded(){
        emit("cruded")
        transfer_crud_dialog.value = false
    }

</script>