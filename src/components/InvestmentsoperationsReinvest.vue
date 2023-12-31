<template>
    <div>
        <h1>{{ title }}
            <MyMenuInline :items="items"/>
        </h1>                
        <v-select class="mr-5" :items="re_or_di_items" v-model="re_or_di" :label="$t('Do you want to reinvest or divest?')"  item-title="name" item-value="id" :rules="RulesSelection(true)" @change="refreshTables"></v-select>  

        <v-card class="pa-4 mb-3 mt-3"  >
            <v-form ref="form" v-model="form_valid" class="pa-4">
                <v-row>                
                    <AutocompleteProducts class="mr-5" v-model="product" :rules="RulesSelection(true)"  />
                    <v-text-field class="mr-5" v-model.number="newprice"  :label="$t('Set order price')" :placeholder="$t('Set order price')" :rules="RulesFloatGEZ(10,true, product.decimals)" counter="10"/>
                    <v-text-field v-model.number="newshares"  :label="$t('Set order shares')" :placeholder="$t('Set order shares')" :rules="RulesFloat(14,true,6)" counter="14"/>
                </v-row>

            <v-row>
                <v-select class="mr-5" :disabled="loading || (ios_id_after==null)" :items="viewoptions" v-model="viewoption" :label="$t('Set a view option')"  item-title="name" item-value="id" :rules="RulesSelection(true)" @change="refreshTables"></v-select>  
                <v-select class="mr-5" :items="gains_methods" v-model="gains_method" :label="$t('Set a method to calculate gains')"  item-title="name" item-value="id" :rules="RulesSelection(true)"></v-select>  


                <v-text-field class="mr-5" autoindex="1" :disabled="loading" v-model.number="gains_value"  :label="$t('Gains method value')" :placeholder="$t('Gains method value')" :rules="RulesFloat(8,true,6)" counter="8"/>

                <v-btn class="mr-5" color="primary" @click="make_all_axios_after">{{ $t("Simulate") }}</v-btn>
                <v-btn v-if="this.newinvestments.length==1" color="error" @click="add_order">{{ $t("Add order") }}</v-btn>                 
            </v-row>
            </v-form>  

        </v-card>
        <v-tabs v-if="ios_id_current" bg-color="secondary" v-model="tab" grow show-arrows>
            <v-tab key="current">{{ $t('Current investment operations') }}</v-tab>
            <v-tab key="operations">{{ $t('Investment operations') }}</v-tab>
            <v-tab key="historical">{{ $t('Historical investment operations') }}</v-tab>
            <v-tab key="chart">{{ $t('Investment chart') }}</v-tab>
        </v-tabs>
        <v-window v-if="ios_id_current" v-model="tab">
            <v-window-item key="current">      
                <div>
                    <v-card>
                        <TableInvestmentOperationsCurrent showtotal :items="ios_id_current.io_current" output="investment" height="400" :key="key" :loading="loading" />
                    </v-card>
                </div>
            </v-window-item>
            <v-window-item key="operations">          
                <div>
                    <v-card>
                        <TableInvestmentOperations :items="ios_id_current.io" height="400" :key="key" output="investment" :loading="loading" />
                    </v-card>
                </div>
            </v-window-item>
            <v-window-item key="historical">     
                <div>            
                    <v-card>
                        <TableInvestmentOperationsHistorical :items="ios_id_current.io_historical" height="400" output="investment" :key="key" :loading="loading" showtotal />
                    </v-card>
                </div>
            </v-window-item>
            <v-window-item key="chart">     
                <div> 
                    <v-card>
                        <ChartInvestments :data="chart_data" height="400" :key="key" :loading="loading"></ChartInvestments>
                    </v-card>
                </div>
            </v-window-item>
        </v-window> 

        <!-- Order CU dialog -->
        <v-dialog v-model="dialog_order_cu" max-width="550">
            <v-card class="pa-4">
                <OrdersCU :order="order" mode="C" :key="key" @cruded="on_OrdersCU_cruded"></OrdersCU>
            </v-card>
        </v-dialog>
    </div>
