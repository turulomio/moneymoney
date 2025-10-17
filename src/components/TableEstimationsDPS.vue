<template>
    <div>
        <v-data-table ref="table" density="compact" :headers="table_headers" :items="items" class="elevation-1" :sort-by="[{key:'year',order:'asc'}]" fixed-header :height="$attrs.height" :items-per-page="10000" >

            <template #item.estimation="{item}">
                <div v-html="currency(item.estimation)"></div>
            </template>          
            <template #item.manual="{item}">
                <v-icon small v-if="item.manual" >mdi-check-outline</v-icon>
            </template>      
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editEstimationDPS(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteEstimationDPS(item)">mdi-delete</v-icon>
            </template>
                <template #bottom ></template>   
        </v-data-table>   
        <!-- DIVIDEND CU-->
        <v-dialog v-model="dialog_estimation_dps" width="35%">
            <v-card class="pa-3">
                <EstimationsDpsCU :estimation="estimation_dps" :mode="estimation_dps_mode" :key="key"  @cruded="on_EstimationsDpsCU_cruded" />
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
    import { ref, computed, nextTick } from 'vue'
    import axios from 'axios'
    import { useStore } from "@/store"
    import EstimationsDpsCU from './EstimationsDpsCU.vue'
    import { parseResponseError, myheaders, currency_html } from '@/functions'
    import { useI18n } from 'vue-i18n'

    const props = defineProps({
        product: {
            required: true
        },
    })

    const store = useStore()
    const { t } = useI18n()

    const table = ref(null)
    const dialog_estimation_dps = ref(false)
    const estimation_dps = ref(null)
    const estimation_dps_mode = ref(null)
    const items = ref([])
    const key = ref(0)
    const loading = ref(false)

    function currency(value) {
        return currency_html(value, props.product.currency)
    }

    function editEstimationDPS(item) {
        estimation_dps.value = item
        estimation_dps_mode.value = "U"
        dialog_estimation_dps.value = true
        key.value++
    }

    function deleteEstimationDPS(item) {
        estimation_dps.value = item
        estimation_dps_mode.value = "D"
        dialog_estimation_dps.value = true
        key.value++
    }

    const table_headers = computed(() => [
        { title: t('Year'), key: 'year', sortable: true },
        { title: t('DPS estimation'), key: 'estimation', sortable: true, align: 'end' },
        { title: t('Estimation date'), key: 'date_estimation', sortable: false },
        { title: t('Source'), key: 'source', sortable: false },
        { title: t('Manual'), key: 'manual', sortable: true },
        { title: t('Actions'), key: 'actions', sortable: false },
    ])

    async function gotoLastRow() {
        await nextTick()
        const tableWrapper = table.value?.$el?.querySelector('.v-table__wrapper')
        if (tableWrapper) {
            tableWrapper.scrollTop = tableWrapper.scrollHeight
        }
    }

    function on_EstimationsDpsCU_cruded() {
        dialog_estimation_dps.value = false
        refresh()
    }

    function refresh() {
        loading.value = true
        axios.get(`${store.apiroot}/api/estimationsdps/?product=${props.product.url}`, myheaders())
            .then((response) => {
                items.value = response.data
                key.value++
                loading.value = false
                gotoLastRow()
            }, (error) => {
                parseResponseError(error)
            });
    }

    refresh()
</script>