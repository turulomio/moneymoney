<template>
    <div>
        <h1>{{ $t(`Products view`)}}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>
        </h1>


        <DisplayValues :items="displayvalues"></DisplayValues>
    
        <v-tabs v-model="tab"  background-color="primary" dark>
            <v-tab key="dps_estimations">{{ $t("DPS estimations")}}</v-tab>
            <v-tab key="quotes">{{ $t("Daily OHCL")}}</v-tab>
            <v-tab key="quotes_by_month">{{ $t("Quotes")}}</v-tab>
            <v-tab key="chart">{{ $t("Chart")}}</v-tab>
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
            // refreshProductAllQuotes(){
            //     return axios.get(`${this.$store.state.apiroot}/api/quotes/?product=${this.product.url}`, this.myheaders())
            // },
            make_all_axios(){
                this.loading=true
                axios.all([this.refreshProductOHCLDaily()])
                .then(([resOHCLS]) => {
                    this.ohcls=resOHCLS.data 
                    console.log(this.ohcls)


                    this.loading=false
                });
            },
        },

        created(){
            this.make_all_axios()
        }
        
    }
</script>

