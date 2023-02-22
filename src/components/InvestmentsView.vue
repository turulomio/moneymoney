<template>
    <div>
        <h1>{{ investment.fullname }}
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
                                <TableInvestmentOperationsCurrent :items="list_io_current" showtotal output="investment" height="500" :key="key" />
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="account">
                                <v-card v-if="!loading">
                                    <TableInvestmentOperationsCurrent :items="list_io_current" showtotal output="account" height="400" :key="key" />
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
                            <v-card v-if="!loading">
                                <TableInvestmentOperations :items="io_filtered" height="500" :key="key" output="investment" @cruded="on_TableInvestmentsOperations_cruded()" />
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="account">
                                <v-card v-if="!loading">
                                    <TableInvestmentOperations :items="io_filtered" height="500" :key="key" output="account" :showactions="false" />
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
                            <v-card  v-if="!loading">
                                <TableInvestmentOperationsHistorical :items="list_io_historical" showtotal height="500" output="investment" :key="key" />
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="accounth">
                                <v-card v-if="!loading">
                                    <TableInvestmentOperationsHistorical :items="list_io_historical" showtotal height="500" output="account" :key="key" />
                                </v-card>
                            </v-tab-item>
                    </v-tabs>
                </div>
            </v-tab-item>
            <v-tab-item key="dividends">     
                <v-card v-if="!loading">
                    <v-checkbox v-model="showAllDividends" :label="setChkDividendsLabel()" @click="on_chkDividends()"></v-checkbox>
                    <TableDividends :items="dividends_filtered" height="500" :key="key" @cruded="on_TableDividends_cruded()" />
                </v-card>
            </v-tab-item>
        </v-tabs-items>

        <!-- EVOLUTION CHART -->
        <v-dialog v-model="dialog_evolution_chart">
            <v-card class="pa-4">
                <ChartInvestmentsoperationsEvolution :investment="investment" :key="key" ></ChartInvestmentsoperationsEvolution>
            </v-card>
        </v-dialog>

        <!-- EVOLUTION CHART TIME SERIES -->
        <v-dialog v-model="dialog_evolution_chart_timeseries">
            <v-card class="pa-4">
                <ChartInvestmentsoperationsEvolutionTimeseries :investment="investment" :key="key" ></ChartInvestmentsoperationsEvolutionTimeseries>
            </v-card>
        </v-dialog>

        <!-- IO CU-->
        <v-dialog v-model="dialog_io" width="65%">
            <v-card class="pa-3">
                <InvestmentsoperationsCU :io="io" :mode="io_mode" :key="key"  @cruded="on_InvestmentsoperationsCU_cruded()" />
            </v-card>
        </v-dialog>

        <!-- DIVIDEND CU-->
        <v-dialog v-model="dividends_cu_dialog" width="35%">
            <v-card class="pa-3">
                <DividendsCU :dividend="dividend" :mode="dividends_cu_mode" :key="key"  @cruded="on_DividendsCU_cruded()"></DividendsCU>
            </v-card>
        </v-dialog>

        <!-- DIVIDEND PRODUCTSVIEW-->
        <v-dialog v-model="dialog_productview" width="100%" heigth="100%">
            <v-card class="pa-3">
                <ProductsView :product="product" :key="key" ></ProductsView>
            </v-card>
        </v-dialog>
        <!-- INVESTMENT CHART-->
        <v-dialog v-model="dialog_investment_chart" v-if="ios">
            <v-card class="pa-3">
                <ChartInvestments :data="chart_data" :key="key"></ChartInvestments>
            </v-card>
        </v-dialog>
        <!-- INVESTMENT change selling price-->
        <v-dialog v-model="dialog_io_sameproduct" v-if="ios">
            <v-card class="pa-3">
                <InvestmentsChangeSellingPrice :product="ios.product" :investment="investment" :key="key" @cruded="on_InvestmentsChangeSellingPrice_cruded()"></InvestmentsChangeSellingPrice>
            </v-card>
        </v-dialog>

        <!-- Reinvest dialog -->
        <v-dialog v-model="dialog_reinvest">
            <v-card class="pa-4">
                <InvestmentsoperationsReinvest :shares="reinvest_shares" :price="reinvest_price" :investments="reinvest_investments" :key="key"></InvestmentsoperationsReinvest>
            </v-card>
        </v-dialog>
        <!-- Divest dialog -->
        <v-dialog v-model="dialog_divest">
            <v-card class="pa-4">
                <InvestmentsoperationsDivest :shares="divest_shares" :price="divest_price" :investments="divest_investments" :key="key"></InvestmentsoperationsDivest>
            </v-card>
        </v-dialog>
    </div>  
