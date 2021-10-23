<template>
    <v-card flat>
        <h1 class="mb-2">{{ $t("Change selling price of investments with the same product") }}</h1>
        <v-data-table ref="table" v-model="selected" :headers="tableHeaders" :items="data" :single-select="false" item-key="id" show-select class="elevation-1" :disable-pagination="true" dense >
            <template v-slot:[`item.selling_price`]="{ item }">
                {{ currency_string(item.selling_price, item.currency)}}
            </template>
            <template v-slot:[`item.average_price`]="{ item }">
                {{ currency_string(item.average_price, item.currency)}}
            </template>
            <template v-slot:[`item.invested_investment`]="{ item }">
                {{ currency_string(item.invested_investment, item.currency)}}
            </template>
            <template v-slot:[`item.balance_investment`]="{ item }">
                {{ currency_string(item.balance_investment, item.currency)}}
            </template>
        </v-data-table>
        <p></p>

        <DisplayValues :items="displayvalues()" :minimized_items="5" :key="key"></DisplayValues>

        <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
            <v-tab key="percentage">{{ $t("Set a gains percentage") }}</v-tab>
            <v-tab key="gain">{{ $t("Set a gain") }}</v-tab>
            <v-tab key="price">{{ $t("Set a price") }}</v-tab>
            <v-tabs-slider color="yellow"></v-tabs-slider>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item key="percentage">      
                <v-card class="padding">
                    <v-text-field :name="this.$t('Set a gains percentage')" v-model.number="percentage" :counter="10" :label="this.$t('Set a gains percentage')" :placeholder="this.$t('Enter an amount')" :rules="this.RulesFloat(10,true)" autofocus></v-text-field>
                </v-card>
            </v-tab-item>
            <v-tab-item key="gain">     
                <v-card class="padding">
                    <v-text-field :name="this.$t('Set a gain')" v-model.number="gains" :counter="10" :label="this.$t('Set a gain')" :placeholder="this.$t('Enter an amount')" :rules="this.RulesFloat(10,true)"></v-text-field>
                </v-card>
            </v-tab-item>
            <v-tab-item key="price">     
                <v-card class="padding">
                    <v-text-field :name="this.$t('Set a price')" v-model.number="price" :counter="10" :label="this.$t('Set a price')" :placeholder="this.$t('Enter an amount')" :rules="this.RulesFloat(10,true)"></v-text-field>
                </v-card>
            </v-tab-item>
        </v-tabs-items>         
        <v-form ref="form" v-model="form_valid" lazy-validation action="url 'investments_same_product_change_selling_price' products_id=product.id)" method="POST">
            <MyDatePicker v-model="selling_expiration" :label="$t('Selling expiration')"></MyDatePicker> 
            <v-btn color="error" @click="submit()" :disabled="form_valid==false">{{ button_text }}</v-btn>
        </v-form>
    </v-card>
