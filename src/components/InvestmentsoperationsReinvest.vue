<template>
    <div>
        <h1>{{ $t(`Orders view`)}}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>
        </h1>
        <v-card class="pa-4 mb-3 mt-3"  >
            <v-form ref="form" v-model="form_valid" lazy-validation class="pa-4">
                <v-row>
                <v-text-field class="mr-5" v-model="neworder.price" type="number" :label="$t('Set order price')" :placeholder="$t('Set order price')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field v-model="neworder.shares" type="number" :label="$t('Set order shares')" :placeholder="$t('Set order shares')" :rules="RulesInteger(10,true)" counter="10"/>
                </v-row>

            <v-row>
            <v-select class="mr-5" :disabled="loading" :items="viewoptions" v-model="viewoption" :label="$t('Set a view option')"  item-text="name" item-value="id" :rules="RulesSelection(true)" @change="refreshTables()"></v-select>  
            <v-text-field class="mr-5" autoindex="1" :disabled="loading" v-model="gains_percentage" type="number" :label="$t('Gains percentage')" :placeholder="$t('Gains percentage')" :rules="RulesFloat(5,true)" counter="5"/>

            <v-btn class="mr-5" color="primary" @click="make_all_axios()" :disabled="!form_valid">{{ $t("Simulate") }}</v-btn>
            <v-btn color="error" @click="add_or_update_order()" :disabled="!form_valid">{{ button() }}</v-btn>                 
            </v-row>
            </v-form>  

        </v-card>
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
    </div>
</template>  
<script>     
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import {empty_investments_operations_simulation,empty_investment_operation,empty_investments_chart,empty_investments_chart_limit_line} from '../empty_objects.js'
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
                required: false,
                default:null,
            },
            investments: {
                type: Array,
                required: true,
            }
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
                viewoption:2,
                list_io_current:[],
                list_io:[],
                list_io_historical:[],
                tab:3,
                key:0,
                gains_percentage:10,

                neworder: null,

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
        computed:{
        },
        watch:{
        },
        methods: {
            empty_investments_operations_simulation,
            empty_investment_operation,
            empty_investments_chart,
            empty_investments_chart_limit_line,
            add_or_update_order(){

            },
            button(){
                if (this.editing){
                    return this.$t("Update order")
                } else {
                    return this.$t("Add order")
                }
            },
            refreshProductQuotes(){
                return axios.get(`${this.$store.state.apiroot}/products/quotes/ohcl?product=${this.neworder.products}`, this.myheaders())
            },
            simulateOrderBefore(){
                var simulation=this.empty_investments_operations_simulation()
                simulation.investments.push(this.neworder.investments)
                simulation.local_currency=this.neworder.currency
                return axios.post(`${this.$store.state.apiroot}/investmentsoperations/full/simulation/`, simulation, this.myheaders())
            },
            simulateOrderAfter(){
                var simulation=this.empty_investments_operations_simulation()
                simulation.investments.push(this.neworder.investments)
                simulation.local_currency=this.neworder.currency
                var operation=this.empty_investment_operation()
                operation.datetime=simulation.dt
                operation.shares=this.neworder.shares
                operation.price=this.neworder.price
                operation.comment="Simulation 1"
                operation.investments=this.neworder.investments
                simulation.operations.push(operation)
                return axios.post(`${this.$store.state.apiroot}/investmentsoperations/full/simulation/`, simulation, this.myheaders())
            },
            make_all_axios(){
                this.loading=true
                axios.all([this.refreshProductQuotes(), this.simulateOrderBefore(), this.simulateOrderAfter()])
                .then(([resQuotes, resBefore, resAfter]) => {
                    this.ohcls=resQuotes.data 
                    this.ios_before=resBefore.data
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
                    ll2.buy=this.neworder.price
                    ll2.average=this.ios_after.investment.average_price_investment
                    ll2.sell=ll2.average*(1+this.gains_percentage/100)
                    this.chart_data.limitlines.push(ll2)
                }
                this.key=this.key+1
            },
        },
        created(){
            if ( this.order!=null){ // EDITING TIENE IO URL
                this.editing=true
                this.neworder=Object.assign({},this.order)
                this.make_all_axios()
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing=false
                this.neworder=Object.assign({},this.order)
            }


        }
        
    }
</script>

