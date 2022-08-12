<template>
    <div>
        <h1>{{ title_string }}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>
        </h1>
        <v-card class="pa-4 mb-3 mt-3"  >
            <v-form ref="form" v-model="form_valid" lazy-validation class="pa-4">
                <v-row>
                    <v-autocomplete class="mr-5" :items="$store.state.products" v-model="product" :label="$t('Select a product')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                    <v-autocomplete :items="$store.getters.getInvestmentsByProduct(product)" v-model="newinvestments" :label="$t('Select investments to include')" item-text="fullname" item-value="url" multiple :rules="RulesSelection(true)" chips></v-autocomplete>

                    <v-text-field class="mr-5" v-model="newprice" type="number" :label="$t('Set order price')" :placeholder="$t('Set order price')" :rules="RulesInteger(10,true)" counter="10"/>
                    <v-text-field v-model="newshares" type="number" :label="$t('Set order shares')" :placeholder="$t('Set order shares')" :rules="RulesInteger(10,true)" counter="10"/>
                </v-row>

            <v-row>
                <v-select class="mr-5" :disabled="loading || (ios_after==null)" :items="viewoptions" v-model="viewoption" :label="$t('Set a view option')"  item-text="name" item-value="id" :rules="RulesSelection(true)" @change="refreshTables()"></v-select>  
                <v-text-field class="mr-5" autoindex="1" :disabled="loading" v-model="gains_percentage" type="number" :label="$t('Gains percentage')" :placeholder="$t('Gains percentage')" :rules="RulesFloat(8,true)" counter="8"/>

                <v-btn class="mr-5" color="primary" @click="make_all_axios_after()" :disabled="!form_valid">{{ $t("Simulate") }}</v-btn>
                <v-btn v-if="this.newinvestments.length==1" color="error" @click="add_order()" :disabled="!form_valid">{{ $t("Add order") }}</v-btn>                 
            </v-row>
            </v-form>  

        </v-card>
        <v-tabs v-if="ios_before" background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
            <v-tab key="current">{{ $t('Current investment operations') }}</v-tab>
            <v-tab key="operations">{{ $t('Investment operations') }}</v-tab>
            <v-tab key="historical">{{ $t('Historical investment operations') }}</v-tab>
            <v-tab key="chart">{{ $t('Investment chart') }}</v-tab>
            <v-tabs-slider color="yellow"></v-tabs-slider>
        </v-tabs>
        <v-tabs-items v-if="ios_before" v-model="tab">
            <v-tab-item key="current">      
                <div>
                    <v-card>
                        <TableInvestmentOperationsCurrent :items="list_io_current" currency_account="EUR" currency_investment="EUR" currency_user="EUR" output="investment" height="400" :key="key" :loading="loading"></TableInvestmentOperationsCurrent>
                    </v-card>
                </div>
            </v-tab-item>
            <v-tab-item key="operations">          
                <div>
                    <v-card>
                        <TableInvestmentOperations :items="list_io" currency_account="EUR" currency_investment="EUR" currency_user="EUR" height="400" :key="key" output="investment" :loading="loading"></TableInvestmentOperations>
                    </v-card>
                </div>
            </v-tab-item>
            <v-tab-item key="historical">     
                <div>            
                    <v-card>
                        <TableInvestmentOperationsHistorical :items="list_io_historical" height="400" output="investment" :homogeneous="true" :key="key" :loading="loading"></TableInvestmentOperationsHistorical>
                    </v-card>
                </div>
            </v-tab-item>
            <v-tab-item key="chart">     
                <div> 
                    <v-card>
                        <ChartInvestments :data="chart_data" height="400" :key="key" :loading="loading"></ChartInvestments>
                    </v-card>
                </div>
            </v-tab-item>
        </v-tabs-items> 

        <!-- Order CU dialog -->
        <v-dialog v-model="dialog_order_cu" max-width="550">
            <v-card class="pa-4">
                <OrdersCU :order="order" mode="C" :key="key" @cruded="on_OrdersCU_cruded()"></OrdersCU>
            </v-card>
        </v-dialog>
    </div>
