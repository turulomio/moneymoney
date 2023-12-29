<template>
    <div>
        <h1>{{ $t("Products comparation") }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <DisplayValues :items="display_values()" width="90%" v-if="product_a"></DisplayValues>
        <v-card class="d-flex flex-row mx-auto pa-4" flat width="65%">
            <v-text-field density="compact" class="mr-4"  v-model.number="interval_minutes" :label="$t('Time interval in minutes allowed to compare the prices of both products')" :placeholder="$t('Time interval in minutes allowed to compare the prices of both products')" :rules="RulesInteger(4,true)" counter="4"/>
            <v-btn @click="pairReport()">{{ $t("Compare") }}</v-btn>
        </v-card>

        <v-tabs v-model="tab"  bg-color="secondary" dark>
            <v-tab key="price_ratio">{{ $t("Price ratio")}}</v-tab>
            <v-tab key="price_ratio_chart">{{ $t("Price ratio chart")}}</v-tab>
            <v-tab key="pairs_price_scatter">{{ $t("Price scatter chart")}}</v-tab>
            <v-tab key="pairs_comparation_by_quote">{{ $t("Comparation by quote")}}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item key="price_ratio">     
                <v-card class="pa-4 d-flex justify-center flex-column" outlined >

                    <v-data-table-virtual density="compact" :headers="data_price_ratio_headers" :items="dbdata" :sort-by="[{key:'datetime',order:'desc'}]" class="elevation-1 ma-4" :loading="loading" :key="key" height="500" fixed-header     :items-per-page="10000" > 

                        <template #item.datetime="{item}">
                            {{localtime(item.datetime)}}
                        </template>  

                        <template #item.price_better="{item}">
                            <div class="text-right" v-html="currency_html(item.price_better, product_a.currency)"></div>
                        </template>  
                        <template #item.price_worse="{item}">
                            <div class="text-right" v-html="currency_html(item.price_worse, product_b.currency)"></div>
                        </template>  
                        <template #item.price_ratio_percentage_from_start="{item}">
                            <div class="text-right" v-html="percentage_html(item.price_ratio_percentage_from_start )"></div>
                        </template>
                        <template #item.price_ratio="{item}">
                            <div class="text-right" v-text="item.price_ratio"></div>
                        </template>
                        <template #item.diff="{item}">
                            <div class="text-right" v-text="item.diff"></div>
                        </template>
                        <template #bottom ></template>   
                    </v-data-table-virtual>
                </v-card>
            </v-window-item>
            <v-window-item key="price_ratio_chart">
                <v-card outlined>
                    <ChartPriceRatio notitle :product_a="product_a" :product_b="product_b" :data="data_price_ratio_chart"></ChartPriceRatio>
                    <p class="boldcenter">{{ $t("One product performs better than another if its price ratio increases") }}</p>
                </v-card>
            </v-window-item>
            <v-window-item key="pairs_price_scatter">
                <v-card outlined>
                    <ChartScatterPairPrices notitle :data="cspp" />
                    <p class="boldcenter">{{ $t("If the red point is above the regression line, it means that last pair prices are performing better than its average.") }}</p>

                </v-card>
            </v-window-item>
            <v-window-item key="pairs_comparation_by_quote">
                <v-card outlined>
                    <v-row class="pa-8 mx-8">
                        <v-text-field  v-model.number="quote_better_from"  :label="$t('Quote better from (current price by default)')" :placeholder="$t('Quote better from')" autofocus :rules="RulesFloat(15,true,6)" counter="15"/>
                        <v-text-field class="ml-4" v-model.number="quote_better_to"  :label="$t('Quote better to (increases 0.1% by default)')" :placeholder="$t('Quote better to')" :rules="RulesFloat(15,true,6)" counter="15"/>
                        <v-btn class="ml-4" vcolor="primary" @click="compare_by_quote()">{{ $t("Comparation by quote") }}</v-btn>

                    </v-row>
                    <v-data-table density="compact" :headers="data_price_ratio_headers" :items="comparation_by_quote" :sort-by="[{key:'datetime',order:'desc'}]" class="elevation-1 ma-4" :loading="loading" :key="key" height="500" fixed-header    :items-per-page="10000" > 

                        <template #item.datetime="{item}">
                            {{localtime(item.datetime)}}
                        </template>  
                        <template #item.price_better="{item}">
                            <div class="text-right" v-html="currency_html(item.price_better, product_a.currency)"></div>
                        </template>  
                        <template #item.price_worse="{item}">
                            <div class="text-right" v-html="currency_html(item.price_worse, product_b.currency)"></div>
                        </template>  
                        <template #item.price_ratio="{item}">
                            <div class="text-right" v-text="item.price_ratio"></div>
                        </template>
                        <template #item.price_ratio_percentage_from_start="{item}">
                            <div class="text-right" v-html="percentage_html(item.price_ratio_percentage_from_start )"></div>
                        </template>
                        <template #bottom ></template>   
                    </v-data-table>
                </v-card>
            </v-window-item>
        </v-window>  
        <!-- QUOTES CU -->
        <v-dialog v-model="dialog_quotescu" width="70%">
            <v-card class="pa-4">
                <QuotesCU :quote="quote" :mode="quote_mode" :key="key" @cruded="on_QuotesCU_cruded" />
            </v-card>
        </v-dialog>
        <!-- PRODUCTS VIEW-->
        <v-dialog v-model="dialog_productview" width="100%" heigth="100%">
            <v-card class="pa-3">
                <ProductsView :product="product" :key="key" />
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import {empty_chart_scatter_pair_prices,empty_quote} from '../empty_objects.js'
    import ChartPriceRatio from './ChartPriceRatio.vue'
    import ChartScatterPairPrices from './ChartScatterPairPrices.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import ProductsView from './ProductsView.vue'
    import QuotesCU from './QuotesCU.vue'
    import DisplayValues from './DisplayValues.vue'
    import { localtime, my_round,RulesFloat,RulesInteger,f} from 'vuetify_rules'
    export default {
        components:{
            ChartPriceRatio,
            ChartScatterPairPrices,
            DisplayValues,
            MyMenuInline,
            QuotesCU,
            ProductsView,
        },
        props: {
            pc: {
                required: true // Null to create, pc object to update
            }
        },
        data(){ 
            return {


                tab:1,
                interval_minutes:1,
                product_a: null,
                product_b: null,
                dbdata:[],
                data_price_ratio_headers:[
                    { title: this.$t('Date and time'), sortable: true, key: 'datetime'},
                    { title: this.$t('Date and time seconds diff'), sortable: true, key: 'diff', align:'end'},
                    { title: this.$t('Better price'), key: 'price_better', align:'end'},
                    { title: this.$t('Worse price'), key: 'price_worse', align:'end'},
                    { title: this.$t('Price ratio'), key: 'price_ratio', align:'end'},
                    { title: this.$t('Percentage from start'), key: 'price_ratio_percentage_from_start', align:'end'},
                ],
                
                data_price_ratio_chart:[],
                cspp: null, //data of chart scatter pair prices

                loading:false,
                key:0,

                //Comparation by quote
                quote_better_from: 0,
                quote_better_to:0,
                comparation_by_quote_headers:[
                    { title: this.$t('Better date and time'), sortable: true, key: 'better_datetime'},
                    { title: this.$t('Better quote'), key: 'better_quote',   align:'end'},
                    { title: this.$t('Worse date and time'), sortable: true, key: 'worse_datetime'},
                    { title: this.$t('Worse quote'), key: 'worse_quote', align:'end'},

                    { title: this.$t('Minutes apart'), key: 'minutes_apart',align:'end'},

                    
                ],
                comparation_by_quote:[],
                comparation_by_quote_filter_by_minutes:[],
                loading_by_quote:false,
                filter_quotes:true,
                filter_max_minutes_apart:10,
                //QuotesCU
                quote:null,
                quote_mode:null,
                dialog_quotescu:false,

                //Products view
                dialog_productview:false,
                product: null,
            }
        },
        computed:{

            menuinline_items(){
                var r =[
                    {
                        subheader: this.$t("Quotes options"),
                        children: [
                        ]
                    },
                    {
                        subheader: this.$t("Products options"),
                        children: [
                        ]
                    },
                ]
                if (this.product_a){
                    r[0].children.push({
                        name: f(this.$t("Add a quote for '[0]'"), [this.product_a.name]),
                                code: function(){
                                    this.key=this.key+1
                                    this.dialog_productview=true
                                }.bind(this),
                                icon: "mdi-magnify",
                    })
                    r[1].children.push({
                        name: f(this.$t("View '[0]'"), [this.product_a.name]),
                        code: function(){
                            this.product=this.useStore().products.get(this.product_a.url)
                            this.key=this.key+1
                            this.dialog_productview=true
                        }.bind(this),
                        icon: "mdi-magnify",
                    })
                }
                if (this.product_b){
                    r[0].children.push({
                        name: f(this.$t("Add a quote for '[0]'"), [this.product_b.name]),
                        icon: "mdi-plus",
                        code: function(){
                            this.quote=this.empty_quote()
                            this.quote_mode="C"
                            this.quote.products=this.product_b.url
                            this.key=this.key+1
                            this.dialog_quotescu=true
                        }.bind(this),
                    })
                    r[1].children.push({
                        name: f(this.$t("View '[0]'"), [this.product_b.name]),
                        code: function(){
                            this.key=this.key+1
                            this.product=this.useStore().products.get(this.product_b.url)
                            this.dialog_productview=true
                        }.bind(this),
                        icon: "mdi-magnify",
                    })
                }
                return r
            },
        },
        methods:{
            useStore,
            empty_chart_scatter_pair_prices,
            empty_quote,
            localtime,
            my_round,
            RulesFloat,
            RulesInteger,
            f,
            display_values(){
                return [
                    {title:this.$t('Better product'), value: this.product_a.name},
                    {title:this.$t('Worse product'), value: this.product_b.name},
                ]
            },
            compare_by_quote(){
                this.comparation_by_quote=this.dbdata.filter( o => this.quote_better_from<= o.price_better && o.price_better<=this.quote_better_to)
                this.key=this.key+1
            },

            pairReport(){               
                this.loading=true
                axios.get(`${this.useStore().apiroot}/products/pairs/?a=${this.pc.a}&b=${this.pc.b}&interval_minutes=${this.interval_minutes}`, this.myheaders())
                .then((response) => {
                    this.dbdata=response.data.data
                    this.product_a=response.data.product_a
                    this.product_b=response.data.product_b

                    //Price ratio chart
                    this.data_price_ratio_chart=[]
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
            on_QuotesCU_cruded(){
                this.dialog_quotescu=false
                this.pairReport()
            }
        },
        created(){
            this.pairReport()
        }
    }
</script>