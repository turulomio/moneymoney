<template>
    <div>
        <h1>{{ merged_name }}
            <MyMenuInline :items="items"  :context="this"></MyMenuInline>
        </h1>
        <DisplayValues v-if="ios" :items="displayvalues()" :key="key" :minimized_items="10"></DisplayValues>

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
                                    <v-card v-if="!loading">
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
                            <v-card v-if="!loading">
                                <TableInvestmentOperations :items="io_filtered" currency_account="EUR" currency_investment="EUR" currency_user="EUR" height="400" :key="key" output="investment" :showactions="false" ></TableInvestmentOperations>
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="account">
                                <v-card v-if="!loading">
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
                            <v-card  v-if="!loading">
                                <TableInvestmentOperationsHistorical :items="list_io_historical" height="400" output="investment" :key="key"></TableInvestmentOperationsHistorical>
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="accounth">
                                <v-card v-if="!loading">
                                    <TableInvestmentOperationsHistorical :items="list_io_historical" height="400" output="account" :key="key"></TableInvestmentOperationsHistorical>
                                </v-card>
                            </v-tab-item>
                    </v-tabs>
                </div>
            </v-tab-item>
            <v-tab-item key="dividends">     
                <v-card v-if="!loading">
                    <v-checkbox v-model="showAllDividends" :label="setChkDividendsLabel()" @click="on_chkDividends()"></v-checkbox>
                    <TableDividends :items="dividends_filtered" currency_account="EUR"  height="300" output="user" :key="key" @cruded="on_TableDividends_cruded()"></TableDividends>
                </v-card>
            </v-tab-item>
        </v-tabs-items> 

    </div>  
</template>
<script>
    import axios from 'axios'
    import {empty_investment_operation,empty_investments_operations_simulation, empty_dividend,empty_investments_chart,empty_investments_chart_limit_line} from '../empty_objects.js'
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
        },
        props: {
            investments: { //Array. Remember all investments must be of the same product
                required: true,
                type: Array,
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
                merged_name:"",
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
            empty_investments_operations_simulation,
            on_TableDividends_cruded(){
                this.update_all()
            },
            displayvalues(){
                var r= []       
                this.leverage_message= this.$t("{0} (Real: {1})").format(
                    this.$store.getters.getObjectPropertyByUrl("leverages",this.product.leverages,"multiplier"),
                    this.product.real_leveraged_multiplier
                    )
                r.push({title:this.$t('Currency'), value: this.product.currency})
                r.push({title:this.$t('Product'), value: this.product.name})
                r.push({title:this.$t('Leverage'), value: this.leverage_message})
                return r
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
                var simulation=this.empty_investments_operations_simulation()
                simulation.investments=this.investments
                simulation.local_currency=this.product.currency
                return axios.post(`${this.$store.state.apiroot}/investmentsoperations/full/simulation/`, simulation, this.myheaders())
            },
            update_dividends(){
                //Convert this.investments to an array of ids
                var investments_ids=[]
                this.investments.forEach(o => {
                    investments_ids.push(this.$store.getters.getObjectPropertyByUrl("investments", o,"id"))
                });



                var headers={...this.myheaders(),params:{investments:investments_ids}}
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
            console.log(this.investments)
            if (this.investments.length>0){
                var investment_0=this.$store.getters.getObjectByUrl("investments", this.investments[0])
                this.product=this.$store.getters.getObjectByUrl("products", investment_0.products, "name")
                console.log(this.product)
                this.merged_name=this.$t("Merged investments of {0}").format(this.product.fullname)
            }
            this.update_all()
        }
    }
</script>
