<template>
    <div>
        <h1>{{ $t("Evolution report") }}</h1>
        <div class="d-flex justify-center mb-4">
            <v-card width="20%" class="pa-5">
                <v-select density="compact" :label="$t('Select the year from which to display the report')" v-model="year" :items="years()" @change="change_year()"></v-select>
            </v-card>
        </div>
        <div class="ma-4">
            <v-tabs  bg-color="secondary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
                <v-tab key="0">{{ $t("Assets evolution report") }}</v-tab>
                <v-tab key="1">{{ $t("Invested assets evolution report") }}</v-tab>
            </v-tabs>
            <v-window v-model="tab">
                <v-window-item key="0">
                    <v-card outlined>
                        <v-data-table density="compact" :headers="assetsHeaders" :items="assetsData"  class="elevation-1" :sort-by="['year']" :loading="loading_assets"    :items-per-page="10000" >
                            <template #item.balance_start="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.balance_start)"></div>
                            </template>   
                            <template #item.balance_end="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.balance_end)"></div>
                            </template>
                            <template #item.diff="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.diff)"></div>
                            </template>
                            <template #item.dividends_net="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.dividends_net)"></div>
                            </template>        
                            <template #item.gains_net="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.gains_net)"></div>
                            </template>        
                            <template #item.incomes="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.incomes)"></div>
                            </template>        
                            <template #item.expenses="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.expenses)"></div>
                            </template>        
                            <template #item.total="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.total)"></div>
                            </template>                
                             <template #tbody>
                                <tr class="totalrow" ref="lr">
                                    <td>{{ $t("Total") }}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(assetsData,'incomes'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(assetsData,'gains_net'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(assetsData,'dividends_net'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(assetsData,'expenses'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(assetsData,'total'))"></td>
                                </tr>
                            </template>
                <template #bottom ></template>   
                        </v-data-table>   
                    </v-card>
                </v-window-item>
                <v-window-item key="1">     
                    <v-card outlined>
                        <v-data-table density="compact" :headers="investedHeaders" :items="investedData"  class="elevation-1" :sort-by="[{key:'year',order:'asc'}]" :loading="loading_invested"    :items-per-page="10000" >
                            <template #item.invested="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.invested)"></div>
                            </template>   
                            <template #item.balance="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.balance)"></div>
                            </template>
                            <template #item.diff="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.diff)"></div>
                            </template>
                            <template #item.percentage="{item}">
                                <div class="text-right" v-html="percentage_html(item.percentage)"></div>
                            </template>
                            <template #item.net_gains_plus_dividends_plus_fo="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.net_gains_plus_dividends_plus_fo)"></div>
                            </template>
                            <template #item.custody_commissions="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.custody_commissions)"></div>
                            </template>
                            <template #item.taxes="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.taxes)"></div>
                            </template>
                            <template #item.investment_commissions="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.investment_commissions)"></div>
                            </template>
                             <template #tbody>
                                <tr class="totalrow" ref="lr">
                                    <td>{{ $t("Total") }}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(investedData,'net_gains_plus_dividends_plus_fo'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(investedData,'custody_commissions'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(investedData,'taxes'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(investedData,'investment_commissions'))"></td>
                                </tr>
                                
                            </template>
                <template #bottom ></template>   
                        </v-data-table>  
                        <div class="ma-3" v-html="report()" v-if="investedData.length>0"></div>
                    </v-card>
                </v-window-item>
            </v-window>    
        </div>
    </div>
</template>
<script>     
    import axios from 'axios'
    import {f} from 'vuetify_rules'
    export default {
        components:{
        },
        data(){
            return {
                tab:1,
                assetsHeaders: [
                    { title: this.$t('Year'), key: 'year',sortable: true },
                    { title: this.$t('Initial balance'), key: 'balance_start',sortable: true, align:'end'},
                    { title: this.$t('Final balance'), key: 'balance_end',sortable: true, align:'end'},
                    { title: this.$t('Difference'), key: 'diff',sortable: true, align:'end'},
                    { title: this.$t('Incomes'), key: 'incomes',sortable: true, align:'end'},
                    { title: this.$t('Net gains'), key: 'gains_net',sortable: true, align:'end'},
                    { title: this.$t('Net dividends'), key: 'dividends_net',sortable: true, align:'end'},
                    { title: this.$t('Expenses'), key: 'expenses',sortable: true, align:'end'},
                    { title: this.$t('Total'), key: 'total',sortable: true, align:'end'},
                ],   
                assetsData: [],
                investedHeaders: [
                    { title: this.$t('Year'), key: 'year',sortable: true, width:"8.5%" },
                    { title: this.$t('Invested balance'), key: 'invested',sortable: true, align:'end', width:"11.5%" },
                    { title: this.$t('Balance'), key: 'balance',sortable: true, align:'end', width:"11.5%" },
                    { title: this.$t('Difference'), key: 'diff',sortable: true, align:'end', width:"11.5%" },
                    { title: this.$t('Percentage'), key: 'percentage',sortable: true, align:'end', width:"11.5%" },
                    { title: this.$t('Net gains + Div. + FO'), key: 'net_gains_plus_dividends_plus_fo',sortable: true, align:'end', width:"11.5%" },
                    { title: this.$t('Custody commissions'), key: 'custody_commissions',sortable: true, align:'end', width:"11.5%" },
                    { title: this.$t('Taxes'), key: 'taxes',sortable: true, align:'end', width:"11.5%" },
                    { title: this.$t('Investment commissions'), key: 'investment_commissions',sortable: true, align:'end', width:"11.5%" },
                ],   
                investedData: [],
                year: new Date().getFullYear()-3,
                loading_invested:false,
                loading_assets:false,
                key: 0,
            }
        },
        methods:{
            f,
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
                var sum_gd=this.listobjects_sum(this.investedData,'net_gains_plus_dividends_plus_fo')
                var sum_cc=this.listobjects_sum(this.investedData,'custody_commissions')
                var sum_t=this.listobjects_sum(this.investedData,'taxes')
                var s=""
                s=s+"<br>"+f(this.$t("Difference between invested amount and current invesment balance is [0]."), [this.localcurrency_html(diff)] )
                s=s+"<br>"
                s=s+"<br>"+f(this.$t("From [0] I've generated [1] gains (investment commisions are included)."), [this.year,this.localcurrency_html(sum_gd)])
                s=s+"<br>"
                s=s+"<br>"+f(this.$t("Sum of taxes and custody commissions is [0]."), [this.localcurrency_html(sum_cc+sum_t)])
                s=s+"<br>"
                s=s+"<br>"+f(this.$t("So, I've generated [0] gains."), [this.localcurrency_html(sum_gd+sum_cc+sum_t)])
                s=s+"<br>"
                var balance=diff+sum_gd+sum_t+sum_cc
                if (balance>0){
                    s=s+"<br>"+f(this.$t("So I'm wining [0] which is [1] per year."), [this.localcurrency_html(balance), this.localcurrency_html(balance/(new Date().getFullYear()-this.year+1))])
                } else {
                    s=s+"<br>"+f(this.$t("So I'm losing [0] which is [1] per year."), [ this.localcurrency_html(balance), this.localcurrency_html(balance/(new Date().getFullYear()-this.year+1))])
                }
                return s
            },

            refreshTables(){
                this.loading_assets=true
                this.loading_invested=true
                axios.get(`${this.store().apiroot}/reports/evolutionassets/${this.year}/`, this.myheaders())
                .then((response) => {
                    this.assetsData=response.data
                    this.loading_assets=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
                axios.get(`${this.store().apiroot}/reports/evolutioninvested/${this.year}/`, this.myheaders())
                .then((response) => {
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
