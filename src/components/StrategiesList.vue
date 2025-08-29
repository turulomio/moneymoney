<template>
    <div data-test="StrategiesList">    
        <h1>{{ $t('Strategies list') }}
            <MyMenuInline :items="menuinline_items" data-test="StrategiesList_MyMenuInline"/>
        </h1>
        <v-card outlined class="ma-4 pa-4">
            <v-checkbox data-test="StrategiesList_CheckActive" v-model="showActive" :label="setCheckboxLabel()" />
            <v-data-table density="compact" :headers="strategies_headers" :items="strategies_items" class="elevation-1 cursorpointer" :loading="loading_strategies" :key="key" @click:row="detailedviewItem" :items-per-page="10000" >
                <template v-slot:[`item.name`]="{ item }">
                    <v-tooltip>
                        <template v-slot:activator="{ props }">
                            <div v-bind="props">{{ item.strategy.name }}</div>
                        </template>
                        <div style="white-space: pre-wrap;">{{ item.strategy.comment }}</div>
                    </v-tooltip>
                </template>
                <template #item.dt_from="{item}">
                    <div :data-test="`StrategiesList_Table_Row${item.id}`" v-html="localtime(item.strategy.dt_from )"></div>
                </template>        
                <template #item.dt_to="{item}">
                    <div v-html="localtime(item.strategy.dt_to )"></div>
                </template>     
                <template #item.type="{item}">
                    {{ useStore().strategiestypes.get(item.strategy.type).name }}
                </template>   
                <template #item.invested="{item}">
                    <div class="text-right" v-html="localcurrency_html(item.balance.invested)"></div>
                </template>    
                <template #item.gains_current_net_user="{item}">
                    <div class="text-right" v-html="localcurrency_html(item.balance.gains_current_net_user)"></div>
                </template>    
                <template #item.gains_historical_net_user="{item}">
                    <div class="text-right" v-html="localcurrency_html(item.balance.gains_historical_net_user)"></div>
                </template>    
                <template #item.dividends_net_user="{item}">
                    <div class="text-right" v-html="localcurrency_html(item.balance.dividends_net_user)"></div>
                </template>    
                <template #item.total_net_user="{item}">
                    <div class="text-right" v-html="localcurrency_html(item.balance.total_net_user)"></div>
                </template>           

                <template #item.actions="{item}">
                    <v-icon :data-test="`StrategiesList_Table_IconView${item.strategy.id}`" v-if="[StrategiesTypes.Ranges, StrategiesTypes.Generic].includes(item.strategy.type)" small class="mr-2" @click.stop="viewItem(item)">mdi-eye</v-icon>
                    <v-icon :data-test="`StrategiesList_Table_IconEdit${item.strategy.id}`" small class="mr-2" @click.stop="editItem(item)">mdi-pencil</v-icon>
                    <v-icon :data-test="`StrategiesList_Table_IconDelete${item.strategy.id}`" small @click.stop="deleteItem(item)">mdi-delete</v-icon>
                </template>                  
                <template #tbody v-if="strategies_items.length>0">
                    <tr class="totalrow">
                        <td>{{f($t("Total ([0] strategies)"), [strategies_items.length]) }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="text-right" v-html="localcurrency_html(sumBy(strategies_items, 'balance.invested'))"></td>
                        <td class="text-right" v-html="localcurrency_html(sumBy(strategies_items, 'balance.gains_current_net_user'))"></td>
                        <td class="text-right" v-html="localcurrency_html(sumBy(strategies_items, 'balance.gains_historical_net_user'))"></td>
                        <td class="text-right" v-html="localcurrency_html(sumBy(strategies_items, 'balance.dividends_net_user'))"></td>
                        <td class="text-right" v-html="localcurrency_html(sumBy(strategies_items, 'balance.total_net_user'))"></td>
                        <td></td>
                    </tr>
                </template>
                <template #bottom ></template>   
            </v-data-table>
        </v-card>

        <!-- Strategy Fast Operations CU -->
        <v-dialog v-model="dialog_strategy_fast_operations_cu" max-width="40%">
            <v-card class="pa-4">
                <StrategyFastOperationsCU :strategy="strategy" :mode="strategy_mode" :key="key" @cruded="on_StrategyCU_cruded" />
            </v-card>
        </v-dialog>
        <!-- Strategy Generic CU -->
        <v-dialog v-model="dialog_strategy_generic_cu" max-width="40%">
            <v-card class="pa-4">
                <StrategyGenericCU :strategy="strategy" :mode="strategy_mode" :key="key" @cruded="on_StrategyCU_cruded" />
            </v-card>
        </v-dialog>
        <!-- Strategy Products Range CU -->
        <v-dialog v-model="dialog_strategy_products_range_cu" max-width="40%">
            <v-card class="pa-4">
                <StrategyProductsRangeCU :strategy="strategy" :mode="strategy_mode" :key="key" @cruded="on_StrategyCU_cruded" />
            </v-card>
        </v-dialog>
        <!-- Strategy Pairs CU -->
        <v-dialog v-model="dialog_strategy_pairs_cu" max-width="40%">
            <v-card class="pa-4">
                <StrategyPairsCU :strategy="strategy" :mode="strategy_mode" :key="key" @cruded="on_StrategyCU_cruded" />
            </v-card>
        </v-dialog>

        <!-- View strategy -->
        <v-dialog v-model="dialog_view">
            <v-card class="pa-4">
                <StrategiesView :strategy="strategy" :key="key" @close="dialog_view=false" />
            </v-card>
        </v-dialog>

        <!-- Detailed view strategy -->
        <v-dialog v-model="dialog_detailedview">
            <v-card class="pa-4">
                <ProductsRanges :pr="pr" :key="key"></ProductsRanges>
            </v-card>
        </v-dialog>

        <!-- Detailed view strategy for fast operations-->
        <v-dialog v-model="dialog_detailedview_fo">
            <v-card class="pa-4">
                <h1>{{ $t("Fast operations of this strategy") }}</h1>
                <TableAccountOperations showaccount showtotal :items="detailed_fo" height="400" class="flex-grow-1 flex-shrink-0" :key="key" @cruded="on_TableAccountsoperations_cruded"/>
            </v-card>
        </v-dialog>

    </div>
</template>

<script setup>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyMenuInline from './MyMenuInline.vue'
    import StrategiesView from './StrategiesView.vue'
    import StrategyFastOperationsCU from './StrategyFastOperationsCU.vue'
    import StrategyGenericCU from './StrategyGenericCU.vue'
    import StrategyProductsRangeCU from './StrategyProductsRangeCU.vue'
    import StrategyPairsCU from './StrategyPairsCU.vue'
    import ProductsRanges from './ProductsRanges.vue'
    import { StrategiesTypes } from '@/types'
    import TableAccountOperations from './TableAccountOperations.vue'
    import {empty_products_ranges, empty_strategy_fast_operations, empty_strategy_products_range, empty_strategy_generic, empty_strategy_pairs} from '../empty_objects.js'
    import { localtime, f} from 'vuetify_rules'
    import { parseResponseError, localcurrency_html, myheaders } from '@/functions'
    import {sumBy} from "lodash-es"
    import { ref, onMounted, watch } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()
    const store = useStore()

    const showActive = ref(true)
    const strategies_headers = ref([
        { title: t('Name'), sortable: true, key: 'name'},
        { title: t('Date and time from'), sortable: true, key: 'dt_from',  width: "10%"},
        { title: t('Date and time to'), key: 'dt_to',  width: "10%"},
        { title: t('Type'), key: 'type',  width: "7%"},
        { title: t('Invested'), key: 'invested',  width: "7%", align:'end'},
        { title: t('Current net gains'), key: 'gains_current_net_user',  width: "7%", align:'end'},
        { title: t('Historical net gains'), key: 'gains_historical_net_user',  width: "7%", align:'end'},
        { title: t('Net dividends'), key: 'dividends_net_user',  width: "7%", align:'end'},
        { title: t('Total'), key: 'total_net_user',  width: "7%", align:'end'},
        { title: t('Actions'), key: 'actions', sortable: false , width: "7%", align:'end'},
    ])
    const strategies_items = ref([])
    const menuinline_items = ref([
        {
            subheader: t("Strategy options"),
            children: [
                {
                    name: t("Add a new fast operations strategy"),
                    icon: "mdi-pencil",
                    code: () => {
                        strategy.value = empty_strategy_fast_operations()
                        strategy_mode.value = "C"
                        key.value = key.value + 1
                        dialog_strategy_fast_operations_cu.value = true
                    }
                },
                {
                    name: t("Add a new products range strategy"),
                    icon: "mdi-pencil",
                    code: () => {
                        strategy.value = empty_strategy_products_range()
                        strategy_mode.value = "C"
                        key.value = key.value + 1
                        dialog_strategy_products_range_cu.value = true
                    }
                },
                {
                    name: t("Add a new pairs in same account strategy"),
                    icon: "mdi-plus",
                    code: () => {
                        strategy.value = empty_strategy_pairs()
                        strategy_mode.value = "C"
                        key.value = key.value + 1
                        dialog_strategy_pairs_cu.value = true
                    }
                },
                {
                    name: t("Add a new generic strategy"),
                    icon: "mdi-plus",
                    code: () => {
                        strategy.value = empty_strategy_generic()
                        strategy_mode.value = "C"
                        key.value = key.value + 1
                        dialog_strategy_generic_cu.value = true
                    }
                },
            ]
        },
    ])
    const dialog_strategy_fast_operations_cu = ref(false)
    const dialog_strategy_products_range_cu = ref(false)
    const dialog_strategy_generic_cu = ref(false)
    const dialog_strategy_pairs_cu = ref(false)
    const strategy = ref(null)
    const strategy_mode = ref(null)
    const loading_strategies = ref(false)
    const dialog_view = ref(false)
    const key = ref(0)
    const dialog_detailedview = ref(false)
    const pr = ref(null)
    const dialog_detailedview_fo = ref(false)
    const detailed_fo = ref(null)

    watch(showActive, () => {
        update_table()
    })

    function editItem (item) {
        strategy.value = item
        strategy_mode.value = "U"
        key.value = key.value + 1
        if (strategy.value.strategy.type==StrategiesTypes.FastOperations){//FAST OPERATIONS
            dialog_strategy_fast_operations_cu.value = true
        } else if (strategy.value.strategy.type==StrategiesTypes.Ranges){//RANGES
            dialog_strategy_products_range_cu.value = true
        } else if (strategy.value.strategy.type==StrategiesTypes.Generic){//GENERIC
            dialog_strategy_generic_cu.value = true
        } else if (strategy.value.strategy.type==StrategiesTypes.PairsInSameAccount){
            dialog_strategy_pairs_cu.value = true
        }
    }

    function deleteItem(item){
        strategy.value = item
        strategy_mode.value = "D"
        key.value = key.value + 1
        if (strategy.value.strategy.type==StrategiesTypes.FastOperations){//FAST OPERATIONS
            dialog_strategy_fast_operations_cu.value = true
        } else if (strategy.value.strategy.type==StrategiesTypes.Ranges){//RANGES
            dialog_strategy_products_range_cu.value = true
        } else if (strategy.value.strategy.type==StrategiesTypes.Generic){//GENERIC
            dialog_strategy_generic_cu.value = true
        } else if (strategy.value.strategy.type==StrategiesTypes.PairsInSameAccount){
            dialog_strategy_pairs_cu.value = true
        }
    }

    function viewItem (item) {
        strategy.value = item
        key.value = key.value + 1
        dialog_view.value = true
    }

    function detailedviewItem (event,object) {
        console.log(object.item)
        if (object.item.strategy.type==StrategiesTypes.Ranges){//RANGES
            pr.value = empty_products_ranges()
            pr.value.product=object.item.product
            pr.value.percentage_between_ranges=object.item.percentage_between_ranges
            pr.value.percentage_gains=object.item.percentage_gains
            pr.value.amount_to_invest=object.item.amount
            pr.value.recomendation_methods=object.item.recomendation_method
            pr.value.totalized_operations=object.item.only_first
            pr.value.investments=object.item.investments
            key.value = key.value + 1
            dialog_detailedview.value = true
        } else if (object.item.strategy.type==StrategiesTypes.FastOperations){//FAST OPERATIONS
            axios.get(`${object.item.url}detailed/`, myheaders())
            .then((response) => {
                detailed_fo.value = response.data
                key.value = key.value + 1
                dialog_detailedview_fo.value = true
            }, (error) => {
                parseResponseError(error)
            });
        } else {
            alert(t("Detailed view for this strategy type is not developed yet"))
        }
    }

    function update_table(){
        loading_strategies.value = true
        axios.get(`${store.apiroot}/api/strategies/withbalance/?active=${showActive.value}`, myheaders())
        .then((response) => {
            strategies_items.value = response.data
            console.log(strategies_items.value)
            loading_strategies.value = false
        }, (error) => {
            parseResponseError(error)
        });
    }

    function on_StrategyCU_cruded(){
        dialog_strategy_fast_operations_cu.value = false
        dialog_strategy_products_range_cu.value = false
        dialog_strategy_generic_cu.value = false
        dialog_strategy_pairs_cu.value = false
        update_table()
    }

    function setCheckboxLabel(){
        if (showActive.value == true){
            return t("Uncheck to see inactive strategies")
        } else {
            return t("Check to see active strategies")
        }
    }

    function on_TableAccountsoperations_cruded(){
        update_table()
    }

    onMounted(() => {
        update_table()
    })
</script>