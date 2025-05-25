<template>
    <div>
        <h1 class="mb-2">{{ $t("Change selling price") }}</h1>
        <div v-html="$t('Table with all investments with the same product as current investment:')"></div>
        <v-data-table ref="table" v-model="selected_ids" show-select :headers="tableHeaders" :items="data" class="elevation-1 mt-2" density="compact" height="300" fixed-header :items-per-page="10000" >
            <template #item.fullname="{item}">
                {{ useStore().investments.get(item.url).fullname }}
            </template>            
            <template #item.selling_price="{item}">
                <div class="text-right">{{ currency_string(item.selling_price, item.currency)}}</div>
            </template>
            <template #item.average_price="{item}">
                <div class="text-right">{{ currency_string(item.average_price, item.currency)}}</div>
            </template>
            <template #item.invested_investment="{item}">
                <div class="text-right">{{ currency_string(item.invested_investment, item.currency)}}</div>
            </template>
            <template #item.balance_investment="{item}">
                <div class="text-right">{{ currency_string(item.balance_investment, item.currency)}}</div>
            </template>
            <template #bottom ></template>   
        </v-data-table>
        <DisplayValues :items="displayvalues()" :minimized_items="5" :key="key"></DisplayValues>

        <v-tabs  bg-color="secondary" dark v-model="tab" grow>
            <v-tab key="percentage">{{ $t("Set a gains percentage") }}</v-tab>
            <v-tab key="gain">{{ $t("Set a gain") }}</v-tab>
            <v-tab key="price">{{ $t("Set a price") }}</v-tab>
            <v-tab key="range" v-if="this.selected_ids.length==1 && this.investment.id==this.selected_ids[0]">{{ $t("Set a range for current investment strategy") }}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item key="percentage">      
                <v-card class="pa-3" outlined>
                    <v-text-field :name="this.$t('Set a gains percentage')" v-model.number="percentage" :counter="10" :label="this.$t('Set a gains percentage')" :placeholder="this.$t('Enter an amount')" :rules="this.RulesFloat(10,true,6)" autofocus></v-text-field>
                </v-card>
            </v-window-item>
            <v-window-item key="gain">     
                <v-card class="pa-3" outlined>
                    <v-text-field :name="this.$t('Set a gain')" v-model.number="gains" :counter="10" :label="this.$t('Set a gain')" :placeholder="this.$t('Enter an amount')" :rules="this.RulesFloat(10,true,6)"></v-text-field>
                </v-card>
            </v-window-item>
            <v-window-item key="price">     
                <v-card class="pa-3" outlined>
                    <v-text-field :name="this.$t('Set a price')" v-model.number="price" :counter="10" :label="this.$t('Set a price')" :placeholder="this.$t('Enter an amount')" :rules="this.RulesFloat(10,true,6)"></v-text-field>
                </v-card>
            </v-window-item>
            <v-window-item key="range">     
                <v-card class="pa-3" outlined>
                    <v-select :items="strategies" v-model="strategy" :label="$t('Set current investment strategy')"  item-title="name" return-object :rules="RulesSelection(true)"></v-select>  
                    <v-select :items="strategy_ranges" v-model="strategy_range" :label="$t('Set a strategy range')"  item-title="name" item-value="value" :rules="RulesSelection(true)"></v-select>  
                </v-card>
            </v-window-item>
        </v-window>    
        <div class="pa-4" width="100%">
            <v-form ref="form" v-model="form_valid">
                <MyDatePicker v-model="selling_expiration" :label="$t('Selling expiration')" :clearable="true"/>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit()">{{ button_text }}</v-btn>
                    <v-btn color="error" @click="submit_null()">{{ $t("Set null values") }}</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-form>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import DisplayValues from './DisplayValues.vue'
    import MyDatePicker from './MyDatePicker.vue'
    import {empty_products_ranges,empty_ios} from '../empty_objects.js'
    import { my_round,RulesSelection, RulesFloat,f } from 'vuetify_rules'
    import { hyperlinked_url, parseResponseError, currency_string, myheaders } from '@/functions.js'

    
    export default {
        props:{
            //Current investment to be selected by default.
            //Investment object
            // Needs:
            // - url
            // - product url
            // - selling_price
            // - selling_expiration
            investment:{
                required:true,
            }
        },
        components:{
            MyDatePicker,
            DisplayValues,
        },
        data(){ 
            return{
                tab:2,
                form_valid:false,
                plio:null,
                data:[],
                selected_ids:[],
                tableHeaders: [
                    { title: this.$t('Id'), key: 'id', sortable: true },
                    { title: this.$t('Name'), key: 'fullname', sortable: true},
                    { title: this.$t('Shares'), key: 'shares', sortable: true, align: 'end'},
                    { title: this.$t('Selling price'), key: 'selling_price', sortable: true, align: 'end'},
                    { title: this.$t('Selling expiration'), key: 'selling_expiration', sortable: true, align: 'end'},
                    { title: this.$t('Average price'), key: 'average_price', sortable: true, align: 'end'},
                    { title: this.$t('Invested'), key: 'invested_investment', sortable: true, align: 'end'},
                    { title: this.$t('Balance'), key: 'balance_investment', sortable: true, align: 'end'},
                ],
                selected_invested:0,
                selling_expiration: new Date().toISOString().substring(0, 10),
                menu_selling_expiration: false,
                selected_selling_price: NaN,
                selected_average_price:0,
                selected_shares:0,
                button_text: this.$t("Calculate your selling price"),
                gains:500,
                price: 0,
                percentage: 10,
                key:0,
                loading_ios:false,

                product:null, // Object loaded at created

                //Strategies for product ranges
                strategies:[],
                strategy: null,
                strategy_ranges:[],
                strategy_range: null,
                
            }
        },
        watch: {
            gains: function() {
                this.calculate()
            },
            percentage: function() {
                this.calculate()
            },
            price: function() {
                this.calculate()
            },
            tab: function(){
                this.calculate()
            },
            strategy: function(item){
                var pr=this.empty_products_ranges()
                pr.product=`${this.useStore().apiroot}/api/products/${item.additional1}/`
                pr.percentage_between_ranges=item.additional2
                pr.percentage_gains=item.additional3
                pr.amount_to_invest=item.additional4
                pr.recomendation_methods=item.additional5
                pr.totalized_operations=item.additional6
                pr.investments=item.investments // Is a string due tu uses api/strategies an in db is a string
                var headers={...this.myheaders(),params:pr}
                axios.get(`${this.useStore().apiroot}/products/ranges/`, headers)
                .then((response) => {
                    this.strategy_ranges=[]


                    response.data.pr.forEach(element => {

                        var investments_string=""
                        element.investments_inside.forEach(o => {
                            investments_string=investments_string+ o.name
                        })
                        this.strategy_ranges.push({name:`${element.value} ${investments_string}`, value: element.value})
                        
                    });
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            strategy_range: function(){
                this.calculate()
            },
            selected_ids(){
                this.calculate()
            }
        },
        computed:{

            investments_same_product(){
                //Returns an array of integers
                var r=[]
                this.useStore().investments.forEach(inv=>{
                    if (inv.products==this.product.url && inv.active){
                        r.push(inv.id)
                    }
                })
                return r
            }
        },
        methods:{
            useStore,
            f,
            my_round,
            currency_string,
            myheaders,
            parseResponseError,
            RulesFloat,
            RulesSelection,
            displayvalues(){
                return [
                    {title:this.$t('Selected invested amount'), value: this.currency_string(this.selected_invested,this.product.currency)},
                    {title:this.$t('Number of shares selected'), value: this.selected_shares},
                    {title:this.$t('Average price of selected shares'), value: this.currency_string(this.selected_average_price,this.product.currency)},
                    {title:this.$t('Product leverage'), value: this.useStore().leverages.get(this.product.leverages).multiplier},
                    {title:this.$t('Product real leverage'), value: this.product.real_leveraged_multiplier},
                ]
            },
            empty_ios,
            empty_products_ranges,
            hyperlinked_url,
            selling_price_to_gain_money(money){
                var PF=0
                if (this.selected_shares>0){
                    PF=(money+this.selected_average_price*this.selected_shares*this.product.real_leveraged_multiplier)/(this.selected_shares*this.product.real_leveraged_multiplier)        
                } 
                else if (this.selected_shares<0){
                    PF=(-money+this.selected_average_price*this.selected_shares*this.product.real_leveraged_multiplier)/(this.selected_shares*this.product.real_leveraged_multiplier)        
                }
                return PF
            },    
            selling_price_to_gain_percentage_of_invested(percentage){
                var gains=this.selected_invested*percentage/100
                return this.selling_price_to_gain_money(gains)
            },
            submit(){           
                this.submit_method(this.selected_selling_price,this.selling_expiration)
            },
            submit_null(){   
                this.submit_method(null,null)   
            },
            submit_method(price,expiration){
                this.selling_expiration=expiration
                if (this.selling_expiration != null && new Date(this.selling_expiration).setHours(0,0,0,0)<new Date().setHours(0,0,0,0)) {
                    alert(this.$t("Selling expiration date is in the past"))
                }

                var s= new Array()
                this.selected_ids.forEach(v=> s.push(this.hyperlinked_url("investments", v)))
                var p={
                    selling_expiration:this.selling_expiration,
                    investments: s,
                    selling_price: this.my_round(price,  this.product.decimals),
                }
                axios.post(`${this.useStore().apiroot}/investments/changesellingprice/`, p, this.myheaders())
                .then((response) => {//api/investments serializer
                    response.data.forEach(o=>{
                        this.useStore().investments.set(o.url,o)
                    })
                    this.loading_ios=false
                    this.key=this.key+1
                    alert(this.$t("Remember to set your order in the bank"))
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });

            },
            calculate(){
                this.selected_shares=0
                this.selected_invested=0
                this.data.forEach(o=>{
                    if (this.selected_ids.includes(o.id)) {
                        this.selected_shares=this.selected_shares + o.shares
                        this.selected_invested=this.selected_invested + o.invested_investment
                    }
                })
                if (this.selected_shares!=0){
                    var selected_sharesbyaverage=0
                    this.data.forEach(o=>{
                        if (this.selected_ids.includes(o.id)) {
                            selected_sharesbyaverage=selected_sharesbyaverage+o.shares*o.average_price
                        }
                    })
                    this.selected_average_price=selected_sharesbyaverage/this.selected_shares
                } else {
                    this.selected_average_price=0
                }
                if (this.tab==0){
                    this.selected_selling_price=this.selling_price_to_gain_percentage_of_invested(this.percentage)
                } else if (this.tab==1) {
                    this.selected_selling_price=this.selling_price_to_gain_money(this.gains)
                } else if (this.tab==2) {
                    this.selected_selling_price=this.price
                } else if (this.tab==3) {
                    this.selected_selling_price=this.strategy_range
                }
                var gai=(this.selected_selling_price-this.selected_average_price)*this.selected_shares*this.product.real_leveraged_multiplier
                this.button_text=f(this.$t("Set selected investments selling price to [0] to gain [1]"), [
                    this.currency_string(this.selected_selling_price, this.product.currency, this.product.decimals),
                    this.currency_string(gai,this.product.currency, 2)
                ])

            },
            refreshInvestments(select_current){
                this.loading_ios=true
                var simulation=this.empty_ios()
                simulation.investments=this.investments_same_product
                simulation.currency=this.useStore().profile.currency
                simulation.mode=2
                return axios.post(`${this.useStore().apiroot}/ios/`, simulation, this.myheaders())
                .then((response) => {
                    this.plio=response.data
                    var o
                    var ios_id

                    this.investments_same_product.forEach( investments_id => {
                        ios_id=this.plio[investments_id.toString()]
                        var inv=this.getMapObjectById("investments",investments_id)
                        o={
                            id: investments_id,
                            url: inv.url,
                            name: (this.investment.url==inv.url) ? inv.fullname+" (current)" : inv.fullname,
                            shares: ios_id.total_io_current.shares,
                            selling_price: inv.selling_price,
                            selling_expiration: inv.selling_expiration,
                            average_price: ios_id.total_io_current.average_price_investment,
                            invested_investment: ios_id.total_io_current.invested_investment,
                            balance_investment: ios_id.total_io_current.balance_investment,
                            currency: ios_id.data.currency_product,
                            
                        }
                        this.data.push(o)
                        //Adds current invesment to selection
                        if (select_current == true && o.url==this.investment.url){
                            this.selected_ids.push(o.id)
                        }
                        this.calculate()

                    })
                    this.loading_ios=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            refreshStrategies(){
                axios.get(`${this.useStore().apiroot}/api/strategies/?investment=${this.investment.url}&active=true&type=2`, this.myheaders())
                .then((response) => {
                    this.strategies=response.data
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        created(){
            this.product=this.useStore().products.get(this.investment.products)
            this.selling_expiration=this.investment.selling_expiration
            this.price=this.investment.selling_price
            this.refreshStrategies()
            this.refreshInvestments(true)
        }
    }
</script>