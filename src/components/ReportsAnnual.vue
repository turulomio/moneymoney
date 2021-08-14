<template>
    <div>
        <h1>{{ $t("Total report") }}</h1>
            <div class="d-flex justify-center mb-4">
                <v-card width="20%" class="pa-5">
                    <v-select dense label="Select the year from which to display the report" v-model="year" :items="years()" @change="change_year()"></v-select>
                </v-card>
            </div>

        <p>{{ last_year_balance_string }}</p>

        <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
            <v-tab key="0">{{ $t("Month evolution") }}</v-tab>
            <v-tab key="1">{{ $t("Income report") }}</v-tab>
            <v-tab key="2">{{ $t("Gains by product type") }}</v-tab>
            <v-tabs-slider color="yellow"></v-tabs-slider>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item key="0">
                <v-card class="padding" outlined>            
                    <v-data-table dense :headers="total_annual_headers" :items="total_annual"  class="elevation-1" disable-pagination  hide-default-footer :loading="loading_annual">      
                        <template v-slot:[`item.account_balance`]="{ item }">
                            <div v-html="localcurrency_html(item.account_balance)"></div>
                        </template>      
                        <template v-slot:[`item.investment_balance`]="{ item }">
                            <div v-html="localcurrency_html(item.investment_balance)"></div>
                        </template>   
                        <template v-slot:[`item.total`]="{ item }">
                            <div v-html="localcurrency_html(item.total)"></div>
                        </template>   
                        <template v-slot:[`item.diff_lastmonth`]="{ item }">
                            <div v-html="localcurrency_html(item.diff_lastmonth)"></div>
                        </template>   
                        <template v-slot:[`item.percentage_year`]="{ item }">
                            <div v-html="percentage_html(item.percentage_year)"></div>
                        </template>   
                        <template v-slot:[`body.append`]="{headers}">
                            <tr style="background-color: GhostWhite" ref="lr">
                                <td v-for="(header,i) in headers" :key="i" >
                                    <div v-if="header.value == 'month'">
                                        Total
                                    </div>
                                    <div v-if="header.value == 'diff_lastmonth'" align="right">
                                        <div v-html="localcurrency_html(listobjects_sum(total_annual,'diff_lastmonth'))"></div>
                                    </div>
                                </td>
                            </tr>
                            
                        </template>
                    </v-data-table>   
                </v-card>
            </v-tab-item>
            <v-tab-item key="1">     
                <v-card class="padding" outlined>            
                    <v-data-table dense :headers="total_annual_incomes_headers" :items="total_annual_incomes"  class="elevation-1" disable-pagination  hide-default-footer :loading="loading_annual_incomes">      
                        <template v-slot:[`item.expenses`]="{ item }">
                            <div v-html="localcurrency_html(item.expenses)"></div>
                        </template>      
                        <template v-slot:[`item.incomes`]="{ item }">
                            <div v-html="localcurrency_html(item.incomes)"></div>
                        </template>   
                        <template v-slot:[`item.total`]="{ item }">
                            <div v-html="localcurrency_html(item.total)"></div>
                        </template>   
                        <template v-slot:[`item.gains`]="{ item }">
                            <div v-html="localcurrency_html(item.gains)"></div>
                        </template>   data
                        <template v-slot:[`item.dividends`]="{ item }">
                            <div v-html="localcurrency_html(item.dividends)"></div>
                        </template>    
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small class="mr-2" @click="incomeDetails(item)">mdi-pencil</v-icon>
                        </template> 
                        <template v-slot:[`body.append`]="{headers}">
                            <tr style="background-color: GhostWhite" ref="lr">
                                <td v-for="(header,i) in headers" :key="i" >
                                    <div v-if="header.value == 'month'">
                                        Total
                                    </div>
                                    <div v-if="header.value == 'expenses'" align="right">
                                        <div v-html="localcurrency_html(listobjects_sum(total_annual_incomes,'expenses'))"></div>
                                    </div>
                                    <div v-if="header.value == 'incomes'" align="right">
                                        <div v-html="localcurrency_html(listobjects_sum(total_annual_incomes,'incomes'))"></div>
                                    </div>
                                    <div v-if="header.value == 'gains'" align="right">
                                        <div v-html="localcurrency_html(listobjects_sum(total_annual_incomes,'gains'))"></div>
                                    </div>
                                    <div v-if="header.value == 'dividends'" align="right">
                                        <div v-html="localcurrency_html(listobjects_sum(total_annual_incomes,'dividends'))"></div>
                                    </div>
                                </td>
                            </tr>
                            
                        </template>
                    </v-data-table>
                </v-card>
            </v-tab-item>
            <v-tab-item key="2">     
                <v-card class="padding" outlined>
                    <v-data-table dense :headers="total_annual_gainsbyproductstypes_headers" :items="total_annual_gainsbyproductstypes"  class="elevation-1" disable-pagination  hide-default-footer :loading="loading_annual_gainsbyproductstypes">      
                        <template v-slot:[`item.dividends_gross`]="{ item }">
                            <div v-html="localcurrency_html(item.dividends_gross)"></div>
                        </template>      
                        <template v-slot:[`item.dividends_net`]="{ item }">
                            <div v-html="localcurrency_html(item.dividends_net)"></div>
                        </template>   
                        <template v-slot:[`item.gains_gross`]="{ item }">
                            <div v-html="localcurrency_html(item.gains_gross)"></div>
                        </template>   
                        <template v-slot:[`item.gains_net`]="{ item }">
                            <div v-html="localcurrency_html(item.gains_net)"></div>
                        </template>    
                        <template v-slot:[`body.append`]="{headers}">
                            <tr style="background-color: GhostWhite" ref="lr">
                                <td v-for="(header,i) in headers" :key="i" >
                                    <div v-if="header.value == 'name'">
                                        Total
                                    </div>
                                    <div v-if="header.value == 'dividends_gross'" align="right">
                                        <div v-html="localcurrency_html(listobjects_sum(total_annual_gainsbyproductstypes,'dividends_gross'))"></div>
                                    </div>
                                    <div v-if="header.value == 'dividends_net'" align="right">
                                        <div v-html="localcurrency_html(listobjects_sum(total_annual_gainsbyproductstypes,'dividends_net'))"></div>
                                    </div>
                                    <div v-if="header.value == 'gains_gross'" align="right">
                                        <div v-html="localcurrency_html(listobjects_sum(total_annual_gainsbyproductstypes,'gains_gross'))"></div>
                                    </div>
                                    <div v-if="header.value == 'gains_net'" align="right">
                                        <div v-html="localcurrency_html(listobjects_sum(total_annual_gainsbyproductstypes,'gains_net'))"></div>
                                    </div>
                                </td>
                            </tr>
                            
                        </template>
                    </v-data-table>   
                    <div v-html="footer_gainsbyproductstypes()"></div>
                
                </v-card>
            </v-tab-item>
        </v-tabs-items>     
    </div>
