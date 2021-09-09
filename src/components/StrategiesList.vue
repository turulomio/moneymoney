<template>
    <div>    
        <h1>{{ $t('Strategies list') }}
            <MyMenuInline :items="menuinline_items" @selected="MyMenuInlineSelection"></MyMenuInline>

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
                    <v-icon small @click="deleteItem(item)" v-if="item.is_deletable">mdi-delete</v-icon>
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
        <v-dialog v-model="dialog" max-width="550">
            <v-card class="pa-4">
                <v-card-title class="headline">{{dialog_title()}}</v-card-title>
                <v-form ref="form" v-model="form_valid" >
                    <v-text-field v-model="strategy.name" type="text" :label="$t('Strategy name')" required :placeholder="$t('Strategy name')" autofocus :rules="RulesString(200,false)" counter="200"/>
                    <v-checkbox v-model="strategy.active" :label="$t('Is active?')" ></v-checkbox>
                    <v-text-field v-model="strategy.number" type="text" :label="$t('Strategy number')" required :placeholder="$t('Strategy number')" :rules="RulesString(30,true)" counter="30"/>
                    <v-autocomplete :items="$store.state.currencies" v-model="strategy.currency" :label="$t('Select a currency')" item-text="fullname" item-value="id" required :rules="RulesSelection(false)"></v-autocomplete>
                    <v-autocomplete ref="autocompleteBanks" :items="$store.state.banks.filter(v =>v.active==true)" v-model="strategy.banks" :label="$t('Select a bank')" item-text="name" item-value="url" required :rules="RulesSelection(false)"></v-autocomplete>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ $t("Log in") }}</v-btn>
                    <v-btn color="error" @click="dialog = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- View strategy -->
        <v-dialog v-model="dialog_view">
            <v-card class="pa-4">
                <StrategiesView strategy="strategy" :key="key"></StrategiesView>
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
    import ProductsRanges from './ProductsRanges.vue'
    import {localtime} from '../functions.js'
    import {empty_products_ranges, empty_strategy} from '../empty_objects.js'
    export default {
        components:{
            MyMenuInline,
            StrategiesView,
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
                                    this_.editing=false
                                    this_.strategy=this_.empty_strategy()
                                    this_.dialog=true
                                },
                            },
                        ]
                    },
                ],
                dialog:false,
                form_valid: false,
                strategy: this.empty_strategy(),
                editing:false,
                loading_strategies:false,

                dialog_view:false,
                key:0,

                //Detailed view
                dialog_detailedview: false,
                pr: null,
            }
        },
        methods: {
            localtime,
            dialog_title(){
                if(this.editing==true){
                    return this.$t("Updating strategy")
                } else {
                    return this.$t("Creating a new strategy")
                }
            },
            MyMenuInlineSelection(item){
                item.code(this)
            },
            editItem (item) {
                this.strategy=item
                this.editing=true
                this.dialog=true
            },
            empty_products_ranges,
            empty_strategy,
            viewItem (item) {
                this.key=this.key+1
                this.strategy=item
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
                    this.pr.only_first=item.additional6
                    this.pr.account=`${this.$store.state.apiroot}/api/accounts/${item.additional7}/`
                    this.dialog_detailedview=true
                    this.key=this.key+1
                } else {
                    alert(this.$t("Detailed view for this strategy type is not developed yet"))
                }
            },
            deleteItem (item) {
               var r = confirm(this.$t("Do you want to delete this item?"))
               if(r == false) {
                  return
               } 
               r = confirm(this.$t("This strategy will be deleted. Do you want to continue?"))
               if(r == false) {
                  return
               } 
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    console.log(response);
                    this.update_table()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            update_table(){
                this.loading_strategies=true
                axios.get(`${this.$store.state.apiroot}/strategies/withbalance?active=${this.showActive}`, this.myheaders())
                .then((response) => {
                    this.strategies_items=response.data
                    console.log(response.data);
                    this.loading_strategies=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_chkActive(){
                this.update_table()
            },
            setCheckboxLabel(){
                if (this.showActive== true){
                    return this.$t("Uncheck to see inactive strategies")
                } else {
                    return this.$t("Check to see active strategies")
                }
            },
            acceptDialog(){
                console.log(this.strategy)
                console.log(this.$refs)
                if (this.editing==true){               
                    axios.put(this.strategy.url, this.strategy, this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.update_table()     
                            this.dialog=false
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/strategies/`, this.strategy,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.update_table()     
                            this.dialog=false
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
        },
        mounted(){
            this.update_table()
        }
    }
</script>

