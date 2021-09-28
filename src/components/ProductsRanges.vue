<template>
    <div>
        <h1> {{ $t('Product ranges') }}</h1>
        <v-card class="ma-4 pa-4">   
            
            <v-form ref="form" v-model="form_valid" lazy-validation>             
                <v-row class="pl-5 pr-5">
                <v-autocomplete class="mr-5" :items="$store.state.products" v-model="newpr.product" :label="$t('Select a product')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field class="mr-5" v-model="newpr.percentage_between_ranges" type="number" :label="$t('Set percentage_between_ranges x 1000')" :placeholder="$t('Set percentage_between_ranges x 1000')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field class="mr-5" v-model="newpr.percentage_gains" type="number" :label="$t('Set percentage gains x1000')" :placeholder="$t('Set percentage gains x1000')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field  v-model="newpr.amount_to_invest" type="number" :label="$t('Set the amount to invest')" :placeholder="$t('Set the amount to invest')" :rules="RulesInteger(10,true)" counter="10"/>
                </v-row>
                <v-row class="pl-5 pr-5">
                <v-select class="mr-5" :items="recomendation_methods" v-model="newpr.recomendation_methods" :label="$t('Set recomendation method')"  item-text="name" item-value="id" :rules="RulesSelection(true)"></v-select>  
                <v-checkbox class="mr-5" v-model="newpr.only_first" :label="$t('Show only first operation?')" ></v-checkbox>
                <v-autocomplete class="mr-5" :items="$store.state.accounts" v-model="newpr.account" :label="$t('Select an account')" item-text="name" item-value="url" :rules="RulesSelection(false)"></v-autocomplete> 
                <v-btn class="mt-4" color="primary" @click="accept()" :disabled="!form_valid">{{ $t("Show ranges") }}</v-btn>
                </v-row>
            </v-form>
        </v-card>

        <v-card class="ma-6 pa-6">
            <v-tabs v-model="tab">
                <v-tab key="0">{{ $t('Product ranges table') }}</v-tab>
                <v-tab key="1">{{ $t('Product ranges chart') }}</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
            <v-tab-item key="0">
                <v-card flat>
                    <v-container >{{ currentpricelabel }}</v-container>
                    <v-data-table dense :headers="tableHeaders" :items="tableData" class="elevation-1" disable-pagination  hide-default-footer :sort-by="['value']" :sort-desc="[true]" fixed-header height="360">      
                        <template v-slot:[`item.value`]="{ item }">
                            <div  @click="showLimits(item)" :class="item.current_in_range ? 'boldgreen' : ''">{{currency_string(item.value, prdata.product.currency) }}</div>
                        </template>    
                        <template v-slot:[`item.recomendation_invest`]="{ item }">
                            <v-icon small v-if="item.recomendation_invest" >mdi-check-outline</v-icon>
                        </template>                        
                         <template v-slot:[`item.investments_inside`]="{ item }">
                            <div v-for="o in item.investments_inside" :key="o.name" @click="on_investments_inside_click(o)">{{ $t(`${o.name}. Invested: ${currency_string(o.invested, prdata.product.currency)}`) }}<br></div>
                        </template>                      
                        <template v-slot:[`item.orders_inside`]="{ item }">
                            <div  v-for="o in item.orders_inside" :key="o.name" @click="on_orders_inside_click(o)">{{ $t(`${o.name}. Amount: ${currency_string(o.amount, prdata.product.currency)}`) }}<br></div>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small class="mr-2" @click="addOrder(item)" :color="(item.recomendation_invest) ? '' : 'red'">mdi-cart</v-icon>
                        </template>
                    </v-data-table>   
                    </v-card>
                </v-tab-item>
                <v-tab-item key="1" >
                    <div style="height: 600px;">
                        <ChartProductsRanges :prdata="prdata" autoresize />
                    </div>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
        <!-- Order CU dialog -->
        <v-dialog v-model="dialog_ordercu" max-width="550">
            <v-card class="pa-4">
                <OrdersCU :order="order" @cruded="on_OrdersCU_cruded()" :key="key"></OrdersCU>
            </v-card>
        </v-dialog>
        <!-- Orders LIST -->
        <v-dialog v-model="dialog_orders_list" @click:outside="on_dialog_orders_list_click_outside()">
            <v-card class="pa-4">
                <OrdersList :key="key"></OrdersList>
            </v-card>
        </v-dialog>
        <!-- Investment view  -->
        <v-dialog v-model="dialog_investment_view" @click:outside="on_dialog_investment_view_click_outside()">
            <v-card class="pa-4">
                <InvestmentsView :key="key" :investment="investment"></InvestmentsView>
            </v-card>
        </v-dialog>
    </div>
