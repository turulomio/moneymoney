<template>
    <div>
        <h1>{{ $t("Products comparation") }}</h1>
        <DisplayValues :items="display_values()" width="90%" v-if="product_a"></DisplayValues>

        <v-tabs v-model="tab"  background-color="primary" dark>
            <v-tab key="price_ratio">{{ $t("Price ratio")}}</v-tab>
            <v-tab key="price_ratio_chart">{{ $t("Price ratio chart")}}</v-tab>
            <v-tab key="pairs_price_scatter">{{ $t("Price scatter chart")}}</v-tab>
            <v-tab key="pairs_comparation_by_quote">{{ $t("Comparation by quote")}}</v-tab>
            <v-tab-item key="price_ratio">     
                <v-card class="pa-4 d-flex justify-center" outlined >
                    <v-data-table dense :headers="data_price_ratio_headers" :items="dbdata" sort-by="datetime" class="elevation-1 ma-4" hide-default-footer disable-pagination :loading="loading" :key="key" height="500"> 
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
                <v-card outlined>
                    <ChartPriceRatio notitle :product_a="product_a" :product_b="product_b" :data="data_price_ratio_chart"></ChartPriceRatio>
                </v-card>
            </v-tab-item>
            <v-tab-item key="pairs_price_scatter">
                <v-card outlined>
                    <ChartScatterPairPrices notitle :data="cspp"></ChartScatterPairPrices>
                </v-card>
            </v-tab-item>
            <v-tab-item key="pairs_comparation_by_quote">
                <v-card outlined>
                    <v-row class="pa-8 mx-8">
                        <v-text-field  v-model.number="quote_better_from"  :label="$t('Quote better from (current price by default)')" :placeholder="$t('Quote better from')" autofocus :rules="RulesFloat(15,true,6)" counter="15"/>
                        <v-text-field class="ml-4" v-model.number="quote_better_to"  :label="$t('Quote better to (increases 0.1% by default)')" :placeholder="$t('Quote better to')" :rules="RulesFloat(15,true,6)" counter="15"/>
                        <v-checkbox class="ml-4" v-model="filter_quotes" :label="$t('Filter values that exceed the maximum difference minutes')" @click="get_comparation_by_quote_filter_by_minutes"></v-checkbox>
                        <v-text-field class="ml-4"  v-model.number="filter_max_minutes_apart" :label="$t('Maximum quotes minutes apart')" :placeholder="$t('Maximum quotes minutes apart')" :rules="RulesInteger(4,true)" counter="4" @change="get_comparation_by_quote_filter_by_minutes"/>
                        <v-btn class="ml-4" vcolor="primary" @click="compare_by_quote()">{{ $t("Comparation by quote") }}</v-btn>

                    </v-row>
                    <v-data-table dense :headers="comparation_by_quote_headers" :items="comparation_by_quote_filter_by_minutes" sort-by="datetime" class="elevation-1 ma-4" hide-default-footer disable-pagination :loading="loading" :key="key" height="500"> 
                        <template v-slot:[`item.better_datetime`]="{ item }">{{localtime(item.better_datetime)}}</template>  
                        <template v-slot:[`item.worse_datetime`]="{ item }">{{localtime(item.worse_datetime)}}</template>  
                        <template v-slot:[`item.better_quote`]="{ item }"><div :class="item.better_quote==product_a.current_price ? 'bold' : ''" v-html="currency_html(item.better_quote, product_a.currency)"></div></template>  
                        <template v-slot:[`item.worse_quote`]="{ item }"><div :class="comparation_by_quote_success(item) ? 'boldgreen' : 'boldred'" v-html="currency_html(item.worse_quote, product_a.currency)"></div></template>  
                        <template v-slot:[`item.comment`]="{ item }">{{item.comment}}</template> 
                    </v-data-table>
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

                //Comparation by quote
                quote_better_from: 0,
                quote_better_to:0,
                comparation_by_quote_headers:[
                    { text: this.$t('Better date and time'), sortable: true, value: 'better_datetime'},
                    { text: this.$t('Better quote'), value: 'better_quote',   align:'right'},
                    { text: this.$t('Worse date and time'), sortable: true, value: 'worse_datetime'},
                    { text: this.$t('Worse quote'), value: 'worse_quote', align:'right'},

                    { text: this.$t('Minutes apart'), value: 'minutes_apart',align:'right'},

                    
                ],
                comparation_by_quote:[],
                comparation_by_quote_filter_by_minutes:[],
                loading_by_quote:false,
                filter_quotes:true,
                filter_max_minutes_apart:10,

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
            get_comparation_by_quote_filter_by_minutes(){
                if (this.filter_quotes==true){
                    this.comparation_by_quote_filter_by_minutes= this.comparation_by_quote.filter(o=> o.minutes_apart<=this.filter_max_minutes_apart) 
                } else {
                    this.comparation_by_quote_filter_by_minutes= this.comparation_by_quote
                }
            },
            compare_by_quote(){               
                this.loading_by_quote=true
                axios.get(`${this.$store.state.apiroot}/products/comparation/by_quote/?a=${this.pc.a}&b=${this.pc.b}&quote_better_from=${this.quote_better_from}&quote_better_to=${this.quote_better_to}`, this.myheaders())
                .then((response) => {
                    if (response.data.success){
                        this.comparation_by_quote=response.data.data
                        this.get_comparation_by_quote_filter_by_minutes()
                    } else {
                        alert(this.$t("Answer is wrong"))
                    }

                    this.loading_by_quote=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            pairReport(){               
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/products/pairs/?a=${this.pc.a}&b=${this.pc.b}`, this.myheaders())
                .then((response) => {
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
                    this.quote_better_from=this.product_a.current_price
                    this.quote_better_to=this.my_round(this.quote_better_from*1.001,3)

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
            },
            //Returns boolean if worse price is lower after time for the same price
            comparation_by_quote_success(item){
                if (item.worse_quote<this.comparation_by_quote[0].worse_quote) return true
                return false
            }
        },
        mounted(){
            this.pairReport()
        }
    }
</script>