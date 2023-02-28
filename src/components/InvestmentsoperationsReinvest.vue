<template>
    <div>
        <h1>{{ $t("Reinvest dialog") }}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>
        </h1>                
        <v-select class="mr-5" :items="re_or_di_items" v-model="re_or_di" :label="$t('Do you want to reinvest or divest?')"  item-text="name" item-value="id" :rules="RulesSelection(true)" @change="refreshTables()"></v-select>  

        <v-card class="pa-4 mb-3 mt-3"  >
            <v-form ref="form" v-model="form_valid" lazy-validation class="pa-4">
                <v-row>                
                    <AutocompleteProducts class="mr-5" v-model="product" :rules="RulesSelection(true)"  />
                    <v-text-field class="mr-5" v-model="newprice"  :label="$t('Set order price')" :placeholder="$t('Set order price')" :rules="RulesFloatGEZ(10,true, product_decimals)" counter="10"/>
                    <v-text-field v-model.number="newshares"  :label="$t('Set order shares')" :placeholder="$t('Set order shares')" :rules="RulesFloatGEZ(14,true,6)" counter="14"/>
                </v-row>

            <v-row>
                <v-select class="mr-5" :disabled="loading || (plio_id_after==null)" :items="viewoptions" v-model="viewoption" :label="$t('Set a view option')"  item-text="name" item-value="id" :rules="RulesSelection(true)" @change="refreshTables()"></v-select>  
                <v-select class="mr-5" :items="gains_methods" v-model="gains_method" :label="$t('Set a method to calculate gains')"  item-text="name" item-value="id" :rules="RulesSelection(true)"></v-select>  


                <v-text-field class="mr-5" autoindex="1" :disabled="loading" v-model.number="gains_value"  :label="$t('Gains method value')" :placeholder="$t('Gains method value')" :rules="RulesFloat(8,true,6)" counter="8"/>

                <v-btn class="mr-5" color="primary" @click="make_all_axios_after()" :disabled="!form_valid">{{ $t("Simulate") }}</v-btn>
                <v-btn v-if="this.newinvestments.length==1" color="error" @click="add_order()" :disabled="!form_valid">{{ $t("Add order") }}</v-btn>                 
            </v-row>
            </v-form>  

        </v-card>
        <v-tabs v-if="plio_id_current" background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
            <v-tab key="current">{{ $t('Current investment operations') }}</v-tab>
            <v-tab key="operations">{{ $t('Investment operations') }}</v-tab>
            <v-tab key="historical">{{ $t('Historical investment operations') }}</v-tab>
            <v-tab key="chart">{{ $t('Investment chart') }}</v-tab>
            <v-tabs-slider color="yellow"></v-tabs-slider>
        </v-tabs>
        <v-tabs-items v-if="plio_id_current" v-model="tab">
            <v-tab-item key="current">      
                <div>
                    <v-card>
                        <TableInvestmentOperationsCurrent showtotal :items="plio_id_current.io_current" output="investment" height="400" :key="key" :loading="loading" />
                    </v-card>
                </div>
            </v-tab-item>
            <v-tab-item key="operations">          
                <div>
                    <v-card>
                        <TableInvestmentOperations :items="plio_id_current.io" height="400" :key="key" output="investment" :loading="loading" />
                    </v-card>
                </div>
            </v-tab-item>
            <v-tab-item key="historical">     
                <div>            
                    <v-card>
                        <TableInvestmentOperationsHistorical :items="plio_id_current.io_historical" height="400" output="investment" :key="key" :loading="loading" showtotal />
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

        <!-- Order CU dialog -->
        <v-dialog v-model="dialog_order_cu" max-width="550">
            <v-card class="pa-4">
                <OrdersCU :order="order" mode="C" :key="key" @cruded="on_OrdersCU_cruded()"></OrdersCU>
            </v-card>
        </v-dialog>
    </div>
