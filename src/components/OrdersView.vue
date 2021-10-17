<template>
    <div>
        <h1>{{ $t(`Orders view`)}}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>
        </h1>
        <v-row>
            <v-select class="mr-5" :items="viewoptions" v-model="viewoption" :label="$t('Set a view option')"  item-text="name" item-value="id" :rules="RulesSelection(true)" @change="refreshTables()"></v-select>  
            <v-text-field autoindex="1" v-model="gains_percentage" type="number" :label="$t('Gains percentage')" :placeholder="$t('Gains percentage')" :rules="RulesFloat(5,true)" counter="5"/>
        </v-row>
        <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
            <v-tab key="current">{{ $t('Current investment operations') }}</v-tab>
            <v-tab key="operations">{{ $t('Investment operations') }}</v-tab>
            <v-tab key="historical">{{ $t('Historical investment operations') }}</v-tab>
            <v-tab key="chart">{{ $t('Investment chart') }}</v-tab>
            <v-tabs-slider color="yellow"></v-tabs-slider>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item key="current">      
                <div>
                    <v-card v-if="!loading_ios_after && !loading_ios_before && !loading_ohcls">
                        <TableInvestmentOperationsCurrent :items="list_io_current" currency_account="EUR" currency_investment="EUR" currency_user="EUR" output="investment" height="400" :key="key"></TableInvestmentOperationsCurrent>
                    </v-card>
                </div>
            </v-tab-item>
            <v-tab-item key="operations">          
                <div>
                    <v-card v-if="!loading_ios_after && !loading_ios_before && !loading_ohcls">
                        <TableInvestmentOperations :items="list_io" currency_account="EUR" currency_investment="EUR" currency_user="EUR" height="400" :key="key" output="investment"></TableInvestmentOperations>
                    </v-card>
                </div>
            </v-tab-item>
            <v-tab-item key="historical">     
                <div>            
                    <v-card v-if="!loading_ios_after && !loading_ios_before && !loading_ohcls">
                        <TableInvestmentOperationsHistorical :items="list_io_historical" height="400" output="investment" :homogeneous="true" :key="key"></TableInvestmentOperationsHistorical>
                    </v-card>
                </div>
            </v-tab-item>
            <v-tab-item key="chart">     
                <div> 
                    <v-card v-if="!loading_ios_after && !loading_ios_before && !loading_ohcls">
                        <ChartInvestments :data="chart_data" height="400" :key="key"></ChartInvestments>
                    </v-card>
                </div>
            </v-tab-item>
        </v-tabs-items> 
    </div>
</template>  
<script>     
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import {empty_investments_operations_simulation,empty_io,empty_investments_chart,empty_investments_chart_limit_line} from '../empty_objects.js'
    import ChartInvestments from './ChartInvestments.vue'
    import TableInvestmentOperations from './TableInvestmentOperations.vue'
    import TableInvestmentOperationsHistorical from './TableInvestmentOperationsHistorical.vue'
    import TableInvestmentOperationsCurrent from './TableInvestmentOperationsCurrent.vue'

    export default {
        components:{
            ChartInvestments,
            MyMenuInline,
            TableInvestmentOperations,
            TableInvestmentOperationsHistorical,
            TableInvestmentOperationsCurrent,
        },
        props: {
            order: {
                required: true
            },
        },
        data () {
            return {
                items: [
                    {
                        subheader:this.$t('Quote options'),
                        children: [
                            {
                                name:this.$t('Add a quote'),
                                code: function(this_){
                                    this_.quote=this_.empty_quote()
                                    this_.quote.products=this_.product.url
                                    this_.dialog_quotescu=true
                                },
                                icon: "mdi-plus",
                            },
                        ]
                    },
                ],
                //View options
                viewoptions:[
                    {id:1, name:'Before simulation'},
                    {id:2, name:'After simulation'},
                ],
                viewoption:1,
                list_io_current:[],
                list_io:[],
                list_io_historical:[],
                tab:0,
                key:0,
                gains_percentage:10,


                //Chart
                chart_data:null,

                //simulation
                ohcls:null,
                ios_before:null,
                ios_after:null,
                loading_ios_before:false,
                loading_ios_after:false,
                loading_ohcls:false,
                ios_before_loaded:false,
                ios_after_loaded:false,
                ohcls_loaded:false,
            }
        },
        computed:{
        },
        watch:{
        },
        methods: {
            empty_investments_operations_simulation,
            empty_io,
            empty_investments_chart,
            empty_investments_chart_limit_line,
            refreshProductQuotes(){
                this.loading_ohcls=true
                axios.get(`${this.$store.state.apiroot}/products/quotes/ohcl?product=${this.neworder.products}`, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.ohcls=response.data 
                    this.loading_ohcls=false
                    this.refreshTables()
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            simulateOrderBefore(){
                    this.loading_ios_before=true
                    var simulation=this.empty_investments_operations_simulation()
                    simulation.investments.push(this.neworder.investments)
                    simulation.local_currency=this.neworder.currency
                    axios.post(`${this.$store.state.apiroot}/investmentsoperations/full/simulation/`, simulation, this.myheaders())
                    .then((response) => {
                        this.ios_before=response.data 
                        this.refreshTables()
                        this.loading_ios_before=false
                        this.key=this.key+1
                    }, (error) => {
                        this.parseResponseError(error)
                    });

            },
            simulateOrderAfter(){
                    this.loading_ios_after=true
                    var simulation=this.empty_investments_operations_simulation()
                    simulation.investments.push(this.neworder.investments)
                    simulation.local_currency=this.neworder.currency
                    var operation=this.empty_io()
                    operation.datetime=simulation.dt
                    operation.shares=this.neworder.shares
                    operation.price=this.neworder.price
                    operation.comment="Simulation 1"
                    operation.investments=this.neworder.investments
                    simulation.operations.push(operation)
                    axios.post(`${this.$store.state.apiroot}/investmentsoperations/full/simulation/`, simulation, this.myheaders())
                    .then((response) => {
                        this.ios_after=response.data 
                        this.loading_ios_after=false
                        this.refreshTables()
                        this.key=this.key+1
                    }, (error) => {
                        this.parseResponseError(error)
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
                    ll2.buy=this.neworder.price
                    ll2.average=this.ios_after.investment.average_price_investment
                    ll2.sell=ll2.average*(1+this.gains_percentage/100)
                    this.chart_data.limitlines.push(ll2)
                }
                this.key=this.key+1
            },
        },
        created(){
            this.neworder=Object.assign({},this.order)
            this.refreshProductQuotes()
            this.simulateOrderBefore()
            this.simulateOrderAfter()
        }
        
    }
</script>

