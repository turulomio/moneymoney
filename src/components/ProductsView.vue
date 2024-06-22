<template>
    <div>
        <h1>{{ f($t("Product '[0]'"), [this.product.fullname])}}
            <MyMenuInline :items="items"/>
        </h1>
        <DisplayValues :items="displayvalues"></DisplayValues>
    
        <v-tabs v-model="tab"  bg-color="secondary" dark>
            <v-tab data-test="ProductsView_TabPercentageEvolution" key="percentage_evolution">{{ $t("Percentage evolution")}}</v-tab>
            <v-tab data-test="ProductsView_TabQuotesEvolution" key="quotes_evolution">{{ $t("Quotes evolution")}}</v-tab>
            <v-tab data-test="ProductsView_TabDpsEstimations" key="dps_estimations">{{ $t("DPS estimations")}}</v-tab>
            <v-tab data-test="ProductsView_TabDps" key="dps">{{ $t("DPS")}}</v-tab>
            <v-tab data-test="ProductsView_TabOHCLS" key="ohcls">{{ $t("Daily OHCL")}}</v-tab>
            <v-tab data-test="ProductsView_TabQuotes" key="quotes">{{ $t("Quotes")}}</v-tab>
            <v-tab data-test="ProductsView_TabChart" key="chart">{{ $t("Chart")}}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item key="percentage_evolution">     
                <v-card class="pa-1" outlined v-if="this.information">
                    <v-data-table density="compact" :headers="percentage_headers" :items="information.percentages" class="elevation-1"   fixed-header :loading="loading"     :items-per-page="10000" >
                        <template #item.m1="{item}"><div class="text-right" v-html="percentage_html(item.m1 )"></div></template>  
                        <template #item.m2="{item}"><div class="text-right" v-html="percentage_html(item.m2 )"></div></template>  
                        <template #item.m3="{item}"><div class="text-right" v-html="percentage_html(item.m3 )"></div></template>  
                        <template #item.m4="{item}"><div class="text-right" v-html="percentage_html(item.m4 )"></div></template>  
                        <template #item.m5="{item}"><div class="text-right" v-html="percentage_html(item.m5 )"></div></template>  
                        <template #item.m6="{item}"><div class="text-right" v-html="percentage_html(item.m6 )"></div></template>  
                        <template #item.m7="{item}"><div class="text-right" v-html="percentage_html(item.m7 )"></div></template>  
                        <template #item.m8="{item}"><div class="text-right" v-html="percentage_html(item.m8 )"></div></template>  
                        <template #item.m9="{item}"><div class="text-right" v-html="percentage_html(item.m9 )"></div></template>  
                        <template #item.m10="{item}"><div class="text-right" v-html="percentage_html(item.m10 )"></div></template>  
                        <template #item.m11="{item}"><div class="text-right" v-html="percentage_html(item.m11 )"></div></template>  
                        <template #item.m12="{item}"><div class="text-right" v-html="percentage_html(item.m12 )"></div></template>  
                        <template #item.total="{item}"><div class="text-right" v-html="percentage_html(item.total )"></div></template> 
                <template #bottom ></template>    
                    </v-data-table>   
                    <p class="boldcenter mt-4" v-html="f($t('Product quotes percentage from first data: [0]'), [percentage_html(information.percentages[information.percentages.length-1].from_first_quote)])"></p>
                </v-card>
            </v-window-item>
            <v-window-item key="quotes_evolution">     
                <v-card class="pa-1" outlined  v-if="this.information">
                    <v-data-table density="compact" :headers="quotes_headers" :items="this.information.quotes" class="elevation-1"    fixed-header :loading="loading"    :items-per-page="10000" >
                        <template #item.m1="{item}"><div class="text-right" v-html="currency_html(item.m1 , product.currency)"></div></template>  
                        <template #item.m2="{item}"><div class="text-right" v-html="currency_html(item.m2 , product.currency)"></div></template>  
                        <template #item.m3="{item}"><div class="text-right" v-html="currency_html(item.m3 , product.currency)"></div></template>  
                        <template #item.m4="{item}"><div class="text-right" v-html="currency_html(item.m4 , product.currency)"></div></template>  
                        <template #item.m5="{item}"><div class="text-right" v-html="currency_html(item.m5 , product.currency)"></div></template>  
                        <template #item.m6="{item}"><div class="text-right" v-html="currency_html(item.m6 , product.currency)"></div></template>  
                        <template #item.m7="{item}"><div class="text-right" v-html="currency_html(item.m7 , product.currency)"></div></template>  
                        <template #item.m8="{item}"><div class="text-right" v-html="currency_html(item.m8 , product.currency)"></div></template>  
                        <template #item.m9="{item}"><div class="text-right" v-html="currency_html(item.m9 , product.currency)"></div></template>  
                        <template #item.m10="{item}"><div class="text-right" v-html="currency_html(item.m10 , product.currency)"></div></template>  
                        <template #item.m11="{item}"><div class="text-right" v-html="currency_html(item.m11 , product.currency)"></div></template>  
                        <template #item.m12="{item}"><div class="text-right" v-html="currency_html(item.m12 , product.currency)"></div></template>  
                <template #bottom ></template>   
                    </v-data-table>   
                </v-card>
            </v-window-item>
            <v-window-item key="dps_estimations">     
                <v-card class="pa-1" outlined >
                    <TableEstimationsDPS :product="product" :key="key"></TableEstimationsDPS>
                </v-card>
            </v-window-item>
            <v-window-item key="dps">     
                <v-card class="pa-1" outlined >
                    <TableDPS :product="product" :key="key" :height="400"></TableDPS>
                </v-card>
            </v-window-item>
            <v-window-item key="ohcls">
                <v-card class="pa-1 d-flex flex-column" outlined >                    
                    <MyMonthPicker ref="ohcls_ym" v-model="ohcls_ym"/>
                    <TableOHCLS :product="product" :items="ohcls_month" :key="key" :height="400" @cruded="on_TableQuotes_cruded()"></TableOHCLS>
                </v-card>
            </v-window-item>
            <v-window-item key="quotes">
                <v-card class="pa-1 d-flex flex-column" outlined >      
                        
                    <MyMonthPicker ref="quotes_ym" v-model="quotes_ym" @update:ModelValue="on_monthpicker_quotes_change()"/>
                    <TableQuotes :product="product" :items="quotes_month" :key="key" :height="400" @cruded="on_TableQuotes_cruded()"></TableQuotes>
                </v-card>
            </v-window-item>
            <v-window-item key="chart"  >     
                <v-card class="pa-4" outlined >
                    <ChartProduct v-if="showchart" :ohcls="ohcls" :product="product" :key="key"></ChartProduct>
                </v-card>
            </v-window-item>
        </v-window>

        <!-- QUOTES CU -->
        <v-dialog v-model="dialog_quotescu" width="65%">
            <v-card class="pa-4">
                <QuotesCU :quote="quote" :mode="quote_mode" :key="key" @cruded="on_QuotesCU_cruded" />
            </v-card>
        </v-dialog>

        <!-- ESTIMATIONS_DPS CU -->
        <v-dialog v-model="dialog_estimationdps" width="35%">
            <v-card class="pa-4">
                <EstimationsDpsCU :estimation="estimation" :mode="estimation_mode" @cruded="on_EstimationsDpsCU_cruded()" :key="key"></EstimationsDpsCU>
            </v-card>
        </v-dialog>

        <!-- DPS CU -->
        <v-dialog v-model="dps_crud_dialog" width="35%">
            <v-card class="pa-4">
                <DpsCRUD :dps="dps" :mode="dps_crud_mode" @cruded="on_DpsCRUD_cruded()" :key="key"></DpsCRUD>
            </v-card>
        </v-dialog>



        <!-- QUOTES MASSIVE UPDATE -->
        <v-dialog v-model="dialog_quotes_massive_update" width="90%">
            <v-card class="pa-4">
                <QuotesMassiveUpdate :product="product" @cruded="on_QuotesMassiveUpdate_cruded()" :key="key"></QuotesMassiveUpdate>
            </v-card>
        </v-dialog>
    </div>
