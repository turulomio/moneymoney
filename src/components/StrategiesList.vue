<template>
    <div data-test="StrategiesList">    
        <h1>{{ $t('Strategies list') }}
            <MyMenuInline :items="menuinline_items" data-test="StrategiesList_MyMenuInline"/>
        </h1>
        <v-card outlined class="ma-4 pa-4">
            <v-checkbox data-test="StrategiesList_CheckActive" v-model="showActive" :label="setCheckboxLabel()" />
            <v-data-table density="compact" :headers="strategies_headers" :items="strategies_items" class="elevation-1 cursorpointer" :loading="loading_strategies" :key="key" @click:row="detailedviewItem" :items-per-page="10000" >
                <template v-slot:[`item.name`]="{ item }">
                    <v-tooltip :text="item.strategy.comment">
                        <template v-slot:activator="{ props }">
                            <div v-bind="props">{{ item.strategy.name }}</div>
                        </template>
                        <span>{{ item.strategy.comment }}</span>
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
                    <v-icon :data-test="`StrategiesList_Table_IconView${item.strategy.id}`" v-if="[1,2,3].includes(item.strategy.type)" small class="mr-2" @click.stop="viewItem(item)">mdi-eye</v-icon>
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
        <!-- Strategy Products Range CU -->
        <v-dialog v-model="dialog_strategy_products_range_cu" max-width="40%">
            <v-card class="pa-4">
                <StrategyProductsRangeCU :strategy="strategy" :mode="strategy_mode" :key="key" @cruded="on_StrategyCU_cruded" />
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
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyMenuInline from './MyMenuInline.vue'
    import StrategiesView from './StrategiesView.vue'
    import StrategyFastOperationsCU from './StrategyFastOperationsCU.vue'
    import StrategyProductsRangeCU from './StrategyProductsRangeCU.vue'
    import ProductsRanges from './ProductsRanges.vue'
    import TableAccountOperations from './TableAccountOperations.vue'
    import {empty_products_ranges, empty_strategy_fast_operations, empty_strategy_products_range} from '../empty_objects.js'
    import { localtime, f} from 'vuetify_rules'
    import { parseResponseError, localcurrency_html, myheaders } from '@/functions'
    import {sumBy} from "lodash-es"
    export default {
        components:{
            MyMenuInline,
            StrategiesView,
            StrategyFastOperationsCU,
            StrategyProductsRangeCU,
            ProductsRanges,
            TableAccountOperations,
        },
        data(){ 
            return{
                showActive:true,
                strategies_headers: [
                    { title: this.$t('Name'), sortable: true, key: 'name'},
                    { title: this.$t('Date and time from'), sortable: true, key: 'dt_from',  width: "10%"},
                    { title: this.$t('Date and time to'), key: 'dt_to',  width: "10%"},
                    { title: this.$t('Type'), key: 'type',  width: "7%"},
                    { title: this.$t('Invested'), key: 'invested',  width: "7%", align:'end'},
                    { title: this.$t('Current net gains'), key: 'gains_current_net_user',  width: "7%", align:'end'},
                    { title: this.$t('Historical net gains'), key: 'gains_historical_net_user',  width: "7%", align:'end'},
                    { title: this.$t('Net dividends'), key: 'dividends_net_user',  width: "7%", align:'end'},
                    { title: this.$t('Total'), key: 'total_net_user',  width: "7%", align:'end'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false , width: "7%"},
                ],
                strategies_items:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Strategy options"),
                        children: [
                            {
                                name: this.$t("Add a new fast operations strategy"),
                                icon: "mdi-pencil",
                                code: function(){
                                    this.strategy=this.empty_strategy_fast_operations()
                                    this.strategy_mode="C"
                                    this.key=this.key+1
                                    this.dialog_strategy_fast_operations_cu=true
                                }.bind(this),
                            },
                            {
                                name: this.$t("Add a new products range strategy"),
                                icon: "mdi-pencil",
                                code: function(){
                                    this.strategy=this.empty_strategy_products_range()
                                    this.strategy_mode="C"
                                    this.key=this.key+1
                                    this.dialog_strategy_products_range_cu=true
                                }.bind(this),
                            },
                        ]
                    },
                ],
                // STRATEGY CU
                dialog_strategy_fast_operations_cu:false,
                dialog_strategy_products_range_cu:false,
                strategy: null,
                strategy_mode: null,

                loading_strategies:false,
                dialog_view:false,
                key:0,

                //Detailed view
                dialog_detailedview: false,
                pr: null,

                // Detailed view for fast operations strategy
                dialog_detailedview_fo:false,
                detailed_fo: null,
            }
        },
        watch:{
            showActive(){
                this.update_table()
            }
        },
        methods: {
            useStore,
            localtime,
            parseResponseError,
            localcurrency_html,
            myheaders,
            f,
            empty_products_ranges,
            empty_strategy_fast_operations,
            empty_strategy_products_range,
            sumBy,
            editItem (item) {
                this.strategy=item
                this.strategy_mode="U"
                this.key=this.key+1
                this.dialog_strategy_fast_operations_cu=true
            },
            deleteItem(item){
                this.strategy=item
                this.strategy_mode="D"
                this.key=this.key+1
                this.dialog_strategy_fast_operations_cu=true
            },
            viewItem (item) {
                this.strategy=item
                this.key=this.key+1
                this.dialog_view=true
            },
            detailedviewItem (event,object) {
                console.log(object.item)
                if (object.item.strategy.type==2){//RANGES
                    this.pr=this.empty_products_ranges()
                    this.pr.product=object.item.product
                    this.pr.percentage_between_ranges=object.item.percentage_between_ranges
                    this.pr.percentage_gains=object.item.percentage_gains
                    this.pr.amount_to_invest=object.item.amount
                    this.pr.recomendation_methods=object.item.recomendation_method
                    this.pr.totalized_operations=object.item.only_first
                    this.pr.investments=object.item.investments
                    this.key=this.key+1
                    this.dialog_detailedview=true
                } else if (object.item.strategy.type==4){//FAST OPERATIONS
                    axios.get(`${object.item.url}detailed/`, this.myheaders())
                    .then((response) => {
                        this.detailed_fo=response.data
                        this.key=this.key+1
                        this.dialog_detailedview_fo=true
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                } else {
                    alert(this.$t("Detailed view for this strategy type is not developed yet"))
                }
            },
            update_table(){
                this.loading_strategies=true
                axios.get(`${this.useStore().apiroot}/api/strategies/withbalance/?active=${this.showActive}`, this.myheaders())
                .then((response) => {
                    this.strategies_items=response.data
                    console.log(this.strategies_items)
                    this.loading_strategies=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_StrategyCU_cruded(){
                this.dialog_strategy_fast_operations_cu=false
                this.dialog_strategy_products_range_cu=false
                this.update_table()
            },
            setCheckboxLabel(){
                if (this.showActive== true){
                    return this.$t("Uncheck to see inactive strategies")
                } else {
                    return this.$t("Check to see active strategies")
                }
            },

            on_TableAccountsoperations_cruded(){
                this.update_table()
            }
        },
        mounted(){
            this.update_table()
        }
    }
</script>
