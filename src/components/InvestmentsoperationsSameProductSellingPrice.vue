<template>
    <v-card flat>
        <h1>{{ $t("Change selling price of investments with the same product") }}</h1>
        <v-data-table ref="table" v-model="selected" :headers="tableHeaders" :items="data" :single-select="false" item-key="id" show-select class="elevation-1" :disable-pagination="true" dense ></v-data-table>
        <p></p>

        <DisplayValues :items="displayvalues()" :key="key"></DisplayValues>

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
            <MyDatePicker name="selling_expiration" v-model="selling_expiration" :label="$t('Selling expiration')"></MyDatePicker> 
            <!-- <input type="hidden" name="investments" :value="investments_ids">
            <input type="hidden" name="selling_price" :value="my_round(selected_selling_price, decimals)]]"> -->
            <v-btn color="error" @click="submit()" :disabled="form_valid==false">{{ $t("Set")}}</v-btn>
        </v-form>
    </v-card>
</template>
<script>
    import axios from 'axios'
    import DisplayValues from './DisplayValues.vue'
    import MyDatePicker from './MyDatePicker.vue'
import { listobjects_sum } from '../functions'
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
                    { text: this.$t('Invested'), value: 'invested', sortable: true, align: 'right'},
                    { text: this.$t('Balance'), value: 'balance_investment', sortable: true, align: 'right'},
                ],
                selected_invested:0,
                selling_expiration: new Date().toISOString().substring(0, 10),
                menu_selling_expiration: false,
                selected_selling_price: NaN,
                selected_average_price:0,
                selected_shares:0,
                // leverage: {{product.real_leveraged_multiplier }},
                button_text:"Calculate your selling price",
                gains:500,
                price: 0,
                // current_price: {{product.basic_results.last | unlocalize}},
                percentage: 10,
                // currency: '{{product.currency}}',
                // decimals: {{product.decimals| unlocalize}},
                investments_ids:"",
                key:0,
                loading_ios:false,
                
            }
        },
        watch: {
            selected: function() {
                this.selected_shares=this.selected.reduce((accum,item) => accum + item.shares, 0)
                this.selected_invested=this.selected.reduce((accum,item) => accum + item.invested, 0)
                if (this.selected_shares!=0){
                    var selected_sharesbyaverage=this.selected.reduce((accum,item) => accum + item.shares*item.average_price, 0)
                    this.selected_average_price=selected_sharesbyaverage/this.selected_shares
                } else {
                    this.selected_average_price=0
                }
                this.calculate()
            },
            // gains: function(value) {
            //     this.calculate()
            // },
            // percentage: function(value) {
            //     this.calculate()
            // },
            // price: function(value) {
            //     this.calculate()
            // },
            // tab: function(value){
            //     this.calculate()
            // }
        },
        methods:{           
            displayvalues(){
                return [
                    // {title:this.$t('Selected invested amount'), value: currency_generic_string(0)},
                    // {title:this.$t('Selling expiration'), value: this.selling_expiration_message},
                    // {title:this.$t('Active'), value: this.investment.active},
                    // {title:this.$t('Currency'), value: this.investment.currency},
                    // {title:this.$t('Product'), value: this.investment.products},
                    // {title:this.$t('Leverage'), value: this.leverage_message},
                    // {title:this.$t('Daily adjustment'), value: this.investment.daily_adjustment},
                    // {title:this.$t('Id'), value: this.investment.id},
                ]
            },
        // <v-container style="width:60%">
        //     <v-card class="padding">
        //         <label>{{ $t("Selected invested amount") }}: [[currency_string(selected_invested, currency)]]</label><br>
        //         <label>{{ $t("Number of shares selected") }}: [[selected_shares]]</label><br>
        //         <label>{{ $t("Average price of selected shares") }}: [[currency_string(selected_average_price, currency, decimals)]]</label><br>
        //         <label>{{ $t("Product leverage") }}: [[leverage]]</label><br>
        //         <label>{{ $t("Product current price") }}:  [[currency_string(current_price, currency, decimals)]]</label><br>
        //     </v-card>    
        // </v-container>
            selling_price_to_gain_money(money){
                var PF=0
                if (this.selected_shares>0){
                    PF=(money+this.selected_average_price*this.selected_shares*this.leverage)/(this.selected_shares*this.leverage)        
                } 
                else if (this.selected_shares<0){
                    PF=(-money+this.selected_average_price*this.selected_shares*this.leverage)/(this.selected_shares*this.leverage)        
                }
                return PF
            },    
            selling_price_to_gain_percentage_of_invested(percentage){
                var gains=this.selected_invested*percentage/100
                return this.selling_price_to_gain_money(gains)
            },
            
            submit(){               
                console.log(this.selling_expiration)
                if (this.$refs.form.validate()==false) return
                this.$refs.form.$el.submit()
            },
            calculate(){
                
                if (this.tab==0){
                    this.selected_selling_price=this.selling_price_to_gain_percentage_of_invested(this.percentage)
                } else if (this.tab==1) {
                    this.selected_selling_price=this.selling_price_to_gain_money(this.gains)
                } else if (this.tab==2) {
                    this.selected_selling_price=this.price
                }
                    
                var gai=(this.selected_selling_price-this.selected_average_price)*this.selected_shares*this.leverage
                this.button_text=`Set selected investments selling price to ${this.currency_string(this.selected_selling_price, this.currency, this.decimals)} to gain ${this.currency_string(gai,this.currency, 2)}`
                
                var s=""
                this.selected.forEach(v=> s=s+`${v.id}, `)
                this.investments_ids=s.slice(0,-2)
            },
            refreshInvestmentsOperations(){
                this.loading_ios=true
                axios.get(`${this.$store.state.apiroot}/investmentsoperations/investments/sameproduct/?product=${this.product}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.dividends=response.data
                    this.data=[]
                    response.data.forEach( ioo => {
                        this.data.push({
                            id: ioo.investment.id,
                            name: ioo.investment.name,
                            shares: listobjects_sum(ioo.io_current,"shares"),
                            
                        })
                    })


                    // { text: this.$t('Id'), value: 'id', sortable: true },
                    // { text: this.$t('Name'), value: 'name', sortable: true},
                    // { text: this.$t('Shares'), value: 'shares', sortable: true, align: 'right'},
                    // { text: this.$t('Selling price'), value: 'selling_price', sortable: true, align: 'right'},
                    // { text: this.$t('Selling expiration'), value: 'selling_expiration', sortable: true, align: 'right'},
                    // { text: this.$t('Average price'), value: 'average_price', sortable: true, align: 'right'},
                    // { text: this.$t('Invested'), value: 'invested', sortable: true, align: 'right'},
                    // { text: this.$t('Balance'), value: 'balance_investment', sortable: true, align: 'right'},
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