</template>
<script>
    import axios from 'axios'
    import {empty_investment_operation,empty_dividend,empty_investments_chart,empty_investments_chart_limit_line} from '../empty_objects.js'
    import ChartInvestments from './ChartInvestments.vue'
    import InvestmentsoperationsCU from './InvestmentsoperationsCU.vue'
    import DividendsCU from './DividendsCU.vue'
    import ChartInvestmentsoperationsEvolution from './ChartInvestmentsoperationsEvolution.vue'
    import ChartInvestmentsoperationsEvolutionTimeseries from './ChartInvestmentsoperationsEvolutionTimeseries.vue'
    import InvestmentsoperationsDivest from "./InvestmentsoperationsDivest.vue"
    import InvestmentsoperationsReinvest from "./InvestmentsoperationsReinvest.vue"
    import InvestmentsChangeSellingPrice from './InvestmentsChangeSellingPrice.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import DisplayValues from './DisplayValues.vue'
    import ProductsView from './ProductsView.vue'
    import TableDividends from './TableDividends.vue'
    import TableInvestmentOperations from './TableInvestmentOperations.vue'
    import TableInvestmentOperationsHistorical from './TableInvestmentOperationsHistorical.vue'
    import TableInvestmentOperationsCurrent from './TableInvestmentOperationsCurrent.vue'
    export default {
        components:{
            ChartInvestments,
            DisplayValues,
            DividendsCU,
            InvestmentsoperationsDivest,
            InvestmentsoperationsReinvest,
            MyMenuInline,
            ProductsView,
            TableInvestmentOperations,
            TableInvestmentOperationsCurrent,
            TableInvestmentOperationsHistorical,
            TableDividends,
            InvestmentsoperationsCU,
            ChartInvestmentsoperationsEvolution,
            ChartInvestmentsoperationsEvolutionTimeseries,
            InvestmentsChangeSellingPrice,
        },
        props: {
            investment: {
                required: true
            },
        },
        computed:{
            account: function(){
                return this.$store.getters.getObjectByUrl("accounts",this.investment.accounts)
            }
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
                io_mode:null,
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
                                name:this.$t('Change active status'),
                                code: function(this_){
                                    this_.investment.active=!this_.investment.active
                                    axios.put(this_.investment.url, this_.investment,  this_.myheaders())
                                    .then(() => {
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
                                    this_.key=this_.key+1
                                    this_.dialog_evolution_chart=true
                                }
                            },
                            {
                                name:this.$t('Show evolution chart with time series'),
                                icon: "mdi-chart-areaspline",
                                code: function(this_){
                                    this_.key=this_.key+1
                                    this_.dialog_evolution_chart_timeseries=true
                                }
                            },
                            {
                                name:this.$t('Change selling price'),
                                icon: "mdi-pencil",
                                code: function(this_){
                                    this_.key=this_.key+1
                                    this_.dialog_io_sameproduct=true
                                }
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Product orders'),
                        children: [
                            {
                                name:this.$t('View product'),
                                code: function(this_){
                                    this_.product=this_.$store.getters.getObjectByUrl("products",this_.investment.products)
                                    this_.key=this_.key+1
                                    this_.dialog_productview=true
                                },
                                icon: "mdi-magnify",
                            },
                            {
                                name:this.$t('Delete last quote'),
                                code: function(this_){
                                    this_.product=this_.$store.getters.getObjectByUrl("products",this_.investment.products)

                                    axios.post(`${this_.$store.state.apiroot}/api/products/${this_.product.id}/delete_last_quote/`, [], this_.myheaders())
                                    .then(() => {
                                        this_.key=this_.key+1
                                        this_.$emit("cruded") 
                                    }, (error) => {
                                        this_.parseResponseError(error)
                                    });
                                },
                                icon: "mdi-delete",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Investment operation orders'),
                        children: [
                            {
                                name:this.$t('Add an investment operation'),
                                code: function(this_){
                                    this_.io=this_.empty_investment_operation()
                                    this_.io.investments=this_.investment.url
                                    this_.io_mode="C"
                                    this_.key=this_.key+1
                                    this_.dialog_io=true
                                },
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Add an investment operation adjusting currency conversion factor'),
                                code: function(this_){
                                    var selling_price_product_currency=this_.parseNumber(prompt( this_.$t("Please add the operation close price in product currency"), 0 ));
                                    var gains_account_currency=this_.parseNumber(prompt( this_.$t("Please add the final gains in account currency"), 0 ));
                                    var shares=this_.listobjects_sum(this_.list_io_current,"shares")
                                    var average_price_current_account=this_.listobjects_average_ponderated(this_.list_io_current,'price_account', 'shares')
                                    var leverage=this_.ios.product.leverage_real_multiplier
                                    var currency_conversion=(gains_account_currency+shares*average_price_current_account*leverage)/(shares*selling_price_product_currency*leverage)

                                    this_.io=this_.empty_investment_operation()
                                    this_.io.shares=-shares
                                    this_.io.currency_conversion=currency_conversion
                                    this_.io.price=selling_price_product_currency
                                    this_.io.investments=this_.investment.url
                                     
                                    this_.dialog_io=true
                                },
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Sell/Buy all shares to selling price'),
                                code: function(this_){
                                    if (this_.investment.currency!=this_.ios.product.currency){
                                        alert(this_.$t("You can't use this option if investment and product currencies are not the same"))
                                        return
                                    }
                                    var shares=this_.listobjects_sum(this_.list_io_current,"shares")

                                    this_.io=this_.empty_investment_operation()
                                    this_.io.investments=this_.investment.url
                                    this_.io.shares=-shares
                                    this_.io.price=this_.investment.selling_price
                                    this_.io_mode="C"
                                    if (shares>=0){
                                        this_.io.operationstypes=this_.$store.getters.getObjectById("operationstypes",5).url//Sales
                                    } else {
                                        this_.io.operationstypes=this_.$store.getters.getObjectById("operationstypes",4).url//Buy
                                    }
                                     
                                    this_.dialog_io=true
                                },
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Reinvest operation'),
                                code: function(this_){
                                    this_.reinvest_investments=[]
                                    this_.reinvest_investments.push(this_.investment.url)
                                    this_.reinvest_shares=0
                                    this_.reinvest_price=this_.investment.last
                                    this_.key=this_.key+1                        
                                    this_.dialog_reinvest=true
                                },
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Divest operation'),
                                code: function(this_){
                                    this_.divest_investments=[]
                                    this_.divest_investments.push(this_.investment.url)
                                    this_.divest_shares=0
                                    this_.divest_price=this_.investment.last
                                    this_.key=this_.key+1                        
                                    this_.dialog_divest=true
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
                                code: function(this_){
                                    this_.dividend=this_.empty_dividend()
                                    this_.dividend.investments=this_.investment.url    
                                    this_.dividends_cu_mode="C"         
                                    this_.key=this_.key+1                        
                                    this_.dividends_cu_dialog=true
                                },
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                ],
                dialog_evolution_chart:false,
                dialog_evolution_chart_timeseries:false,

                ios:null,

                // Dividend CU
                dividends_cu_dialog:false,
                dividends_cu_mode: null,
                dividend: null,

                // Dividend Produts view
                dialog_productview:false,
                product: null,

                // Investment chart
                dialog_investment_chart:false,

                // IO set selling price same product
                dialog_io_sameproduct:false,

                //dialog_reinvest
                dialog_reinvest: false,
                reinvest_investments:[],
                reinvest_shares:0,
                reinvest_price:0,
                //dialog_divest
                dialog_divest: false,
                divest_investments:[],
                divest_shares:0,
                divest_price:0,
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
            on_DividendsCU_cruded(){
                this.dividends_cu_dialog=false
                this.update_all()
            },
            on_TableDividends_cruded(){
                this.update_all()
            },
            on_InvestmentsoperationsCU_cruded(){
                this.dialog_io=false
                this.update_all()
                this.$emit("cruded") //Translated to InvestmentsList
            },
            on_InvestmentsChangeSellingPrice_cruded(){
                this.dialog_io_sameproduct=false
                this.update_all()
                this.$emit("cruded")
            },
            on_TableInvestmentsOperations_cruded(){//Emited deleting IO
                this.on_InvestmentsoperationsCU_cruded()
            },
            displayvalues(){
                return [
                    {title:this.$t('Selling point'), value: this.selling_point_message},
                    {title:this.$t('Selling expiration'), value: this.selling_expiration_message},
                    {title:this.$t('Active'), value: this.ios.investment.active},
                    {title:this.$t('Currency'), value: this.ios.product.currency},
                    {title:this.$t('Next reinvest amount'), value: this.ios.product.currency},
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
                return axios.get(`${this.$store.state.apiroot}/investmentsoperations/full/?investments=${this.investment.id}`, this.myheaders())
            },
            update_dividends(){
                var headers={...this.myheaders(),params:{investments:[this.investment.id,]}}
                return axios.get(`${this.$store.state.apiroot}/api/dividends/`, headers)
            },
            update_all(){
                this.loading=true
                axios.all([this.update_investmentsoperations(), this.update_dividends()])
                .then(([resIO, resDividends]) => {
                    this.ios=resIO.data[0]
                    this.list_io=resIO.data[0].io
                    this.list_io_current=resIO.data[0].io_current
                    this.list_io_historical=resIO.data[0].io_historical

                    this.leverage_message= this.$t("{0} (Real: {1})").format(
                        this.ios.product.leverage_multiplier,
                        this.ios.product.leverage_real_multiplier
                    )

                    this.selling_point_message=this.currency_string(this.ios.investment.selling_price, this.ios.product.currency)
                    if (this.ios.investment.gains_at_sellingpoint){
                        this.selling_point_message=this.selling_point_message+ this.$t(", to gain {0}").format(
                            this.currency_string(this.ios.investment.gains_at_sellingpoint, this.ios.product.currency)
                    )
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
            this.update_all()
        }
    }
</script>