</template>


<script>    
    import {empty_products_ranges, empty_order} from '../empty_objects.js'
    import axios from 'axios'
    
    import ChartProductsRanges from './ChartProductsRanges.vue'
    import InvestmentsView from './InvestmentsView.vue'
    import OrdersList from './OrdersList.vue'
    import OrdersCU from './OrdersCU.vue'
    export default {
        components: {
            ChartProductsRanges,
            OrdersCU,
            OrdersList,
            InvestmentsView,
        },
        props:{
            pr:{
                required:false,
            }
        },
        data(){ 
            return {
                tab: null,
                chart: '',                
                tableHeaders: [
                    { text: 'Value', value: 'value',sortable: true, width:"7%"},
                    { text: 'Must Invest', value: 'recomendation_invest',sortable: false, width:"5%"},
                    { text: 'Investments',  sortable: false, value: 'investments_inside'},
                    { text: 'Orders',  sortable: false, value: 'orders_inside'},
                    { text: 'Actions', value: 'actions', sortable: false , width:"7%"},
                ],   
                newpr:this.empty_products_ranges(),
                currentpricelabel:"",
                prdata:null,
                form_valid:false,
                tableData:[],
                option: {},
                loading:false,
                recomendation_methods:[
                    {id:0,name:this.$t("None")},
                    {id:1,name:this.$t("All")},
                    {id:2,name:this.$t("SMA 10/50/200")},
                    {id:3,name:this.$t("SMA 100")},
                    {id:4,name:this.$t("Strict SMA 10/50/200")},
                    {id:5,name:this.$t("Strict SMA 100")},
                    {id:6,name:this.$t("Strict SMA 10/100")},
                ],

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
        methods:{
            accept(){
                if (this.$refs.form.validate()==false) return
                this.refreshTable()

            },
            addOrder(item){
                this.order=this.empty_order()
                this.order.price=item.value
                this.order.current_price=this.prdata.product.last
                this.key=this.key+1
                this.dialog_ordercu=true
            },
            empty_order,
            empty_products_ranges,
            refreshTable(){
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/products/ranges/?product=${this.newpr.product}&percentage_between_ranges=${this.newpr.percentage_between_ranges}&percentage_gains=${this.newpr.percentage_gains}&amount_to_invest=${this.newpr.amount_to_invest}&recomendation_methods=${this.newpr.recomendation_methods}&only_first=${this.newpr.only_first}&account=${this.newpr.account}`, this.myheaders())
                .then((response) => {
                    this.prdata=response.data
                    this.tableData=this.prdata.pr
                    this.currentpricelabel= this.$t(`Current price: ${this.currency_string(this.prdata.product.last, this.prdata.product.currency)}`) 
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            showLimits(item){
                alert(item.limits)
            },
            on_OrdersCU_cruded(){
                this.dialog_ordercu=false
                this.refreshTable()
            },
            on_orders_inside_click(o){
                console.log(o)
                this.dialog_orders_list=true
            },
            on_dialog_orders_list_click_outside(){
                console.log("FUERA")
                this.dialog_orders_list=false
                this.refreshTable()
            },
            on_investments_inside_click(inv){
                console.log(inv)
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
