<template>
    <div>
        <h1>{{ $t("Products view")}}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>
        </h1>


        <DisplayValues :items="displayvalues"></DisplayValues>
    
        <v-tabs v-model="tab"  background-color="primary" dark>
            <v-tab key="percentage_evolution">{{ $t("Percentage evolution")}}</v-tab>
            <v-tab key="quotes_evolution">{{ $t("Quotes evolution")}}</v-tab>
            <v-tab key="dps_estimations">{{ $t("DPS estimations")}}</v-tab>
            <v-tab key="dps">{{ $t("DPS")}}</v-tab>
            <v-tab key="ohcls">{{ $t("Daily OHCL")}}</v-tab>
            <v-tab key="quotes">{{ $t("Quotes")}}</v-tab>
            <v-tab key="chart">{{ $t("Chart")}}</v-tab>
            <v-tabs-items v-model="tab">
                <v-tab-item key="percentage_evolution">     
                    <v-card class="pa-1" outlined >
                        <v-data-table dense :headers="percentage_headers" :items="this.information.percentages" class="elevation-1" disable-pagination  hide-default-footer  fixed-header :loading="loading">
                            <template v-slot:[`item.m1`]="{ item }"><div v-html="percentage_html(item.m1 )"></div></template>  
                            <template v-slot:[`item.m2`]="{ item }"><div v-html="percentage_html(item.m2 )"></div></template>  
                            <template v-slot:[`item.m3`]="{ item }"><div v-html="percentage_html(item.m3 )"></div></template>  
                            <template v-slot:[`item.m4`]="{ item }"><div v-html="percentage_html(item.m4 )"></div></template>  
                            <template v-slot:[`item.m5`]="{ item }"><div v-html="percentage_html(item.m5 )"></div></template>  
                            <template v-slot:[`item.m6`]="{ item }"><div v-html="percentage_html(item.m6 )"></div></template>  
                            <template v-slot:[`item.m7`]="{ item }"><div v-html="percentage_html(item.m7 )"></div></template>  
                            <template v-slot:[`item.m8`]="{ item }"><div v-html="percentage_html(item.m8 )"></div></template>  
                            <template v-slot:[`item.m9`]="{ item }"><div v-html="percentage_html(item.m9 )"></div></template>  
                            <template v-slot:[`item.m10`]="{ item }"><div v-html="percentage_html(item.m10 )"></div></template>  
                            <template v-slot:[`item.m11`]="{ item }"><div v-html="percentage_html(item.m11 )"></div></template>  
                            <template v-slot:[`item.m12`]="{ item }"><div v-html="percentage_html(item.m12 )"></div></template>  
                            <template v-slot:[`item.m13`]="{ item }"><div v-html="percentage_html(item.m13 )"></div></template>  
                        </v-data-table>   
                    </v-card>
                </v-tab-item>
                <v-tab-item key="quotes_evolution">     
                    <v-card class="pa-1" outlined >
                        <v-data-table dense :headers="quotes_headers" :items="this.information.quotes" class="elevation-1" disable-pagination  hide-default-footer  fixed-header :loading="loading">
                            <template v-slot:[`item.m1`]="{ item }"><div v-html="currency_html(item.m1 , product.currency)"></div></template>  
                            <template v-slot:[`item.m2`]="{ item }"><div v-html="currency_html(item.m2 , product.currency)"></div></template>  
                            <template v-slot:[`item.m3`]="{ item }"><div v-html="currency_html(item.m3 , product.currency)"></div></template>  
                            <template v-slot:[`item.m4`]="{ item }"><div v-html="currency_html(item.m4 , product.currency)"></div></template>  
                            <template v-slot:[`item.m5`]="{ item }"><div v-html="currency_html(item.m5 , product.currency)"></div></template>  
                            <template v-slot:[`item.m6`]="{ item }"><div v-html="currency_html(item.m6 , product.currency)"></div></template>  
                            <template v-slot:[`item.m7`]="{ item }"><div v-html="currency_html(item.m7 , product.currency)"></div></template>  
                            <template v-slot:[`item.m8`]="{ item }"><div v-html="currency_html(item.m8 , product.currency)"></div></template>  
                            <template v-slot:[`item.m9`]="{ item }"><div v-html="currency_html(item.m9 , product.currency)"></div></template>  
                            <template v-slot:[`item.m10`]="{ item }"><div v-html="currency_html(item.m10 , product.currency)"></div></template>  
                            <template v-slot:[`item.m11`]="{ item }"><div v-html="currency_html(item.m11 , product.currency)"></div></template>  
                            <template v-slot:[`item.m12`]="{ item }"><div v-html="currency_html(item.m12 , product.currency)"></div></template>  
                        </v-data-table>   
                    </v-card>
                </v-tab-item>
                <v-tab-item key="dps_estimations">     
                    <v-card class="pa-1" outlined >
                        <TableEstimationsDPS :product="product" :key="key"></TableEstimationsDPS>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="dps">     
                    <v-card class="pa-1" outlined >
                        <TableDPS :product="product" :key="key" :height="400"></TableDPS>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="ohcls">
                    <v-card class="pa-1 d-flex flex-column" outlined >                    
                        <MyMonthPicker v-model="ohcls_ym" @input="on_monthpicker_ohcls_change()"/>
                        <TableOHCLS :product="product" :items="ohcls_month" :key="key" :height="400" @cruded="on_TableQuotes_cruded()"></TableOHCLS>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="quotes">
                    <v-card class="pa-1 d-flex flex-column" outlined >      
                            
                        <MyMonthPicker v-model="quotes_ym" @input="on_monthpicker_quotes_change()"/>
                        <TableQuotes :product="product" :items="quotes_month" :key="key" :height="400" @cruded="on_TableQuotes_cruded()"></TableQuotes>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="chart">     
                    <v-card class="pa-4" outlined >
                        <ChartProduct :ohcls="ohcls" :product="product" :key="key"></ChartProduct>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-tabs>  

        <!-- QUOTES CU -->
        <v-dialog v-model="dialog_quotescu" width="65%">
            <v-card class="pa-4">
                <QuotesCU :quote="quote" :mode="quote_mode" :key="key" />
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
            product: {
                required: true
            },
        },
        data () {
            return {
                displayvalues:[
                    {title:this.$t('Leverage'), value: this.$store.getters.getObjectPropertyByUrl("leverages",this.product.leverages,"localname")},
                    {title:this.$t('Currency'), value: this.product.currency},
                    {title:this.$t('Obsolete'), value: this.product.obsolete},
                    {title:this.$t('Id'), value: this.product.id},
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
                                code: function(this_){
                                    this_.quote=this_.empty_quote()
                                    this_.quote_mode="C"
                                    this_.quote.products=this_.product.url
                                    this_.dialog_quotescu=true
                                },
                                icon: "mdi-plus",
                            },
                            {
                                name:this.$t('Quotes massive update'),
                                code: function(this_){
                                    this_.dialog_quotes_massive_update=true
                                    this_.key=this_.key+1
                                },
                                icon: "mdi-update",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('DPS options'),
                        children: [
                            {
                                name:this.$t('Add a DPS estimation'),
                                code: function(this_){
                                    this_.estimation=this_.empty_estimation_dps()
                                    this_.estimation.products=this_.product.url
                                    this_.estimation_mode="C"
                                    this_.key=this_.key+1
                                    this_.dialog_estimationdps=true
                                },
                                icon: "mdi-plus",
                            },
                            {
                                name:this.$t('Add a DPS'),
                                code: function(this_){
                                    this_.key=this_.key+1
                                    this_.dps=this_.empty_dps()
                                    this_.dps.products=this_.product.url
                                    this_.dps_crud_mode="C"
                                    this_.dps_crud_dialog=true

                                },
                                icon: "mdi-plus",
                            },
                        ]
                    },
                ],

                tab:0,
                key:0,

                // Information
                information: [],

                percentage_headers: [
                    { text: this.$t('Year'), value: 'year', sortable: true },
                    { text: this.$t('January'), value: 'm1', sortable: true,align:"right" },
                    { text: this.$t('February'), value: 'm2', sortable: true, align:"right" },
                    { text: this.$t('March'), value: 'm3', sortable: true, align:"right" },
                    { text: this.$t('April'), value: 'm4', sortable: true, align:"right" },
                    { text: this.$t('May'), value: 'm5', sortable: true, align:"right" },
                    { text: this.$t('June'), value: 'm6', sortable: true, align:"right" },
                    { text: this.$t('July'), value: 'm7', sortable: true, align:"right" },
                    { text: this.$t('August'), value: 'm8', sortable: true, align:"right" },
                    { text: this.$t('September'), value: 'm9', sortable: true, align:"right" },
                    { text: this.$t('October'), value: 'm10', sortable: true, align:"right" },
                    { text: this.$t('November'), value: 'm11', sortable: true, align:"right" },
                    { text: this.$t('December'), value: 'm12', sortable: true, align:"right" },
                    { text: this.$t('Total'), value: 'm13', sortable: true,align:"right" },
                ],
                quotes_headers: [
                    { text: this.$t('Year'), value: 'year', sortable: true },
                    { text: this.$t('January'), value: 'm1', sortable: true,align:"right" },
                    { text: this.$t('February'), value: 'm2', sortable: true, align:"right" },
                    { text: this.$t('March'), value: 'm3', sortable: true, align:"right" },
                    { text: this.$t('April'), value: 'm4', sortable: true, align:"right" },
                    { text: this.$t('May'), value: 'm5', sortable: true, align:"right" },
                    { text: this.$t('June'), value: 'm6', sortable: true, align:"right" },
                    { text: this.$t('July'), value: 'm7', sortable: true, align:"right" },
                    { text: this.$t('August'), value: 'm8', sortable: true, align:"right" },
                    { text: this.$t('September'), value: 'm9', sortable: true, align:"right" },
                    { text: this.$t('October'), value: 'm10', sortable: true, align:"right" },
                    { text: this.$t('November'), value: 'm11', sortable: true, align:"right" },
                    { text: this.$t('December'), value: 'm12', sortable: true, align:"right" },
                ],


                //Product chart
                ohcls:[],
                ohcls_ym:null,
                quotes_ym:null,
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
        methods: {
            empty_dps,
            empty_quote,
            empty_estimation_dps,
            on_EstimationsDpsCU_cruded(){
                this.key=this.key+1
                this.dialog_estimationdps=false
            },
            on_monthpicker_quotes_change(){
                axios.get(`${this.$store.state.apiroot}/api/quotes/?product=${this.product.url}&year=${this.quotes_ym.year}&month=${this.quotes_ym.month}`, this.myheaders())                
                .then((response) => {
                    this.quotes_month=response.data
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            },
            on_monthpicker_ohcls_change(){
                axios.get(`${this.$store.state.apiroot}/products/quotes/ohcl/?product=${this.product.url}&year=${this.ohcls_ym.year}&month=${this.ohcls_ym.month}`, this.myheaders())                
                .then((response) => {
                    this.ohcls_month=response.data
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            },
            refreshProductOHCLDaily(){
                return axios.get(`${this.$store.state.apiroot}/products/quotes/ohcl/?product=${this.product.url}`, this.myheaders())
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
            }
        },

        created(){
            this.make_all_axios()
            this.on_monthpicker_ohcls_change()
            this.on_monthpicker_quotes_change()
        }
        
    }
</script>

