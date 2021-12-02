<template>
    <div>
        <h1>{{ $t("Products comparation") }}</h1>

        <v-tabs v-model="tab"  background-color="primary" dark>
            <v-tab key="price_ratio">{{ $t("Price ratio")}}</v-tab>
            <v-tab key="price_ratio_chart">{{ $t("Price ratio chart")}}</v-tab>
            <v-tab-item key="price_ratio">     
                <v-card class="pa-4 d-flex justify-center" outlined >
                    <v-data-table dense :headers="data_price_ratio_headers" :items="data_price_ratio" sort-by="datetime" class="elevation-1 ma-4" hide-default-footer disable-pagination :loading="loading" :key="key" height="600"> 
                        <template v-slot:[`item.datetime`]="{ item }">
                            {{localtime(item.datetime)}}
                        </template>  
                        <template v-slot:[`item.price_better`]="{ item }">
                            <div v-html="currency_html(item.price_better, item.currency)"></div>
                        </template>  
                        <template v-slot:[`item.price_worse`]="{ item }">
                            <div v-html="currency_html(item.price_worse, item.currency)"></div>
                        </template>  
                        <template v-slot:[`item.price_ratio_percentage_from_start`]="{ item }">
                            <div v-html="percentage_html(item.price_ratio_percentage_from_start )"></div>
                        </template>  
                        <template v-slot:[`item.price_ratio_percentage_month_diff`]="{ item }">
                            <div v-html="percentage_html(item.price_ratio_percentage_month_diff )"></div>
                        </template>  
                    </v-data-table>
                </v-card>
            </v-tab-item>
            <v-tab-item key="price_ratio_chart">
                <v-card class="padding" outlined>
                    <ChartPriceRatio notitle :product_a="product_a" :product_b="product_b" :data="data_price_ratio_chart"></ChartPriceRatio>
                </v-card>
            </v-tab-item>
        </v-tabs>  
    </div>
</template>
<script>
    import axios from 'axios'
    import {localtime} from '../functions.js'
    import ChartPriceRatio from './ChartPriceRatio.vue'
    export default {
        components:{
            ChartPriceRatio,
        },
        props: {
            // An account object
            pc: {
                required: true // Null to create, pc object to update
            }
        },
        data(){ 
            return {
                tab:1,
                product_a: null,
                product_b: null,
                data_price_ratio:[],
                data_price_ratio_headers:[
                    { text: this.$t('Date and time'), sortable: true, value: 'datetime', width: "20%"},
                    { text: this.$t('Better price'), value: 'price_better',  width: "10%", align:'right'},
                    { text: this.$t('Worse price'), value: 'price_worse',  width: "10%", align:'right'},
                    { text: this.$t('Price ratio'), value: 'price_ratio',  width: "16%", align:'right'},
                    { text: this.$t('Percentage from start'), value: 'price_ratio_percentage_from_start',  width: "16%", align:'right'},
                    { text: this.$t('Percentage month difference start'), value: 'price_ratio_percentage_month_diff',  width: "16%", align:'right'},
                ],
                
                data_price_ratio_chart:[],
                loading:false,
                key:0,

            }
        },
        methods:{
            localtime,
            pairReport(){               
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/products/pairs/?a=${this.pc.a}&b=${this.pc.b}`, this.myheaders())
                .then((response) => {
                    this.data_price_ratio=response.data
                    this.data_price_ratio_chart=[]
                    this.data_price_ratio.forEach(o => this.data_price_ratio_chart.push([o.datetime,o.price_ratio]))
                    this.loading=false
                    this.key=this.key+1
                    console.log(this.data_price_ratio)
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            change(){
                var tmp=this.product_a
                this.product_a=this.product_b
                this.product_b=tmp
                this.$refs.a.forceValue(this.product_a)
                this.$refs.b.forceValue(this.product_b)
            }
        },
        mounted(){
            this.pairReport()
        }
    }
</script>