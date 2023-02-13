<template>
    <div>
        <h1>{{ $t("Evolution report") }}</h1>
        <div class="d-flex justify-center mb-4">
            <v-card width="20%" class="pa-5">
                <v-select dense :label="$t('Select the year from which to display the report')" v-model="year" :items="years()" @change="change_year()"></v-select>
            </v-card>
        </div>
        <div class="ma-4">
            <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
                <v-tab key="0">{{ $t("Assets evolution report") }}</v-tab>
                <v-tab key="1">{{ $t("Invested assets evolution report") }}</v-tab>
                <v-tabs-slider color="yellow"></v-tabs-slider>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item key="0">
                    <v-card outlined>
                        <v-data-table dense :headers="assetsHeaders" :items="assetsData"  class="elevation-1" disable-pagination  hide-default-footer :sort-by="['year']" :loading="loading_assets">
                            <template v-slot:[`item.balance_start`]="{ item }">
                                <div v-html="localcurrency_html(item.balance_start)"></div>
                            </template>   
                            <template v-slot:[`item.balance_end`]="{ item }">
                                <div v-html="localcurrency_html(item.balance_end)"></div>
                            </template>
                            <template v-slot:[`item.diff`]="{ item }">
                                <div v-html="localcurrency_html(item.diff)"></div>
                            </template>
                            <template v-slot:[`item.dividends_net`]="{ item }">
                                <div v-html="localcurrency_html(item.dividends_net)"></div>
                            </template>        
                            <template v-slot:[`item.gains_net`]="{ item }">
                                <div v-html="localcurrency_html(item.gains_net)"></div>
                            </template>        
                            <template v-slot:[`item.incomes`]="{ item }">
                                <div v-html="localcurrency_html(item.incomes)"></div>
                            </template>        
                            <template v-slot:[`item.expenses`]="{ item }">
                                <div v-html="localcurrency_html(item.expenses)"></div>
                            </template>        
                            <template v-slot:[`item.total`]="{ item }">
                                <div v-html="localcurrency_html(item.total)"></div>
                            </template>                
                            <template v-slot:[`body.append`]="{headers}">
                                <tr class="totalrow" ref="lr">
                                    <td v-for="(header,i) in headers" :key="i" >
                                        <div v-if="header.value == 'year'">
                                            Total
                                        </div>
                                        <div v-if="header.value == 'dividends_net'" class="d-flex justify-end">
                                            <div v-html="localcurrency_html(listobjects_sum(assetsData,'dividends_net'))"></div>
                                        </div>
                                        <div v-if="header.value == 'gains_net'" class="d-flex justify-end">
                                            <div v-html="localcurrency_html(listobjects_sum(assetsData,'gains_net'))"></div>
                                        </div>
                                        <div v-if="header.value == 'incomes'" class="d-flex justify-end">
                                            <div v-html="localcurrency_html(listobjects_sum(assetsData,'incomes'))"></div>
                                        </div>
                                        <div v-if="header.value == 'expenses'" class="d-flex justify-end">
                                            <div v-html="localcurrency_html(listobjects_sum(assetsData,'expenses'))"></div>
                                        </div>
                                        <div v-if="header.value == 'total'" class="d-flex justify-end">
                                            <div v-html="localcurrency_html(listobjects_sum(assetsData,'total'))"></div>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>   
                    </v-card>
                </v-tab-item>
                <v-tab-item key="1">     
                    <v-card outlined>
                        <v-data-table dense :headers="investedHeaders" :items="investedData"  class="elevation-1" disable-pagination  hide-default-footer :sort-by="['year']" :loading="loading_invested">
                            <template v-slot:[`item.invested`]="{ item }">
                                <div v-html="localcurrency_html(item.invested)"></div>
                            </template>   
                            <template v-slot:[`item.balance`]="{ item }">
                                <div v-html="localcurrency_html(item.balance)"></div>
                            </template>
                            <template v-slot:[`item.diff`]="{ item }">
                                <div v-html="localcurrency_html(item.diff)"></div>
                            </template>
                            <template v-slot:[`item.percentage`]="{ item }">
                                <div v-html="percentage_html(item.percentage)"></div>
                            </template>
                            <template v-slot:[`item.net_gains_plus_dividends`]="{ item }">
                                <div v-html="localcurrency_html(item.net_gains_plus_dividends)"></div>
                            </template>
                            <template v-slot:[`item.custody_commissions`]="{ item }">
                                <div v-html="localcurrency_html(item.custody_commissions)"></div>
                            </template>
                            <template v-slot:[`item.taxes`]="{ item }">
                                <div v-html="localcurrency_html(item.taxes)"></div>
                            </template>
                            <template v-slot:[`item.investment_commissions`]="{ item }">
                                <div v-html="localcurrency_html(item.investment_commissions)"></div>
                            </template>            
                            <template v-slot:[`body.append`]="{headers}">
                                <tr class="totalrow" ref="lr">
                                    <td v-for="(header,i) in headers" :key="i" >
                                        <div v-if="header.value == 'year'">
                                            Total
                                        </div>
                                        <div v-if="header.value == 'net_gains_plus_dividends'" class="d-flex justify-end">
                                            <div v-html="localcurrency_html(listobjects_sum(investedData,'net_gains_plus_dividends'))"></div>
                                        </div>
                                        <div v-if="header.value == 'custody_commissions'" class="d-flex justify-end">
                                            <div v-html="localcurrency_html(listobjects_sum(investedData,'custody_commissions'))"></div>
                                        </div>
                                        <div v-if="header.value == 'taxes'" class="d-flex justify-end">
                                            <div v-html="localcurrency_html(listobjects_sum(investedData,'taxes'))"></div>
                                        </div>
                                        <div v-if="header.value == 'investment_commissions'" class="d-flex justify-end">
                                            <div v-html="localcurrency_html(listobjects_sum(investedData,'investment_commissions'))"></div>
                                        </div>
                                    </td>
                                </tr>
                                
                            </template>
                        </v-data-table>  
                        <div class="ma-3" v-html="report()" v-if="investedData.length>0"></div>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>    
        </div>
    </div>