</template>  
<script>     
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import {empty_order, empty_investments_operations_simulation,empty_investment_operation,empty_investments_chart,empty_investments_chart_limit_line} from '../empty_objects.js'
    import ChartInvestments from './ChartInvestments.vue'
    import OrdersCU from './OrdersCU.vue'
    import TableInvestmentOperations from './TableInvestmentOperations.vue'
    import TableInvestmentOperationsHistorical from './TableInvestmentOperationsHistorical.vue'
    import TableInvestmentOperationsCurrent from './TableInvestmentOperationsCurrent.vue'

    export default {
        components:{
            ChartInvestments,
            MyMenuInline,
            OrdersCU,
            TableInvestmentOperations,
            TableInvestmentOperationsHistorical,
            TableInvestmentOperationsCurrent,
        },
        props: {
            investments: {
                type: Array,
                required: true,
            },
            shares: {
                required: false,
                default: 0,
            },
            price: {
                required: false,
                default: 0,
            }
        },
        data () {
            return {
                items: [
                    {
                        subheader:this.$t('Options to set shares'),
                        children: [
                            {
                                name:this.$t('Integer shares from amount to reinvest'),
                                code: function(this_){
                                    var amount=this_.parseNumber(prompt( this_.$t("Please set the amount to invest in this order"), 10000 ));
                                    this_.newshares=parseInt(amount/this_.newprice)
                                },
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Decimal shares from amount to reinvest'),
                                code: function(this_){
                                    var amount=this_.parseNumber(prompt( this_.$t("Please set the amount to invest in this order"), 10000 ));
                                    this_.newshares=amount/this_.newprice
                                },
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Options to set gains percentage to reinvest'),
                        children: [
                            {
                                name:this.$t('Gains percentage from gains amount'),
                                code: function(this_){
                                    var invested=0
                                    this_.ios_before.io_current.forEach(o=>{
                                        invested=invested+o.invested_investment
                                    })

                                    var amount=this_.parseNumber(prompt( this_.$t("Please the amount to gain in this order"), 500 ));
                                    this_.gains_percentage=this_.my_round(parseFloat(amount/invested)*100,4)
                                },
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Options to divest'),
                        children: [
                            {
                                name:this.$t('Integer shares to consolidate losses'),
                                code: function(this_){
                                    var losses=this_.parseNumber(prompt( this_.$t("Please set losses to consolidate (Positive amount)"), 500 ));

                                    var resultado=0
                                    for (var i = 0; i < this_.ios_before.io_current.length; i++) {
                                        var o=this_.ios_before.io_current[i]
                                        var gains=o.gains_gross_investment
                                        if (losses+gains==0){
                                            resultado=resultado+o.shares
                                            break
                                        } else if (losses+gains>0){
                                            resultado=resultado+o.shares
                                            losses=losses+gains
                                        } else if (losses+gains<0){
                                            resultado=resultado+Math.abs(parseInt(losses*o.shares/gains))
                                            break
                                        }
                                    }


                                    this_.newshares=-resultado
                                },
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Float shares to consolidate losses'),
                                code: function(this_){
                                    var losses=this_.parseNumber(prompt( this_.$t("Please set losses to consolidate (Positive amount)"), 500 ));

                                    var resultado=0
                                    for (var i = 0; i < this_.ios_before.io_current.length; i++) {
                                        var o=this_.ios_before.io_current[i]
                                        var gains=o.gains_gross_investment
                                        if (losses+gains==0){
                                            resultado=resultado+o.shares
                                            break
                                        } else if (losses+gains>0){
                                            resultado=resultado+o.shares
                                            losses=losses+gains
                                        } else if (losses+gains<0){
                                            resultado=resultado+Math.abs(losses*o.shares/gains)
                                            break
                                        }
                                    }


                                    this_.newshares=-this_.my_round(resultado,6)
                                },
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                ],


                title_string:"",

                //View options
                viewoptions:[
                    {id:1, name:'Before simulation'},
                    {id:2, name:'After simulation'},
                ],
                viewoption:1,
                list_io_current:[],
                list_io:[],
                list_io_historical:[],
                tab:3,
                key:0,
                gains_percentage:10,

                //Order CU
                dialog_order_cu:false,
                order: null,

                //Form
                product: null,
                newinvestments: [],
                newshares:0,                
                newprice:0,


                //Chart
                chart_data:null,

                //simulation
                ohcls:null,
                ios_before:null,
                ios_after:null,
                loading:false,
                form_valid:false,
            }
        },
        watch:{
            newshares: function (){
                this.update_title()
            }
        },
        methods: {
            empty_order,
            empty_investments_operations_simulation,
            empty_investment_operation,
            empty_investments_chart,
            empty_investments_chart_limit_line,
            update_title(){
                if (this.newshares==0){
                    this.title_string= this.$t(`Reinvest / Divest dialog`)
                } else if (this.newshares<0){
                    this.title_string= this.$t("Divest dialog")
                } else if (this.newshares>0){
                    this.title_string= this.$t("Reinvest dialog")
                }
            },
            add_order(){
                this.order=this.empty_order()
                this.order.price=this.newprice
                this.order.shares=this.newshares
                this.key=this.key+1
                this.dialog_order_cu=true

            },
            on_OrdersCU_cruded(){
                this.dialog_order_cu=false
            },
            refreshProductQuotes(){
                return axios.get(`${this.$store.state.apiroot}/products/quotes/ohcl?product=${this.product}`, this.myheaders())
            },
            simulateOrderBefore(){
                var simulation=this.empty_investments_operations_simulation()
                simulation.investments=this.newinvestments
                simulation.local_currency=this.$store.state.settings.local_currency
                return axios.post(`${this.$store.state.apiroot}/investmentsoperations/full/simulation/`, simulation, this.myheaders())
            },
            simulateOrderAfter(){
                var simulation=this.empty_investments_operations_simulation()
                simulation.investments=this.newinvestments
                simulation.local_currency=this.$store.state.settings.local_currency
                var operation=this.empty_investment_operation()
                operation.datetime=simulation.dt
                operation.shares=this.newshares
                operation.price=this.newprice
                operation.comment="Simulation 1"
                operation.investments=this.investments[0]
                simulation.operations.push(operation)
                return axios.post(`${this.$store.state.apiroot}/investmentsoperations/full/simulation/`, simulation, this.myheaders())
                
            },
            make_all_axios_before(){
                this.loading=true
                axios.all([this.refreshProductQuotes(), this.simulateOrderBefore()])
                .then(([resQuotes, resBefore]) => {
                    this.ohcls=resQuotes.data 
                    this.ios_before=resBefore.data
                    this.loading=false
                    this.refreshTables()
                });
            },
            make_all_axios_after(){
                this.viewoption=2
                this.loading=true
                axios.all([this.simulateOrderAfter()])
                .then(([resAfter]) => {
                    this.ios_after=resAfter.data
                    this.loading=false
                    this.refreshTables()
                });
            },
            refreshTables(){
                var ll
                this.chart_data=this.empty_investments_chart()
                this.chart_data.ohcls=this.ohcls
                if (this.ios_before.io_current.length>0){
                    ll=this.empty_investments_chart_limit_line()
                    ll.buy=this.ios_before.investment.average_price_investment
                    ll.average=this.ios_before.investment.average_price_investment
                    ll.sell=ll.average*(1+this.gains_percentage/100)
                    this.chart_data.limitlines.push(ll)

                }


                if(this.viewoption==1){ //Before
                    this.list_io_current=this.ios_before.io_current
                    this.list_io=this.ios_before.io
                    this.list_io_historical=this.ios_before.io_historical
                    this.chart_data.io_object=this.ios_before
                } else if(this.viewoption==2){//After
                    this.list_io_current=this.ios_after.io_current
                    this.list_io=this.ios_after.io
                    this.list_io_historical=this.ios_after.io_historical
                    this.chart_data.io_object=this.ios_after
                    var ll2=this.empty_investments_chart_limit_line()
                    ll2.buy=this.newprice
                    ll2.average=this.ios_after.investment.average_price_investment
                    ll2.sell=ll2.average*(1+this.gains_percentage/100)
                    this.chart_data.limitlines.push(ll2)
                }
                this.key=this.key+1
            },
        },
        created(){
            this.newshares=this.shares
            this.update_title()
            this.newprice=this.price
            this.investments.forEach(element => { this.newinvestments.push(element)});
            if (this.newinvestments.length>0) {
                this.product=this.$store.getters.getObjectPropertyByUrl("investments", this.newinvestments[0],"products")
            }
            this.make_all_axios_before()
        }
        
    }
</script>

