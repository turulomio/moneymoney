<template>
    <div>
        <h1>{{ $t("Products comparation") }}</h1>
        <DisplayValues :items="display_values()" width="90%" v-if="product_a"></DisplayValues>

        <v-tabs v-model="tab"  background-color="primary" dark>
            <v-tab key="price_ratio">{{ $t("Price ratio")}}</v-tab>
            <v-tab key="price_ratio_chart">{{ $t("Price ratio chart")}}</v-tab>
            <v-tab key="pairs_price_scatter">{{ $t("Price scatter chart")}}</v-tab>
            <v-tab-item key="price_ratio">     
                <v-card class="pa-4 d-flex justify-center" outlined >
                    <v-data-table dense :headers="data_price_ratio_headers" :items="dbdata" sort-by="datetime" class="elevation-1 ma-4" hide-default-footer disable-pagination :loading="loading" :key="key" height="600"> 
                        <template v-slot:[`item.datetime`]="{ item }">
                            {{localtime(item.datetime)}}
                        </template>  
                        <template v-slot:[`item.price_better`]="{ item }">
                            <div v-html="currency_html(item.price_better, product_a.currency)"></div>
                        </template>  
                        <template v-slot:[`item.price_worse`]="{ item }">
                            <div v-html="currency_html(item.price_worse, product_b.currency)"></div>
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
            <v-tab-item key="pairs_price_scatter">
                <v-card class="padding" outlined>
                    <ChartScatterPairPrices notitle :data="cspp"></ChartScatterPairPrices>
                </v-card>
            </v-tab-item>
        </v-tabs>  
    </div>
</template>
<script>
    import axios from 'axios'
    import {empty_chart_scatter_pair_prices} from '../empty_objects.js'
    import ChartPriceRatio from './ChartPriceRatio.vue'
    import ChartScatterPairPrices from './ChartScatterPairPrices.vue'
    import DisplayValues from './DisplayValues.vue'
    export default {
        components:{
            ChartPriceRatio,
            ChartScatterPairPrices,
            DisplayValues,
        },
        props: {
            pc: {
                required: true // Null to create, pc object to update
            }
        },
        data(){ 
            return {


                tab:1,
                product_a: null,
                product_b: null,
                dbdata:[],
                data_price_ratio_headers:[
                    { text: this.$t('Date and time'), sortable: true, value: 'datetime', width: "20%"},
                    { text: this.$t('Better price'), value: 'price_better',  width: "10%", align:'right'},
                    { text: this.$t('Worse price'), value: 'price_worse',  width: "10%", align:'right'},
                    { text: this.$t('Price ratio'), value: 'price_ratio',  width: "16%", align:'right'},
                    { text: this.$t('Percentage from start'), value: 'price_ratio_percentage_from_start',  width: "16%", align:'right'},
                    { text: this.$t('Percentage month difference start'), value: 'price_ratio_percentage_month_diff',  width: "16%", align:'right'},
                ],
                
                data_price_ratio_chart:[],
                cspp: null, //data of chart scatter pair prices

                loading:false,
                key:0,

            }
        },
        methods:{
            empty_chart_scatter_pair_prices,
            display_values(){
                return [
                    {title:this.$t('Better product'), value: this.product_a.name},
                    {title:this.$t('Worse product'), value: this.product_b.name},
                ]
            },
            pairReport(){               
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/products/pairs/?a=${this.pc.a}&b=${this.pc.b}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.dbdata=response.data.data
                    this.product_a=response.data.product_a
                    this.product_b=response.data.product_b

                    //Price ratio chart
                    this.data_price_ratio_chart=[]
                    console.log(this.dbdata)
                    this.dbdata.forEach(o => this.data_price_ratio_chart.push([o.datetime,o.price_ratio]))

                    //Price scatter
                    this.cspp=empty_chart_scatter_pair_prices()
                    this.cspp.product_a=this.product_a
                    this.cspp.product_b=this.product_b
                    this.cspp.prices=[]
                    this.dbdata.forEach((o,index) => {
                        this.cspp.prices.push([this.dbdata[index].price_better,this.dbdata[index].price_worse])
                    })

                    this.loading=false
                    this.key=this.key+1
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