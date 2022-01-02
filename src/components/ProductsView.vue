<template>
    <div>
        <h1>{{ $t(`Products view`)}}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>
        </h1>


        <DisplayValues :items="displayvalues"></DisplayValues>
    
        <v-tabs v-model="tab"  background-color="primary" dark>
            <v-tab key="percentage_evolution">{{ $t("Percentage evolution")}}</v-tab>
            <v-tab key="quotes_evolution">{{ $t("Quotes evolution")}}</v-tab>
            <v-tab key="dps_estimations">{{ $t("DPS estimations")}}</v-tab>
            <v-tab key="quotes">{{ $t("Daily OHCL")}}</v-tab>
            <v-tab key="quotes_by_month">{{ $t("Quotes")}}</v-tab>
            <v-tab key="chart">{{ $t("Chart")}}</v-tab>
            <v-tabs-items v-model="tab">
                <v-tab-item key="percentage_evolution">     
                    <v-card class="pa-4 d-flex justify-center" outlined >
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
                    <v-card class="pa-4 d-flex justify-center" outlined >
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
                    <v-card class="pa-4 d-flex justify-center" outlined >
                        <TableEstimationsDPS :product="product" :key="key"></TableEstimationsDPS>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="quotes">
                    <v-card class="padding" outlined>
                        <TableOHCLS :product="product" :items="ohcls" :key="key"></TableOHCLS>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="quotes_by_month">
                    <v-card class="padding" outlined>
                        <TableQuotes :product="product" :items="quotes_all" :key="key"></TableQuotes>
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
        <v-dialog v-model="dialog_quotescu" width="35%">
            <v-card class="pa-4">
                <QuotesCU :quote="quote"></QuotesCU>
            </v-card>
        </v-dialog>

        <!-- ESTIMATIONS_DPS CU -->
        <v-dialog v-model="dialog_estimationdps" width="35%">
            <v-card class="pa-4">
                <EstimationsDpsCU :estimation="estimation" @cruded="on_EstimationsDpsCU_cruded()" :key="key"></EstimationsDpsCU>
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
    import TableEstimationsDPS from './TableEstimationsDPS.vue'
    import TableOHCLS from './TableOHCLS.vue'
    import TableQuotes from './TableQuotes.vue'
    import {empty_quote,empty_estimation_dps} from '../empty_objects.js'
    export default {
        components:{
            ChartProduct,
            DisplayValues,
            EstimationsDpsCU,
            MyMenuInline,
            QuotesCU,
            TableEstimationsDPS,
            TableQuotes,
            TableOHCLS,
        },

        props: {
            product: {
                required: true
            },
        },
        data () {
            return {
                displayvalues:[
                    {title:this.$t('Leverage'), value: this.product.leverage},
                    {title:this.$t('Currency'), value: this.product.currency},
                    {title:this.$t('Obsolete'), value: this.product.obsolete},
                    {title:this.$t('Id'), value: this.product.id},
                ],
                items: [
                    {
                        subheader:this.$t('Quote options'),
                        children: [
                            {
                                name:this.$t('Add a quote'),
                                code: function(this_){
                                    this_.quote=this_.empty_quote()
                                    this_.quote.products=this_.product.url
                                    this_.dialog_quotescu=true
                                },
                                icon: "mdi-plus",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('DPS options'),
                        children: [
                            {
                                name:this.$t('Add a DPS estimation'),
                                code: function(this_){
                                    this_.key=this_.key+1
                                    this_.estimation=this_.empty_estimation_dps()
                                    this_.estimation.product=this_.product.url
                                    this_.dialog_estimationdps=true
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
                quotes_all:[],


                // Quotes CU
                dialog_quotescu: false,
                quote:null,

                //Estimations DPS CU
                dialog_estimationdps: false,
                estimation: null,
            }
        },
        methods: {
            empty_quote,
            empty_estimation_dps,
            on_EstimationsDpsCU_cruded(){
                this.dialog_estimationdps=false
                this.key=this.key+1
            },
            refreshProductOHCLDaily(){
                return axios.get(`${this.$store.state.apiroot}/products/quotes/ohcl/?product=${this.product.url}`, this.myheaders())
            },
            refreshInformation(){
                return axios.get(`${this.$store.state.apiroot}/products/information/?product=${this.product.url}`, this.myheaders())
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
        },

        created(){
            this.make_all_axios()
        }
        
    }
</script>

