<template>
    <div>
        <h1>{{ ios_id.data.name }}
            <MyMenuInline :items="items"  :context="this"></MyMenuInline>
        </h1>
        <DisplayValues v-if="product" :items="displayvalues()" :key="key" :minimized_items="10"></DisplayValues>

        <v-tabs  bg-color="secondary" v-model="tab"  show-arrows grow>
            <v-tab key="current">{{ $t('Current investment operations') }}</v-tab>
            <v-tab key="operations">{{ $t('Investment operations') }}</v-tab>
            <v-tab key="historical">{{ $t('Historical investment operations') }}</v-tab>
            <v-tab key="dividends">{{ $t('Dividends') }}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item key="current">      
                <div>
                    <v-tabs vertical  v-model="tabcurrent" bg-color="secondary">
                        <v-tab key="investment">{{ $t('Investment currency') }}</v-tab>
                        <v-tab key="account">{{ $t('Account currency') }}</v-tab>
                    </v-tabs>
                    <v-window>
                        <v-window-item key="investment">     
                            <v-card>
                                <TableInvestmentOperationsCurrent :items="ios_id.io_current" output="investment" height="400" :key="key" showtotal/>
                            </v-card>
                        </v-window-item>
                        <v-window-item key="account">
                            <v-card v-if="!loading">
                                <TableInvestmentOperationsCurrent :items="ios_id.io_current" output="account" height="400" :key="key" showtotal />
                            </v-card>
                        </v-window-item>
                    </v-window>
                </div>
            </v-window-item>
            <v-window-item key="operations">          
                <div>
                    <v-checkbox v-model="chkShowAllIO" :label="chkShowAllIO_label()" @click="on_chkShowAllIO_click()"></v-checkbox>
                    <v-tabs vertical  v-model="tabcurrent" bg-color="secondary">
                        <v-tab key="investment">{{ $t('Investment currency') }}</v-tab>
                        <v-tab key="account">{{ $t('Account currency') }}</v-tab>
                    </v-tabs>
                    <v-window>
                        <v-window-item key="investment">     
                            <v-card>
                                <TableInvestmentOperations :items="io_filtered" height="400" :key="key" output="investment" :showactions="false" />
                            </v-card>
                        </v-window-item>
                        <v-window-item key="account">
                            <v-card v-if="!loading">
                                <TableInvestmentOperations :items="io_filtered" height="400" :key="key" output="account" :showactions="false" />
                            </v-card>
                        </v-window-item>
                    </v-window>
                </div>
            </v-window-item>
            <v-window-item key="historical">     
                <div>            
                    <v-tabs vertical  v-model="tabcurrent" bg-color="secondary">
                        <v-tab key="investmenth">{{ $t('Investment currency') }}</v-tab>
                        <v-tab key="accounth">{{ $t('Account currency') }}</v-tab>
                    </v-tabs>
                    <v-window>
                        <v-window-item key="investmenth">     
                            <v-card  v-if="!loading">
                                <TableInvestmentOperationsHistorical :items="ios_id.io_historical" height="400" output="investment" :key="key" showtotal />
                            </v-card>
                        </v-window-item>
                        <v-window-item key="accounth">
                            <v-card v-if="!loading">
                                <TableInvestmentOperationsHistorical :items="ios_id.io_historical" height="400" output="account" :key="key" showtotal />
                            </v-card>
                        </v-window-item>
                    </v-window>
                </div>
            </v-window-item>
            <v-window-item key="dividends">     
                <v-card v-if="!loading">
                    <v-checkbox v-model="chkShowAllDividends" :label="chkShowAllDividends_label()" @click="on_chkDividends()"></v-checkbox>
                    <TableDividends :items="dividends_filtered" showinvestment height="300" :key="key" @cruded="on_TableDividends_cruded()" />
                </v-card>
            </v-window-item>
        </v-window> 

    </div>  
</template>
<script>
    import axios from 'axios'
    import {empty_investment_operation, empty_dividend,empty_investments_chart,empty_investments_chart_limit_line} from '../empty_objects.js'
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
            ios_id: { // Ios_id object. ios["79329"]
                required: true,
                type: Object,
            },
        },
        data () {
            return {
                tab:0,
                tabcurrent:0,
                key:0,
                dialog_io:false,
                io:null,
                loading:true,
                dividends: [],
                dividends_filtered: [],
                io_filtered:[],
                selling_expiration_message:"",
                selling_point_message:"",
                chkShowAllDividends:true,
                chkShowAllIO:true,
                leverage_message:"",
                chart_data: null,
                product:null,
                items: [
                    {
                        subheader:this.$t('Investment orders'),
                        children: [
                            {
                                name:this.$t('Investment chart'),
                                icon: "mdi-chart-areaspline",
                                code: function(){
                                    axios.get(`${this.store().apiroot}/products/quotes/ohcl?product=${this.product.url}`, this.myheaders())
                                    .then((response) => {
                                        this.chart_data=this.empty_investments_chart()
                                        this.chart_data.ohcls=response.data
                                        this.chart_data.io_object=this.ios_id
                                        var ll
                                        if (this.ios_id.io_current.length>0){
                                            ll=this.empty_investments_chart_limit_line()
                                            ll.buy=this.ios.investment.average_price_investment
                                            ll.average=this.ios.investment.average_price_investment
                                            ll.sell=this.investment.selling_price
                                            this.chart_data.limitlines.push(ll)
                                        }
                                        this.ohcl=response.data 
                                        this.key=this.key+1
                                        this.dialog_investment_chart=true
                                    }, (error) => {
                                        this.parseResponseError(error)
                                    });
                                }.bind(this)
                            },
                            {
                                name:this.$t('Show evolution chart'),
                                icon: "mdi-chart-areaspline",
                                code: function(){
                                    this.dialog_evolution_chart=true
                                }.bind(this)
                            },
                            {
                                name:this.$t('Show evolution chart with time series'),
                                icon: "mdi-chart-areaspline",
                                code: function(){
                                    this.dialog_evolution_chart_timeseries=true
                                }.bind(this)
                            },
                        ]
                    },
                ],
            }  
        },
        watch: {
            chkShowAllIO(){
                this.on_chkShowAllIO_click()
            },
            chkShowAllDividends(){
                this.on_chkDividends()
            }
        },
        methods: {
            empty_investments_chart,
            empty_investments_chart_limit_line,
            empty_dividend,
            empty_investment_operation,
            on_TableDividends_cruded(){
                this.update_all()
            },
            displayvalues(){
                var r= []       
                this.leverage_message= this.$t("[0] (Real: [1])").format(
                    this.store().leverages.get(this.product.leverages).multiplier,
                    this.product.real_leveraged_multiplier
                    )
                r.push({title:this.$t('Currency'), value: this.product.currency})
                r.push({title:this.$t('Product'), value: this.product.name})
                r.push({title:this.$t('Leverage'), value: this.leverage_message})
                return r
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
            on_chkShowAllIO_click(){
                if (this.chkShowAllIO==true){
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
            update_dividends(){
                //Convert this.investments to an array of ids
                var headers={...this.myheaders(),params:{investments:this.ios_id.data.investments_id}}
                return axios.get(`${this.store().apiroot}/api/dividends/`, headers)
            },
            update_all(){
                this.loading=true
                axios.all([ this.update_dividends()])
                .then(([resDividends]) => {
                    console.log("dividendso",resDividends.data)
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
            console.log(this.ios_id)
            this.product=this.store().products.get(this.hyperlinked_url("products",this.ios_id.data.products_id))
            this.update_all()   
        }
    }
</script>
