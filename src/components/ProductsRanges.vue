<template>
    <div data-test="ProductsRanges">
        <h1> {{ $t('Product ranges') }}</h1>
        <v-card class="ma-4 pa-4">   
            
            <v-form ref="form" v-model="form_valid">             
                <v-row class="d-flex pl-5 pr-5 mx-auto">
                <AutocompleteProducts data-test="ProductsRanges_Product" class="mr-5" v-model="newpr.product" :rules="RulesSelection(true)"  />
                <v-autocomplete data-test="ProductsRanges_Investments" class="mr-5" :items="this.getInvestmentsByProduct(newpr.product)" v-model="newpr.investments" :label="$t('Select investments to include')" item-title="fullname" item-value="url" multiple :rules="RulesSelection(true)" chips></v-autocomplete>

                </v-row>
                <v-row class="pl-5 pr-5">                
                <v-select data-test="ProductsRanges_RecomendationMethod" class="mr-5" :items="getArrayFromMap(useStore().recomendation_methods)" v-model="newpr.recomendation_methods" :label="$t('Set recomendation method')"  item-title="name" item-value="id" :rules="RulesSelection(true)"></v-select>  

                <v-text-field data-test="ProductsRanges_PercentageBetweenRanges" class="mr-5" v-model.number="newpr.percentage_between_ranges"  :label="$t('Set percentage between ranges')" :placeholder="$t('Set percentage between ranges')" :rules="RulesFloat(10,true,6)" counter="10"/>
                <v-text-field data-test="ProductsRanges_PercentageGains" class="mr-5" v-model.number="newpr.percentage_gains"  :label="$t('Set percentage gains')" :placeholder="$t('Set percentage gains')" :rules="RulesFloat(10,true,6)" counter="10"/>
                <v-text-field data-test="ProductsRanges_AmountToInvest" class="mr-5" v-model.number="newpr.amount_to_invest"  :label="$t('Set the amount to invest')" :placeholder="$t('Set the amount to invest')" :rules="RulesFloat(10,true,6)" counter="10"/>

                <v-text-field data-test="ProductsRanges_AdditionalRanges" class="mr-5" v-model.number="newpr.additional_ranges"  :label="$t('Additional ranges to show')" :placeholder="$t('Additional ranges to show')" :rules="RulesInteger(2,true)" counter="2"/>
                <v-checkbox data-test="ProductsRanges_TotalizedOperations" class="mr-5" v-model="newpr.totalized_operations" :label="$t('Show totalized investments operations?')" ></v-checkbox>
                <v-btn data-test="ProductsRanges_ButtonShow" class="mt-2" color="primary" @click="accept()" :disabled="!form_valid">{{ $t("Show ranges") }}</v-btn>

                </v-row>
            </v-form>
        </v-card>
                    <p >{{ currentpricelabel }}</p>

        <v-card flat class="ma-4 pa-4">
            <v-tabs v-model="tab" grow bg-color="secondary">
                <v-tab key="0" data-test="ProductsRanges_TabTable">{{ $t('Product ranges table') }}</v-tab>
                <v-tab key="1" data-test="ProductsRanges_TabChart">{{ $t('Product ranges chart') }}</v-tab>
            </v-tabs>
            <v-window v-model="tab">
            <v-window-item key="0">
                <v-card flat>
                    <v-data-table data-test="ProductsRanges_Table" density="compact" :headers="tableHeaders" :items="tableData" class="elevation-1" :sort-by="['value']" :sort-type="['desc']" fixed-header height="360"     :items-per-page="10000" >
                        <template #item.value="{item}">
                            <div  @click="showLimits(item)" :class="item.current_in_range ? 'boldgreen' : ''">{{currency_string(item.value, prdata.product.currency) }}</div>
                        </template>    
                            <template #item.recomendation_invest="{item}">
                            <v-icon small v-if="item.recomendation_invest" >mdi-check-outline</v-icon>
                        </template>                        
                            <template #item.investments_inside="{item}">
                            <div v-for="o in item.investments_inside" :key="o.name" @click="on_investments_inside_click(o)">{{ f($t("[0]. Invested: [1]"), [o.name, currency_string(o.invested, prdata.product.currency)]) }}<br></div>
                        </template>                      
                            <template #item.orders_inside="{item}">
                            <div  v-for="o in item.orders_inside" :key="o.name" @click="on_orders_inside_click(o)">{{ f($t("[0]. Amount: [1]"), [o.name, currency_string(o.amount, prdata.product.currency)]) }}<br></div>
                        </template>
                            <template #item.actions="{item}">
                            <v-icon :data-test="`ProductsRanges_Table_IconAddOrder${item.id}`" small class="mr-2" @click="addOrder(item)" :color="(item.recomendation_invest) ? '' : 'red'">mdi-cart</v-icon>
                        </template>
                        <template #bottom ></template>   
                    </v-data-table>   
                    </v-card>
                </v-window-item>
                <v-window-item key="1" >
                    <div style="height: 600px;" data-test="ProductsRanges_Chart">
                        <ChartProductsRanges v-if="showchart" :prdata="prdata" autoresize data-test="ProductsRanges_Chart_Component" />
                    </div>
                </v-window-item>
            </v-window>
        </v-card>
        <!-- Order CU dialog -->
        <v-dialog v-model="dialog_ordercu" max-width="40%">
            <v-card class="pa-4">
                <OrdersCU :order="order" mode="C" @cruded="on_OrdersCU_cruded" :key="key"  :investments="investments_for_orders" />
            </v-card>
        </v-dialog>
        <!-- Orders LIST -->
        <v-dialog v-model="dialog_orders_list" @click:outside="on_dialog_orders_list_click_outside">
            <v-card class="pa-4">
                <OrdersList :key="key"></OrdersList>
            </v-card>
        </v-dialog>
        <!-- Investment view  -->
        <v-dialog v-model="dialog_investment_view" @click:outside="on_dialog_investment_view_click_outside">
            <v-card class="pa-4">
                <InvestmentsView :key="key" :investment_id="investment.id"></InvestmentsView>
            </v-card>
        </v-dialog>
    </div>
