<!--
    Emits, @cruded when a dividend, investment or investment operation is cruded
-->
<template>
    <div>
        <h1>{{ strategy.name }}
            <MyMenuInline :items="items"  :context="this"></MyMenuInline>
        </h1>
        <DisplayValues v-if="ios" :items="displayvalues()" :key="key"></DisplayValues>

        <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
            <v-tab key="current">{{ $t('Current investment operations') }}</v-tab>
            <v-tab key="operations">{{ $t('Investment operations') }}</v-tab>
            <v-tab key="historical">{{ $t('Historical investment operations') }}</v-tab>
            <v-tab key="dividends">{{ $t('Dividends') }}</v-tab>
            <v-tabs-slider color="yellow"></v-tabs-slider>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item key="current">      
                <div>
                    <v-tabs vertical  v-model="tabcurrent">
                        <v-tab key="investment">{{ $t('Investment currency') }}</v-tab>
                        <v-tab key="account">{{ $t('Account currency') }}</v-tab>
                        <v-tab-item key="investment">     
                            <v-card v-if="!loading">
                                <TableInvestmentOperationsCurrent :items="list_io_current" currency_account="EUR" currency_investment="EUR" currency_user="EUR" output="investment" height="400" :key="key"></TableInvestmentOperationsCurrent>
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="account">
                                    <v-card class="padding" v-if="!loading">
                                            <TableInvestmentOperationsCurrent :items="list_io_current" currency_account="EUR" currency_investment="EUR" currency_user="EUR" output="account" height="400" :key="key"></TableInvestmentOperationsCurrent>
                                    </v-card>
                            </v-tab-item>
                    </v-tabs>
                </div>
            </v-tab-item>
            <v-tab-item key="operations">          
                <div>
                    <v-checkbox v-model="chkShowAllIO" :label="set_chkShowAllIO_label()" @click="on_chkShowAllIO_click()"></v-checkbox>
                    <v-tabs vertical  v-model="tabcurrent">
                        <v-tab key="investment">{{ $t('Investment currency') }}</v-tab>
                            <v-tab key="account">{{ $t('Account currency') }}</v-tab>
                        <v-tab-item key="investment">     
                            <v-card class="padding" v-if="!loading">
                                <TableInvestmentOperations :items="io_filtered" currency_account="EUR" currency_investment="EUR" currency_user="EUR" height="400" :key="key" output="investment" @cruded="on_TableInvestmentsOperations_cruded()" @onedit="on_TableInvestmentsOperations_edit"></TableInvestmentOperations>
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="account">
                                <v-card class="padding" v-if="!loading">
                                    <TableInvestmentOperations :items="io_filtered" currency_account="EUR" currency_investment="EUR" currency_user="EUR" height="400" :key="key" output="account" :showactions="false"></TableInvestmentOperations>
                                </v-card>
                            </v-tab-item>
                    </v-tabs>
                </div>
            </v-tab-item>
            <v-tab-item key="historical">     
                <div>            
                    <v-tabs vertical  v-model="tabcurrent">
                        <v-tab key="investmenth">{{ $t('Investment currency') }}</v-tab>
                            <v-tab key="accounth">{{ $t('Account currency') }}</v-tab>
                        <v-tab-item key="investmenth">     
                            <v-card class="padding"  v-if="!loading">
                                <TableInvestmentOperationsHistorical :items="list_io_historical" height="400" output="investment" :homogeneous="true" :key="key"></TableInvestmentOperationsHistorical>
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="accounth">
                                <v-card class="padding" v-if="!loading">
                                    <TableInvestmentOperationsHistorical :items="list_io_historical" height="400" output="account" :homogeneous="true" :key="key"></TableInvestmentOperationsHistorical>
                                </v-card>
                            </v-tab-item>
                    </v-tabs>
                </div>
            </v-tab-item>
            <v-tab-item key="dividends">     
                <v-card class="padding" v-if="!loading">
                    <v-checkbox v-model="showAllDividends" :label="setChkDividendsLabel()" @click="on_chkDividends()"></v-checkbox>
                    <TableDividends :items="dividends_filtered" currency_account="EUR"  height="300" output="user" :key="key" heterogeneus @cruded="on_TableDividends_cruded()"></TableDividends>
                </v-card>
            </v-tab-item>
        </v-tabs-items> 

        <v-dialog v-model="dialog_evolution_chart">
            <v-card class="pa-4">
                <InvestmentsoperationsEvolutionChart :investment="investment" :key="key" ></InvestmentsoperationsEvolutionChart>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog_evolution_chart_timeseries">
            <v-card class="pa-4">
                <InvestmentsoperationsEvolutionChartTimeseries :investment="investment" :key="key" ></InvestmentsoperationsEvolutionChartTimeseries>
            </v-card>
        </v-dialog>
        <!-- INVESTMENT CHART-->
        <v-dialog v-model="dialog_investment_chart" v-if="ios">
            <v-card class="pa-3">
                <ChartInvestments :data="chart_data" :key="key"></ChartInvestments>
            </v-card>
        </v-dialog>
    </div>  