</template>  
<script>     
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import {empty_order, empty_investments_operations_simulation,empty_investment_operation,empty_investments_chart,empty_investments_chart_limit_line} from '../empty_objects.js'
    import ChartInvestments from './ChartInvestments.vue'
    import OrdersCU from './OrdersCU.vue'
    import AutocompleteProducts from './AutocompleteProducts.vue'
    import TableInvestmentOperations from './TableInvestmentOperations.vue'
    import TableInvestmentOperationsHistorical from './TableInvestmentOperationsHistorical.vue'
    import TableInvestmentOperationsCurrent from './TableInvestmentOperationsCurrent.vue'

    export default {
        components:{
            ChartInvestments,
            MyMenuInline,
            OrdersCU,
            TableInvestmentOperations,
            TableInvestmentOperationsHistorical,
            TableInvestmentOperationsCurrent,
            AutocompleteProducts,
        },
        props: {
            plio_id: { //object plinvestmentsoperations id can be investment or virtual investment (Merged)
                       //it uses only current_operations to make simulation 
                required: true,
            },
            shares: {
                required: false,
                default: 0,
            },
            price: {
                required: false,
                default: 0,
            }
        },
        data () {
            return {
                items: [
                    {
                        subheader:this.$t('Options to set shares'),
                        children: [
                            {
                                name:this.$t('Integer shares from amount to reinvest'),
                                code: function(this_){
                                    var amount=this_.parseNumber(prompt( this_.$t("Please set the amount to invest in this order"), 10000 ));
                                    this_.newshares=parseInt(amount/this_.newprice)
                                },
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Decimal shares from amount to reinvest'),
                                code: function(this_){
                                    var amount=this_.parseNumber(prompt( this_.$t("Please set the amount to invest in this order"), 10000 ));
                                    this_.newshares=amount/this_.newprice
                                },
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Options to select investments'),
                        children: [
                            {
                                name:this.$t('Add all active investments of the same product'),
                                code: function(this_){
                                    this_.$store.state.investments.forEach(o=>{
                                        if (this_.product==o.products && o.active && !this_.newinvestments.includes(o.url)){
                                            this_.newinvestments.push(o.url)
                                        }
                                    })
                                },
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                ],

                //View options
                re_or_di_items:[
                    {id:1, name: this.$t('Reinvest')},
                    {id:2, name: this.$t('Divest')},
                ],      
                re_or_di:1,
                viewoptions:[
                    {id:1, name:'Before simulation'},
                    {id:2, name:'After simulation'},
                ],                
                gains_methods:[
                    {id:1, name:'Gain a porcentage from invested amount'},
                    {id:2, name:'Gain a fixed amount'},
                ],
                viewoption:1,
                gains_method:1,
                tab:0,
                key:0,
                gains_value:10,

                //Order CU
                dialog_order_cu:false,
                order: null,

                //Form
                product: null,
                newinvestments: [],
                newshares:0,                
                newprice:0,


                //Chart
                chart_data:null,

                //simulation
                ohcls:null,
                plio_id_after:null,
                loading:false,
                form_valid:false,
            }
        },
        computed:{
            product_decimals: function(){
                return this.$store.getters.getObjectPropertyByUrl("products",this.product,"decimals")
            },
            plio_id_current: function(){
                if (this.viewoption==1){
                    return this.plio_id
                } else {
                    return this.plio_id_after
                }
            }
        },
        methods: {
            empty_order,
            empty_investments_operations_simulation,
            empty_investment_operation,
            empty_investments_chart,
            empty_investments_chart_limit_line,
            add_order(){
                this.order=this.empty_order()
                this.order.price=this.newprice
                this.order.shares=this.newshares
                this.key=this.key+1
                this.dialog_order_cu=true

            },
            on_OrdersCU_cruded(){
                this.dialog_order_cu=false
            },
            refreshProductQuotes(){
                return axios.get(`${this.$store.state.apiroot}/products/quotes/ohcl?product=${this.product.url}`, this.myheaders())
            },
            simulateOrderAfter(){
                var simulation=this.empty_investments_operations_simulation()
                simulation.plio_id=this.plio_id
                var operation=this.empty_investment_operation()
                operation.shares=this.newshares
                operation.price=this.newprice
                operation.comment="Simulation 1"
                operation.investments=this.plio_id.investments_id
                simulation.operations.push(operation)
                return axios.post(`${this.$store.state.apiroot}/investmentsoperations/full/simulation/`, simulation, this.myheaders())
                
            },
            make_all_axios_before(){
                this.loading=true
                axios.all([this.refreshProductQuotes(),])
                .then(([resQuotes,]) => {
                    this.ohcls=resQuotes.data
                    this.loading=false
                    this.refreshTables()
                });
            },
            make_all_axios_after(){         
                if (this.newshares<=0){
                    alert(this.$t("To reinvest shares must be positive"))
                    return
                }
                this.viewoption=2
                this.loading=true
                axios.all([this.simulateOrderAfter(),])
                .then(([resAfter,]) => {
                    this.plio_id_after=resAfter.data
                    this.loading=false
                    this.refreshTables()
                });
            },
            refreshTables(){
                var ll
                this.chart_data=this.empty_investments_chart()
                this.chart_data.ohcls=this.ohcls
                if (this.plio_id_current.io_current.length>0){                  
                    //Calculate shares before
                    var shares_before=0
                    this.plio_id_current.io_current.forEach(o=>{
                        shares_before=shares_before + o.shares
                    }) 
                    ll=this.empty_investments_chart_limit_line()
                    ll.buy=this.plio_id_current.total_io_current.average_price_investment
                    ll.average=this.plio_id_current.total_io_current.average_price_investment
                    if (this.gains_method==1){
                        ll.sell=ll.average*(1+this.gains_value/100)
                    } else {//P_f={P_o Ac Ap +G } over {Ac Ap } Fixed amount
                        ll.sell=(ll.average*shares_before*this.product.leverage_real_multiplier+this.gains_value)/(shares_before*this.product.leverage_real_multiplier)
                    }
                    this.chart_data.limitlines.push(ll)

                }


                if(this.viewoption==1){ //Before
                    this.chart_data.io_object=this.plio_id_current
                } else if(this.viewoption==2){//After
                    //Calculate shares after
                    var shares_after=0
                    this.plio_id_after.io_current.forEach(o=>{
                        shares_after=shares_after + o.shares
                    }) 

                    this.list_io_current=this.plio_id_after.io_current
                    this.list_io=this.plio_id_after.io
                    this.list_io_historical=this.plio_id_after.io_historical
                    this.chart_data.io_object=this.plio_id_after
                    var ll2=this.empty_investments_chart_limit_line()
                    ll2.buy=this.newprice
                    ll2.average=this.plio_id_after.investment.average_price_investment
                    if (this.gains_method==1){
                        ll2.sell=ll2.average*(1+this.gains_value/100)
                    } else {//P_f={P_o Ac Ap +G } over {Ac Ap } Fixed amount
                        ll2.sell=(ll2.average*shares_after*this.plio_id_after.product.leverage_real_multiplier+this.gains_value)/(shares_after*this.plio_id_after.product.leverage_real_multiplier)
                    }
                    this.chart_data.limitlines.push(ll2)
                }
                this.key=this.key+1
            },
        },
        created(){
            //This components
            this.newshares=this.shares
            this.newprice=this.price
            this.product=this.$store.getters.getObjectById("products", this.plio_id_current.data.products_id)
            console.log(this.plio_id)
            this.make_all_axios_before()
        }
        
    }
</script>

