<template>
    <div>
        <v-data-table density="compact" :headers="table_headers" :items="items" class="elevation-1" :sort-by="[{key:'date',order:'asc'}]" fixed-header :height="$attrs.height" ref="table">
            <template #item.gross="{item}">
                <div v-html="currency_html(item.gross, product.currency)"></div>
            </template>       
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editDPS(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteDPS(item)">mdi-delete</v-icon>
            </template>
                <template #bottom ></template>   
        </v-data-table>   
        <!-- DPSCRUD DIALOG -->
        <v-dialog v-model="dps_crud_dialog" width="35%">
            <v-card class="pa-3">
                <DpsCRUD :dps="dps" :mode="dps_crud_mode" :key="key"  @cruded="on_DpsCRUD_cruded"></DpsCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
    import { ref, computed, onMounted, nextTick } from 'vue'
    import axios from 'axios'
    import { useStore } from "@/store"
    import DpsCRUD from './DpsCRUD.vue'
    import {  parseResponseError, currency_html, myheaders } from '@/functions'
    import { useI18n } from 'vue-i18n'

    const props = defineProps({
        product: {
            required: true
        },
    })

    const emit = defineEmits(['cruded'])

    const store = useStore()
    const { t } = useI18n()

    const table = ref(null)
    const dps_crud_dialog = ref(false)
    const dps_crud_mode = ref(null)
    const dps = ref(null)
    const items = ref([])
    const key = ref(0)
    const loading = ref(false)

    const table_headers = computed(() => [
        { title: t('Date'), key: 'date', sortable: true, width: "25%" },
        { title: t('Pay date'), key: 'paydate', sortable: false, width: "25%" },
        { title: t('DPS'), key: 'gross', sortable: true, align: 'end', width: "25%" },
        { title: t('Actions'), key: 'actions', sortable: false, width: "25%" },
    ])

    function editDPS(item) {
        dps.value = item
        dps_crud_mode.value = "U"
        key.value++
        dps_crud_dialog.value = true
    }

    function deleteDPS(item) {
        dps.value = item
        dps_crud_mode.value = "D"
        key.value++
        dps_crud_dialog.value = true
    }

    async function gotoLastRow() {
        await nextTick()
        const tableWrapper = table.value?.$el?.querySelector('.v-table__wrapper')
        if (tableWrapper) {
            tableWrapper.scrollTop = tableWrapper.scrollHeight
        }
    }

    function on_DpsCRUD_cruded() {
        refresh()
        emit("cruded")
        dps_crud_dialog.value = false
    }

    function refresh() {
        loading.value = true
        axios.get(`${store.apiroot}/api/dps/?product=${props.product.url}`, myheaders())
            .then((response) => {
                items.value = response.data
                loading.value = false
                gotoLastRow()
            }, (error) => {
                parseResponseError(error)
            });
    }

    onMounted(() => {
        refresh()
    })
</script>