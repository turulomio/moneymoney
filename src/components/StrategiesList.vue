<template>
    <div>    
        <h1>{{ $t('Strategies list') }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <v-card outlined class="ma-4 pa-4">
            <v-checkbox v-model="showActive" :label="setCheckboxLabel()" @click="on_chkActive()" ></v-checkbox>
            <v-data-table dense :headers="strategies_headers" :items="strategies_items" sort-by="percentage_selling_point" class="elevation-1" hide-default-footer disable-pagination :loading="loading_strategies" :key="key">
                <template v-slot:[`item.dt_from`]="{ item }">
                    {{localtime(item.dt_from)}}
                </template>                  
                <template v-slot:[`item.dt_to`]="{ item }">
                    {{localtime(item.dt_to)}}
                </template>  
                <template v-slot:[`item.invested`]="{ item }">
                    <div v-html="localcurrency_html(item.invested)"></div>
                </template>    
                <template v-slot:[`item.gains_current_net_user`]="{ item }">
                    <div v-html="localcurrency_html(item.gains_current_net_user)"></div>
                </template>    
                <template v-slot:[`item.gains_historical_net_user`]="{ item }">
                    <div v-html="localcurrency_html(item.gains_historical_net_user)"></div>
                </template>    
                <template v-slot:[`item.dividends_net_user`]="{ item }">
                    <div v-html="localcurrency_html(item.dividends_net_user)"></div>
                </template>    
                <template v-slot:[`item.total_net_user`]="{ item }">
                    <div v-html="localcurrency_html(item.total_net_user)"></div>
                </template>           

                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="viewItem(item)">mdi-eye</v-icon>
                    <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon small class="mr-2" @click="detailedviewItem(item)">mdi-chart-box</v-icon>
                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>                  
                <template v-slot:[`body.append`]="{headers}">
                    <tr style="background-color: WhiteSmoke">
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'name'">
                                {{$t(`Total (${strategies_items.length} strategies)`)}}
                            </div>
                            <div v-if="header.value == 'invested'" align="right" v-html="localcurrency_html(listobjects_sum(strategies_items,'invested'))"></div>
                            <div v-if="header.value == 'gains_current_net_user'" align="right" v-html="localcurrency_html(listobjects_sum(strategies_items,'gains_current_net_user'))"></div>
                            <div v-if="header.value == 'gains_historical_net_user'" align="right" v-html="localcurrency_html(listobjects_sum(strategies_items,'gains_historical_net_user'))"></div>
                            <div v-if="header.value == 'dividends_net_user'" align="right" v-html="localcurrency_html(listobjects_sum(strategies_items,'dividends_net_user'))"></div>
                            <div v-if="header.value == 'total_net_user'" align="right" v-html="localcurrency_html(listobjects_sum(strategies_items,'total_net_user'))"></div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>

        <!-- Strategy CU -->
        <v-dialog v-model="dialog_strategy_cu" max-width="550">
            <v-card class="pa-4">
                <StrategyCU :strategy="strategy" :deleting="strategy_deleting" :key="key" @cruded="on_StrategyCU_cruded()"></StrategyCU>
            </v-card>
        </v-dialog>

        <!-- View strategy -->
        <v-dialog v-model="dialog_view">
            <v-card class="pa-4">
                <StrategiesView :strategy="strategy" :key="key"></StrategiesView>
            </v-card>
        </v-dialog>

        <!-- Detailed view strategy -->
        <v-dialog v-model="dialog_detailedview">
            <v-card class="pa-4">
                <ProductsRanges :pr="pr" :key="key"></ProductsRanges>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import StrategiesView from './StrategiesView.vue'
    import StrategyCU from './StrategyCU.vue'
    import ProductsRanges from './ProductsRanges.vue'
    import {empty_products_ranges, empty_strategy} from '../empty_objects.js'
    export default {
        components:{
            MyMenuInline,
            StrategiesView,
            StrategyCU,
            ProductsRanges,
        },
        data(){ 
            return{
                showActive:true,
                strategies_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Date and time from'), sortable: true, value: 'dt_from',  width: "10%"},
                    { text: this.$t('Date and time to'), value: 'dt_to',  width: "10%"},
                    { text: this.$t('Invested'), value: 'invested',  width: "7%", align:'right'},
                    { text: this.$t('Current net gains'), value: 'gains_current_net_user',  width: "7%", align:'right'},
                    { text: this.$t('Historical net gains'), value: 'gains_historical_net_user',  width: "7%", align:'right'},
                    { text: this.$t('Net dividends'), value: 'dividends_net_user',  width: "7%", align:'right'},
                    { text: this.$t('Total'), value: 'total_net_user',  width: "7%", align:'right'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "7%"},
                ],
                strategies_items:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Strategy options"),
                        children: [
                            {
                                name:"Add a new strategy",
                                icon: "mdi-pencil",
                                code: function(this_){
                                    this_.strategy=this_.empty_strategy()
                                    this_.key=this_.key+1
                                    this_.dialog_strategy_cu=true
                                },
                            },
                        ]
                    },
                ],
                // STRATEGY CU
                dialog_strategy_cu:false,
                strategy: null,
                strategy_deleting: false,



                loading_strategies:false,
                dialog_view:false,
                key:0,

                //Detailed view
                dialog_detailedview: false,
                pr: null,
            }
        },
        methods: {
            editItem (item) {
                this.strategy=item
                this.key=this.key+1
                this.dialog_strategy_cu=true
            },
            empty_products_ranges,
            empty_strategy,
            deleteItem(item){
                this.strategy=item
                this.strategy_deleting=true
                this.key=this.key+1
                this.dialog_strategy_cu=true
            },
            viewItem (item) {
                this.strategy=item
                this.key=this.key+1
                this.dialog_view=true
            },
            detailedviewItem (item) {
                if (item.type==2){//RANGES
                    this.pr=this.empty_products_ranges()
                    this.pr.product=`${this.$store.state.apiroot}/api/products/${item.additional1}/`
                    this.pr.percentage_between_ranges=item.additional2
                    this.pr.percentage_gains=item.additional3
                    this.pr.amount_to_invest=item.additional4
                    this.pr.recomendation_methods=item.additional5
                    this.pr.totalized_operations=item.additional6
                    this.pr.investments=item.investments
                    this.key=this.key+1
                    this.dialog_detailedview=true
                } else {
                    alert(this.$t("Detailed view for this strategy type is not developed yet"))
                }
            },
            update_table(){
                this.loading_strategies=true
                axios.get(`${this.$store.state.apiroot}/strategies/withbalance?active=${this.showActive}`, this.myheaders())
                .then((response) => {
                    this.strategies_items=response.data
                    this.loading_strategies=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_chkActive(){
                this.update_table()
            },
            on_StrategyCU_cruded(){
                this.dialog_strategy_cu=false
                this.strategy_deleting=false
                this.update_table()
            },
            setCheckboxLabel(){
                if (this.showActive== true){
                    return this.$t("Uncheck to see inactive strategies")
                } else {
                    return this.$t("Check to see active strategies")
                }
            },
        },
        mounted(){
            this.update_table()
        }
    }
</script>

