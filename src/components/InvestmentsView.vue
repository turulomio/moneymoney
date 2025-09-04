<template>
    <div>
        <h1>{{ investment.fullname }}
            <MyMenuInline data-test="InvestmentsView_MyMenuInline" :items="items" />
            <v-btn data-test="InvestmentsView_ButtonClose" small style="color:darkgrey" icon="mdi-close" class="elevation-0" @click="$emit('close')"/>
        </h1>
        <DisplayValues v-if="ios_id" :items="displayvalues" :key="key" />
        <v-tabs  bg-color="secondary" dark v-model="tab" show-arrows>
            <v-tab data-test="InvestmentsView_TabCurrent" key="current">{{ $t('Current investment operations') }}</v-tab>
            <v-tab data-test="InvestmentsView_TabOperations" key="operations">{{ $t('Investment operations') }}</v-tab>
            <v-tab data-test="InvestmentsView_TabHistorical" key="historical">{{ $t('Historical investment operations') }}</v-tab>
            <v-tab data-test="InvestmentsView_TabDividends" key="dividends">{{ $t('Dividends') }}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item key="current">      
                <div>
                    <v-tabs vertical bg-color="secondary"  v-model="tabcurrent">
                        <v-tab key="investment">{{ $t('Investment currency') }}</v-tab>
                        <v-tab key="account">{{ $t('Account currency') }}</v-tab>
                    </v-tabs>
                    <v-window>
                        <v-window-item key="investment">     
                            <v-card v-if="!loading">
                                <TableInvestmentOperationsCurrent :items="ios_id.io_current" showtotal output="investment" height="500" :key="key" />
                            </v-card>
                        </v-window-item>
                            <v-window-item key="account">
                                <v-card v-if="!loading">
                                    <TableInvestmentOperationsCurrent :items="ios_id.io_current" showtotal output="account" height="400" :key="key" />
                                </v-card>
                            </v-window-item>
                    </v-window>
                </div>
            </v-window-item>
            <v-window-item key="operations">          
                <div>
                    <v-checkbox v-model="chkShowAllIO" :label="chkShowAllIO_label"></v-checkbox>
                    <v-tabs vertical bg-color="secondary"  v-model="tabcurrent">
                        <v-tab key="investment">{{ $t('Investment currency') }}</v-tab>
                            <v-tab key="account">{{ $t('Account currency') }}</v-tab>

                    </v-tabs>
                    <v-window>
                        <v-window-item key="investment">     
                            <v-card v-if="!loading">
                                <TableInvestmentOperations :items="io_filtered" height="500" :key="key" output="investment" @cruded="on_TableInvestmentsOperations_cruded" />
                            </v-card>
                        </v-window-item>
                        <v-window-item key="account">
                            <v-card v-if="!loading">
                                <TableInvestmentOperations :items="io_filtered" height="500" :key="key" output="account" :showactions="false" />
                            </v-card>
                        </v-window-item>
                    </v-window>
                </div>
            </v-window-item>
            <v-window-item key="historical">     
                <div>            
                    <v-tabs vertical bg-color="secondary"  v-model="tabcurrent">
                        <v-tab key="investmenth">{{ $t('Investment currency') }}</v-tab>
                        <v-tab key="accounth">{{ $t('Account currency') }}</v-tab>
                    </v-tabs>
                    <v-window>
                        <v-window-item key="investmenth">     
                            <v-card  v-if="!loading">
                                <TableInvestmentOperationsHistorical :items="ios_id.io_historical" showtotal height="500" output="investment" :key="key" />
                            </v-card>
                        </v-window-item>
                        <v-window-item key="accounth">
                            <v-card v-if="!loading">
                                <TableInvestmentOperationsHistorical :items="ios_id.io_historical" showtotal height="500" output="account" :key="key" />
                            </v-card>
                        </v-window-item>
                    </v-window>
                </div>
            </v-window-item>
            <v-window-item key="dividends">     
                <v-card v-if="!loading">
                    <v-checkbox v-model="chkShowAllDividends" :label="chkShowAllDividends_label"></v-checkbox>
                    <TableDividends ref="tableDividends" :items="dividends_filtered" height="500" :key="key" @cruded="on_TableDividends_cruded" />
                </v-card>
            </v-window-item>
        </v-window>
        <p v-if="ios_id && dividends">{{ gains_with_dividends_message() }}</p>

        <!-- EVOLUTION CHART -->
        <v-dialog v-model="dialog_evolution_chart">
            <v-card class="pa-4">
                <ChartInvestmentsoperationsEvolution :investment="investment" :key="key" @close="on_ChartInvestmentsoperationsEvolution_close" />
            </v-card>
        </v-dialog>

        <!-- EVOLUTION CHART TIME SERIES -->
        <v-dialog v-model="dialog_evolution_chart_timeseries">
            <v-card class="pa-4">
                <ChartInvestmentsoperationsEvolutionTimeseries :investment="investment" :key="key" @close="on_ChartInvestmentsoperationsEvolutionTimeseries_close" />
            </v-card>
        </v-dialog>

        <!-- IO CU-->
        <v-dialog v-model="dialog_io" width="40%">
            <v-card class="pa-3">
                <InvestmentsoperationsCU :io="io" :mode="io_mode" :key="key"  @cruded="on_InvestmentsoperationsCU_cruded" />
            </v-card>
        </v-dialog>

        <!-- DIVIDEND CU-->
        <v-dialog v-model="dividends_cu_dialog" width="35%">
            <v-card class="pa-3">
                <DividendsCU :dividend="dividend" :mode="dividends_cu_mode" :key="key"  @cruded="on_DividendsCU_cruded"></DividendsCU>
            </v-card>
        </v-dialog>

        <!-- PRODUCTS VIEW-->
        <v-dialog v-model="dialog_productview" width="100%" heigth="100%">
            <v-card class="pa-3">
                <ProductsView :product="product" :key="key" />
            </v-card>
        </v-dialog>
        <!-- INVESTMENT CHART-->
        <v-dialog v-model="dialog_investment_chart" v-if="ios_id" >
            <v-card class="pa-3">
                <ChartInvestments :data="chart_data" :key="key"  @close="on_ChartInvestments_close" />
            </v-card>
        </v-dialog>
        <!-- INVESTMENT change selling price-->
        <v-dialog v-model="dialog_io_sameproduct" v-if="ios_id">
            <v-card class="pa-3">
                <InvestmentsChangeSellingPrice :product="product.url" :investment="investment" :key="key" @cruded="on_InvestmentsChangeSellingPrice_cruded"></InvestmentsChangeSellingPrice>
            </v-card>
        </v-dialog>

        <!-- Reinvest dialog -->
        <v-dialog v-model="dialog_reinvest">
            <v-card class="pa-4">
                <InvestmentsoperationsReinvest :shares="reinvest_shares" :price="reinvest_price" :ios_id="ios_id" :key="key"></InvestmentsoperationsReinvest>
            </v-card>
        </v-dialog>

        <!-- Investments transfers -->
        <v-dialog v-model="dialog_investments_transfers">
            <v-card class="pa-4">
                <InvestmentsTransfers :investment="investment" :key="key" />
            </v-card>
        </v-dialog>
    </div>  
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import {empty_investment_operation,empty_dividend,empty_investments_chart,empty_investments_chart_limit_line,empty_ios} from '../empty_objects.js'
    import { parseNumber,f } from 'vuetify_rules'
    import { percentage_string,listobjects_average_ponderated, parseResponseError, currency_string, localcurrency_string, listobjects_sum, myheaders, getMapObjectById } from '@/functions.js'
    import ChartInvestments from './ChartInvestments.vue'
    import InvestmentsoperationsCU from './InvestmentsoperationsCU.vue'
    import DividendsCU from './DividendsCU.vue'
    import ChartInvestmentsoperationsEvolution from './ChartInvestmentsoperationsEvolution.vue'
    import ChartInvestmentsoperationsEvolutionTimeseries from './ChartInvestmentsoperationsEvolutionTimeseries.vue'
    import InvestmentsoperationsReinvest from "./InvestmentsoperationsReinvest.vue"
    import InvestmentsChangeSellingPrice from './InvestmentsChangeSellingPrice.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import DisplayValues from './DisplayValues.vue'
    import ProductsView from './ProductsView.vue'
    import TableDividends from './TableDividends.vue'
    import TableInvestmentOperations from './TableInvestmentOperations.vue'
    import TableInvestmentOperationsHistorical from './TableInvestmentOperationsHistorical.vue'
    import TableInvestmentOperationsCurrent from './TableInvestmentOperationsCurrent.vue'
    import InvestmentsTransfers from './InvestmentsTransfers.vue'
    export default {
        components:{
            ChartInvestments,
            DisplayValues,
            DividendsCU,
            InvestmentsoperationsReinvest,
            MyMenuInline,
            ProductsView,
            TableInvestmentOperations,
            TableInvestmentOperationsCurrent,
            TableInvestmentOperationsHistorical,
            TableDividends,
            InvestmentsoperationsCU,
            InvestmentsTransfers,
            ChartInvestmentsoperationsEvolution,
            ChartInvestmentsoperationsEvolutionTimeseries,
            InvestmentsChangeSellingPrice,
        },
        props: {
            investment_id: { //investment id
                required: true
            },
        },
        data () {
            return {
                investment:null,//Object of $store
                tab:0,
                tabcurrent:0,
                key:0,
                dialog_io:false,
                io:null,
                io_mode:null,
                loading:true,
                dividends: [],
                dividends_filtered: [],
                io_filtered:[],
                chkShowAllDividends:false,
                chkShowAllIO:false,
                chart_data: null,
                items: [
                    {
                        subheader:this.$t('Investment orders'),
                        children: [
                            {
                                name:this.$t('Investment chart'),
                                icon: "mdi-chart-areaspline",
                                code: function(){
                                    axios.get(`${this.useStore().apiroot}/products/quotes/ohcl?product=${this.product.url}`, this.myheaders())
                                    .then((response) => {
                                        this.chart_data=this.empty_investments_chart()
                                        this.chart_data.ohcls=response.data
                                        this.chart_data.ios_id=this.ios_id
                                        var ll
                                        if (this.ios_id.io_current.length>0){
                                            ll=this.empty_investments_chart_limit_line()
                                            ll.buy=this.investment.average_price_investment
                                            ll.average=this.investment.average_price_investment
                                            ll.sell=this.investment.selling_price
                                            this.chart_data.limitlines.push(ll)
                                        }
                                        this.key=this.key+1
                                        this.dialog_investment_chart=true
                                    }, (error) => {
                                        this.parseResponseError(error)
                                    });
                                }.bind(this)
                            },
                            {
                                name:this.$t('Change active status'),
                                code: function(){
                                    this.investment.active=!this.investment.active
                                    axios.put(this.investment.url, this.investment,  this.myheaders())
                                    .then((response) => {
                                        this.useStore().investments.set(response.data.url, response.data)
                                        this.$emit("cruded")
                                        this.update_all()
                                    }, (error) => {
                                        this.parseResponseError(error)
                                    })
                                }.bind(this),
                                icon: "mdi-pencil",
                            },
                            {
                                name:this.$t('Show evolution chart'),
                                icon: "mdi-chart-areaspline",
                                code: function(){
                                    this.key=this.key+1
                                    this.dialog_evolution_chart=true
                                }.bind(this)
                            },
                            {
                                name:this.$t('Show evolution chart with time series'),
                                icon: "mdi-chart-areaspline",
                                code: function(){
                                    this.key=this.key+1
                                    this.dialog_evolution_chart_timeseries=true
                                }.bind(this)
                            },
                            {
                                name:this.$t('Change selling price'),
                                icon: "mdi-pencil",
                                code: function(){
                                    this.key=this.key+1
                                    this.dialog_io_sameproduct=true
                                }.bind(this)
                            },
                            {
                                name:this.$t('Investments transfers'),
                                icon: "mdi-transfer",
                                code: function(){
                                    this.dialog_investments_transfers=true
                                }.bind(this)
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Product orders'),
                        children: [
                            {
                                name:this.$t('View product'),
                                code: function(){
                                    this.key=this.key+1
                                    this.dialog_productview=true
                                }.bind(this),
                                icon: "mdi-magnify",
                            },
                            {
                                name:this.$t('Delete last quote'),
                                code: function(){
                                    axios.post(`${this.useStore().apiroot}/api/products/${this.product.id}/delete_last_quote/`, [], this.myheaders())
                                    .then(() => {
                                        this.key=this.key+1
                                        this.$emit("cruded") 
                                    }, (error) => {
                                        this.parseResponseError(error)
                                    });
                                }.bind(this),
                                icon: "mdi-delete",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Investment operation orders'),
                        children: [
                            {
                                name:this.$t('Add an investment operation'),
                                code: function(){
                                    this.io=this.empty_investment_operation()
                                    this.io.investments=this.investment.url
                                    this.io_mode="C"
                                    this.key=this.key+1
                                    this.dialog_io=true
                                }.bind(this),
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Add an investment operation adjusting currency conversion factor'),
                                code: function(){
                                    var selling_price_product_currency=this.parseNumber(prompt( this.$t("Please add the operation close price in product currency"), 0 ));
                                    var gains_account_currency=this.parseNumber(prompt( this.$t("Please add the final gains in account currency"), 0 ));
                                    var shares=this.listobjects_sum(this.ios_id.io_current,"shares")
                                    var average_price_current_account=this.listobjects_average_ponderated(this.ios_id.io_current,'price_account', 'shares')
                                    var leverage=this.product.leverage_real_multiplier
                                    var currency_conversion=(gains_account_currency+shares*average_price_current_account*leverage)/(shares*selling_price_product_currency*leverage)

                                    this.io=this.empty_investment_operation()
                                    this.io.shares=-shares
                                    this.io.currency_conversion=currency_conversion
                                    this.io.price=selling_price_product_currency
                                    this.io.investments=this.investment.url
                                     
                                    this.dialog_io=true
                                }.bind(this),
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Sell/Buy all shares to selling price'),
                                code: function(){
                                    var shares=this.listobjects_sum(this.ios_id.io_current,"shares")

                                    this.io=this.empty_investment_operation()
                                    this.io.investments=this.investment.url
                                    this.io.shares=-shares
                                    this.io.price=this.investment.selling_price
                                    this.io_mode="C"
                                    if (shares>=0){
                                        this.io.operationstypes=this.getMapObjectById("operationstypes",5).url//Sales
                                    } else {
                                        this.io.operationstypes=this.getMapObjectById("operationstypes",4).url//Buy
                                    }
                                     
                                    this.dialog_io=true
                                }.bind(this),
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Reinvest/Divest operation'),
                                code: function(){
                                    this.reinvest_shares=0
                                    this.reinvest_price=this.investment.last
                                    this.key=this.key+1                        
                                    this.dialog_reinvest=true
                                }.bind(this),
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Dividend orders'),
                        children: [
                            {
                                name:this.$t('Add a dividend'),
                                code: function(){
                                    this.dividend=this.empty_dividend()
                                    this.dividend.investments=this.investment.url    
                                    this.dividends_cu_mode="C"         
                                    this.key=this.key+1                        
                                    this.dividends_cu_dialog=true
                                }.bind(this),
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                ],
                dialog_evolution_chart:false,
                dialog_evolution_chart_timeseries:false,

                ios_id:null,

                // Dividend CU
                dividends_cu_dialog:false,
                dividends_cu_mode: null,
                dividend: null,

                // Dividend Produts view
                dialog_productview:false,

                // Investment chart
                dialog_investment_chart:false,

                // IO set selling price same product
                dialog_io_sameproduct:false,

                //dialog_reinvest
                dialog_reinvest: false,
                reinvest_shares:0,
                reinvest_price:0,
                //dialog_divest
                dialog_divest: false,
                divest_investments:[],
                divest_shares:0,
                divest_price:0,

                // dialog investments transfers
                dialog_investments_transfers: false,
            }  
        },
        watch:{
            chkShowAllIO(){
                this.on_chkShowAllIO_click()
            },
            chkShowAllDividends(){
                this.on_chkDividends()
            }
        },
        computed:{
            account: function(){
                return this.useStore().accounts.get(this.investment.accounts)
            },
            product: function(){
                return this.useStore().products.get(this.investment.products)

            },
            leverage_message (){
                if (!this.ios_id) return ""
                return f(this.$t("[0] (Real: [1])"), [
                        this.ios_id.data.multiplier,
                        this.ios_id.data.real_leverages
                ])
            },
            selling_expiration_message(){
                if (!this.product || !this.ios_id) return ""
                var gains_at_selling_point_investment=(this.investment.selling_price-this.ios_id.total_io_current.average_price_investment)*this.ios_id.total_io_current.shares*this.ios_id.data.real_leverages
                return f(this.$t("[0], to gain [1]"), [
                        this.currency_string(this.investment.selling_price, this.product.currency),
                        this.currency_string(gains_at_selling_point_investment, this.product.currency)
                ])

            },
            selling_point_message(){
                var r= `${this.investment.selling_expiration}`
                if (new Date(this.investment.selling_expiration).setHours(0,0,0,0)<new Date().setHours(0,0,0,0)){
                    r=r+ '.<span class="vuered"> '+ this.$t('You must set a new selling order.') + '</span>'
                }
                return r

            },

            displayvalues(){
                return [
                    {title:this.$t('Selling point'), value: this.selling_point_message},
                    {title:this.$t('Selling expiration'), value: this.selling_expiration_message},
                    {title:this.$t('Active'), value: this.investment.active},
                    {title:this.$t('Currency'), value: this.ios_id.data.currency_product},
                    {title:this.$t('Next reinvest amount'), value: this.ios_id.data.currency_product},
                    {title:this.$t('Product'), value: this.product.fullname},
                    {title:this.$t('Leverage'), value: this.leverage_message},
                    {title:this.$t('Daily adjustment'), value: this.investment.daily_adjustment},
                    {title:this.$t('Id'), value: this.investment.id},
                ]
            },

            chkShowAllIO_label(){
                if (this.chkShowAllIO){
                    return  this.$t("Uncheck to see current investment operations")
                } else {
                    return this.$t("Check to see all investment operations")
                }


                
            },

            chkShowAllDividends_label(){
                if (this.chkShowAllDividends==true){
                    return this.$t("Uncheck to see dividends of current investment operations")
                } else {
                    return this.$t("Check to see all dividends")
                }
            },
        },
        methods: {
            useStore,
            f,
            listobjects_average_ponderated,
            parseNumber,
            percentage_string,
            empty_investments_chart,
            empty_investments_chart_limit_line,
            empty_dividend,
            empty_ios,
            empty_investment_operation,
            getMapObjectById,
            parseResponseError,
            currency_string,
            localcurrency_string,
            listobjects_sum,
            myheaders,
            on_DividendsCU_cruded(){
                this.update_all()
                this.dividends_cu_dialog=false
            },
            on_TableDividends_cruded(){
                this.update_all()
            },
            on_InvestmentsoperationsCU_cruded(){
                this.update_all()
                this.$emit("cruded") //Translated to InvestmentsList
                this.dialog_io=false
            },
            on_InvestmentsChangeSellingPrice_cruded(){
                this.key=this.key+1
                this.update_all()
                this.$emit("cruded")
                this.dialog_io_sameproduct=false
            },
            on_TableInvestmentsOperations_cruded(){//Emited deleting IO
                this.on_InvestmentsoperationsCU_cruded()
            },
            on_chkShowAllIO_click(){
                if (this.chkShowAllIO){
                    this.io_filtered=this.ios_id.io
                } else {
                    if (this.ios_id.io_current.length==0){
                        this.io_filtered=[]
                    } else {
                        this.io_filtered=this.ios_id.io.filter((d)=> new Date(d.datetime)>=new Date(this.ios_id.io_current[0].datetime))
                    }
                }
            },
            on_chkDividends(){
                if (this.chkShowAllDividends==true){
                    this.dividends_filtered=this.dividends
                } else {
                    if (this.ios_id.io_current.length==0){
                        this.dividends_filtered=[]
                    } else {
                        this.dividends_filtered=this.dividends.filter((d)=> new Date(d.datetime)>=new Date(this.ios_id.io_current[0].datetime))
                    }
                }
            },
            update_ios(){
                var simulation=this.empty_ios()
                simulation.investments.push(parseInt(this.investment_id))
                simulation.currency=this.useStore().profile.currency
                return axios.post(`${this.useStore().apiroot}/ios/`, simulation, this.myheaders())
            },
            update_dividends(){
                var headers={...this.myheaders(),params:{investments:[this.investment_id,]}}
                return axios.get(`${this.useStore().apiroot}/api/dividends/`, headers)
            },
            update_all(){
                this.loading=true
                this.investment=this.getMapObjectById("investments",this.investment_id)

                axios.all([this.update_ios(), this.update_dividends()])
                .then(([resIO, resDividends]) => {

                    this.ios_id=resIO.data[this.investment_id]
                    this.on_chkShowAllIO_click()

                    this.dividends=resDividends.data
                    this.on_chkDividends()
                    this.loading=false
                    this.key=this.key+1
                });
            },
            on_ChartInvestmentsoperationsEvolution_close(){
                this.dialog_evolution_chart=false
            },
            on_ChartInvestmentsoperationsEvolutionTimeseries_close(){
                this.dialog_evolution_chart_timeseries=false
            },
            on_ChartInvestments_close(){
                this.dialog_investment_chart=false
            },
            gains_with_dividends_message(){
                let gains=this.ios_id.total_io_current.gains_gross_user
                let dividends_account=this.listobjects_sum(this.dividends,'gross') //Should be _user
                let total=gains+dividends_account 
                let invested=this.ios_id.total_io_current.invested_user
                let invested_percentage=total/invested
                return f(this.$t("Gross gains: [0]. Gross dividends: [1]. Gross total: [2]. Invested: [3]. Invested percentage: [4]."),
                    [  
                        this.localcurrency_string(gains), 
                        this.localcurrency_string(dividends_account),
                        this.localcurrency_string(total),
                        this.localcurrency_string(invested),
                        this.percentage_string(invested_percentage)
                    ]
                )
            },
        },
        created(){
            this.update_all()
        }
    }
</script>
