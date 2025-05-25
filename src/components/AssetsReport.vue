<template>
    <div>
        <h1 data-test="AssetsReport_Title">{{ $t("Assets Report") }}</h1>
        <div class="d-flex justify-center mb-4" width="20%">
            <v-card width="20%" class="pa-4">      
                <v-text-field v-model="password" type="password" :label="$t('Set pdf password if necessary')"></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn data-test="AssetsReport_ButtonGenerate" class="pa-4" :loading="creating" color="primary" :disabled="loading || creating" @click="launch_report">{{ (!loading)?  $t("Generate report"): $t("Data is being retrieving. Please be patient...") }}</v-btn>

                    <v-spacer></v-spacer>

                </v-card-actions>

            </v-card>
        </div>
        <div v-if="!loading">
            <ChartEvolutionAssets hidden ref="chart_assets" />
            <ChartPie name="Investments by product" hidden :items="echart_products_items" ref="chart_pie_product" :heigth="height" :show_data="false"/>
            <ChartPie name="Investments by pci" hidden :items="echart_pci_items" ref="chart_pie_pci" :heigth="height" :show_data="false"/>
            <ChartPie name="Investments by variable percentage" hidden :items="echart_percentage_items" ref="chart_pie_percentage" :heigth="height" :show_data="false"/>
            <ChartPie name="Investments by product type" hidden :items="echart_producttype_items" ref="chart_pie_producttype" :heigth="height" :show_data="false"/>
            <ChartPie name="Investments by leverage" hidden :items="echart_leverage_items" ref="chart_pie_leverage" :heigth="height" :show_data="false"/>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import ChartEvolutionAssets from './ChartEvolutionAssets.vue'
    import ChartPie from './ChartPie.vue'
    import { my_round, f, localtime } from 'vuetify_rules'
    import {sumBy, orderBy} from "lodash-es"
    import pdfMake from "pdfmake/build/pdfmake";
    import pdfFonts from "pdfmake/build/vfs_fonts";
    pdfMake.addVirtualFileSystem(pdfFonts);
    import {pdfmake_convertImageToDataURL, pdfmake_percentage_string, pdfmake_loo_to_table, pdfmake_loo_to_table_guess_headers} from "@/pdfmake_helpers"
    import imgMoneymoney from '../assets/moneymoney.png'
    import { parseResponseError, string_with_localized_now, myheaders, getMapObjectById } from '@/functions'

    export default {
        components:{
            ChartPie,
            ChartEvolutionAssets,
        },
        data(){
            return {
                reportdate:new Date(),
                loading:true,
                creating:false,
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
            localtime,
            my_round,
            f,
            orderBy,
            sumBy,
            myheaders,
            getMapObjectById,
            parseResponseError,
            pdfmake_convertImageToDataURL,
            pdfmake_loo_to_table,
            pdfmake_loo_to_table_guess_headers,
            pdfmake_percentage_string,
            string_with_localized_now,
            async launch_report(){
                this.creating=true
                const docDefinition = {
                    info: {
                        title: this.$t("Money Money assets report"),
                        author: `Money Money v${this.useStore().version}`,
                        subject: this.$t("Money Money assets report"),
                        keywords: 'assets report',
                    },
                     content: [    
                        { image: await pdfmake_convertImageToDataURL(imgMoneymoney), width: 200, alignment: 'center', margin: [0, 125, 0, 0] },
                        { text: 'Assets report', style: 'header1', alignment:'center' },
                        { text: f(this.$t(`Generated by MoneyMoney-[0]`), [this.useStore().version,]), style: 'body', alignment:'center' },  
                        { text: new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false  }).format(this.reportdate), style: 'body', alignment:'center' , margin: [0, 300, 0, 200],pageBreak:'after' },

                        { toc: { title: { text: 'Table of Contents', style: 'header1', numberStyle: 'normal'}}, pageBreak:"after"},

                        { text: this.$t('1. Personal settings'), id:'Personal_settings', style: 'header1', tocItem: true },
                        { text: f(this.$t("Your user currency is set to [0]."),[this.useStore().profile.currency,]), style: 'body' },
                        { text: f(this.$t("Your local time zone is set to [0]."),[this.useStore().profile.zone,]), style: 'body' ,pageBreak:"after"},

                        ...this.report_assets(),
                        ...this.report_assets_by_bank(),
                        ...this.report_current_year_evolution(),
                        ...this.report_assets_current_year_detail(),       

                        { text: this.$t('2.4. Assets graphical evolution'), id:'assets_graphical_evolution', style: 'header2', tocItem: true, pageBreak:"before", pageOrientation:"landscape" },
                        { image:  await this.$refs.chart_assets.downloadChart(), width: 810, height:490, alignment: 'left' },

                        ...this.report_assets_current_year_gainsbyproductstypes(),
                        ...this.report_accounts(),
                        ...this.report_investments(),
                        ...this.report_investmentsoperations(),
                        ...this.report_investements_freerisk_revaluation(),


                        { text: this.$t('4.4. Investments group by variable percentage'), id:'investments_by_variable_percentage', style: 'header2', tocItem: true , pageBreak:"before"},
                        { image: await this.$refs.chart_pie_percentage.downloadChart(), width: 1200, alignment: 'center' },
                        { text: this.$t('4.5. Investments group by type'), id:'investments_by_type', style: 'header2', tocItem: true ,pageBreak:"before"},
                        { image: await this.$refs.chart_pie_producttype.downloadChart(), width: 1200, alignment: 'center' },
                        { text: this.$t('4.6. Investments group by leverage'), id:'investments_by_leverage', style: 'header2', tocItem: true ,pageBreak:"before"},
                        { image: await this.$refs.chart_pie_leverage.downloadChart(), width: 1200, alignment: 'center' },
                        { text: this.$t('4.7. Investments group by product'), id:'investments_by_product', style: 'header2', tocItem: true ,pageBreak:"before"},
                        { image: await this.$refs.chart_pie_product.downloadChart(), width: 1200, alignment: 'center' },
                        { text: this.$t('4.8. Investments group by pci'), id:'investments_by_pci', style: 'header2', tocItem: true ,pageBreak:"before"},
                        { image: await this.$refs.chart_pie_pci.downloadChart(), width: 1200, alignment: 'center' },
                        
                        ...this.report_orders(),
                        ...this.report_dividends(),
                        ...this.report_ranking(),
                        { text: this.$t('8. About Money Money'), id:'about', style: 'header1', tocItem: true ,pageBreak:"before",pageOrientation:"portrait"},
                        { text: this.$t("Money Money is a opensource software to manage your personal finances."), style: 'body' },
                    ],
                    styles: {
                        header1: { fontSize: 16, bold: true , margin: [0, 6, 0, 6]},
                        header2: { fontSize: 14, bold: true , margin: [6, 4, 0, 4]},
                        body: { fontSize: 11 ,margin:[0,2,0,2], alignment:"justify"},
                        table5: {fontSize:5,margin:[0,4,0,4]},
                        table8: {fontSize:8,margin:[0,4,0,4]},
                        table12: {fontSize:12,margin:[0,4,0,4]},
                    },

                    footer: function(currentPage, pageCount) {
                        return (currentPage>2)? { text: currentPage.toString() + this.$t(' of ') + pageCount, alignment: 'center' }:""
                    }.bind(this)
                };
                console.log("LAUNCHED REPORT")
                if (this.password.length>0){
                    docDefinition["ownerPassword"]=this.password,
                    docDefinition["userPassword"]=this.password,
                    docDefinition["permissions"]={
                        printing: 'highResolution', // Allow printing
                        modifying: true,           // Disallow modifying
                        copying: true,             // Disallow copying
                        annotating: true,          // Disallow annotating
                        fillingForms: true,        // Disallow filling forms
                        contentAccessibility: true,// Disallow content accessibility
                        documentAssembly: true,    // Disallow document assembly
                    }
                }

                console.log("PDFMAKE", docDefinition)


                var datestring=this.string_with_localized_now(this.useStore().profile.zone)
                var filename=`${datestring} AssetsReport ${ this.useStore().getProfileUppercaseChars}.pdf`
                await pdfMake.createPdf(docDefinition,{tagged:true}).download(filename);
                this.creating=false
            },

            report_assets(){
                var r=[]
                r.push({ text: this.$t('2. Assets'), id:'assets', style: 'header1', tocItem: true })
                if (this.results.balance-this.results.last_year_balance>=0){
                    r.push({text: f(this.$t("At the end of last year, you had [0]. Currently, you have [1], which means you have gained [2]."), [
                        this.localcurrency_html(this.results.last_year_balance),
                        this.localcurrency_html(this.results.balance),
                        this.percentage_string((this.results.balance-this.results.last_year_balance)/this.results.last_year_balance)
                    ]) , style:"body"})
                    
                }  else {
                    r.push({text: f(this.$t("At the end of last year, you had [0]. Currently, you have [1], which means you have lost [2]."), [
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

                r.push({ text: f(this.$t("Up to date you have got [0] (net gains + net dividends) what represents a [1] of the total assets at the end of the last year."), [
                        this.localcurrency_html(this.results.dividends_net+this.results.gains_net), 
                        this.percentage_string((this.results.dividends_net+this.results.gains_net)/this.results.last_year_balance)
                    ]), style:"body"})

                var current_percentage_with_revaluation=(this.results.dividends_net+this.results.gains_net+this.results.revaluation_free_risk_total)/this.results.last_year_balance
                r.push({ text: f(this.$t("Considering gains from risk-free investments ([0]), the annual percentage of gains would be [1]."), [this.localcurrency_string(this.results.revaluation_free_risk_total),this.percentage_string(current_percentage_with_revaluation)]), style:"body"})

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
                headers[0].width="56%"
                headers[1].width="20%"
                headers[2].width="12%"
                headers[3].width="12%"
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
                    r.push({ text: f(this.$t('Investments gains (positive minus negative results): [0] - [1] are [2].'),[
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

                this.results.current_investments_operations.forEach(o=>{
                    o["datetime"]=this.localtime(o["datetime"])
                    o["operationstypes"]=this.getMapObjectById("operationstypes",o["operationstypes_id"]).localname
                })

                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.current_investments_operations, ["datetime","name","operationstypes","shares", "price_user", "invested_user","balance_user","gains_gross_user"])

                headers[0].title=this.$t("Date and time")
                headers[1].title=this.$t("Name")
                headers[2].title=this.$t("Operation type")
                headers[3].title=this.$t("Shares")
                headers[4].title=this.$t("Price")
                headers[5].title=this.$t("Invested")
                headers[6].title=this.$t("Balance")
                headers[7].title=this.$t("Gains")
                headers[4].currency_row_key="currency_product"
                headers[5].currency_column=this.useStore().profile.currency
                headers[6].currency_column=this.useStore().profile.currency
                headers[7].currency_column=this.useStore().profile.currency
                headers[0].width="11%"
                headers[1].width="34%"
                headers[2].width="10%"
                headers[3].width="9%"
                headers[4].width="9%"
                headers[5].width="9%"
                headers[6].width="9%"
                headers[7].width="9%"
                headers[0].total=this.$t("Total")
                headers[5].total="#SUM"
                headers[6].total="#SUM"
                headers[7].total="#SUM"
                r.push(this.pdfmake_loo_to_table(this.results.current_investments_operations, headers, "table8"))
                return r
            },
            report_investements_freerisk_revaluation(){
                var r=[]
                r.push({ text: this.$t('4.3. Current free-risk investments revaluation'), id:'current_investments_freerisk_revaluation', style: 'header2', tocItem: true ,pageOrientation: 'landscape', pageBreak:"before",}) // Set this page to landscape})
                this.results.revaluation_free_risk.forEach(o=>{
                    o["localdatetime"]=this.localtime(o["datetime"])
                    o["operationstypes"]=this.getMapObjectById("operationstypes", o["operationstypes_id"]).localname
                    o["percentage_last_year_revaluation"]=o.current_year_gains_user/o.invested_user
                })

                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.revaluation_free_risk, ["localdatetime","name","operationstypes","shares", "price_user", "balance_last_year_or_invested","current_year_gains_user","percentage_last_year_revaluation"])

                headers[0].title=this.$t("Date and time")
                headers[1].title=this.$t("Investments")
                headers[2].title=this.$t("Operation type")
                headers[3].title=this.$t("Shares")
                headers[4].title=this.$t("Price")
                headers[5].title=this.$t("Last year balance or invested")
                headers[6].title=this.$t("Annual gains")
                headers[7].title=this.$t("% Annual")
                headers[4].currency_row_key="currency_product"
                headers[5].currency_column=this.useStore().profile.currency
                headers[6].currency_column=this.useStore().profile.currency
                headers[7].currency_column="%"
                headers[0].width="11%"
                headers[1].width="32%"
                headers[2].width="12%"
                headers[3].width="9%"
                headers[4].width="9%"
                headers[5].width="9%"
                headers[6].width="9%"
                headers[7].width="9%"
                headers[0].total=this.$t("Total")
                headers[5].total="#SUM"
                headers[6].total="#SUM"
                r.push(this.pdfmake_loo_to_table(this.results.revaluation_free_risk, headers, "table5"))
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
                headers[4].currency_row_key="currency"
                headers[5].currency_row_key="currency"
                headers[6].currency_column="%"
                headers[0].width="8%"
                headers[1].width="8%"
                headers[2].width="44%"
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
                headers[1].currency_row_key="currency"
                headers[2].currency_row_key="currency"
                headers[4].currency_column=this.useStore().profile.currency
                headers[5].currency_column="%"
                headers[0].width="50%"
                headers[1].width="10%"
                headers[2].width="10%"
                headers[3].width="10%"
                headers[4].width="10%"
                headers[5].width="10%"
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
                r.push({ text: this.$t('7. Historical investment ranking'), id:'historical_investment_ranking', style: 'header1', tocItem: true ,pageOrientation: 'portrait', pageBreak:"before",}) // Set this page to landscape})

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
                headers[0].width="5%"
                headers[1].width="63%"
                headers[2].width="8%"
                headers[3].width="8%"
                headers[4].width="8%"
                headers[5].width="8%"
                r.push(this.pdfmake_loo_to_table(this.results.ranking, headers, "table5"))
                return r
            },  
            get_report_data(){
                const ranking_filter_data=(ios)=>{
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
                }


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
                    this.results.last_year_balance=resRA.data.last_year_balance
                    this.results.annual=resRA.data.data
                    this.results.balance=this.results.annual[this.results.annual.length-1].total
                    this.results.annual_incomes=resRAI.data
                    this.results.annual_gainsbyproductstypes=resRAG.data
                    this.results.gains_net=this.sumBy(this.results.annual_gainsbyproductstypes, "gains_net")
                    this.results.gains_gross=this.sumBy(this.results.annual_gainsbyproductstypes, "gains_gross")
                    this.results.dividends_net=this.sumBy(this.results.annual_gainsbyproductstypes,"dividends_net")
                    this.results.dividends_gross=this.sumBy(this.results.annual_gainsbyproductstypes,"dividends_gross")
                    this.results.revaluation_free_risk=resRAR.data
                    this.results.revaluation_free_risk_total=this.sumBy(this.results.revaluation_free_risk, "current_year_gains_user")
                    this.results.assets_by_bank=resBWB.data
                    this.results.accounts=resAWB.data
                    this.results.investments=resIWB.data
                    this.results.investements_invested_user=this.sumBy(this.results.investments,"invested_user")
                    this.results.investments_gains_positives=this.sumBy(this.results.investments, (item) => {return item.gains_user >= 0 ? item.gains_user : 0})
                    this.results.investments_gains_negatives=this.sumBy(this.results.investments, (item) => {return item.gains_user < 0 ? item.gains_user : 0})
                    this.results.current_investments_operations=resIOC.data
                    this.results.orders=resOrders.data
                    this.results.dividends=resDividends.data
                    this.results.ranking=ranking_filter_data(resRanking.data)

                    console.log("RESULTS", this.results)
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
        },
        created(){
            this.get_report_data()
        }
    }
</script>