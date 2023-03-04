<template>
    <div>
        <h1>{{ strategy.name }}
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
                    <v-card v-if="!loading">
                        <TableInvestmentOperationsCurrent :items="plio_id.io_current" showinvestment showtotal output="user" height="400" :key="key" />
                    </v-card>
                </div>
            </v-tab-item>
            <v-tab-item key="operations">          
                <div>
                    <v-card v-if="!loading">
                        <TableInvestmentOperations showinvestment :items="plio_id.io" height="400" :key="key" output="user" :showactions="false" />
                    </v-card>
                </div>
            </v-tab-item>
            <v-tab-item key="historical">     
                <div>            
                    <v-card v-if="!loading">
                        <TableInvestmentOperationsHistorical :items="plio_id.io_historical" height="400" output="user" :key="key" showinvestment showtotal />
                    </v-card>
                </div>
            </v-tab-item>
            <v-tab-item key="dividends">     
                <v-card v-if="!loading">
                    <TableDividends :items="dividends_filtered" height="300" showinvestment :key="key" @cruded="on_TableDividends_cruded" />
                </v-card>
            </v-tab-item>
        </v-tabs-items> 

    </div>  
</template>
<script>
    import axios from 'axios'
    import {empty_strategy_simulation, empty_investments_chart,empty_investments_chart_limit_line} from '../empty_objects.js'
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
            strategy: { //Object
                required: true
            },
        },
        data () {
            return {
                tab:0,
                key:0,
                dialog_io:false,
                io:null,
                loading:true,
                dividends: [],
                dividends_filtered: [],
                io_filtered:[],
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
                                    axios.get(`${this_.$store.state.apiroot}/products/quotes/ohcl?product=${this_.product.url}`, this_.myheaders())
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
            }  
        },
        computed:{
            product: function (){
                if (this.strategy.additional1!=null){
                    return this.$store.getters.getObjectById("products", this.strategy.additional1)
                }
                return null
            }
        },
        methods: {
            empty_investments_chart,
            empty_investments_chart_limit_line,
            empty_strategy_simulation,
            on_TableDividends_cruded(){
                this.update_all()
            },
            displayvalues(){
                var r= []

                r.push({title:this.$t('From'), value: this.localtime(this.strategy.dt_from)})
                r.push({title:this.$t('To'), value: this.localtime(this.strategy.dt_to)})
                r.push({title:this.$t('Type'), value: this.$store.getters.getObjectPropertyById("strategiestypes", this.strategy.type, "name")})
                r.push({title:this.$t('Investments'), value: this.strategy.investments.length})                
                if (this.strategy.additional1){//That means it has a product property
                    this.leverage_message= this.$t("{0} (Real: {1})").format(this.product.leverage_multiplier, this.product.leverage_real_multiplier )
                    r.push({title:this.$t('Currency'), value: this.product.currency})
                    r.push({title:this.$t('Product'), value: this.product.name})
                    r.push({title:this.$t('Leverage'), value: this.leverage_message})
                }
                return r
            },
            update_investmentsoperations(){
                return axios.get(`${this.strategy.url}plio_id/`, this.myheaders())
            },
            update_dividends(){
                var headers={...this.myheaders(),params:{investments:this.strategy.investments}}
                return axios.get(`${this.$store.state.apiroot}/api/dividends/`, headers)
            },
            update_all(){
                this.loading=true
                axios.all([this.update_investmentsoperations(), this.update_dividends()])
                .then(([resIO, resDividends]) => {
                    this.plio_id=resIO.data
                    this.dividends=resDividends.data
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
