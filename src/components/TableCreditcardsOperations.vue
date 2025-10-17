<template>
    <div>        
        <v-data-table ref="table" :show-select="props.showselected" v-model="selected" density="compact" :headers="table_headers" :items="props.items" class="elevation-1" :sort-by="[{ key: 'datetime', order: 'asc' }]" fixed-header :height="$attrs.height"  :items-per-page="items_per_page" fixed-footer>
            <template #item.datetime="{item}">
                <div >{{ localtime(item.datetime)}}</div>
            </template>          
            <template #item.amount="{item}">
                <div class="text-right" v-html="currency_html(item.amount,item.currency)"></div>
            </template>   
            <template #item.balance="{item}">
                <div class="text-right" v-html="currency_html(item.balance, item.currency)"></div>
            </template>   
            <template #item.creditcard="{item}">
                <div v-html="store.creditcards.get(item.creditcards).name"></div>
            </template>  
            <template #item.concepts="{item}">
                <div v-html="store.concepts.get(item.concepts).name"></div>
            </template>
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="copyCCO(item)">mdi-content-copy</v-icon>
                <v-icon small class="mr-2" @click="editCCO(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteCCO(item)">mdi-delete</v-icon>
            </template>
            <template #tbody v-if="props.showtotal && props.items.length>0">
                <tr class=" v-data-table__tr totalrow">
                    <td>{{ f(t("Total ([0] registers)"), [props.items.length])}}</td>
                    <td v-if="props.showcc"></td>
                    <td></td>
                    <td></td>
                    <td class="text-right" v-html="currency_html(listobjects_sum(props.items,'amount'),total_currency)"></td>
                    <td></td>
                    <td></td>
                </tr>
            </template>
         <template #bottom ></template>
        </v-data-table>

        <!-- CCCO CU -->
        <v-dialog v-model="dialog" max-width="650" class="pa-4" >
            <v-card class="pa-4">
                <CreditcardsoperationsCU :deleting="cco_deleting" :cco="cco" :key="key" @cruded="on_CreditcardsoperationsCU_cruded"></CreditcardsoperationsCU>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted, nextTick } from 'vue'
    import CreditcardsoperationsCU from './CreditcardsoperationsCU.vue'
    import { useStore } from "@/store"
    import {empty_cco} from '../empty_objects.js'
    import { localtime, f } from 'vuetify_rules'
    import {listobjects_sum, currency_html} from '@/functions'
    import { useI18n } from 'vue-i18n'

    const props = defineProps({
        items: {
            required: true
        },
        showtotal:{// Items must have currency attribute
            type: Boolean,
            required:false,
            default: false,
        },
        showcc:{// Items must have accounts attribute
            type: Boolean,
            required:false,
            default: false,
        },
        showselected:{
            type: Boolean,
            required:false,
            default: false,
        },
        hideactions:{
            type: Boolean,
            required:false,
            default: false,
        }
    })

    const emit = defineEmits(['cruded', 'changeSelected'])

    const store = useStore()
    const { t } = useI18n()

    const table = ref(null)
    const selected = ref([])
    const items_per_page = ref(5000000)

    //CCOCU
    const dialog = ref(false)
    const cco = ref(null)
    const cco_deleting = ref(false)
    const key = ref(0)

    const total_currency = computed(() => {
        if (props.items.length === 0) return ""
        return props.items[0].currency
    })

    // const all_items_has_same_currency = computed(() => {
    //     if (props.items.length === 0) return false
    //     const first_currency = props.items[0].currency
    //     return props.items.every(item => item.currency === first_currency)
    // })

    const selected_items = computed(() => {
        return props.items.filter((o) => {
            return selected.value.includes(o.id)
        })
    })

    const table_headers = computed(() => {
        const r = []
        r.push({ title: t('Date and time'), key: 'datetime', sortable: true, width: "12%" })
        if (props.showcc) {
            r.push({ title: t('Credit card'), key: 'creditcard', sortable: true, width: "20%" })
        }
        r.push({ title: t('Concept'), key: 'concepts', sortable: true, width: "20%" })
        r.push({ title: t('Amount'), key: 'amount', sortable: false, align: 'end', width: "8%" })
        r.push({ title: t('Balance'), key: 'balance', sortable: false, align: 'end', width: "8%" })
        r.push({ title: t('Comment'), key: 'comment', sortable: true })
        if (props.hideactions === false) {
            r.push({ title: t('Actions'), key: 'actions', sortable: false, width: "8%" })
        }
        return r
    })

    watch(selected, () => {
        emit("changeSelected", selected_items.value)
    })

    function editCCO(item) {
        cco.value = item
        cco_deleting.value = false
        key.value++
        dialog.value = true
    }

    function deleteCCO(item) {
        cco.value = item
        cco_deleting.value = true
        key.value++
        dialog.value = true
    }

    function copyCCO(item) {
        cco.value = empty_cco()
        cco.value.concepts = item.concepts
        cco.value.amount = item.amount
        cco.value.comment = item.comment
        cco.value.creditcards = item.creditcards
        cco.value.url = null
        key.value++
        dialog.value = true
    }

    async function gotoLastRow() {
        await nextTick()
        const tableWrapper = table.value?.$el?.querySelector('.v-table__wrapper')
        if (tableWrapper) {
            tableWrapper.scrollTop = tableWrapper.scrollHeight
        }
    }

    function on_CreditcardsoperationsCU_cruded(following) {
        emit("cruded")
        dialog.value = following
        gotoLastRow()
    }

    onMounted(() => {
        gotoLastRow()
    })

</script>
