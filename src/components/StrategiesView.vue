<template>
    <div data-test="StrategiesView">
        <h1>{{ strategy.name }}
            <MyMenuInline :items="items" />
            <v-btn data-test="StrategiesView_ButtonClose" small style="color:darkgrey" icon="mdi-close" class="elevation-0" @click="$emit('close')"/>
        </h1>
        <DisplayValues v-if="ios" :items="displayvalues()" :key="key" :minimized_items="10"></DisplayValues>

        <v-tabs  bg-color="secondary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
            <v-tab key="current">{{ $t('Current investment operations') }}</v-tab>
            <v-tab key="operations">{{ $t('Investment operations') }}</v-tab>
            <v-tab key="historical">{{ $t('Historical investment operations') }}</v-tab>
            <v-tab key="dividends">{{ $t('Dividends') }}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item key="current">      
                <div>
                    <v-card v-if="!loading">
                        <TableInvestmentOperationsCurrent :items="ios_id.io_current" showtotal output="user" height="400" :key="key" />
                    </v-card>
                </div>
            </v-window-item>
            <v-window-item key="operations">          
                <div>
                    <v-card v-if="!loading">
                        <TableInvestmentOperations :items="ios_id.io" height="400" :key="key" output="user" :showactions="false" />
                    </v-card>
                </div>
            </v-window-item>
            <v-window-item key="historical">     
                <div>            
                    <v-card v-if="!loading">
                        <TableInvestmentOperationsHistorical :items="ios_id.io_historical" height="400" output="user" :key="key" showtotal />
                    </v-card>
                </div>
            </v-window-item>
            <v-window-item key="dividends">     
                <v-card v-if="!loading">
                    <TableDividends :items="dividends_filtered" height="300" :key="key" @cruded="on_TableDividends_cruded" />
                </v-card>
            </v-window-item>
        </v-window> 

    </div>  
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import {empty_strategy_simulation, empty_investments_chart,empty_investments_chart_limit_line} from '../empty_objects.js'
    import MyMenuInline from './MyMenuInline.vue'
    import DisplayValues from './DisplayValues.vue'
    import TableDividends from './TableDividends.vue'
    import TableInvestmentOperations from './TableInvestmentOperations.vue'
    import TableInvestmentOperationsHistorical from './TableInvestmentOperationsHistorical.vue'
    import TableInvestmentOperationsCurrent from './TableInvestmentOperationsCurrent.vue'
    import { localtime ,f} from 'vuetify_rules'
    import { parseResponseError, myheaders, getMapObjectById} from '@/functions.js'
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
                                code: function(){
                                    axios.get(`${this.useStore().apiroot}/products/quotes/ohcl?product=${this.product.url}`, this.myheaders())
                                    .then((response) => {
                                        this.chart_data=this.empty_investments_chart()
                                        this.chart_data.ohcls=response.data
                                        this.chart_data.io_object=this.ios
                                        var ll
                                        if (this.list_io_current.length>0){
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

                ios:null,
            }  
        },
        computed:{
            product: function (){
                if (this.strategy.product!=null){
                    return this.useStore().products.get(this.strategy.product)
                }
                return null
            }
        },
        methods: {
            useStore,
            f,
            localtime,
            parseResponseError,
            myheaders,
            empty_investments_chart,
            empty_investments_chart_limit_line,
            empty_strategy_simulation,
            getMapObjectById,
            on_TableDividends_cruded(){
                this.update_all()
            },
            displayvalues(){
                var r= []
                r.push({title:this.$t('From'), value: this.localtime(this.strategy.strategy.dt_from)})
                r.push({title:this.$t('To'), value: this.localtime(this.strategy.strategy.dt_to)})
                r.push({title:this.$t('Type'), value: this.useStore()["strategiestypes"].get(this.strategy.strategy.type).name})
                r.push({title:this.$t('Investments'), value: this.strategy.investments.length})                
                if (this.strategy.product){//That means it has a product property
                    this.leverage_message= f(this.$t("[0] (Real: [1])"), [this.product.leverage_multiplier, this.product.leverage_real_multiplier ])
                    r.push({title:this.$t('Currency'), value: this.product.currency})
                    r.push({title:this.$t('Product'), value: this.product.name})
                    r.push({title:this.$t('Leverage'), value: this.leverage_message})
                }
                return r
            },
            update_investmentsoperations(){
                return axios.get(`${this.strategy.url}detailed/`, this.myheaders())
            },
            update_dividends(){
                var headers={...this.myheaders(),params:{investments:this.strategy.investments}}
                return axios.get(`${this.useStore().apiroot}/api/dividends/`, headers)
            },
            update_all(){
                this.loading=true
                axios.all([this.update_investmentsoperations(), this.update_dividends()])
                .then(([resIO, resDividends]) => {
                    this.ios=resIO.data
                    this.ios_id=this.ios[this.ios.entries[0]]
                    console.log("IOS_ID",this.ios_id)
                    this.dividends=resDividends.data
                    this.displayvalues()
                    this.loading=false
                    this.key=this.key+1
                });
            }
        },
        mounted(){
            this.update_all()
            console.log(this.strategy.product)
            console.log(this.product)
        }
    }
</script>