</template>
<script>
    import axios from 'axios'
    import {empty_investment_operation, empty_strategy_simulation, empty_dividend,empty_investments_chart,empty_investments_chart_limit_line} from '../empty_objects.js'
    import {listobjects_average_ponderated} from '../functions.js'
    import ChartInvestments from './ChartInvestments.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import DisplayValues from './DisplayValues.vue'
    import TableDividends from './TableDividends.vue'
    import InvestmentsoperationsEvolutionChart from './InvestmentsoperationsEvolutionChart.vue'
    import InvestmentsoperationsEvolutionChartTimeseries from './InvestmentsoperationsEvolutionChartTimeseries.vue'
    import TableInvestmentOperations from './TableInvestmentOperations.vue'
    import TableInvestmentOperationsHistorical from './TableInvestmentOperationsHistorical.vue'
    import TableInvestmentOperationsCurrent from './TableInvestmentOperationsCurrent.vue'
    export default {
        components:{
            ChartInvestments,
            DisplayValues,
            MyMenuInline,
            TableInvestmentOperations,
            TableInvestmentOperationsCurrent,
            TableInvestmentOperationsHistorical,
            TableDividends,
            InvestmentsoperationsEvolutionChart,
            InvestmentsoperationsEvolutionChartTimeseries,
        },
        props: {
            strategy: {
                required: true
            },
        },
        data () {
            return {
                tab:0,
                tabcurrent:0,
                key:0,
                list_io: [],
                list_io_current: [],
                list_io_historical: [],
                dialog_io:false,
                io:null,
                loading:true,
                dividends: [],
                dividends_filtered: [],
                io_filtered:[],
                selling_expiration_message:"",
                selling_point_message:"",
                showAllDividends:false,
                chkShowAllIO:false,
                leverage_message:"",
                chart_data: null,
                items: [
                    {
                        subheader:this.$t('Investment orders'),
                        children: [
                            {
                                name:this.$t('Investment chart'),
                                icon: "mdi-chart-areaspline",
                                code: function(this_){
                                    axios.get(`${this_.$store.state.apiroot}/products/quotes/ohcl?product=${this_.ios.product.url}`, this_.myheaders())
                                    .then((response) => {
                                        this_.chart_data=this_.empty_investments_chart()
                                        this_.chart_data.ohcls=response.data
                                        this_.chart_data.io_object=this_.ios
                                        var ll
                                        if (this_.list_io_current.length>0){
                                            ll=this_.empty_investments_chart_limit_line()
                                            ll.buy=this_.ios.investment.average_price_investment
                                            ll.average=this_.ios.investment.average_price_investment
                                            ll.sell=this_.investment.selling_price
                                            this_.chart_data.limitlines.push(ll)
                                        }
                                        this_.ohcl=response.data 
                                        this_.key=this_.key+1
                                        this_.dialog_investment_chart=true
                                    }, (error) => {
                                        this_.parseResponseError(error)
                                    });
                                }
                            },
                            {
                                name:this.$t('Show evolution chart'),
                                icon: "mdi-chart-areaspline",
                                code: function(this_){
                                    this_.dialog_evolution_chart=true
                                }
                            },
                            {
                                name:this.$t('Show evolution chart with time series'),
                                icon: "mdi-chart-areaspline",
                                code: function(this_){
                                    this_.dialog_evolution_chart_timeseries=true
                                }
                            },
                        ]
                    },
                ],

                ios:null,

                dialog_evolution_chart:false,
                dialog_evolution_chart_timeseries:false,

                // Investment chart
                dialog_investment_chart:false,

            }  
        },
        watch:{
            tab: function (){
                this.key=this.key+1
            }
        },
        methods: {
            empty_investments_chart,
            empty_investments_chart_limit_line,
            empty_dividend,
            empty_investment_operation,
            empty_strategy_simulation,
            listobjects_average_ponderated,
            on_TableDividends_cruded(){
                this.update_all()
            },
            displayvalues(){
                return [
                    {title:this.$t('Selling point'), value: this.selling_point_message},
                    {title:this.$t('Selling expiration'), value: this.selling_expiration_message},
                    {title:this.$t('Active'), value: this.ios.investment.active},
                    {title:this.$t('Currency'), value: this.ios.product.currency},
                    {title:this.$t('Product'), value: this.ios.product.name},
                    {title:this.$t('Leverage'), value: this.leverage_message},
                    {title:this.$t('Daily adjustment'), value: this.ios.investment.daily_adjustment},
                    {title:this.$t('Id'), value: this.ios.investment.id},
                ]
            },
            setChkDividendsLabel(){
                if (this.showAllDividends== true){
                    return this.$t("Uncheck to see dividends of current investment operations")
                } else {
                    return this.$t("Check to see all dividends")
                }
            },
            set_chkShowAllIO_label(){
                if (this.chkShowAllIO== true){
                    return this.$t("Uncheck to see current investment operations")
                } else {
                    return this.$t("Check to see all investment operations")
                }
            },
            on_chkShowAllIO_click(){
                if (this.chkShowAllIO==true){
                    this.io_filtered=this.list_io
                } else {
                    if (this.list_io_current.length==0){
                        this.io_filtered=[]
                    } else {
                        this.io_filtered=this.list_io.filter((d)=> new Date(d.datetime)>=new Date(this.list_io_current[0].datetime))
                    }
                }
            },
            on_chkDividends(){
                if (this.showAllDividends==true){
                    this.dividends_filtered=this.dividends
                } else {
                    if (this.list_io_current.length==0){
                        this.dividends_filtered=[]
                    } else {
                        this.dividends_filtered=this.dividends.filter((d)=> new Date(d.datetime)>=new Date(this.list_io_current[0].datetime))
                    }
                }
            },

            update_investmentsoperations(){
                var simulation=this.empty_strategy_simulation()
                simulation.investments=this.strategy.investments
                simulation.local_currency=this.$store.state.local_currency
                var headers={...this.myheaders(),params:simulation}
                return axios.get(`${this.$store.state.apiroot}/strategies/simulation/`, headers)
            },
            update_dividends(){
                var headers={...this.myheaders(),params:{investments:this.strategy.investments}}
                return axios.get(`${this.$store.state.apiroot}/api/dividends/`, headers)
            },
            update_all(){
                this.loading=true
                axios.all([this.update_investmentsoperations(), this.update_dividends()])
                .then(([resIO, resDividends]) => {
                    this.ios=resIO.data
                    console.log(this.ios)   
                    this.list_io=resIO.data.io
                    this.list_io_current=resIO.data.io_current
                    this.list_io_historical=resIO.data.io_historical

                    this.leverage_message= this.$t(`${this.ios.product.leverage_multiplier } (Real: ${this.ios.product.leverage_real_multiplier })`)

                    this.selling_point_message=this.currency_string(this.ios.investment.selling_price, this.ios.product.currency)
                    if (this.ios.investment.gains_at_sellingpoint){
                        this.selling_point_message=this.selling_point_message+ this.$t(`, to gain ${this.currency_string(this.ios.investment.gains_at_sellingpoint, this.ios.product.currency)}`)
                    }
                    this.selling_expiration_message=`${this.ios.investment.selling_expiration}`
                    if (new Date(this.ios.investment.selling_expiration).setHours(0,0,0,0)<new Date().setHours(0,0,0,0)){
                        this.selling_expiration_message=this.selling_expiration_message+ '.<span class="vuered"> '+ this.$t('You must set a new selling order.') + '</span>'
                    }
                    this.on_chkShowAllIO_click()

                    this.dividends=resDividends.data
                    this.on_chkDividends()
                    this.displayvalues()
                    this.loading=false
                    this.key=this.key+1
                });
            }
        },
        created(){
            console.log(this.strategy)
            this.update_all()
        }
    }
</script>
