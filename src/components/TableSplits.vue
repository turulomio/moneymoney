<template>
    <div>
        <v-data-table density="compact" :headers="table_headers" :items="items" class="elevation-1" :sort-by="[{key:'datetime',order:'asc'}]" fixed-header :height="$attrs.height" ref="table">
            <template #item.datetime="{item}">
                <div>{{ localtime(item.datetime) }}</div>
            </template>
            <template #item.ratio="{item}">
                <div>{{ item.before }} : {{ item.after }}</div>
            </template>
            <template #item.actions="{item}">
                <v-icon :data-test="`TableSplits_ButtonUpdate${item.id}`" small class="mr-2" @click="editSplit(item)">mdi-pencil</v-icon>
                <v-icon :data-test="`TableSplits_ButtonDelete${item.id}`" small class="mr-2" @click="deleteSplit(item)">mdi-delete</v-icon>
            </template>
            <template #bottom ></template>
        </v-data-table>
        <!-- SplitsCU DIALOG -->
        <v-dialog v-model="splits_crud_dialog" width="35%">
            <v-card class="pa-3">
                <SplitsCU :split="split" :mode="splits_crud_mode" :key="key" @cruded="on_SplitsCU_cruded"></SplitsCU>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { useStore } from '@/store'
import SplitsCU from './SplitsCU.vue'
import { localtime } from 'vuetify_rules'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    product: {
        required: true
    }
})

const emit = defineEmits(['cruded'])

const store = useStore()
const { t } = useI18n()

const table = ref(null)
const splits_crud_dialog = ref(false)
const splits_crud_mode = ref(null)
const split = ref(null)
const items = ref([])
const key = ref(0)
const loading = ref(false)

const table_headers = computed(() => [
    { title: t('Date'), key: 'datetime', sortable: true, width: "25%" },
    { title: t('Before'), key: 'before', sortable: false, align: 'end', width: "15%" },
    { title: t('After'), key: 'after', sortable: false, align: 'end', width: "15%" },
    { title: t('Comment'), key: 'comment', sortable: false, width: "30%" },
    { title: t('Actions'), key: 'actions', sortable: false, width: "15%" },
])

function editSplit(item) {
    split.value = item
    splits_crud_mode.value = "U"
    key.value++
    splits_crud_dialog.value = true
}

function deleteSplit(item) {
    split.value = item
    splits_crud_mode.value = "D"
    key.value++
    splits_crud_dialog.value = true
}

async function gotoLastRow() {
    await nextTick()
    const tableWrapper = table.value?.$el?.querySelector('.v-table__wrapper')
    if (tableWrapper) {
        tableWrapper.scrollTop = tableWrapper.scrollHeight
    }
}

function on_SplitsCU_cruded() {
    refresh()
    emit("cruded")
    splits_crud_dialog.value = false
}

function refresh() {
    loading.value = true
    axios.get(`${store.apiroot}/api/splits/?product=${props.product.url}`)
        .then((response) => {
            items.value = response.data
            loading.value = false
            gotoLastRow()
        })
}

defineExpose({
    refresh
})

onMounted(() => {
    refresh()
})
</script>