</template>
<script>     

    import axios from 'axios'
    import {listobjects_sum, localtime} from '../functions.js'
    export default {
        components:{
        },
        data(){
            return {
                tab:0,   
                total_annual: [],
                total_annual_headers: [
                    { text: this.$t('Month'), value: 'month',sortable: false },
                    { text: this.$t('Account balance'), value: 'account_balance', sortable: false, align:'right'},
                    { text: this.$t('Investment balance'), value: 'investment_balance', sortable: false, align:'right'},
                    { text: this.$t('Total balance'), value: 'total',sortable: false, align:'right'},
                    { text: this.$t('Last month difference'), value: 'diff_lastmonth', sortable: false, align:'right'},
                    { text: this.$t('% year to date'), value: 'percentage_year', sortable: false, align:'right'},
                ],   
                total_annual_incomes:[],
                total_annual_incomes_headers: [
                    { text: this.$t('Month'), value: 'month',sortable: true },
                    { text: this.$t('Incomes'), value: 'incomes', sortable: true, align:'right'},
                    { text: this.$t('Expenses'), value: 'expenses', sortable: true, align:'right'},
                    { text: this.$t('Gains'), value: 'gains',sortable: true, align:'right'},
                    { text: this.$t('Dividends'), value: 'dividends', sortable: true, align:'right'},
                    { text: this.$t('Total'), value: 'total', sortable: true, align:'right'},
                    { text: this.$t('Actions'), value: 'actions', sortable: true, align:'right'},
                ],     
                total_annual_gainsbyproductstypes:[],
                total_annual_gainsbyproductstypes_headers: [
                    { text: this.$t('Name'), value: 'name',sortable: true },
                    { text: this.$t('Gross gains'), value: 'gains_gross', sortable: true, align:'right'},
                    { text: this.$t('Gross dividends'), value: 'dividends_gross', sortable: true, align:'right'},
                    { text: this.$t('Net gains'), value: 'gains_net',sortable: true, align:'right'},
                    { text: this.$t('Net dividends'), value: 'dividends_net', sortable: true, align:'right'},
                ],   
                year: 2021,
                last_year_balance_string: "",
                loading_annual:true,
                loading_annual_incomes:true,
                loading_annual_gainsbyproductstypes:true,
            }
        },
        computed:{
        },
        methods:{
            localtime,
            years(){
                var start=1990
                var end=new Date().getFullYear()
                return Array(end - start + 1).fill().map((_, idx) => start + idx)
            },
            change_year(){
                this.refreshTables()
            },
            footer_gainsbyproductstypes(){
                var gross_gains=listobjects_sum(this.total_annual_gainsbyproductstypes,'gains_gross')+listobjects_sum(this.total_annual_gainsbyproductstypes,'dividends_gross')
                var net_gains=listobjects_sum(this.total_annual_gainsbyproductstypes,'gains_net')+listobjects_sum(this.total_annual_gainsbyproductstypes,'dividends_net')
                return this.$t("<p class='mt-4'>Gross gains + Gross dividends = {0}.</p><p>Net gains + Net dividends = {1}.</p>").format(this.localcurrency_html(gross_gains), this.localcurrency_html(net_gains))
            },
            incomeDetails(item){
            
                var url='{% url "report_total_income_details" year=9999 month=8888 }}'.replace('9999', this.year).replace('8888', item.month_number)
                window.open(url, '_blank')            
            },
            refreshTables(){
                this.loading_annual=true
                this.loading_annual_incomes=true
                this.loading_annual_gainsbyproductstypes=true
                this.last_year_balance_string=""
                axios.get(`${this.$store.state.apiroot}/reports/annual/${this.year}/`, this.myheaders())
                .then((response) => {
                        console.log(response.data)
                        this.last_year_balance_string=this.$t(`Last year balance (${this.localtime(response.data.dtaware_last_year)}) is ${this.localcurrency_html(response.data.last_year_balance)}`) 
                        this.total_annual=response.data.data
                        this.loading_annual=false
                }, (error) => {
                    this.parseResponseError(error)
                })
                axios.get(`${this.$store.state.apiroot}/reports/annual/income/${this.year}/`, this.myheaders())
                .then((response) => {
                        console.log(response.data)
                        this.total_annual_incomes=response.data
                        this.loading_annual_incomes=false
                }, (error) => {
                    this.parseResponseError(error)
                })            
                axios.get(`${this.$store.state.apiroot}/reports/annual/gainsbyproductstypes/${this.year}/`, this.myheaders())
                .then((response) => {
                        console.log(response.data)
                        this.total_annual_gainsbyproductstypes=response.data
                        this.loading_annual_gainsbyproductstypes=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            }
        },
        mounted(){
            this.refreshTables()

        }
    }
</script>