</template>


<script>    
    import {empty_products_ranges, empty_order} from '../empty_objects.js'
    import { useStore } from "@/store"
    import { RulesSelection, RulesInteger, RulesFloat, f } from 'vuetify_rules'
    import axios from 'axios'
    import AutocompleteProducts from './AutocompleteProducts.vue'
    import ChartProductsRanges from './ChartProductsRanges.vue'
    import InvestmentsView from './InvestmentsView.vue'
    import OrdersList from './OrdersList.vue'
    import OrdersCU from './OrdersCU.vue'
    import { parseResponseError, currency_string, myheaders, getArrayFromMap, getInvestmentsByProduct } from '@/functions.js'

    export default {
        components: {
            ChartProductsRanges,
            OrdersCU,
            OrdersList,
            InvestmentsView,
            AutocompleteProducts,
        },
        props:{
            pr:{
                required:false,
            }
        },
        data(){ 
            return {
                showchart:false,
                tab: null,
                chart: '',                
                tableHeaders: [
                    { title: 'Value', key: 'value',sortable: true, width:"7%"},
                    { title: 'Must Invest', key: 'recomendation_invest',sortable: false, width:"5%"},
                    { title: 'Investments',  sortable: false, key: 'investments_inside'},
                    { title: 'Orders',  sortable: false, key: 'orders_inside'},
                    { title: 'Actions', key: 'actions', sortable: false , width:"7%"},
                ],   
                newpr:this.empty_products_ranges(),
                currentpricelabel:"",
                prdata:null,
                form_valid:false,
                tableData:[],
                option: {},
                loading:false,

                //Dialog OrderCU
                dialog_ordercu:false,
                order: null,
                key:0,

                //Dialog orders list
                dialog_orders_list:false,

                //Dialog investment view
                dialog_investment_view:false,
                investment:null,
            }   
        },
        watch: {
            tab(){
                this.showchart=false
                if (this.tab==1) setTimeout(() => {this.showchart=true }, 300)
            },
        },
        computed:{
            investments_for_orders(){
                //Show only investments in this product range
                var r=[]
                this.pr.investments.forEach(o=>{
                    r.push(this.useStore().investments.get(o))
                })
                return r
            }
        },
        methods:{
            useStore,
            RulesSelection,
            RulesInteger,
            RulesFloat,
            f,
            parseResponseError,
            currency_string,
            myheaders,
            getArrayFromMap,
            getInvestmentsByProduct,
            empty_order,
            empty_products_ranges,
            accept(){
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                this.refreshTable()
            },
            addOrder(item){
                this.order=this.empty_order()
                this.order.price=item.value
                this.order.current_price=this.prdata.product.last
                this.order.shares=Math.floor(this.newpr.amount_to_invest/this.order.price)
                console.log(this.order)
                this.key=this.key+1
                this.dialog_ordercu=true
            },
            refreshTable(){
                this.loading=true
                var headers={...this.myheaders(),params:this.newpr}
                axios.get(`${this.useStore().apiroot}/products/ranges/`, headers)
                .then((response) => {
                    console.log("Products ranges", response.data)
                    this.prdata=response.data
                    this.tableData=this.prdata.pr
                    this.currentpricelabel= f(this.$t("Current price: [0]"), [this.currency_string(this.prdata.product.last, this.prdata.product.currency)]) + ". "
                    Object.keys(this.prdata.dataframe[0]).filter(key => !["date", "open", "high", "low", "close", "products_id"].includes(key)).forEach(indicator=> {
                        this.currentpricelabel+= ` ${indicator}: ${this.currency_string(this.prdata.dataframe[this.prdata.dataframe.length-1][indicator], this.prdata.product.currency)}`
                    })
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            showLimits(item){
                let s=f(this.$t("Range center: [0]"), [this.currency_string(item.value, this.prdata.product.currency)])
                alert(`${s}\n${item.limits}`)
            },
            on_OrdersCU_cruded(){
                this.dialog_ordercu=false
                this.refreshTable()
            },
            on_orders_inside_click(){
                this.dialog_orders_list=true
            },
            on_dialog_orders_list_click_outside(){
                this.dialog_orders_list=false
                this.refreshTable()
            },
            on_investments_inside_click(inv){
                this.investment=inv
                this.dialog_investment_view=true
            },
            on_dialog_investment_view_click_outside(){
                this.dialog_orders_list=false
                this.refreshTable()
            },
        
        },
        created(){
            if (this.pr!=null){
                this.newpr=Object.assign({},this.pr)
                this.refreshTable()
            }
        }
    }
</script>