</template>  
<script>     
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyMenuInline from './MyMenuInline.vue'
    import {empty_order, empty_ios,empty_ios_simulation_operation,empty_investments_chart,empty_investments_chart_limit_line} from '../empty_objects.js'
    import { my_round, RulesSelection,RulesFloat,RulesFloatGEZ,parseNumber,f } from 'vuetify_rules'
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
            ios_id: { //object plinvestmentsoperations id can be investment or virtual investment (Merged)
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
                        subheader:this.$t('Options to reinvest'),
                        children: [
                            {
                                name:this.$t('Integer shares from amount to reinvest'),
                                code: function(){
                                    var amount=this.parseNumber(prompt( this.$t("Please set the amount to invest in this order"), 10000 ));
                                    this.newshares=parseInt(amount/this.newprice)
                                }.bind(this),
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Decimal shares from amount to reinvest'),
                                code: function(){
                                    var amount=this.parseNumber(prompt( this.$t("Please set the amount to invest in this order"), 10000 ));
                                    this.newshares=amount/this.newprice
                                }.bind(this),
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Options to divest'),
                        children: [
                            {
                                name:this.$t('Calculate shares from losses amount'),
                                code: function(){
                                    var losses=this.parseNumber(prompt( this.$t("Please set losses to consolidate (Positive amount)"), 500 ));

                                    var resultado=0
                                    for (var i = 0; i < this.ios_before.io_current.length; i++) {
                                        var o=this.ios_before.io_current[i]
                                        var gains=o.gains_gross_investment
                                        if (losses+gains==0){
                                            resultado=resultado+o.shares
                                            break
                                        } else if (losses+gains>0){
                                            resultado=resultado+o.shares
                                            losses=losses+gains
                                        } else if (losses+gains<0){
                                            resultado=resultado+Math.abs(parseInt(losses*o.shares/gains))
                                            break
                                        }
                                    }


                                    this.newshares=-resultado
                                }.bind(this),
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Float shares to consolidate losses'),
                                code: function(){
                                    var losses=this.parseNumber(prompt( this.$t("Please set losses to consolidate (Positive amount)"), 500 ));

                                    var resultado=0
                                    for (var i = 0; i < this.ios_before.io_current.length; i++) {
                                        var o=this.ios_before.io_current[i]
                                        var gains=o.gains_gross_investment
                                        if (losses+gains==0){
                                            resultado=resultado+o.shares
                                            break
                                        } else if (losses+gains>0){
                                            resultado=resultado+o.shares
                                            losses=losses+gains
                                        } else if (losses+gains<0){
                                            resultado=resultado+Math.abs(losses*o.shares/gains)
                                            break
                                        }
                                    }


                                    this.newshares=-this.my_round(resultado,6)
                                }.bind(this),
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Options to select investments'),
                        children: [
                            {
                                name:this.$t('Add all active investments of the same product'),
                                code: function(){
                                    this.useStore().investments.forEach(o=>{
                                        if (this.product==o.products && o.active && !this.newinvestments.includes(o.url)){
                                            this.newinvestments.push(o.url)
                                        }
                                    })
                                }.bind(this),
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                ],

                title:"",
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
                ios_id_after:null,
                loading:false,
                form_valid:false,
            }
        },
        computed:{
            ios_id_current: function(){
                if (this.viewoption==1){
                    return this.ios_id
                } else {
                    return this.ios_id_after
                }
            },
        },
        methods: {
            useStore,
            RulesFloat,
            RulesFloatGEZ,
            RulesSelection,
            parseNumber,
            empty_order,
            empty_ios,
            empty_ios_simulation_operation,
            empty_investments_chart,
            empty_investments_chart_limit_line,
            my_round,
            f,
            set_title(){
                if (this.re_or_di==1){
                    this.title= this.$t("Reinvest dialog")
                } else {
                    this.title=this.$t("Divest dialog")
                }
            },
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
                return axios.get(`${this.useStore().apiroot}/products/quotes/ohcl?product=${this.product.url}`, this.myheaders())
            },
            simulateOrderAfter(){
                var simulation=this.empty_ios()
                simulation.investments.push(parseInt(this.ios_id.data.investments_id))
                simulation.currency=this.useStore().profile.currency

                var operation=this.empty_ios_simulation_operation()
                operation.shares=this.newshares
                operation.price=this.newprice
                operation.comment="Simulation 1"
                operation.investments_id=parseInt(this.ios_id.data.investments_id)
                simulation.simulation.push(operation)
                return axios.post(`${this.useStore().apiroot}/ios/`, simulation, this.myheaders())
                
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
                
                //Calculate shares before
                var shares_before=0
                this.ios_id.io_current.forEach(o=>{
                    shares_before=shares_before + o.shares
                }) 
       
                if (this.newshares<=0 && this.re_or_di==1){
                    alert(this.$t("To reinvest shares must be positive"))
                    return
                }
                if (this.newshares>=0 && this.re_or_di==2){
                    alert(this.$t("To divest shares must be negative"))
                    return
                }

                if (Math.abs(this.newshares)>=shares_before && this.re_or_di==2){
                    alert(f(this.$t("You're divesting the whole investment shares ([0])"), [Math.abs(this.newshares)]))
                    return
                }
                this.viewoption=2
                this.loading=true
                axios.all([this.simulateOrderAfter(),])
                .then(([resAfter,]) => {
                    this.ios_id_after=resAfter.data[this.ios_id.data.investments_id]
                    this.loading=false
                    this.refreshTables()
                });
            },
            refreshTables(){
                this.set_title()
                var ll
                this.chart_data=this.empty_investments_chart()
                this.chart_data.ios_id=this.ios_id_current
                this.chart_data.ohcls=this.ohcls
                if (this.ios_id.io_current.length>0){                  
                    //Calculate shares before
                    var shares_before=0
                    this.ios_id.io_current.forEach(o=>{
                        shares_before=shares_before + o.shares
                    }) 
                    ll=this.empty_investments_chart_limit_line()
                    ll.buy=this.ios_id.total_io_current.average_price_investment
                    ll.average=this.ios_id.total_io_current.average_price_investment
                    if (this.gains_method==1){
                        ll.sell=ll.average*(1+this.gains_value/100)
                    } else {//P_f={P_o Ac Ap +G } over {Ac Ap } Fixed amount
                        ll.sell=(ll.average*shares_before*this.product.real_leveraged_multiplier+this.gains_value)/(shares_before*this.product.real_leveraged_multiplier)
                    }
                    this.chart_data.limitlines.push(ll)

                }


                if(this.viewoption==2){//After
                    //Calculate shares after
                    var shares_after=0
                    this.ios_id_current.io_current.forEach(o=>{
                        shares_after=shares_after + o.shares
                    }) 
                    var ll2=this.empty_investments_chart_limit_line()
                    ll2.buy=this.newprice
                    ll2.average=this.ios_id_current.total_io_current.average_price_investment
                    if (this.gains_method==1){
                        ll2.sell=ll2.average*(1+this.gains_value/100)
                    } else {//P_f={P_o Ac Ap +G } over {Ac Ap } Fixed amount
                        ll2.sell=(ll2.average*shares_after*this.product.real_leveraged_multiplier+this.gains_value)/(shares_after*this.product.real_leveraged_multiplier)
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
            this.product=this.getMapObjectById("products", this.ios_id_current.data.products_id)
            this.make_all_axios_before()
        }
        
    }
</script>

