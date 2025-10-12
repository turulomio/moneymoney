<template>
    <div>
        <v-data-table  ref="table_ao" :show-select="props.showselected" v-model="selected" density="compact" :headers="table_headers" :items="props.items" class="elevation-1" :sort-by="[{ key: 'datetime', order: 'asc' }]" fixed-header :height="$attrs.height"  :items-per-page="items_per_page" fixed-footer>
            <template #item.datetime="{item}">
                {{ localtime(item.datetime) }}
            </template>  
            <template #item.amount="{item}">
                <div class="text-right" v-html="currency_html(item.amount,item.currency)"></div>
            </template>   
            <template #item.balance="{item}">
                <div class="text-right" v-html="currency_html(item.balance, item.currency)"></div>
            </template>   
            <template #item.accounts="{item}">
                <div v-html="useStore().accounts.get(item.accounts).fullname"></div>
            </template> 
            <template #item.concepts="{item}">
                <div class="cursorpointer" @click="viewHistoricalConcept(item)"> {{ store.concepts.get(item.concepts).localname }}</div>
            </template>
            <template #item.actions="{item}">  
                <v-icon v-if="item.has_refunds" class="mr-2" @click="show_refunds(item)">mdi-cash-refund</v-icon>              
                <v-icon :data-test="`TableAccountOperations_ButtonRefund${item.id}`" v-if="can_make_a_refund(item)" small class="mr-2" @click="refund(item)">mdi-arrow-u-left-top-bold</v-icon>
                <v-icon :data-test="`TableAccountOperations_ButtonCopy${item.id}`" small class="mr-2" @click="copyAO(item)">mdi-content-copy</v-icon>
                <v-icon small class="mr-2" @click="editAO(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteAO(item)">mdi-delete</v-icon>
            </template>
            <template #body.append v-if="props.showtotal && props.items.length>0">
                <tr id="bottom" class=" v-data-table__tr totalrow">
                    <td>{{ f($t("Total ([0] registers)"), [props.items.length])}}</td>
                    <td></td>
                    <td v-if="showaccount"></td>
                    <td v-if="all_items_has_same_currency" class="text-right" v-html="currency_html(listobjects_sum(items,'amount'),total_currency)"></td>
                    <td v-if="!all_items_has_same_currency" >{{ $t("Can't sum amounts due to they have different currencies") }}</td>
                    <td v-if="showbalance"></td>
                    <td></td>
                    <td></td>
                </tr>
            </template>
            
         <template #bottom ></template>
        </v-data-table>   
        
        <!-- DIALOG ACCOUNTSOPERATIONS ADD/UPDATE -->
        <v-dialog v-model="dialog_ao" max-width="550">
            <v-card class="pa-8">
                <AccountsoperationsCU ref="aocu" :ao="ao" :mode="ao_mode" :key="key" @cruded="on_AccountsoperationsCU_cruded"></AccountsoperationsCU>
            </v-card>
        </v-dialog>
        
        <!-- IO CU-->
        <v-dialog v-model="dialog_io" width="40%" v-if="io">
            <v-card class="pa-3">
                <InvestmentsoperationsCU :io="io" :mode="io_mode" :key="key" @cruded="on_InvestmentsoperationsCU_cruded()" />
            </v-card>
        </v-dialog>

        <!-- DIALOG ACCOUNT TRANSFER -->
        <v-dialog v-model="dialog_transfer" width="35%">
            <v-card class="pa-6">
                <AccountsTransfer :at="at" :mode="at_mode" @cruded="on_AccountTransfer_cruded()" :key="key" />
            </v-card>
        </v-dialog>

        <!-- DIVIDEND CU-->
        <v-dialog v-model="dividends_cu_dialog" width="35%">
            <v-card class="pa-3">
                <DividendsCU :dividend="dividend" :mode="dividends_cu_mode" :key="key"  @cruded="on_DividendsCU_cruded()"></DividendsCU>
            </v-card>
        </v-dialog>


        <!-- VIEW HISTORICAL REPORT dialog -->
        <v-dialog v-model="dialog_historical_concepts">
            <v-card class="pa-4">
                <ReportsConceptsHistorical :concept="concept" :key="key" />
            </v-card>
        </v-dialog>

        <!-- VIEW SHOW REFUNDS dialog -->
        <v-dialog v-model="dialog_show_refunds">
            <v-card class="pa-4">
                <AccountsoperationsShowRefunds :ao="ao" :key="key" />
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted, nextTick } from 'vue'
    import axios from 'axios'
    import { useStore } from "@/store"
    import {  empty_account_operation } from '../empty_objects.js'
    import AccountsoperationsCU from './AccountsoperationsCU.vue'
    import AccountsTransfer from './AccountsTransfer.vue'
    import DividendsCU from './DividendsCU.vue'
    import InvestmentsoperationsCU from './InvestmentsoperationsCU.vue'
    import ReportsConceptsHistorical from './ReportsConceptsHistorical.vue'
    import AccountsoperationsShowRefunds from './AccountsoperationsShowRefunds.vue'
    import { localtime, f } from 'vuetify_rules'
    import { parseResponseError, listobjects_sum, currency_html, myheaders, id_from_hyperlinked_url } from '@/functions.js'
    import { OperationsTypes } from '@/types.js'
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
        showaccount:{// Items must have accounts attribute
            type: Boolean,
            required:false,
            default: false,
        },
        showbalance:{// Items must have balance attribute
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

    const emit = defineEmits(['changeSelected', 'cruded'])

    const store = useStore()
    const { t } = useI18n()

    const selected = ref([])
    const key = ref(0)
    const items_per_page = ref(500000000)

    // DIALOG ACCOUNT OPERATIONS
    const dialog_ao = ref(false)
    const ao = ref(null)
    const ao_mode = ref(null)

    // DIALOG INVESTMENT OPERATIONS CU
    const dialog_io = ref(false)
    const io = ref(null)
    const io_mode = ref(null)

    // DIALOG ACCOUNT TRANSFER
    const at = ref(null)
    const at_mode = ref(null)
    const dialog_transfer = ref(false)

    // DIALOG DIVIDENDS CU
    const dividends_cu_dialog = ref(false)
    const dividends_cu_mode = ref(null)
    const dividend = ref(null)

    //DIALOG HISTORICAL CONECPTS
    const dialog_historical_concepts = ref(false)
    const concept = ref(null)

    //DIALOG SHOW REFUNDS
    const dialog_show_refunds = ref(false)


    const total_currency = computed(() => {
        if (props.items.length === 0) return ""
        return props.items[0].currency
    })

    const all_items_has_same_currency = computed(() => {
        if (props.items.length === 0) return false
        const first_currency = props.items[0].currency
        return props.items.every(item => item.currency === first_currency)
    })

    watch(selected, (newValue) => {
        emit("changeSelected", newValue)
    })


    function can_make_a_refund(item){
        let concept_object=store.concepts.get(item.concepts)
        console.log(id_from_hyperlinked_url(concept_object.operationstypes))
        if (id_from_hyperlinked_url(concept_object.operationstypes)==OperationsTypes.Expense) return true
        return false
    }

    function copyAO(item) {
        if (item.is_editable === false) {
            alert(t("You can't copy this account operation"))
            return
        }
        ao.value = empty_account_operation()
        ao_mode.value = "C"
        ao.value.concepts = item.concepts
        ao.value.amount = item.amount
        ao.value.comment = item.comment
        ao.value.accounts = item.accounts
        key.value++
        dialog_ao.value = true
    }

    function editAO(item) {
        if (item.is_editable === false) { // Account operation is not editable
            if (item.associated_io) { // It's an investment operation
                axios.get(item.associated_io, myheaders())
                    .then((response) => {
                        io.value = response.data
                        io_mode.value = "U"
                        key.value++
                        dialog_io.value = true
                    }, (error) => {
                        parseResponseError(error)
                    });
            } else if (item.associated_transfer) { // Try to find account transfer to edit it
                axios.get(item.associated_transfer, myheaders())
                    .then((response) => {
                        at.value = response.data
                        at_mode.value = "U"
                        key.value++
                        dialog_transfer.value = true
                    }, (error) => {
                        parseResponseError(error)
                    })
            } else if (item.associated_dividend) {
                axios.get(item.associated_dividend, myheaders())
                    .then((response) => {
                        dividend.value = response.data
                        dividends_cu_mode.value = "U"
                        key.value++
                        dividends_cu_dialog.value = true
                    }, (error) => {
                        parseResponseError(error)
                    })
            } else { // It's not a special comment
                alert(t("You can't edit this account operation"))
            }
        } else { // Account operation is editable
            ao.value = item
            ao_mode.value = 'U'
            key.value++
            dialog_ao.value = true
        }
    }

    function deleteAO(item) {
        if (item.associated_transfer) { // Tries to find transfer to delete it
            axios.get(item.associated_transfer, myheaders())
                .then((response) => {
                    at.value = response.data
                    at_mode.value = "D"
                    key.value++
                    dialog_transfer.value = true
                }, (error) => {
                    parseResponseError(error)
                })
        } else if (item.is_editable === false) { // Rest of non-editables
            alert(t("You can't delete this account operation"))
        } else { // Editables
            ao.value = item
            ao_mode.value = 'D'
            key.value++
            dialog_ao.value = true
        }
    }

    function refund(item) {
        ao.value = item
        ao_mode.value = 'F'
        key.value++
        dialog_ao.value = true
    }

    function show_refunds(item){
        ao.value = item
        key.value++
        dialog_show_refunds.value = true
    }



    const table_headers = computed(() => {
        const r = [
            { title: t('Date and time'), key: 'datetime', sortable: true, width: "12%" },
            { title: t('Account'), key: 'accounts', sortable: true, width: "20%" },
            { title: t('Concept'), key: 'concepts', sortable: true, width: "20%" },
            { title: t('Amount'), key: 'amount', sortable: true, align: 'end', width: "8%" },
            { title: t('Balance'), key: 'balance', sortable: false, align: 'end', width: "8%" },
            { title: t('Comment'), key: 'nice_comment', sortable: true },
        ]
        if (props.hideactions === false) {
            r.push({ title: t('Actions'), key: 'actions', sortable: false, width: "12%", align:"end" })
        }
        if (props.showbalance === false) {
            r.splice(4, 1);
        }
        if (props.showaccount === false) {
            r.splice(1, 1);
        }
        return r
    })

    async function gotoLastRow() {
        await nextTick()
        const bottom = document.getElementById("bottom")
        if (bottom) {
            bottom.scrollIntoView({ behavior: "auto", block: "end", inline: "nearest" })
        }
    }

    function on_AccountTransfer_cruded() {
        dialog_transfer.value = false
        emit("cruded")
        gotoLastRow()
    }

    function on_AccountsoperationsCU_cruded(following) {
        dialog_ao.value = following
        emit("cruded")
    }

    function on_DividendsCU_cruded() {
        dividends_cu_dialog.value = false
        emit("cruded")
        gotoLastRow()
    }

    function on_InvestmentsoperationsCU_cruded() {
        dialog_io.value = false
        emit("cruded")
        gotoLastRow()
    }

    function viewHistoricalConcept(item) {
        concept.value = item.concepts
        key.value++
        dialog_historical_concepts.value = true
    }

    onMounted(() => {
        gotoLastRow()
    })
</script>