</template>
<script>
    import axios from 'axios'
    import DisplayValues from './DisplayValues.vue'
    import MyDatePicker from './MyDatePicker.vue'
    import {my_round} from '../functions.js'
    export default {
        props:{
            product:{
                required:true,
            },
        },
        components:{
            MyDatePicker,
            DisplayValues,
        },
        data(){ 
            return{
                tab:0,
                form_valid:false,
                data: [],
                selected:[],
                tableHeaders: [
                    { text: this.$t('Id'), value: 'id', sortable: true },
                    { text: this.$t('Name'), value: 'name', sortable: true},
                    { text: this.$t('Shares'), value: 'shares', sortable: true, align: 'right'},
                    { text: this.$t('Selling price'), value: 'selling_price', sortable: true, align: 'right'},
                    { text: this.$t('Selling expiration'), value: 'selling_expiration', sortable: true, align: 'right'},
                    { text: this.$t('Average price'), value: 'average_price', sortable: true, align: 'right'},
                    { text: this.$t('Invested'), value: 'invested_investment', sortable: true, align: 'right'},
                    { text: this.$t('Balance'), value: 'balance_investment', sortable: true, align: 'right'},
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
                
            }
        },
        watch: {
            selected: function() {
                this.selected_shares=this.selected.reduce((accum,item) => accum + item.shares, 0)
                this.selected_invested=this.selected.reduce((accum,item) => accum + item.invested_investment, 0)
                if (this.selected_shares!=0){
                    var selected_sharesbyaverage=this.selected.reduce((accum,item) => accum + item.shares*item.average_price, 0)
                    this.selected_average_price=selected_sharesbyaverage/this.selected_shares
                } else {
                    this.selected_average_price=0
                }
                this.calculate()
            },
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
            }
        },
        methods:{           
            my_round,
            displayvalues(){
                console.log(this.product)
                return [
                    {title:this.$t('Selected invested amount'), value: this.currency_string(this.selected_invested,this.product.currency)},
                    {title:this.$t('Number of shares selected'), value: this.selected_shares},
                    {title:this.$t('Average price of selected shares'), value: this.currency_string(this.selected_average_price,this.product.currency)},
                    {title:this.$t('Product leverage'), value: this.product.leverage_multiplier},
                    {title:this.$t('Product current price'), value: this.product.leverage_real_multiplier},
                ]
            },
            selling_price_to_gain_money(money){
                var PF=0
                if (this.selected_shares>0){
                    PF=(money+this.selected_average_price*this.selected_shares*this.product.leverage_real_multiplier)/(this.selected_shares*this.product.leverage_real_multiplier)        
                } 
                else if (this.selected_shares<0){
                    PF=(-money+this.selected_average_price*this.selected_shares*this.product.leverage_real_multiplier)/(this.selected_shares*this.product.leverage_real_multiplier)        
                }
                return PF
            },    
            selling_price_to_gain_percentage_of_invested(percentage){
                var gains=this.selected_invested*percentage/100
                return this.selling_price_to_gain_money(gains)
            },
            
            submit(){                               
                if (this.$refs.form.validate()==false) return
                var s= new Array()
                this.selected.forEach(v=> s.push(v.url))
                var p={
                    selling_expiration:this.selling_expiration,
                    investments: s,
                    selling_price: this.my_round(this.selected_selling_price,  this.product.decimals),
                }
                axios.post(`${this.$store.state.apiroot}/investments/sameproduct/changesellingprice/`, p, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.loading_ios=false
                    this.refreshInvestmentsOperations()
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            calculate(){
                if (this.tab==0){
                    this.selected_selling_price=this.selling_price_to_gain_percentage_of_invested(this.percentage)
                } else if (this.tab==1) {
                    this.selected_selling_price=this.selling_price_to_gain_money(this.gains)
                } else if (this.tab==2) {
                    this.selected_selling_price=this.price
                }
                    
                var gai=(this.selected_selling_price-this.selected_average_price)*this.selected_shares*this.product.leverage_real_multiplier
                this.button_text=this.$t(`Set selected investments selling price to ${this.currency_string(this.selected_selling_price, this.product.currency, this.product.decimals)} to gain ${this.currency_string(gai,this.product.currency, 2)}`)

            },
            refreshInvestmentsOperations(){
                this.loading_ios=true
                axios.get(`${this.$store.state.apiroot}/investmentsoperationstotalmanager/investments/sameproduct/?product=${this.product.url}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.dividends=response.data
                    this.data=[]
                    response.data.forEach( iot => {
                        this.data.push({
                            id: iot.investment.id,
                            url: iot.investment.url,
                            name: iot.investment.name,
                            shares: iot.io_current.shares,
                            selling_price: iot.investment.selling_price,
                            selling_expiration: iot.investment.selling_expiration,
                            average_price: iot.io_current.average_price_investment,
                            invested_investment: iot.io_current.invested_investment,
                            balance_investment: iot.io_current.balance_investment,
                            currency:iot.product.currency,
                            
                        })
                    })
                    this.loading_ios=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        mounted(){
            console.log(this.product)
            this.refreshInvestmentsOperations()
            // this.$refs.table.selection=this.data
        }
}
</script>