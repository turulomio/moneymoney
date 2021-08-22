<!--
    Emits, @cruded when a dividend, investment or investment operation is cruded
-->
<template>
    <div>
        <h1>{{ investment.name }}
            <MyMenuInline :items="items" @selected="MyMenuInlineSelection"></MyMenuInline>
        </h1>
        <DisplayValues :items="displayvalues()" :key="key"></DisplayValues>

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
                            <v-card class="padding" v-if="!loading_ios">
                                <TableInvestmentOperationsCurrent :items="io_current" currency_account="EUR" currency_investment="EUR" currency_user="EUR" output="investment" height="400" :key="key"></TableInvestmentOperationsCurrent>
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="account">
                                    <v-card class="padding" v-if="!loading_ios">
                                            <TableInvestmentOperationsCurrent :items="io_current" currency_account="EUR" currency_investment="EUR" currency_user="EUR" output="account" height="400" :key="key"></TableInvestmentOperationsCurrent>
                                    </v-card>
                            </v-tab-item>
                    </v-tabs>
                </div>
            </v-tab-item>
            <v-tab-item key="operations">          
                <div>
                    <v-tabs vertical  v-model="tabcurrent">
                        <v-tab key="investment">{{ $t('Investment currency') }}</v-tab>
                            <v-tab key="account">{{ $t('Account currency') }}</v-tab>
                        <v-tab-item key="investment">     
                            <v-card class="padding" v-if="!loading_ios">
                                <TableInvestmentOperations :items="io" currency_account="EUR" currency_investment="EUR" currency_user="EUR" height="400" :key="key" output="investment"></TableInvestmentOperations>
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="account">
                                <v-card class="padding" v-if="!loading_ios">
                                    <TableInvestmentOperations :items="io" currency_account="EUR" currency_investment="EUR" currency_user="EUR" height="400" :key="key" output="account"></TableInvestmentOperations>
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
                            <v-card class="padding"  v-if="!loading_ios">
                                <TableInvestmentOperationsHistorical :items="io_historical" currency_account="EUR" currency_investment="EUR" currency_user="EUR" height="400" output="investment" :key="key"></TableInvestmentOperationsHistorical>
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="accounth">
                                <v-card class="padding" v-if="!loading_ios">
                                    <TableInvestmentOperationsHistorical :items="io_historical" currency_account="EUR" currency_investment="EUR" currency_user="EUR" height="400" output="account" :key="key"></TableInvestmentOperationsHistorical>
                                </v-card>
                            </v-tab-item>
                    </v-tabs>
                </div>
            </v-tab-item>
            <v-tab-item key="dividends">     
                <v-card class="padding" v-if="!loading_ios">
                    <v-checkbox v-model="showAllDividends" :label="setChkDividendsLabel()" @click="on_chkDividends()"></v-checkbox>
                    <TableDividends :items="dividends_filtered" currency_account="EUR"  height="300" output="user" :key="key" heterogeneus></TableDividends>
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
    </div>  