</template>  
<script>     
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyMenuInline from './MyMenuInline.vue'
    import QuotesCU from './QuotesCU.vue'
    import ChartProduct from './ChartProduct.vue'
    import DisplayValues from './DisplayValues.vue'
    import EstimationsDpsCU from './EstimationsDpsCU.vue'
    import MyMonthPicker from './MyMonthPicker.vue'
    import QuotesMassiveUpdate from './QuotesMassiveUpdate.vue'
    import TableDPS from './TableDPS.vue'
    import TableEstimationsDPS from './TableEstimationsDPS.vue'
    import TableOHCLS from './TableOHCLS.vue'
    import TableQuotes from './TableQuotes.vue'
    import {empty_quote,empty_estimation_dps,empty_dps} from '../empty_objects.js'
    import {f} from 'vuetify_rules'
    import DpsCRUD from './DpsCRUD.vue'
    export default {
        components:{
            ChartProduct,
            DisplayValues,
            EstimationsDpsCU,
            MyMenuInline,
            QuotesCU,
            QuotesMassiveUpdate,
            TableDPS,
            TableEstimationsDPS,
            TableQuotes,
            TableOHCLS,
            DpsCRUD,
            MyMonthPicker,
        },

        props: {
            product: { //Object
                required: true
            },
        },
        data () {
            return {
                displayvalues:[
                    {title:this.$t('Leverage'), value: this.useStore().leverages.get(this.product.leverages).localname},
                    {title:this.$t('Currency'), value: this.product.currency},
                    {title:this.$t('Obsolete'), value: this.product.obsolete},
                    {title:this.$t('Id'), value: this.product.id},
                    {title:this.$t('ISIN'), value: this.product.isin},
                    {title:this.$t('Ticker Yahoo'), value: this.product.ticker_yahoo},
                    {title:this.$t('Ticker Morningstar'), value: this.product.ticker_morningstar},
                    {title:this.$t('Ticker Google'), value: this.product.ticker_google},
                    {title:this.$t('Ticker QueFondos'), value: this.product.ticker_quefondos},
                    {title:this.$t('Ticker Investing.com'), value: this.product.ticker_investingcom},
                ],
                items: [
                    {
                        subheader:this.$t('Quote options'),
                        children: [
                            {
                                name:this.$t('Add a quote'),
                                code: function(){
                                    this.quote=this.empty_quote()
                                    this.quote_mode="C"
                                    this.quote.products=this.product.url
                                    this.dialog_quotescu=true
                                }.bind(this),
                                icon: "mdi-plus",
                            },
                            {
                                name:this.$t('Quotes massive update'),
                                code: function(){
                                    this.dialog_quotes_massive_update=true
                                    this.key=this.key+1
                                }.bind(this),
                                icon: "mdi-update",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('DPS options'),
                        children: [
                            {
                                name:this.$t('Add a DPS estimation'),
                                code: function(){
                                    this.estimation=this.empty_estimation_dps()
                                    this.estimation.products=this.product.url
                                    this.estimation_mode="C"
                                    this.key=this.key+1
                                    this.dialog_estimationdps=true
                                }.bind(this),
                                icon: "mdi-plus",
                            },
                            {
                                name:this.$t('Add a DPS'),
                                code: function(){
                                    this.key=this.key+1
                                    this.dps=this.empty_dps()
                                    this.dps.products=this.product.url
                                    this.dps_crud_mode="C"
                                    this.dps_crud_dialog=true
                                }.bind(this),
                                icon: "mdi-plus",
                            },
                        ]
                    },
                ],

                tab:0,
                key:0,
                loading:false,
                showchart:false,
                // Information
                information: null,

                percentage_headers: [
                    { title: this.$t('Year'), key: 'year', sortable: true },
                    { title: this.$t('January'), key: 'm1', sortable: true,align:'end' },
                    { title: this.$t('February'), key: 'm2', sortable: true, align:'end' },
                    { title: this.$t('March'), key: 'm3', sortable: true, align:'end' },
                    { title: this.$t('April'), key: 'm4', sortable: true, align:'end' },
                    { title: this.$t('May'), key: 'm5', sortable: true, align:'end' },
                    { title: this.$t('June'), key: 'm6', sortable: true, align:'end' },
                    { title: this.$t('July'), key: 'm7', sortable: true, align:'end' },
                    { title: this.$t('August'), key: 'm8', sortable: true, align:'end' },
                    { title: this.$t('September'), key: 'm9', sortable: true, align:'end' },
                    { title: this.$t('October'), key: 'm10', sortable: true, align:'end' },
                    { title: this.$t('November'), key: 'm11', sortable: true, align:'end' },
                    { title: this.$t('December'), key: 'm12', sortable: true, align:'end' },
                    { title: this.$t('Total'), key: 'total', sortable: true,align:'end' },
                ],
                quotes_headers: [
                    { title: this.$t('Year'), key: 'year', sortable: true },
                    { title: this.$t('January'), key: 'm1', sortable: true,align:'end' },
                    { title: this.$t('February'), key: 'm2', sortable: true, align:'end' },
                    { title: this.$t('March'), key: 'm3', sortable: true, align:'end' },
                    { title: this.$t('April'), key: 'm4', sortable: true, align:'end' },
                    { title: this.$t('May'), key: 'm5', sortable: true, align:'end' },
                    { title: this.$t('June'), key: 'm6', sortable: true, align:'end' },
                    { title: this.$t('July'), key: 'm7', sortable: true, align:'end' },
                    { title: this.$t('August'), key: 'm8', sortable: true, align:'end' },
                    { title: this.$t('September'), key: 'm9', sortable: true, align:'end' },
                    { title: this.$t('October'), key: 'm10', sortable: true, align:'end' },
                    { title: this.$t('November'), key: 'm11', sortable: true, align:'end' },
                    { title: this.$t('December'), key: 'm12', sortable: true, align:'end' },
                ],


                //Product chart
                ohcls:[],
                ohcls_ym:{year:new Date().getFullYear(), month: new Date().getMonth()+1},
                quotes_ym:{year:new Date().getFullYear(), month: new Date().getMonth()+1},
                ohcls_month: [],
                quotes_month:[],


                // Quotes CU
                dialog_quotescu: false,
                quote:null,
                quote_mode:null,

                //Estimations DPS CU
                dialog_estimationdps: false,
                estimation: null,
                estimation_mode: null,

                //DPS CRUD DIALOG
                dps_crud_dialog: false,
                dps_crud_mode: null,
                dps: null,

                //QUOTES MASSIVE UPDATE
                dialog_quotes_massive_update:false,
            }
        },
        watch: {
            ohcls_ym(){
                this.on_monthpicker_ohcls_change()
            },
            tab(){
                this.showchart=false
                if (this.tab==6) setTimeout(() => {this.showchart=true }, 300)
            },
        },
        methods: {
            useStore,
            f,
            empty_dps,
            empty_quote,
            empty_estimation_dps,
            on_EstimationsDpsCU_cruded(){
                this.key=this.key+1
                this.dialog_estimationdps=false
            },
            on_monthpicker_quotes_change(){
                axios.get(`${this.useStore().apiroot}/api/quotes/?product=${this.product.url}&year=${this.quotes_ym.year}&month=${this.quotes_ym.month}`, this.myheaders())                
                .then((response) => {
                    this.quotes_month=response.data
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            },
            on_monthpicker_ohcls_change(){
                axios.get(`${this.useStore().apiroot}/products/quotes/ohcl/?product=${this.product.url}&year=${this.ohcls_ym.year}&month=${this.ohcls_ym.month}`, this.myheaders())                
                .then((response) => {
                    this.ohcls_month=response.data
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            },
            refreshProductOHCLDaily(){
                return axios.get(`${this.useStore().apiroot}/products/quotes/ohcl/?product=${this.product.url}`, this.myheaders())
            },
            refreshInformation(){
                return axios.get(`${this.product.url}historical_information/`, this.myheaders())
            },
            make_all_axios(){
                this.loading=true
                axios.all([this.refreshProductOHCLDaily(),this.refreshInformation()])
                .then(([resOHCLS,resInformation]) => {
                    this.ohcls=resOHCLS.data 
                    this.information=resInformation.data
                    this.loading=false
                });
            },
            on_TableQuotes_cruded(){
                this.make_all_axios()
                this.on_monthpicker_quotes_change()
                this.on_monthpicker_ohcls_change()
            },
            on_DpsCRUD_cruded(){
                this.dps_crud_dialog=false
                this.key=this.key+1
            },
            on_QuotesMassiveUpdate_cruded(){
                this.dialog_quotes_massive_update=false
                this.on_TableQuotes_cruded()
            },
            on_QuotesCU_cruded(){
                this.dialog_quotescu=false
                this.on_TableQuotes_cruded()
            }
        },

        mounted(){
            this.make_all_axios()
            this.on_monthpicker_ohcls_change()
            this.on_monthpicker_quotes_change()
        }
        
    }
</script>

