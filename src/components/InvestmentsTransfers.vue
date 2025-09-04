<template>
    <div>    
        <h1>{{ f(t(`'[0]' transfers`), [investment.fullname]) }}
            <MyMenuInline :items="menuinline_items" data-test="StrategiesList_MyMenuInline"/>
        </h1>
        <TableInvestmentsTransfers :items="items" :investment="investment" :key="key" :loading="loading" @cruded="update_table" />

        <v-dialog v-model="dialog_transfers_cu" width="35%">
            <v-card class="pa-3">
                <InvestmentsTransfersCU :transfer="transfer" :mode="transfer_mode" :key="key" @cruded="on_cruded" />
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyMenuInline from './MyMenuInline.vue'    
    import { parseResponseError, myheaders } from '@/functions'
    import { ref, onMounted, defineProps } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { f } from 'vuetify_rules'
    import TableInvestmentsTransfers from './TableInvestmentsTransfers.vue'
    import InvestmentsTransfersCU from './InvestmentsTransfersCU.vue'

    const { t } = useI18n()
    const store = useStore()

    const props = defineProps({
        investment: Object, // Investment object
    })
    const items = ref([])
    const dialog_transfers_cu=ref(false)
    const transfer=ref(null)
    const transfer_mode=ref(null)
    const key=ref(0)

    const menuinline_items = ref([
        {
            subheader: t("Investments transfers options"),
            children: [
                {
                    name: t("Add a new investment transfer"),
                    icon: "mdi-plus",
                    code: () => {
                        transfer.value = null
                        transfer_mode.value = "C"
                        key.value++
                        dialog_transfers_cu.value = true
                    }
                },
            ]
        },
    ])

    const loading = ref(false)

    function on_cruded(){
        dialog_transfers_cu.value=false
        update_table()
    }


    function update_table(){
        loading.value = true
        axios.get(`${store.apiroot}/api/investmentstransfers/?investments=${props.investment.url}`, myheaders())
        .then((response) => {
            items.value = response.data
            loading.value = false
            key.value++
        }, (error) => {
            parseResponseError(error)
        });
    }

    onMounted(() => {
        update_table()
    })
</script>