<template>
    <div>
        <v-data-table ref="table" density="compact" :headers="table_headers" :items="props.items" class="elevation-1" :sort-by="[{key:'datetime',order:'asc'}]" fixed-header :height="$attrs.height" :items-per-page="10000" >
            <template #item.datetime="{item}">
                {{ localtime(item.datetime) }}
            </template>                 
            <template #item.investments="{item}">
                {{ useStore().investments.get(item.investments).fullname }}
            </template>              
            <template #item.amount="{item}">
                <div class="text-right" v-html="currency_html(item.amount,item.currency)"></div>
            </template>            
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editFOC(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteFOC(item)">mdi-delete</v-icon>
            </template>
                <template #bottom ></template>   
        </v-data-table>   
        <!-- DIVIDEND CU-->
        <v-dialog v-model="dialog_foc" width="35%">
            <v-card class="pa-3">
                <FastOperationsCoverageCU :foc="foc" :mode="foc_mode" :key="key" @cruded="on_FastOperationsCoverageCU_cruded" />
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
    import { ref, computed, onMounted, nextTick } from 'vue'
    import FastOperationsCoverageCU from './FastOperationsCoverageCU.vue'
    import { useStore } from "@/store"
    import { localtime } from 'vuetify_rules'
    import { currency_html } from '@/functions'
    import { useI18n } from 'vue-i18n'

    const props = defineProps({
        items: {
            required: true
        },
    })

    const emit = defineEmits(['cruded'])

    const { t } = useI18n()

    const table = ref(null)
    const dialog_foc = ref(false)
    const foc = ref(null)
    const foc_mode = ref(null)
    const key = ref(0)

    function editFOC(item) {
        foc.value = item
        foc_mode.value = "U"
        dialog_foc.value = true
        key.value++
    }

    function deleteFOC(item) {
        foc.value = item
        foc_mode.value = "D"
        dialog_foc.value = true
        key.value++
    }

    const table_headers = computed(() => [
        { title: t('Date and time'), key: 'datetime', sortable: true },
        { title: t('Investment'), key: 'investments', sortable: true, align: 'end' },
        { title: t('Amount'), key: 'amount', sortable: true, align: 'end' },
        { title: t('Comment'), key: 'comment', sortable: true, align: 'end' },
        { title: t('Actions'), key: 'actions', sortable: false, width: "6%" },
    ])

    async function gotoLastRow() {
        await nextTick()
        const tableWrapper = table.value?.$el?.querySelector('.v-table__wrapper')
        if (tableWrapper) {
            tableWrapper.scrollTop = tableWrapper.scrollHeight
        }
    }

    function on_FastOperationsCoverageCU_cruded() {
        emit("cruded")
        dialog_foc.value = false
        gotoLastRow()
    }

    onMounted(() => {
        gotoLastRow()
    })
</script>