<template>
    <div>
        <h1>{{ $t("Total report") }}</h1>
        <v-form ref="form" v-model="form_valid" class="d-flex justify-center mb-4">
            <v-card width="20%" class="pa-5">
                <v-select density="compact" :label="$t('Select the year from which to display the report')" v-model="year" :items="years()"/>              
                <v-text-field v-model.number="target"  :label="$t('Set annual gains target')" :placeholder="$t('Set annual gains target')" :rules="RulesFloat(6,true,6)" counter="6" suffix=" %" autofocus/>
            </v-card>
        </v-form>
        <div class="pa-6">
            <p>{{ last_year_balance_string }}</p>

            <v-tabs bg-color="secondary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
                <v-tab key="0">{{ $t("Month evolution") }}</v-tab>
                <v-tab key="1">{{ $t("Income report") }}</v-tab>
                <v-tab key="2">{{ $t("Gains by product type") }}</v-tab>
                <v-tab key="3">{{ $t("Annual target") }}</v-tab>
                <v-tab key="4">{{ $t("Invest or work") }}</v-tab>
                <v-tab key="5">{{ $t("Make ends meet") }}</v-tab>
            </v-tabs>
            <v-window v-model="tab">
                <v-window-item key="0"> <!-- MONTH EVOLUTION -->
                    <v-card outlined>            
                        <v-data-table density="compact" :headers="total_annual_headers" :items="total_annual"  class="elevation-1" :loading="loading_annual"     :items-per-page="10000" >
                            <template #item.account_balance="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.account_balance)"></div>
                            </template>      
                            <template #item.investment_balance="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.investment_balance)"></div>
                            </template>   
                            <template #item.total="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.total)"></div>
                            </template>   
                            <template #item.diff_lastmonth="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.diff_lastmonth)"></div>
                            </template>   
                            <template #item.percentage_year="{item}">
                                <div class="text-right" v-html="percentage_html(item.percentage_year)"></div>
                            </template>   
                             <template #tbody>
                                <tr class="totalrow" v-if="total_annual.length>0">
                                    <td>{{ $t("Total") }}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_annual,'diff_lastmonth'))"></td>
                                    <td class="text-right" v-html="percentage_html(listobjects_sum(total_annual,'diff_lastmonth')/last_year_balance)"></td>
                                </tr>
                            </template>
                            <template #bottom ></template>   
                        </v-data-table>   
                    </v-card>
                </v-window-item>
                <v-window-item key="1">     <!-- INCOME REPORT -->
                    <v-card outlined>            
                        <v-data-table density="compact" :headers="total_annual_incomes_headers" :items="total_annual_incomes"  class="elevation-1 cursorpointer" :loading="loading_annual_incomes" @click:row="incomeDetails"    :items-per-page="10000" >     
                            <template #item.expenses="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.expenses)"></div>
                            </template>      
                            <template #item.incomes="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.incomes)"></div>
                            </template>   
                            <template #item.total="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.total)"></div>
                            </template>   
                            <template #item.gains="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.gains)"></div>
                            </template>
                            <template #item.fast_operations="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.fast_operations)"></div>
                            </template>
                            <template #item.dividends="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.dividends)"></div>
                            </template>
                             <template #tbody>
                                <tr class="totalrow" ref="lr" v-if="total_annual_incomes.length>0">
                                    <td>{{ $t("Total") }}</td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_annual_incomes,'incomes'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_annual_incomes,'expenses'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_annual_incomes,'gains'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_annual_incomes,'fast_operations'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_annual_incomes,'dividends'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_annual_incomes,'total'))"></td>
                                </tr>
                                
                            </template>
                <template #bottom ></template>   
                        </v-data-table>
                    </v-card>
                </v-window-item>
                <v-window-item key="2">     
                    <v-card outlined>
                        <v-data-table density="compact" :headers="total_annual_gainsbyproductstypes_headers" :items="total_annual_gainsbyproductstypes"  class="elevation-1" :loading="loading_annual_gainsbyproductstypes"    :items-per-page="10000" >    
                            <template #item.dividends_gross="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.dividends_gross)"></div>
                            </template>      
                            <template #item.dividends_net="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.dividends_net)"></div>
                            </template>   
                            <template #item.gains_gross="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.gains_gross)"></div>
                            </template>   
                            <template #item.gains_net="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.gains_net)"></div>
                            </template>    
                             <template #tbody>
                                <tr class="totalrow" ref="lr" v-if="total_annual_gainsbyproductstypes.length>0">
                                    <td>{{ $t("Total") }}</td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_annual_gainsbyproductstypes,'gains_gross'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_annual_gainsbyproductstypes,'dividends_gross'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_annual_gainsbyproductstypes,'gains_net'))"></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_annual_gainsbyproductstypes,'dividends_net'))"></td>
                                </tr>
                            </template>
                            <template #bottom ></template>   
                        </v-data-table>   
                        <div v-html="footer_gainsbyproductstypes()"  v-if="total_annual_gainsbyproductstypes.length>0"></div>
                    
                    </v-card>
                </v-window-item>                
                <v-window-item key="3"><!-- ANNUAL TARGET -->
                    <v-card  outlined width="100%">
    
                        <v-data-table density="compact" :headers="total_target_headers" :items="total_target"  class="elevation-1" :loading="loading_target"     :items-per-page="10000" >
                            <template #item.month_target="{item}">
                                <div class="text-right" v-html="localcurrency_string(item.month_target)"></div>
                            </template>      
                            <template #item.month_gains="{item}">
                                <div class="text-right" v-html="localcurrency_string(item.month_gains)" :class="item.color_month_gains"></div>
                            </template>   
                            <template #item.cumulative_target="{item}">
                                <div class="text-right" v-html="localcurrency_string(item.cumulative_target)"></div>
                            </template>   
                            <template #item.cumulative_gains="{item}">
                                <div class="text-right" v-html="localcurrency_string(item.cumulative_gains)" :class="item.color_month_cumulative_gains"></div>
                            </template>
                             <template #tbody>
                                <tr class="totalrow" ref="lr"  v-if="total_target.length>0">
                                    <td>{{ $t("Total") }}</td>
                                    <td class="text-right" v-html="localcurrency_string(listobjects_sum(total_target,'month_target'))" ></td>
                                    <td class="text-right" v-html="localcurrency_string(listobjects_sum(total_target,'month_gains'))" :class="(month_target*12<listobjects_sum(total_target,'month_gains')) ? 'boldgreen' : 'boldred'"></td>
                                    <td></td>
                                    <td></td>
                                </tr>                                
                            </template>
                            <template #bottom ></template>   
                        </v-data-table>   
                        <div v-html="current_assets_gains_percentage_message" class="ma-4"   v-if="total_target.length>0"></div>
                    </v-card>
                </v-window-item>
                <v-window-item key="4"><!-- INVEST OR WORK -->
                    <v-card  outlined width="100%">
                        <v-data-table density="compact" :headers="total_invest_or_work_headers" :items="total_invest_or_work"  class="elevation-1" :loading="loading_invest_or_work"    :items-per-page="10000" >  
                            <template #item.gains="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.gains)"></div>
                            </template>      
                            <template #item.expenses="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.expenses)"></div>
                            </template>   
                            <template #item.diff="{item}">
                                <div v-html="localcurrency_string(item.diff)" :class="item.color_diff + ' right'"></div>
                            </template>
                             <template #tbody>
                                <tr class="totalrow" ref="lr"  v-if="total_invest_or_work.length>0">
                                    <td>{{ $t("Total") }}</td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_invest_or_work,'gains'))" ></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_invest_or_work,'expenses'))" ></td>
                                    <td class="text-right" v-html="localcurrency_string(listobjects_sum(total_invest_or_work,'diff'))" :class="(listobjects_sum(total_invest_or_work,'diff')>0) ? 'boldgreen' : 'boldred'"></td>
                                </tr>
                            </template>
                            <template #bottom ></template>   
                        </v-data-table>   
                        <div v-html="message_invest_or_work()" class="ma-4"   v-if="total_invest_or_work.length>0"></div>

                    </v-card>
                </v-window-item>
                <v-window-item key="5"><!-- MAKE ENDS MEET -->
                    <v-card  outlined width="100%">
                        <v-data-table density="compact" :headers="total_make_ends_meet_headers" :items="total_make_ends_meet"  class="elevation-1" :loading="loading_make_ends_meet"    :items-per-page="10000" >   
                            <template #item.incomes="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.incomes)"></div>
                            </template>      
                            <template #item.expenses="{item}">
                                <div class="text-right" v-html="localcurrency_html(item.expenses)"></div>
                            </template>   
                            <template #item.diff="{item}">
                                <div class="text-right" v-html="localcurrency_string(item.diff)" :class="item.color_diff"></div>
                            </template>
                             <template #tbody>
                                <tr class="totalrow" ref="lr"   v-if="total_make_ends_meet.length>0">
                                    <td>{{ $t("Total") }}</td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_make_ends_meet,'incomes'))" ></td>
                                    <td class="text-right" v-html="localcurrency_html(listobjects_sum(total_make_ends_meet,'expenses'))" ></td>
                                    <td class="text-right" v-html="localcurrency_string(listobjects_sum(total_make_ends_meet,'diff'))" :class="(listobjects_sum(total_make_ends_meet,'diff')>0) ? 'boldgreen' : 'boldred'"></td>
                                </tr>
                            </template>
                            <template #bottom ></template>   
                        </v-data-table>   
                        <div v-html="message_make_ends_meet()" class="ma-4"   v-if="total_make_ends_meet.length>0"></div>
                    </v-card>
                </v-window-item>
            </v-window>     
        </div>
        <!-- REPORT ANNUAL INCOME DETAIL-->
        <v-dialog v-model="dialog_income_details">
            <v-card class="pa-3">
                <ReportsAnnualIncomeDetail :year="year" :month="month" :key="key" ></ReportsAnnualIncomeDetail>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>     

    import axios from 'axios'
    import moment from 'moment'
    import ReportsAnnualIncomeDetail from './ReportsAnnualIncomeDetail.vue'
    export default {
        components:{
            ReportsAnnualIncomeDetail,
        },
        data(){
            return {
                tab:0,   
                total_annual: [],
                total_annual_headers: [
                    { title: this.$t('Month'), key: 'month',sortable: false , width:"15%"},
                    { title: this.$t('Account balance'), key: 'account_balance', sortable: false, align:'end', width:"17%"},
                    { title: this.$t('Investment balance'), key: 'investment_balance', sortable: false, align:'end', width:"17%"},
                    { title: this.$t('Total balance'), key: 'total',sortable: false, align:'end', width:"17%"},
                    { title: this.$t('Last month difference'), key: 'diff_lastmonth', sortable: false, align:'end', width:"17%"},
                    { title: this.$t('% year to date'), key: 'percentage_year', sortable: false, align:'end', width:"17%"},
                ],   
                total_annual_incomes:[],
                total_annual_incomes_headers: [
                    { title: this.$t('Month'), key: 'month',sortable: true , width:"12.5%"},
                    { title: this.$t('Incomes'), key: 'incomes', sortable: true, align:'end', width:"12.5%"},
                    { title: this.$t('Expenses'), key: 'expenses', sortable: true, align:'end', width:"12.5%"},
                    { title: this.$t('Gains'), key: 'gains',sortable: true, align:'end', width:"12.5%"},
                    { title: this.$t('Fast operations'), key: 'fast_operations',sortable: true, align:'end', width:"12.5%"},
                    { title: this.$t('Dividends'), key: 'dividends', sortable: true, align:'end', width:"12.5%"},
                    { title: this.$t('Total'), key: 'total', sortable: true, align:'end', width:"12.5%"},
                ],     
                total_annual_gainsbyproductstypes:[],
                total_annual_gainsbyproductstypes_headers: [
                    { title: this.$t('Name'), key: 'name',sortable: true},
                    { title: this.$t('Gross gains'), key: 'gains_gross', sortable: true, align:'end', width:"22%"},
                    { title: this.$t('Gross dividends'), key: 'dividends_gross', sortable: true, align:'end', width:"22%"},
                    { title: this.$t('Net gains'), key: 'gains_net',sortable: true, align:'end', width:"22%"},
                    { title: this.$t('Net dividends'), key: 'dividends_net', sortable: true, align:'end', width:"22%"},
                ],   
                total_target:[],
                total_target_headers: [
                    { title: this.$t('Month'), key: 'month',sortable: true },
                    { title: this.$t('Month target'), key: 'month_target',sortable: true,align:'end', width:"22%"},
                    { title: this.$t('Month gains'), key: 'month_gains', sortable: true, align:'end', width:"22%"},
                    { title: this.$t('Cumulative target'), key: 'cumulative_target', sortable: true, align:'end', width:"22%"},
                    { title: this.$t('Cumulative gains'), key: 'cumulative_gains',sortable: true, align:'end', width:"22%"},
                ],   
                total_invest_or_work:[],
                total_invest_or_work_headers: [
                    { title: this.$t('Month'), key: 'month',sortable: true },
                    { title: this.$t('Gains'), key: 'gains',sortable: true,align:'end', width:"27%"},
                    { title: this.$t('Expenses'), key: 'expenses', sortable: true, align:'end', width:"27%"},
                    { title: this.$t('Diff'), key: 'diff', sortable: true, align:'end', width:"27%"},
                ],    
                total_make_ends_meet:[],
                total_make_ends_meet_headers: [
                    { title: this.$t('Month'), key: 'month',sortable: true },
                    { title: this.$t('Incomes'), key: 'incomes',sortable: true,align:'end', width:"27%"},
                    { title: this.$t('Expenses'), key: 'expenses', sortable: true, align:'end', width:"27%"},
                    { title: this.$t('Diff'), key: 'diff', sortable: true, align:'end', width:"27%"},
                ],   
                year: new Date().getFullYear(),
                last_year_balance:0,
                last_year_balance_string: "",
                loading_annual:true,
                loading_annual_incomes:true,
                loading_annual_gainsbyproductstypes:true,

                // REPORTS ANNUAL INCOME DETAILS
                dialog_income_details:false,
                month:null,
                key:0,

                // TARGET
                form_valid:false,
                target: this.store().profile.annual_gains_target,
                month_target: 0,
                loading_target: false,
                current_assets_gains_percentage_message:0,

                // INVEST OR WORK
                loading_invest_or_work: false,
                // INVEST OR WORK
                loading_make_ends_meet: false,
            }
        },
        computed:{
        },
        watch:{
            target: function(){
                this.refreshTotalTarget()
            },
            year: function(){
                this.refreshTables()
            }
        },
        methods:{
            years(){
                var start=1990
                var end=new Date().getFullYear()
                return Array(end - start + 1).fill().map((_, idx) => start + idx)
            },
            footer_gainsbyproductstypes(){
                var gross_gains=this.listobjects_sum(this.total_annual_gainsbyproductstypes,'gains_gross')+this.listobjects_sum(this.total_annual_gainsbyproductstypes,'dividends_gross')
                var net_gains=this.listobjects_sum(this.total_annual_gainsbyproductstypes,'gains_net')+this.listobjects_sum(this.total_annual_gainsbyproductstypes,'dividends_net')
                return "<p class='mt-4'>"+
                    this.$t("Gross gains + Gross dividends = [0].").format(this.localcurrency_html(gross_gains)) +
                    "</p><p>" + 
                    this.$t("Net gains + Net dividends = [0].").format(this.localcurrency_html(net_gains))+"</p>"
            },
            incomeDetails(event,object){
                this.month=object.item.month_number
                this.dialog_income_details=true
                this.key=this.key+1  
            },
            message_invest_or_work(){
                if (this.listobjects_sum(this.total_invest_or_work,'diff')>=0){
                    return this.$t("You can only invest")
                } else {
                    return this.$t("You still have to work")
                }
            },
            message_make_ends_meet(){
                if (this.listobjects_sum(this.total_make_ends_meet,'diff')>=0){
                    return this.$t("I make ends meet")
                } else {
                    return this.$t("I don't make ends meet")
                }
            },
            refreshInvestOrWork(){
                this.loading_invest_or_work=true
                this.total_invest_or_work=[]
                
                for (var i=0; i<12; i++){
                    let month_gains= this.total_annual_incomes[i].gains + this.total_annual_incomes[i].dividends + this.total_annual_incomes[i].fast_operations
                    let month_expenses=this.total_annual_incomes[i].expenses
                    let diff=month_gains+month_expenses
                    this.total_invest_or_work.push({
                        month: this.$t(moment().month(i).format("MMMM")),
                        gains: month_gains,
                        expenses: month_expenses,
                        diff: diff,
                        color_diff:(diff>0)? "boldgreen": "boldred",
                    })


                }
                this.loading_invest_or_work=false

            },
            refreshMakeEndsMeet(){
                this.loading_make_ends_meet=true
                this.total_make_ends_meet=[]
                
                for (var i=0; i<12; i++){
                    let month_incomes= this.total_annual_incomes[i].incomes
                    let month_expenses=this.total_annual_incomes[i].expenses
                    let diff=month_incomes+month_expenses
                    this.total_make_ends_meet.push({
                        month: this.$t(moment().month(i).format("MMMM")),
                        incomes: month_incomes,
                        expenses: month_expenses,
                        diff: diff,
                        color_diff:(diff>0)? "boldgreen": "boldred",
                    })


                }
                this.loading_make_ends_meet=false

            },
            refreshTotalTarget(){
                
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                this.loading_target=true
                //Updates annual_gains_target in profile
                var new_profile=Object.assign({},this.store().profile)
                new_profile.annual_gains_target=this.target
                axios.put(`${this.store().apiroot}/profile/`, new_profile, this.myheaders())
                .then(() => {
                    this.store().updateProfile().then(() =>{
                        this.total_target=[]
                        this.month_target=this.last_year_balance*(this.target/100)/12
                        var cumulative_target=0
                        var cumulative_gains=0

                        for (var i=0; i<12; i++){
                            let month_gains= this.total_annual_incomes[i].gains + this.total_annual_incomes[i].dividends + this.total_annual_incomes[i].fast_operations
                            cumulative_target=cumulative_target+this.month_target
                            cumulative_gains=cumulative_gains+month_gains
                            this.total_target.push({
                                month: this.$t(moment().month(i).format("MMMM")),
                                month_target:this.month_target,
                                month_gains: month_gains,
                                cumulative_target: cumulative_target,
                                cumulative_gains: cumulative_gains,
                                color_month_gains: (this.month_target<month_gains) ? "boldgreen" : "boldred",
                                color_month_cumulative_gains: (cumulative_target<cumulative_gains) ? "boldgreen" : "boldred",
                            })
                        }

                        var current_percentage=cumulative_gains/this.last_year_balance
                        this.current_assets_gains_percentage_message=this.$t("Currently, gains annual percentage is [0].").format(this.percentage_html(current_percentage))
                        this.loading_target=false
                    })
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            refreshTables(){
                this.loading_annual=true
                this.loading_annual_incomes=true
                this.loading_annual_gainsbyproductstypes=true
                this.last_year_balance_string=""


                axios.all([
                    axios.get(`${this.store().apiroot}/reports/annual/${this.year}/`, this.myheaders()),
                    axios.get(`${this.store().apiroot}/reports/annual/income/${this.year}/`, this.myheaders()),
                    axios.get(`${this.store().apiroot}/reports/annual/gainsbyproductstypes/${this.year}/`, this.myheaders())
                ]).then(([resRA, resRAI, resRAG]) => {
                    this.last_year_balance=resRA.data.last_year_balance
                    this.last_year_balance_string=this.$t("Last year balance ([0]) is [1]").format(
                        this.localtime(resRA.data.dtaware_last_year),
                        this.localcurrency_html(resRA.data.last_year_balance)
                    )
                    this.total_annual=resRA.data.data
                    this.loading_annual=false
                    this.total_annual_incomes=resRAI.data
                    this.loading_annual_incomes=false
                    this.total_annual_gainsbyproductstypes=resRAG.data
                    this.loading_annual_gainsbyproductstypes=false
                    this.refreshTotalTarget()
                    this.refreshInvestOrWork()
                    this.refreshMakeEndsMeet()
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