</template>
<script>
    import axios from 'axios'
    import {listobjects_sum, parseNumber,listobjects_average_ponderated} from '../functions.js'
    import InvestmentsoperationsEvolutionChart from './InvestmentsoperationsEvolutionChart.vue'
    import InvestmentsoperationsEvolutionChartTimeseries from './InvestmentsoperationsEvolutionChartTimeseries.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import DisplayValues from './DisplayValues.vue'
    import TableDividends from './TableDividends.vue'
    import TableInvestmentOperations from './TableInvestmentOperations.vue'
    import TableInvestmentOperationsHistorical from './TableInvestmentOperationsHistorical.vue'
    import TableInvestmentOperationsCurrent from './TableInvestmentOperationsCurrent.vue'
    export default {
        components:{
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
            investment: {
                required: true
            },
        },
        data () {
            return {
                tab:0,
                tabcurrent:0,
                key:0,
                investment_io: null,
                io: [],
                io_current: [],
                io_historical: [],
                loading_ios:true,
                dividends: [],
                dividends_filtered: [],
                selling_expiration_message:"",
                selling_point_message:"",
                showAllDividends:false,
                leverage_message:"",
                items: [
                    {
                        subheader:this.$t('Investment orders'),
                        children: [
                            {
                                name:this.$t('Change active status'),
                                code: function(this_){
                                    this_.investment.active=!this_.investment.active
                                    axios.put(this_.investment.url, this_.investment,  this_.myheaders())
                                    .then((response) => {
                                            console.log(response.data)
                                            this_.$emit("cruded")
                                    }, (error) => {
                                        this_.parseResponseError(error)
                                    })
                                },
                                icon: "mdi-pencil",
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
                            {
                                name:this.$t('Change selling price of investments with the same product'),
                                type: "redirection",
                                command:"{% url 'investments_same_product_change_selling_price' products_id=investment.products.id %}",
                                icon: "mdi-pencil",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Product orders'),
                        children: [
                            {
                                name:this.$t('View product'),
                                type: "redirection",
                                command:"{% url 'product_view' pk=investment.products.id %}",
                                icon: "mdi-magnify",
                            },
                            {
                                name:this.$t('Add a quote to product'),
                                type: "redirection",
                                command:"{% url 'quote_new' products_id=investment.products.id %}",
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Delete last quote'),
                                type: "redirection",
                                command:"{% url 'quote_delete_last' products_id=investment.products.id %}?next={% url 'investment_list_active')",
                                icon: "mdi-delete",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Investment operation orders'),
                        children: [
                            {
                                name:this.$t('Add an investment operation'),
                                type: "redirection",
                                command: "{% url 'investmentoperation_new' investments_id=investment.id %}",
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Add an investment operation adjusting currency conversion factor'),
                                code: function(this_){
                                    var selling_price_product_currency=parseNumber(prompt( this_.$t("Please add the operation close price in product currency"), 0 ));
                                    var gains_account_currency=parseNumber(prompt( this_.$t("Please add the final gains in account currency"), 0 ));
                                    var shares=listobjects_sum(this_.investment_io.io_current,"shares")
                                    var average_price_current_account=listobjects_average_ponderated(this_.investment_io.io_current,'price_account', 'shares')
                                    var leverage=this_.investment_io.leverage_real_multiplier
                                    var currency_conversion=(gains_account_currency+shares*average_price_current_account*leverage)/(shares*selling_price_product_currency*leverage)
//                                    var url=`{% url 'investmentoperation_new' investments_id=investment.id %}?currency_conversion=${my_round(currency_conversion,10)}&price=${selling_price_product_currency}&shares=${-shares}`;
//                                   window.location.href=url;
                                    console.log(currency_conversion)
                                },
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Dividend orders'),
                        children: [
                            {
                                name:this.$t('Add a dividend'),
                                type: "redirection",
                                command: "{% url 'dividend_new' investments_id=investment.id %}",
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                ],
                dialog_evolution_chart:false,
                dialog_evolution_chart_timeseries:false,
            }  
        },
        watch:{
            tab: function (){
                this.key=this.key+1
            }
        },
        methods: {
            listobjects_average_ponderated,
            displayvalues(){
                return [
                    {title:this.$t('Selling point'), value: this.selling_point_message},
                    {title:this.$t('Selling expiration'), value: this.selling_expiration_message},
                    {title:this.$t('Active'), value: this.investment.active},
                    {title:this.$t('Currency'), value: this.investment.currency},
                    {title:this.$t('Product'), value: this.investment.products},
                    {title:this.$t('Leverage'), value: this.leverage_message},
                    {title:this.$t('Daily adjustment'), value: this.investment.daily_adjustment},
                    {title:this.$t('Id'), value: this.investment.id},
                ]
            },
            MyMenuInlineSelection(item){
                item.code(this)
            },
            setChkDividendsLabel(){
                if (this.showAllDividends== true){
                    return this.$t("Uncheck to see dividends of current investment operations")
                } else {
                    return this.$t("Check to see all dividends")
                }
            },
            on_chkDividends(){
                if (this.showAllDividends==true){
                    this.dividends_filtered=this.dividends
                } else {
                    if (this.io_current.length==0){
                        this.dividends_filtered=[]
                    } else {
                        this.dividends_filtered=this.dividends.filter((d)=> new Date(d.datetime)>=new Date(this.io_current[0].datetime))
                    }
                }
            },

            update_investmentsoperations(){
                axios.get(`${this.$store.state.apiroot}/investmentsoperations/full?investments=${this.investment.id}`, this.myheaders())
                .then((response) => {
                     console.log(this.investment)
                    console.log(response.data[0])
                    this.investment_io=response.data[0].investment
                    this.io=response.data[0].io
                    this.io_current=response.data[0].io_current
                    this.io_historical=response.data[0].io_historical

                    this.leverage_message= this.$t(`${this.investment_io.leverage_multiplier } (Real: ${this.investment_io.leverage_real_multiplier })`)

                    this.selling_point_message=this.currency_string(this.investment.selling_price, this.investment.currency)
                    if (this.investment_io.gains_at_sellingpoint){
                        this.selling_point_message=this.selling_point_message+ this.$t(`, to gain ${this.currency_string(this.investment_io.gains_at_sellingpoint, this.investment.currency)}`)
                    }

                    this.update_dividends()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            update_dividends(){
                axios.get(`${this.$store.state.apiroot}/api/dividends?investments=${this.investment.id}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.dividends=response.data
                    this.on_chkDividends()
                    this.loading_ios=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        mounted(){
            this.loading_ios=true

            this.selling_expiration_message= `${this.investment.selling_expiration}`
            if (new Date(this.investment.selling_expiration)<new Date()){
                this.selling_expiration_message=this.selling_expiration_message+ '.<span class="vuered"> '+ this.$t('You must set a new selling order.') + '</span>'
            }


            this.update_investmentsoperations()

        }
    }
</script>

