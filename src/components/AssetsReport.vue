<template>
    <div>
        <h1>{{ $t("Assets Report") }}</h1>
        <div class="d-flex justify-center mb-4" width="40%">
            <v-card width="40%" class="pa-4">      
                <v-text-field v-model="password" type="password" :label="$t('Set pdf password if necessary')"></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn data-test="AssetsReport_ButtonGenerate" class="pa-4" :loading="loading" color="primary" :disabled="loading" @click="launch_report">{{ (!loading)?  $t("Generate report"): $t("Report is being prepared. Please be patient...") }}</v-btn>

                    <v-spacer></v-spacer>

                </v-card-actions>

            </v-card>
        </div>
        <div v-if="!loading">
            <ChartEvolutionAssets hidden reference="chart_assets" @finished="on_chart_finished" />
            <ChartPie name="Investments by product" hidden :items="echart_products_items" reference="chart_pie_product" :heigth="height" :show_data="false" @finished="on_chart_finished" />
            <ChartPie name="Investments by pci" hidden :items="echart_pci_items" reference="chart_pie_pci" :heigth="height" :show_data="false" @finished="on_chart_finished"/>
            <ChartPie name="Investments by variable percentage" hidden :items="echart_percentage_items" reference="chart_pie_percentage" :heigth="height" :show_data="false" @finished="on_chart_finished"/>
            <ChartPie name="Investments by product type" hidden :items="echart_producttype_items" reference="chart_pie_producttype" :heigth="height" :show_data="false" @finished="on_chart_finished"/>
            <ChartPie name="Investments by leverage" hidden :items="echart_leverage_items" reference="chart_pie_leverage" :heigth="height" :show_data="false" @finished="on_chart_finished"/>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import ChartEvolutionAssets from './ChartEvolutionAssets.vue'
    import ChartPie from './ChartPie.vue'
    import { my_round, f } from 'vuetify_rules'
    import {sumBy, orderBy} from "lodash-es"

    import pdfMake from "pdfmake/build/pdfmake";
    import pdfFonts from "pdfmake/build/vfs_fonts";
    pdfMake.addVirtualFileSystem(pdfFonts);

    
    import {pdfmake_convertImageToDataURL, pdfmake_percentage_string, pdfmake_loo_to_table, pdfmake_loo_to_table_guess_headers} from "@/pdfmake_helpers"


    import imgMoneymoney from '../assets/moneymoney.png'

    export default {
        components:{
            ChartPie,
            ChartEvolutionAssets,
        },
        data(){
            return {
                loading:false,
                key:0,
                height:100,

                imgMoneymoney,
                password:"",

                method:"Current",
                results:{},

            }
        },
        computed:{
            /// COPIED FROM REPORTSINVESTMENTSCLASSES
            echart_products_items: function(){
                var products= this.results.pies.by_product
                var adapted
                if (this.method=="Current"){
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.balance, 2)}))
                } else {//Invested
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.invested,2)}))
                }
                adapted=adapted.filter(o => o.value!=0)
                return adapted
            },
            echart_pci_items: function(){
                var products= this.results.pies.by_pci
                var adapted
                if (this.method=="Current"){
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.balance, 2)}))
                } else {//Invested
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.invested,2)}))
                }
                adapted=adapted.filter(o => o.value!=0)
                return adapted
            },
            echart_percentage_items: function(){
                var products= this.results.pies.by_percentage
                var adapted

                if (this.method=="Current"){
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.balance, 2)}))
                } else {//Invested
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.invested,2)}))
                }
                adapted=adapted.filter(o => o.value!=0)
                return adapted
            },
            echart_producttype_items: function(){
                var products= this.results.pies.by_producttype
                var adapted
                if (this.method=="Current"){
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.balance, 2)}))
                } else {//Invested
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.invested,2)}))
                }
                adapted=adapted.filter(o => o.value!=0)
                return adapted
            },
            echart_leverage_items: function(){
                var products= this.results.pies.by_leverage
                var adapted
                if (this.method=="Current"){
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.balance, 2)}))
                } else {//Invested
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.invested,2)}))
                }
                adapted=adapted.filter(o => o.value!=0)
                return adapted
            },
        },
        methods:{
            useStore,
            my_round,
            f,
            orderBy,
            sumBy,
            pdfmake_convertImageToDataURL,
            pdfmake_loo_to_table,
            pdfmake_loo_to_table_guess_headers,
            pdfmake_percentage_string,
            async launch_report(){
                this.loading=true //False to debugging

                const docDefinition = {
                    info: {
                        title: this.$t("Money money assets report"),
                        author: `Money Money v${this.useStore().version}`,
                        subject: this.$t("Money money assets report"),
                        keywords: 'assets report',
                    },
                    content: [    
                        { image: await pdfmake_convertImageToDataURL(imgMoneymoney), width: 200, alignment: 'center', margin: [0, 125, 0, 0] },
                        { text: 'Assets report', style: 'header1', alignment:'center' },
                        { text: f(this.$t(`Generated by MoneyMoney-[0]`), [this.useStore().version,]), style: 'body', alignment:'center' },  
                        { text: new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()), style: 'body', alignment:'center' , margin: [0, 300, 0, 200],pageBreak:'after' },

                        { toc: { title: { text: 'Table of Contents', style: 'header1', numberStyle: 'normal'}}, pageBreak:"after"},

                        { text: this.$t('1. Personal settings'), id:'Personal_settings', style: 'header1', tocItem: true },
                        { text: f(this.$t("Your user currency is set to [0]."),[this.useStore().profile.currency,]), style: 'body' },
                        { text: f(this.$t("Your local time zone is set to [0]."),[this.useStore().profile.zone,]), style: 'body' ,pageBreak:"after"},

                        ...this.report_assets(),
                        ...this.report_assets_by_bank(),
                        ...this.report_current_year_evolution(),
                        ...this.report_assets_current_year_detail(),       

                        { text: this.$t('2.4. Assets graphical evolution'), id:'assets_graphical_evolution', style: 'header2', tocItem: true, pageBreak:"before", pageOrientation:"landscape" },
                        { image: this.results.pies_payload["chart_assets"], width: 810, height:490, alignment: 'left' },

                        ...this.report_assets_current_year_gainsbyproductstypes(),
                        ...this.report_accounts(),
                        ...this.report_investments(),
                        ...this.report_investmentsoperations(),


                        { text: this.$t('4.3. Investments group by variable percentage'), id:'investments_by_variable_percentage', style: 'header2', tocItem: true , pageBreak:"before"},
                        { image: this.results.pies_payload["chart_pie_percentage"], width: 1200, alignment: 'center' },
                        { text: this.$t('4.4. Investments group by type'), id:'investments_by_type', style: 'header2', tocItem: true ,pageBreak:"before"},
                        { image: this.results.pies_payload["chart_pie_producttype"], width: 1200, alignment: 'center' },
                        { text: this.$t('4.5. Investments group by leverage'), id:'investments_by_leverage', style: 'header2', tocItem: true ,pageBreak:"before"},
                        { image: this.results.pies_payload["chart_pie_leverage"], width: 1200, alignment: 'center' },
                        { text: this.$t('4.6. Investments group by product'), id:'investments_by_product', style: 'header2', tocItem: true ,pageBreak:"before"},
                        { image: this.results.pies_payload["chart_pie_product"], width: 1200, alignment: 'center' },
                        { text: this.$t('4.7. Investments group by pci'), id:'investments_by_pci', style: 'header2', tocItem: true ,pageBreak:"before"},
                        { image: this.results.pies_payload["chart_pie_pci"], width: 1200, alignment: 'center' },
                        
                        ...this.report_orders(),
                        ...this.report_dividends(),
                        ...this.report_ranking(),
                        { text: this.$t('8. About Money Money'), id:'about', style: 'header1', tocItem: true ,pageBreak:"before",pageOrientation:"portrait"},
                        { text: this.$t("Money Money is a opensource software to manage your personal finances."), style: 'body' },
                    ],
                    styles: {
                        header1: { fontSize: 16, bold: true , margin: [0, 6, 0, 6]},
                        header2: { fontSize: 14, bold: true , margin: [6, 4, 0, 4]},
                        body: { fontSize: 11 ,margin:[0,2,0,2]},
                        table8: {fontSize:8,margin:[0,4,0,4]},
                        table12: {fontSize:12,margin:[0,4,0,4]},
                    },

                    footer: function(currentPage, pageCount) {
                        return (currentPage>2)? { text: currentPage.toString() + this.$t(' of ') + pageCount, alignment: 'center' }:""
                    }.bind(this)
                };
                console.log(docDefinition)
                pdfMake.createPdf(docDefinition,{tagged:true}).open()//.download('report.pdf');
                this.loading=false
            },

            report_assets(){
                var r=[]
                r.push({ text: this.$t('2. Assets'), id:'assets', style: 'header1', tocItem: true })
                if (this.results.balance-this.results.last_year_balance>=0){
                    r.push({text: f(this.$t("At the end of last year, you had [0]. Currently, you have [1], which meas you have gained [2]."), [
                        this.localcurrency_html(this.results.last_year_balance),
                        this.localcurrency_html(this.results.balance),
                        this.percentage_string((this.results.balance-this.results.last_year_balance)/this.results.last_year_balance)
                    ]) , style:"body"})
                    
                }  else {
                    r.push({text: f(this.$t("At the end of last year, you had [0]. Currently, you have [1], which meas you have lost [2]."), [
                        this.localcurrency_html(this.results.last_year_balance),
                        this.localcurrency_html(this.results.balance),
                        this.percentage_string((this.results.balance-this.results.last_year_balance)/this.results.last_year_balance)
                    ]) , style:"body"})

                }
                return r
            },
            report_assets_by_bank(){
                var r=[]
                r.push({ text: this.$t('2.1. Assets by bank'), id:'assets_by_bank', style: 'header2', tocItem: true })
                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.assets_by_bank, ["name","balance_accounts","balance_investments","balance_total"])
                headers[1].title=this.$t("Accounts balance")
                headers[2].title=this.$t("Investments balance")
                headers[3].title=this.$t("Total balance")
                headers[1].currency_column=this.useStore().profile.currency
                headers[2].currency_column=this.useStore().profile.currency
                headers[3].currency_column=this.useStore().profile.currency
                headers[0].total=this.$t("Total")
                headers[1].total="#SUM"
                headers[2].total="#SUM"
                headers[3].total="#SUM"
                headers[0].width="40%"
                headers[1].width="20%"
                headers[2].width="20%"
                headers[3].width="20%"
                r.push(this.pdfmake_loo_to_table(this.results.assets_by_bank, headers, "table8"))
                return r
            },
            report_current_year_evolution(){
                var r=[]
                r.push({ text: this.$t('2.2. Assets current year evolution'), id:'assets_current_year_evolution', style: 'header2', tocItem: true })
                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.annual, ["month","account_balance","investment_balance","total","percentage_year","diff_lastmonth"])

                headers[0].title=this.$t("Month")
                headers[1].title=this.$t("Accounts balance")
                headers[2].title=this.$t("Investments balance")
                headers[3].title=this.$t("Total balance")
                headers[4].title=this.$t("Annual percentage")
                headers[5].title=this.$t("Last month difference")
                headers[1].currency_column=this.useStore().profile.currency
                headers[2].currency_column=this.useStore().profile.currency
                headers[3].currency_column=this.useStore().profile.currency
                headers[4].currency_column="%"
                headers[5].currency_column=this.useStore().profile.currency
                headers[0].total=this.$t("Total")
                headers[5].total="#SUM"
                r.push(this.pdfmake_loo_to_table(this.results.annual, headers, "table8"))
                return r
            },
            report_assets_current_year_detail(){
                var r=[]
                r.push({ text: this.$t('2.3. Assets current year detail'), id:'assets_current_year_detail', style: 'header2', tocItem: true })
                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.annual_incomes, ["month","incomes","expenses","gains","dividends","total"])

                headers[0].title=this.$t("Month")
                headers[1].title=this.$t("Incomes")
                headers[2].title=this.$t("Expenses")
                headers[3].title=this.$t("Gains")
                headers[4].title=this.$t("Dividends")
                headers[5].title=this.$t("Total")
                headers[1].currency_column=this.useStore().profile.currency
                headers[2].currency_column=this.useStore().profile.currency
                headers[3].currency_column=this.useStore().profile.currency
                headers[4].currency_column=this.useStore().profile.currency
                headers[5].currency_column=this.useStore().profile.currency
                headers[0].total=this.$t("Total")
                headers[1].total="#SUM"
                headers[2].total="#SUM"
                headers[3].total="#SUM"
                headers[4].total="#SUM"
                headers[5].total="#SUM"
                r.push(this.pdfmake_loo_to_table(this.results.annual_incomes, headers, "table8"))


                r.push({ text: f(this.$t("Up to date you have got [0] (net gains + net dividends) what represents a [1] of the total assets at the end of the last year."), [
                        this.localcurrency_html(this.results.dividends_net+this.results.gains_net), 
                        this.percentage_string((this.results.dividends_net+this.results.gains_net)/this.results.last_year_balance)
                    ]), style:"body"})
        

                return r
            },
            report_assets_current_year_gainsbyproductstypes(){
                var r=[]
                r.push({ text: this.$t('2.5. Current year investments gains group by product type'), id:'assets_current_year_gains_product_type', style: 'header2', tocItem: true, pageBreak:"before", pageOrientation:"portrait" })
                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.annual_gainsbyproductstypes, ["name","gains_gross","dividends_gross","gains_net","dividends_net"])

                headers[0].title=this.$t("Product type")
                headers[1].title=this.$t("Gross gains")
                headers[2].title=this.$t("Gross dividends")
                headers[3].title=this.$t("Net gains")
                headers[4].title=this.$t("Net dividends")
                headers[1].currency_column=this.useStore().profile.currency
                headers[2].currency_column=this.useStore().profile.currency
                headers[3].currency_column=this.useStore().profile.currency
                headers[4].currency_column=this.useStore().profile.currency
                headers[0].total=this.$t("Total")
                headers[1].total="#SUM"
                headers[2].total="#SUM"
                headers[3].total="#SUM"
                headers[4].total="#SUM"
                r.push(this.pdfmake_loo_to_table(this.results.annual_gainsbyproductstypes, headers, "table8"))
                
                r.push({ text: f(this.$t('Gross gains + Gross dividends = [0].'), [
                    this.localcurrency_string(this.results.dividends_gross+this.results.gains_gross),
                ]), style: 'body' }) 
                r.push({ text: f(this.$t('Net gains + Net dividends = [0].'), [
                    this.localcurrency_string(this.results.dividends_net+this.results.gains_net),
                ]), style: 'body' }) 
                return r
            },
            report_accounts(){
                var r=[]
                r.push({ text: this.$t('3. Current accounts'), id:'current_accounts', style: 'header1', tocItem: true ,pageOrientation: 'portrait', pageBreak:"before" })
                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.accounts, ["name","number","balance_account","balance_user"])

                headers[0].title=this.$t("Account name")
                headers[1].title=this.$t("Number")
                headers[2].title=this.$t("Balance")
                headers[3].title=this.$t("User currency balance")
                headers[2].currency_row_key="currency"
                headers[3].currency_column=this.useStore().profile.currency
                headers[0].total=this.$t("Total")
                headers[3].total="#SUM"
                r.push(this.pdfmake_loo_to_table(this.results.accounts, headers, "table8"))
                return r
            },
            report_investments(){
                var r=[]
                r.push({ text: this.$t('4. Current investments'), id:'current_investments', style: 'header1', tocItem: true ,pageOrientation: 'landscape', pageBreak:"before",}) // Set this page to landscape})
                r.push({ text: this.$t('4.1. Investments list'), id:'investments_list', style: 'header2', tocItem: true }) 
                r.push({ text: this.$t('Next list is sorted by the distance in percent to the selling point.'), style: 'body' }) 


                this.results.investments=this.orderBy(this.results.investments,[function(o) { return o["percentage_selling_point"] === null ? -Infinity : o["percentage_selling_point"]; }], ['asc'])
                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.investments, ["fullname","invested_user","balance_user","gains_user", "percentage_invested", "percentage_selling_point"])

                headers[0].title=this.$t("Investment name")
                headers[1].title=this.$t("Invested")
                headers[2].title=this.$t("Balance")
                headers[3].title=this.$t("Gains")
                headers[4].title=this.$t("% invested")
                headers[5].title=this.$t("% selling point")
                headers[1].currency_column=this.useStore().profile.currency
                headers[2].currency_column=this.useStore().profile.currency
                headers[3].currency_column=this.useStore().profile.currency
                headers[4].currency_column="%"
                headers[5].currency_column="%"
                headers[0].total=this.$t("Total")
                headers[1].total="#SUM"
                headers[2].total="#SUM"
                headers[3].total="#SUM"
                headers[0].width="50%"
                headers[1].width="10%"
                headers[2].width="10%"
                headers[3].width="10%"
                headers[4].width="10%"
                headers[5].width="10%"
                headers[5].alignment="right"
                r.push(this.pdfmake_loo_to_table(this.results.investments, headers, "table8"))

                if (this.results.invested_user!=0){
                    r.push({ text: f(this.$t('Investment gains (positive minus negative results): [0] - [1] are [2].'),[
                        this.localcurrency_string(this.results.investments_gains_positives), 
                        this.localcurrency_string(-this.results.investments_gains_negatives),
                        this.localcurrency_string(this.results.investments_gains_positives+this.results.investments_gains_negatives)
                    ]), style: 'body' }) 

                } 
                return r
            },            
            report_investmentsoperations(){
                var r=[]
                r.push({ text: this.$t('4.2. Current investments operations'), id:'current_investments_operations', style: 'header2', tocItem: true ,pageOrientation: 'landscape', pageBreak:"before",}) // Set this page to landscape})

                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.current_investments_operations, ["datetime","name","operationstype","shares", "price_user", "invested_user","balance_user","gains_gross_user"])

                headers[0].title=this.$t("Date and time")
                headers[1].title=this.$t("Name")
                headers[2].title=this.$t("Operation type")
                headers[3].title=this.$t("Shares")
                headers[4].title=this.$t("Price")
                headers[5].title=this.$t("Invested")
                headers[6].title=this.$t("Balance")
                headers[7].title=this.$t("Gains")
                // headers[1].currency_column=this.useStore().profile.currency
                // headers[2].currency_column=this.useStore().profile.currency
                // headers[3].currency_column=this.useStore().profile.currency
                // headers[4].currency_column="%"
                // headers[5].currency_column="%"
                headers[0].width="15%"
                headers[1].width="20%"
                headers[2].width="15%"
                headers[3].width="10%"
                headers[4].width="10%"
                headers[5].width="10%"
                headers[6].width="10%"
                headers[7].width="10%"
                headers[0].total=this.$t("Total")
                headers[5].total="#SUM"
                headers[6].total="#SUM"
                headers[7].total="#SUM"
                r.push(this.pdfmake_loo_to_table(this.results.current_investments_operations, headers, "table8"))
                return r
            },
            report_orders(){
                var r=[]
                r.push({ text: this.$t('5. Investments orders'), id:'investments_orders', style: 'header1', tocItem: true ,pageOrientation: 'landscape', pageBreak:"before",}) // Set this page to landscape})

                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.orders, ["date","expiration","investmentsname","shares", "price", "amount","percentage_from_price"])
                headers[0].title=this.$t("Date")
                headers[1].title=this.$t("Expiration")
                headers[2].title=this.$t("Investment name")
                headers[3].title=this.$t("Shares")
                headers[4].title=this.$t("Price")
                headers[5].title=this.$t("Amount")
                headers[6].title=this.$t("% from price")
                headers[6].currency_column="%"
                headers[0].width="10%"
                headers[1].width="10%"
                headers[2].width="40%"
                headers[3].width="10%"
                headers[4].width="10%"
                headers[5].width="10%"
                headers[6].width="10%"
                r.push(this.pdfmake_loo_to_table(this.results.orders, headers, "table8"))
                return r
            },
            report_dividends(){
                var r=[]
                r.push({ text: this.$t('6. Dividend estimations report'), id:'dividend_estimations_report', style: 'header1', tocItem: true ,pageOrientation: 'landscape', pageBreak:"before",}) // Set this page to landscape})

                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.dividends, ["name","current_price","dps","shares", "estimated", "percentage"])

                headers[0].title=this.$t("Investment name")
                headers[1].title=this.$t("Current price")
                headers[2].title=this.$t("DPS")
                headers[3].title=this.$t("Shares")
                headers[4].title=this.$t("Estimated")
                headers[5].title=this.$t("%")
                headers[5].currency_column="%"
                headers[0].total=this.$t("Total")
                headers[4].total="#SUM"
                r.push(this.pdfmake_loo_to_table(this.results.dividends, headers, "table8"))

                if (this.results.invested_user!=0){
                    r.push({ text: f(this.$t("If I keep this investment during a year, I'll get [0]"),[
                        this.localcurrency_string(this.sumBy(this.results.dividends,"estimated")), 
                    ]), style: 'body' }) 
                } 
                return r
            },              
            report_ranking(){
                var r=[]
                r.push({ text: this.$t('7. Historical investment ranking'), id:'historical_investment_ranking', style: 'header1', tocItem: true ,pageOrientation: 'landscape', pageBreak:"before",}) // Set this page to landscape})

                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.ranking, ["ranking","name","current_net_gains","historical_net_gains", "dividends", "total"])

                headers[0].title=this.$t("Ranking")
                headers[1].title=this.$t("Name")
                headers[2].title=this.$t("Current net gains")
                headers[3].title=this.$t("Historical net gains")
                headers[4].title=this.$t("Dividends")
                headers[5].title=this.$t("Total")
                headers[2].currency_column=this.useStore().profile.currency
                headers[3].currency_column=this.useStore().profile.currency
                headers[4].currency_column=this.useStore().profile.currency
                headers[5].currency_column=this.useStore().profile.currency
                headers[0].total=this.$t("Total")
                headers[2].total="#SUM"
                headers[3].total="#SUM"
                headers[4].total="#SUM"
                headers[5].total="#SUM"
                r.push(this.pdfmake_loo_to_table(this.results.ranking, headers, "table8"))
                return r
            },  
            get_report_data(){
                this.loading=true
                const year=new Date().getFullYear()
                axios.all([
                    axios.get(`${this.useStore().apiroot}/investments/classes/`, this.myheaders()),//resPies
                    axios.get(`${this.useStore().apiroot}/api/banks/withbalance/?active=true`, this.myheaders()),//resBWB
                    axios.get(`${this.useStore().apiroot}/reports/annual/${year}/`, this.myheaders()),//resRA
                    axios.get(`${this.useStore().apiroot}/reports/annual/income/${year}/`, this.myheaders()),//resRAI
                    axios.get(`${this.useStore().apiroot}/reports/annual/gainsbyproductstypes/${year}/`, this.myheaders()),//resRAG
                    axios.get(`${this.useStore().apiroot}/reports/annual/revaluation/?only_zero=true`, this.myheaders()),//resRAR
                    axios.get(`${this.useStore().apiroot}/api/accounts/withbalance/?active=true`, this.myheaders()),//resAWB
                    axios.get(`${this.useStore().apiroot}/api/investments/withbalance/?active=true`, this.myheaders()),//resIWB
                    axios.get(`${this.useStore().apiroot}/reports/investmentsoperations/current/` , this.myheaders()),// resIOC
                    axios.get(`${this.useStore().apiroot}/api/orders/?active=true`, this.myheaders()),//resOrders
                    axios.get(`${this.useStore().apiroot}/reports/dividends/`, this.myheaders()), //resDividends
                    axios.get(`${this.useStore().apiroot}/reports/ranking/`, this.myheaders()), //resRanking
                ]).then(([resPies, resBWB, resRA, resRAI, resRAG, resRAR, resAWB, resIWB,resIOC,resOrders,resDividends, resRanking]) => {
                    this.results.pies=resPies.data
                    console.log(this.results.pies)
                    this.results.pies_payload={
                        chart_pie_product: null,
                        chart_pie_pci: null,
                        chart_pie_percentage: null,
                        chart_pie_producttype: null,
                        chart_pie_leverage: null,
                        chart_assets: null,
                    },
                    this.results.last_year_balance=resRA.data.last_year_balance
                    this.results.annual=resRA.data.data
                    this.results.balance=this.results.annual[this.results.annual.length-1].total
                    this.results.annual_incomes=resRAI.data
                    this.results.annual_gainsbyproductstypes=resRAG.data
                    this.results.gains_net=this.sumBy(this.results.annual_gainsbyproductstypes, "gains_net")
                    this.results.gains_gross=this.sumBy(this.results.annual_gainsbyproductstypes, "gains_gross")
                    this.results.dividends_net=this.sumBy(this.results.annual_gainsbyproductstypes,"dividends_net")
                    this.results.dividends_gross=this.sumBy(this.results.annual_gainsbyproductstypes,"dividends_gross")
                    this.results.annual_revaluation=resRAR.data
                    this.results.assets_by_bank=resBWB.data
                    this.results.accounts=resAWB.data
                    this.results.investments=resIWB.data
                    this.results.investements_invested_user=this.sumBy(this.results.investments,"invested_user")
                    this.results.investments_gains_positives=this.sumBy(this.results.investments, (item) => {return item.gains_user >= 0 ? item.gains_user : 0})
                    this.results.investments_gains_negatives=this.sumBy(this.results.investments, (item) => {return item.gains_user < 0 ? item.gains_user : 0})
                    this.results.current_investments_operations=resIOC.data
                    this.results.orders=resOrders.data
                    this.results.dividends=resDividends.data
                    this.results.ranking=this.ranking_filter_data(resRanking.data)

                    console.log(this.results)
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            on_chart_finished(reference,image){
                this.results.pies_payload[reference]=image
            },
            ranking_filter_data(ios){
                var r=[]
                ios.entries.forEach(o=>{
                    var e=ios[o]
                    r.push({
                        ranking: e.data.ranking,
                        name: e.data.name,
                        current_net_gains:e.total_io_current.gains_net_user,
                        historical_net_gains: e.total_io_historical.gains_net_user,
                        dividends: e.data.dividends,
                        total: e.total_io_current.gains_net_user+ e.total_io_historical.gains_net_user + e.data.dividends,
                        products_id: e.data.products_id,
                    })
                })
                r=orderBy(r,["ranking"], ["asc"])
                return r

            },

        },
        created(){
            this.get_report_data()
        }
    }
</script>