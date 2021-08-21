
<template>
    <div>
        <h1>{{ $t(`Investment details of '${investment.name}'`)}}</h1>
        <v-layout style="justify-content: center;">
            <v-card class="padding" style="width:50%;">
                <p class="info"><strong>{{ $t('Id') }}: </strong>{{ investment.id }}</p>
                <p class="info"><strong>{{ $t('Name') }}: </strong>{{ investment.name }}</p>
                <p class="info"><strong>{{ $t('Product Id') }}: </strong>{{ investment.products }}</p>
                <p class="info"><strong>{{ $t('Active') }}: </strong>{{ investment.active }}</p>
                <p class="info"><strong>{{ $t('Selling point') }}: </strong>{{ investment.selling_price }}
                {% if gains_at_selling_price %}
                    . {% blocktrans %} to gain {% gains_at_selling_price %}.{% endblocktrans %}</p>
                <p v-html="selling_expiration_message"></p>
                <p class="info"><strong>{{ $t('Daily adjustment') }}: </strong>{{ investment.daily_adjustment }}</p>
                <p class="info"><strong>{{ $t('Currency') }}: </strong>{{ investment.currency }}</p>
                <p class="info"><strong>{{ $t('Leverage') }}: </strong>{% investment.products.leverages.multiplier %} (Real: {%investment.products.real_leveraged_multiplier%})</p>
            </v-card>
            <MyMenuInline :items="items" @selected="items_selected"></MyMenuInline>
        </v-layout>
        <p></p>
        <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
            <v-tab key="current">{{ $t('Current investment operations') }}</v-tab>
            <v-tab key="operations">{{ $t('Investment operations') }}</v-tab>
            <v-tab key="historical">{{ $t('Historical investment operations') }}</v-tab>
            <v-tab key="dividends">{{ $t('Dividends') }}</v-tab>
            <v-tabs-slider color="yellow"></v-tabs-slider>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item key="current">      
                <div>
                    <v-tabs vertical  v-model="tabcurrent">
                        <v-tab key="investment">{{ $t('Investment currency') }}</v-tab>
                        <v-tab key="account">{{ $t('Account currrency') }}</v-tab>
                        <v-tab-item key="investment">     
                            <v-card class="padding" v-if="!loading_ios">
                                <TableInvestmentOperationsCurrent :items="io_current" currency_account="EUR" currency_investment="EUR" currency_user="EUR" output="investment" height="400" :key="key"></TableInvestmentOperationsCurrent>
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="account">
                                    <v-card class="padding" v-if="!loading_ios">
                                            <TableInvestmentOperationsCurrent :items="io_current" currency_account="EUR" currency_investment="EUR" currency_user="EUR" output="account" height="400" :key="key"></TableInvestmentOperationsCurrent>
                                    </v-card>
                            </v-tab-item>
                    </v-tabs>
                </div>
            </v-tab-item>
            <v-tab-item key="operations">          
                <div>
                    <v-tabs vertical  v-model="tabcurrent">
                        <v-tab key="investment">{{ $t('Investment currency') }}</v-tab>
                            <v-tab key="account">{{ $t('Account currrency') }}</v-tab>
                        <v-tab-item key="investment">     
                            <v-card class="padding" v-if="!loading_ios">
                                <TableInvestmentOperations :items="io" currency_account="EUR" currency_investment="EUR" currency_user="EUR" height="400" :key="key" output="investment"></TableInvestmentOperations>
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="account">
                                <v-card class="padding" v-if="!loading_ios">
                                    <TableInvestmentOperations :items="io" currency_account="EUR" currency_investment="EUR" currency_user="EUR" height="400" :key="key" output="account"></TableInvestmentOperations>
                                </v-card>
                            </v-tab-item>
                    </v-tabs>
                </div>
            </v-tab-item>
            <v-tab-item key="historical">     
                <div>            
                    <v-tabs vertical  v-model="tabcurrent">
                        <v-tab key="investmenth">{{ $t('Investment currency') }}</v-tab>
                            <v-tab key="accounth">{{ $t('Account currrency') }}</v-tab>
                        <v-tab-item key="investmenth">     
                            <v-card class="padding"  v-if="!loading_ios">
                                <TableInvestmentOperationsHistorical :items="io_historical" currency_account="EUR" currency_investment="EUR" currency_user="EUR" height="400" output="investment" :key="key"></TableInvestmentOperationsHistorical>
                            </v-card>
                        </v-tab-item>
                            <v-tab-item key="accounth">
                                <v-card class="padding" v-if="!loading_ios">
                                    <TableInvestmentOperationsHistorical :items="io_historical" currency_account="EUR" currency_investment="EUR" currency_user="EUR" height="400" output="account" :key="key"></TableInvestmentOperationsHistorical>
                                </v-card>
                            </v-tab-item>
                    </v-tabs>
                </div>
            </v-tab-item>
            <v-tab-item key="dividends">     
                <v-card class="padding" v-if="!loading_ios">
                    <TableDividends :items="items_dividends" currency_account="EUR"  height="400" output="user" :key="key" heterogeneus></TableDividends>
                </v-card>
            </v-tab-item>
        </v-tabs-items> 
    </div>  
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './MyMenuInline.vue'
    import TableDividends from './TableDividends.vue'
    import TableInvestmentOperations from './TableInvestmentOperations.vue'
    import TableInvestmentOperationsHistorical from './TableInvestmentOperationsHistorical.vue'
    import TableInvestmentOperationsCurrent from './TableInvestmentOperationsCurrent.vue'
    export default {
        components:{
            MyMenuInline,
            TableInvestmentOperations,
            TableInvestmentOperationsCurrent,
            TableInvestmentOperationsHistorical,
            TableDividends,
        },
        props: {
            investment: {
                required: true
            },
        },
        data () {
            return {
                tab:0,
                tabcurrent:0,
                key:0,
                io: [],
                io_current: [],
                io_historical: [],
                loading_ios:true,
                items_dividends: [],
                selling_expiration_message:"",
                items: [
                    {
                        subheader:this.$t('Investment orders'),
                        children: [
                            {
                                name:this.$t('Update this investment'),
                                type: "redirection",
                                command: "{% url 'investment_update' pk=investment.id %}",
                                icon: "mdi-pencil",
                            },
                            {
                                name:this.$t('Change active status'),
                                type: "redirection",
                                command:"{% url 'investment_change_active' pk=investment.id %}",
                                icon: "mdi-pencil",
                            },
                            {
                                name:this.$t('Show evolution chart'),
                                type: "redirection",
                                command:"{% url 'investment_view_chart' pk=investment.id %}",
                                icon: "mdi-chart-areaspline",
                            },
                            {
                                name:this.$t('Change selling price of investments with the same product'),
                                type: "redirection",
                                command:"{% url 'investments_same_product_change_selling_price' products_id=investment.products.id %}",
                                icon: "mdi-pencil",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Product orders'),
                        children: [
                            {
                                name:this.$t('View product'),
                                type: "redirection",
                                command:"{% url 'product_view' pk=investment.products.id %}",
                                icon: "mdi-magnify",
                            },
                            {
                                name:this.$t('Add a quote to product'),
                                type: "redirection",
                                command:"{% url 'quote_new' products_id=investment.products.id %}",
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Delete last quote'),
                                type: "redirection",
                                command:"{% url 'quote_delete_last' products_id=investment.products.id %}?next={% url 'investment_list_active')",
                                icon: "mdi-delete",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Investment operation orders'),
                        children: [
                            {
                                name:this.$t('Add an investment operation'),
                                type: "redirection",
                                command: "{% url 'investmentoperation_new' investments_id=investment.id %}",
                                icon: "mdi-book-plus",
                            },
                            {
                                name:this.$t('Add an investment operation adjusting currency conversion factor'),
                                type: "function",
                                command: "newio_adjusting_cc",
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Dividend orders'),
                        children: [
                            {
                                name:this.$t('Add a dividend'),
                                type: "redirection",
                                command: "{% url 'dividend_new' investments_id=investment.id %}",
                                icon: "mdi-book-plus",
                            },
                        ]
                    },
                ]
            }  
        },
        watch:{
            tab: function (){
                this.key=this.key+1
            }
        },
        methods: {
            items_selected(item){
                alert(item)
                /*if (item.command=="newio_adjusting_cc"){
                    var selling_price_product_currency=parseNumber(prompt( this.$t("Please add the operation close price in product currency"), 0 ));
                    var gains_account_currency=parseNumber(prompt( this.$t("Please add the final gains in account currency"), 0 ));
                    var shares=parseNumber("{{ operations.current_shares|unlocalize}}");
                    var average_price_current_account=parseNumber("{{operations.current_average_price_account.amount|unlocalize}}");
                    var leverage=parseNumber("{{operations.investment.products.real_leveraged_multiplier}}")
                    
                    var currency_conversion=(gains_account_currency+shares*average_price_current_account*leverage)/(shares*selling_price_product_currency*leverage)
                    var url=`{% url 'investmentoperation_new' investments_id=investment.id %}?currency_conversion=${my_round(currency_conversion,10)}&price=${selling_price_product_currency}&shares=${-shares}`;
                    window.location.href=url;
                }*/
            },
            update_investmentsoperations(){
                axios.get(`${this.$store.state.apiroot}/investmentsoperations/full?investments=${this.investment.id}`, this.myheaders())
                .then((response) => {
                     console.log(this.investment)
                    console.log(response.data[0])
                    this.io=response.data[0].io
                    this.io_current=response.data[0].io_current
                    this.io_historical=response.data[0].io_historical
                    this.loading_ios=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            }
        },
        mounted(){
            this.loading_ios=true

            this.selling_expiration_message= '<strong>' + this.$t("Selling expiration") + `: </strong>${this.investment.selling_expiration}`
            if (new Date(this.investment.selling_expiration)<new Date()){
                this.selling_expiration_message=this.selling_expiration_message+ '<span class="red"> '+ this.$t('You must set a new selling order.') + '</span>'
            }


            this.update_investmentsoperations()

        }
    }
</script>