</template>
<script>     
    import axios from 'axios'
    export default {
        components:{
        },
        data(){
            return {
                tab:1,
                assetsHeaders: [
                    { text: this.$t('Year'), value: 'year',sortable: true },
                    { text: this.$t('Initial balance'), value: 'balance_start',sortable: true, align:'right'},
                    { text: this.$t('Final balance'), value: 'balance_end',sortable: true, align:'right'},
                    { text: this.$t('Difference'), value: 'diff',sortable: true, align:'right'},
                    { text: this.$t('Incomes'), value: 'incomes',sortable: true, align:'right'},
                    { text: this.$t('Net gains'), value: 'gains_net',sortable: true, align:'right'},
                    { text: this.$t('Net dividends'), value: 'dividends_net',sortable: true, align:'right'},
                    { text: this.$t('Expenses'), value: 'expenses',sortable: true, align:'right'},
                    { text: this.$t('Total'), value: 'total',sortable: true, align:'right'},
                ],   
                assetsData: [],
                investedHeaders: [
                    { text: this.$t('Year'), value: 'year',sortable: true, width:"8.5%" },
                    { text: this.$t('Invested balance'), value: 'invested',sortable: true, align:'right', width:"11.5%" },
                    { text: this.$t('Balance'), value: 'balance',sortable: true, align:'right', width:"11.5%" },
                    { text: this.$t('Difference'), value: 'diff',sortable: true, align:'right', width:"11.5%" },
                    { text: this.$t('Percentage'), value: 'percentage',sortable: true, align:'right', width:"11.5%" },
                    { text: this.$t('Net gains + Dividends'), value: 'net_gains_plus_dividends',sortable: true, align:'right', width:"11.5%" },
                    { text: this.$t('Custody commissions'), value: 'custody_commissions',sortable: true, align:'right', width:"11.5%" },
                    { text: this.$t('Taxes'), value: 'taxes',sortable: true, align:'right', width:"11.5%" },
                    { text: this.$t('Investment commissions'), value: 'investment_commissions',sortable: true, align:'right', width:"11.5%" },
                ],   
                investedData: [],
                year: new Date().getFullYear()-3,
                loading_invested:false,
                loading_assets:false,
                key: 0,
            }
        },
        methods:{
            years(){
                var start=1990
                var end=new Date().getFullYear()
                return Array(end - start + 1).fill().map((_, idx) => start + idx)
            },
            change_year(){
                this.refreshTables()
            },
            report(){
                var last=this.investedData[this.investedData.length-1]
                var diff=last.balance-last.invested
                var sum_gd=this.listobjects_sum(this.investedData,'net_gains_plus_dividends')
                var sum_cc=this.listobjects_sum(this.investedData,'custody_commissions')
                var sum_t=this.listobjects_sum(this.investedData,'taxes')
                var s=""
                s=s+"<br>"+this.$t("Difference between invested amount and current invesment balance is {0}.").replace('{0}', this.localcurrency_html(diff) )
                s=s+"<br>"
                s=s+"<br>"+this.$t("From {0} I've generated {1} gains (investment commisions are included).").replace('{0}', this.year)
                    .replace('{1}',this.localcurrency_html(sum_gd))
                s=s+"<br>"
                s=s+"<br>"+this.$t("Sum of taxes and custody commissions is {0}.")
                    .replace('{0}', this.localcurrency_html(sum_cc+sum_t))
                s=s+"<br>"
                s=s+"<br>"+this.$t("So, I've generated {0} gains.")
                    .replace('{0}', this.localcurrency_html(sum_gd+sum_cc+sum_t))
                s=s+"<br>"
                var balance=diff+sum_gd+sum_t+sum_cc
                if (balance>0){
                    s=s+"<br>"+this.$t("So I'm wining {0} which is {1} per year.")
                        .replace('{0}', this.localcurrency_html(balance))
                        .replace('{1}', this.localcurrency_html(balance/(new Date().getFullYear()-this.year+1)))
                } else {
                    s=s+"<br>"+this.$t("So I'm losing {0} which is {1} per year.")
                        .replace('{0}', this.localcurrency_html(balance))
                        .replace('{1}', this.localcurrency_html(balance/(new Date().getFullYear()-this.year+1)))
                }
                return s
            },

            refreshTables(){
                this.loading_assets=true
                this.loading_invested=true
                axios.get(`${this.$store.state.apiroot}/reports/evolutionassets/${this.year}/`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.assetsData=response.data
                    this.loading_assets=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
                axios.get(`${this.$store.state.apiroot}/reports/evolutioninvested/${this.year}/`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.investedData=response.data
                    this.loading_invested=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        mounted(){
            this.refreshTables()

        }
    }
</script>
