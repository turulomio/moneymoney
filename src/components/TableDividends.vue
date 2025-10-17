<template>
    <div>
        <v-data-table ref="table" density="compact" :headers="table_headers" :items="props.items" class="elevation-1" :sort-by="[{key:'datetime',order:'asc'}]" fixed-header :height="$attrs.height" :items-per-page="10000" >
            <template #item.datetime="{item}">
                <div>{{ localtime(item.datetime)}}</div>
            </template>         
            <template #item.concepts="{item}">
               <div v-html="useStore().concepts.get(item.concepts).localname"></div>
           </template>       
            <template #item.investments="{item}">
               <div v-html="useStore().investments.get(item.investments).fullname"></div>
           </template> 
            <template #item.gross="{item}">
                <div v-html="currency_html(item.gross,item.currency)"></div>
            </template>   
            <template #item.net="{item}">
                <div v-html="currency_html(item.net,item.currency)"></div>
            </template>   
            <template #item.commission="{item}">
                <div v-html="currency_html(item.commission,item.currency)"></div>
            </template>   
            <template #item.taxes="{item}">
                <div v-html="currency_html(item.taxes,item.currency)"></div>
            </template>   
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="copyDividend(item)">mdi-content-copy</v-icon>
                <v-icon small class="mr-2" @click="editDividend(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteDividend(item)">mdi-delete</v-icon>
            </template>
            <template #tbody>
                <tr class="totalrow" v-if="props.items.length > 0">
                    <td>{{ f($t("Total ([0] registers)"), [props.items.length])}}</td>
                    <td></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(props.items, 'gross'), total_currency)"></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(props.items, 'net'), total_currency)"></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(props.items, 'commission'), total_currency)"></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(props.items, 'taxes'), total_currency)"></td>
                    <td></td>
                    <td></td>
                </tr>
            </template>
            <template #bottom ></template>   
        </v-data-table>   
        <!-- DIVIDEND CU-->
        <v-dialog v-model="dividends_cu_dialog" width="35%">
            <v-card class="pa-3">
                <DividendsCU :dividend="dividend" :mode="dividends_cu_mode" :key="key"  @cruded="on_DividendsCU_cruded"></DividendsCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
    import { ref, computed, onMounted, nextTick } from 'vue'
    import DividendsCU from './DividendsCU.vue'
    import { useStore } from "@/store"
    import { empty_dividend } from '../empty_objects.js'
    import { localtime, f } from 'vuetify_rules'
    import { listobjects_sum, currency_html } from '@/functions'
    import { useI18n } from 'vue-i18n'

    const props = defineProps({
        items: {
            required: true
        },
        showinvestment:{ //Only hides account if true
            type: Boolean,
            required:false,
            default:false,
        },
    })

    const emit = defineEmits(['cruded'])

    const { t } = useI18n()

    const table = ref(null)
    const dividends_cu_dialog = ref(false)
    const dividend = ref(null)
    const dividends_cu_mode = ref(null)
    const key = ref(0)

    // To sum amounts
    const all_items_has_same_currency = computed(() => {
        if (props.items.length === 0) return false
        const first_currency = props.items[0].currency
        return props.items.every(item => item.currency === first_currency)
    })

    const total_currency = computed(() => {
        if (props.items.length === 0) return "Bad currency"
        return props.items[0].currency
    })

    function copyDividend(item){
        dividend.value = empty_dividend()
        dividend.value.gross = item.gross
        dividend.value.net = item.net
        dividend.value.taxes = item.taxes
        dividend.value.commission = item.commission
        dividend.value.dps = item.dps
        dividend.value.investments = item.investments
        dividend.value.concepts = item.concepts
        dividend.value.currency_conversion = item.currency_conversion
        dividends_cu_mode.value = "C"
        key.value++
        dividends_cu_dialog.value = true
    }

    function editDividend(item){
        dividend.value = item
        dividends_cu_mode.value = "U"
        key.value++
        dividends_cu_dialog.value = true
    }

    function deleteDividend(item){
        dividend.value = item
        dividends_cu_mode.value = "D"
        key.value++
        dividends_cu_dialog.value = true
    }

    const table_headers = computed(() => {
        var r = [
            { title: t('Date and time'), key: 'datetime', sortable: true },
            { title: t('Investment'), key: 'investments',sortable: true },
            { title: t('Concept'), key: 'concepts', sortable: true },
            { title: t('Gross'), key: 'gross', sortable: false, align:'end'},
            { title: t('Net'), key: 'net', sortable: false, align:'end'},
            { title: t('Commission'), key: 'commission', sortable: true , align:'end'},
            { title: t('Taxes'), key: 'taxes', sortable: true , align:'end'},
            { title: t('DPS'), key: 'dps', sortable: true , align:'end'},
            { title: t('Actions'), key: 'actions', sortable: false },
        ]
        if (props.showinvestment === false){
            r.splice(1, 1)
        }
        return r
    })

    async function gotoLastRow(){
        await nextTick()
        const tableWrapper = table.value?.$el?.querySelector('.v-table__wrapper')
        if (tableWrapper) {
            tableWrapper.scrollTop = tableWrapper.scrollHeight
        }
    }

    function on_DividendsCU_cruded(){
        dividends_cu_dialog.value = false
        emit("cruded")
        gotoLastRow()
    }

    onMounted(() => {
         gotoLastRow()
    })
</script>