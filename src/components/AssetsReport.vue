<template>
    <div>
        <h1>{{ $t("Assets Report") }}</h1>
        <div class="d-flex justify-center mb-4" width="20%">                
            <v-card width="20%" class="pa-4">      
    
                <v-select class="pa-4" density="compact" label="Select a format" v-model="format" :items="['pdf','odt','docx']"></v-select>       
                <v-alert density="compact" class=" px-10" outlined :type="(unogenerator_working) ? 'success':'error'"> {{ (unogenerator_working) ? $t("UnoGenerator is ready"): $t("UnoGenerator is not working. Please contact system administrator")}}</v-alert>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn data-test="AssetsReport_ButtonGenerate" class="pa-4" :loading="loading" color="primary" :disabled="!can_launch" @click="launch_report">{{ (can_launch)?  $t("Generate report"): $t("Report is being prepared. Please be patient...") }}</v-btn>

                    <v-spacer></v-spacer>

                </v-card-actions>
                    <v-btn data-test="AssetsReport_ButtonGenerateAlternative" class="pa-4" :loading="loading" color="primary" :disabled="!can_launch" @click="launch_report_alternative">{{ (can_launch)?  $t("Generate report alternative"): $t("Report is being prepared. Please be patient...") }}</v-btn>

            </v-card>
        </div>
        <div ref="chart_assets" v-if="data">
            <!-- <ChartEvolutionAssets ref="chart_assets"  v-if="unogenerator_working" reference="chart_assets" @finished="on_chart_finished" /> -->
            <ChartPie name="Investments by product" hidden :items="echart_products_items" reference="chart_pie_product" :heigth="height" :show_data="false" @finished="on_chart_finished" />
            <!-- <ChartPie name="Investments by pci" hidden :items="echart_pci_items" reference="chart_pie_pci" :heigth="height" :show_data="false" @finished="on_chart_finished"/>
            <ChartPie name="Investments by variable percentage" hidden :items="echart_percentage_items" reference="chart_pie_percentage" :heigth="height" :show_data="false" @finished="on_chart_finished"/>
            <ChartPie name="Investments by product type" hidden :items="echart_producttype_items" reference="chart_pie_producttype" :heigth="height" :show_data="false" @finished="on_chart_finished"/>
            <ChartPie name="Investments by leverage" hidden :items="echart_leverage_items" reference="chart_pie_leverage" :heigth="height" :show_data="false" @finished="on_chart_finished"/> -->
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    // import ChartEvolutionAssets from './ChartEvolutionAssets.vue'
    import ChartPie from './ChartPie.vue'
    import { my_round, f } from 'vuetify_rules'
    import {sumBy} from "lodash-es"

    import pdfMake from "pdfmake/build/pdfmake";
    import pdfFonts from "pdfmake/build/vfs_fonts";
    import {pdfmake_convertImageToDataURL, pdfmake_percentage_string, pdfmake_loo_to_table, pdfmake_loo_to_table_guess_headers} from "@/pdfmake_helpers"
    pdfMake.vfs = pdfFonts.pdfMake.vfs;


    import imgMoneymoney from '../assets/moneymoney.png'

    export default {
        components:{
            ChartPie,
            // ChartEvolutionAssets,
        },
        data(){
            return {
                loading:false,
                data:null,
                key:0,
                height:100,

                imgMoneymoney,

                format:"pdf",
                unogenerator_working:false,
                method:"Current",

                payload:{
                    format: "pdf",
                    chart_pie_product: null,
                    chart_pie_pci: null,
                    chart_pie_percentage: null,
                    chart_pie_producttype: null,
                    chart_pie_leverage: null,
                    chart_assets: null,
                },

                results:{},

            }
        },       
        watch:{
            format(){
                this.payload.format=this.format
            }
        },
        computed:{
            /// COPIED FROM REPORTSINVESTMENTSCLASSES
            echart_products_items: function(){
                var products= this.data.by_product
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
                var products= this.data.by_pci
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
                var products= this.data.by_percentage
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
                var products= this.data.by_producttype
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
                var products= this.data.by_leverage
                var adapted
                if (this.method=="Current"){
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.balance, 2)}))
                } else {//Invested
                    adapted= products.map(el => ({name: el.name, value: this.my_round(el.invested,2)}))
                }
                adapted=adapted.filter(o => o.value!=0)
                return adapted
            },
            can_launch(){
                return true
                // for (let key in this.payload) {
                //     if (this.payload[key]==null) return false
                // }
                // return true
            },
        },
        methods:{
            useStore,
            my_round,
            f,
            sumBy,
            pdfmake_convertImageToDataURL,
            pdfmake_loo_to_table,
            pdfmake_loo_to_table_guess_headers,
            pdfmake_percentage_string,
            launch_report(){
                this.loading=true //False to debugging

                axios.post(`${this.useStore().apiroot}/assets/report/`, this.payload, this.myheaders())
                .then((response) => {
                    this.loading=false
                    var link = window.document.createElement('a');

                    link.href = `data:${response.data.mime};base64,${response.data.data}`
                    link.download = response.data.filename
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            async launch_report_alternative(){
                this.loading=true //False to debugging


                // const canvas = await html2canvas(this.$refs.chart_assets);
                // const imgAssetsReport = canvas.toDataURL('image/png');

                const docDefinition = {
                    content: [    
                        { image: await pdfmake_convertImageToDataURL(imgMoneymoney), width: 200, alignment: 'center', margin: [0, 125, 0, 0] },
                        { text: 'Assets report', style: 'header1', alignment:'center' },
                        { text: f(this.$t(`Generated by MoneyMoney-[0]`), [this.useStore().version,]), style: 'body', alignment:'center' },  
                        { text: new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()), style: 'body', alignment:'center' , margin: [0, 300, 0, 200],pageBreak:'after' },

                        { toc: { title: { text: 'Table of Contents', style: 'header1', numberStyle: 'normal'}}, pageBreak:"after"},

                        { text: this.$t('Personal settings'), id:'Personal_settings', style: 'header1', tocItem: true },
                        { text: f(this.$t("Your user currency is set to [0]."),[this.useStore().profile.currency,]), style: 'body' },
                        { text: f(this.$t("Your local time zone is set to [0]."),[this.useStore().profile.zone,]), style: 'body' ,pageBreak:"after"},

                        ...this.report_assets(),
                        ...this.report_assets_by_bank(),
                        ...this.report_current_year_evolution(),
                        ...this.report_assets_current_year_detail(),

                        { text: 'Report Title', style: 'header1' },
                        { text: 'This is a detailed report generated in JavaScript.', style: 'body', 
                        linkToDestination: 'Personal_settings', },        
                        {
                            image: this.payload["chart_pie_product"],
                            width: 500,
                            alignment: 'center'
                        },
                    ],
                    styles: {
                        header1: { fontSize: 16, bold: true },
                        header2: { fontSize: 14, bold: true },
                        body: { fontSize: 11 },
                        table8: {fontSize:8},
                        table12: {fontSize:12},
                    },

                    footer: function(currentPage, pageCount) {
                        return (currentPage>2)? { text: currentPage.toString() + this.$t(' of ') + pageCount, alignment: 'center' }:""
                    }.bind(this)
                };
                console.log(docDefinition)
                pdfMake.createPdf(docDefinition).download('report.pdf');
                this.loading=false
            },

            update_pies(){
                this.loading=true
                axios.get(`${this.useStore().apiroot}/investments/classes/`, this.myheaders())
                .then((response) => {
                    this.data=response.data
                    this.loading=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            check_unogenerator_server(){
                axios.get(`${this.useStore().apiroot}/unogenerator/working/`, this.myheaders())
                .then((response) => {
                    this.unogenerator_working=response.data
                    this.key=this.key+1
                }, (error) => {
                    this.unogenerator_working=false
                    this.parseResponseError(error)
                });

            },
            on_chart_finished(reference,image){
                this.payload[reference]=image
            },
            report_assets(){
                var r=[]
                r.push({ text: this.$t('Assets'), id:'assets', style: 'header1', tocItem: true })
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
                r.push({ text: this.$t('Assets by bank'), id:'assets_by_bank', style: 'header2', tocItem: true })
                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.assets_by_bank, ["name","balance_accounts","balance_investments","balance_total"])
                headers[1].title=this.$t("Accounts balance")
                headers[2].title=this.$t("Investments balance")
                headers[3].title=this.$t("Total balance")
                headers[1].currency=this.useStore().profile.currency
                headers[2].currency=this.useStore().profile.currency
                headers[3].currency=this.useStore().profile.currency
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
                r.push({ text: this.$t('Assets current year evolution'), id:'assets_current_year_evolution', style: 'header2', tocItem: true })
                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.annual, ["month","account_balance","investment_balance","total","percentage_year","diff_lastmonth"])

                headers[0].title=this.$t("Month")
                headers[1].title=this.$t("Accounts balance")
                headers[2].title=this.$t("Investments balance")
                headers[3].title=this.$t("Total balance")
                headers[4].title=this.$t("Annual percentage")
                headers[5].title=this.$t("Last month difference")
                headers[1].currency=this.useStore().profile.currency
                headers[2].currency=this.useStore().profile.currency
                headers[3].currency=this.useStore().profile.currency
                headers[4].currency="%"
                headers[5].currency=this.useStore().profile.currency
                headers[0].total=this.$t("Total")
                headers[5].total="#SUM"
                r.push(this.pdfmake_loo_to_table(this.results.annual, headers, "table8"))
                return r
            },
            report_assets_current_year_detail(){
                var r=[]
                r.push({ text: this.$t('Assets current year detail'), id:'assets_current_year_detail', style: 'header2', tocItem: true })
                var headers=this.pdfmake_loo_to_table_guess_headers(this.results.annual_incomes, ["month","incomes","expenses","gains","dividends","total"])

                headers[0].title=this.$t("Month")
                headers[1].title=this.$t("Incomes")
                headers[2].title=this.$t("Expenses")
                headers[3].title=this.$t("Gains")
                headers[4].title=this.$t("Dividends")
                headers[5].title=this.$t("Total")
                headers[1].currency=this.useStore().profile.currency
                headers[2].currency=this.useStore().profile.currency
                headers[3].currency=this.useStore().profile.currency
                headers[4].currency=this.useStore().profile.currency
                headers[5].currency=this.useStore().profile.currency
                headers[0].total=this.$t("Total")
                headers[1].total="#SUM"
                headers[2].total="#SUM"
                headers[3].total="#SUM"
                headers[4].total="#SUM"
                headers[5].total="#SUM"
                r.push(this.pdfmake_loo_to_table(this.results.annual_incomes, headers, "table8"))


                r.push({ text: f(this.$t("Up to date you have got [0] (net gains + net dividends) what represents a [1] of the total assets at the end of the last year."), [
                        this.localcurrency_html(this.results.dividends_net), 
                        this.percentage_string(this.results.dividends_net/this.results.last_year_balance)
                    ]), style:"body"})
        

                return r
            },
            get_report_data(){
                const year=new Date().getFullYear()
                axios.all([
                    axios.get(`${this.useStore().apiroot}/api/banks/withbalance/?active=true`, this.myheaders()),//resBWB
                    axios.get(`${this.useStore().apiroot}/reports/annual/${year}/`, this.myheaders()),//resRA
                    axios.get(`${this.useStore().apiroot}/reports/annual/income/${year}/`, this.myheaders()),//resRAI
                    axios.get(`${this.useStore().apiroot}/reports/annual/gainsbyproductstypes/${year}/`, this.myheaders()),//resRAG
                    axios.get(`${this.useStore().apiroot}/reports/annual/revaluation/?only_zero=true`, this.myheaders()),//resRAR
                ]).then(([resBWB, resRA, resRAI, resRAG, resRAR]) => {
                    this.results.last_year_balance=resRA.data.last_year_balance
                    this.results.annual=resRA.data.data
                    this.results.balance=this.results.annual[this.results.annual.length-1].total
                    this.results.annual_incomes=resRAI.data
                    this.results.annual_gainsbyproductstypes=resRAG.data
                    this.results.dividends_net=this.sumBy(this.annual_gainsbyproductstypes,"dividends_net")
                    console.log(this.results.dividends_net,"DIVIDENS_NDS")
                    this.results.dividends_gross=this.sumBy(this.annual_gainsbyproductstypes,"dividends_gross")
                    this.results.annual_revaluation=resRAR.data
                    this.results.assets_by_bank=resBWB.data

                    console.log(this.results)
                }, (error) => {
                    this.parseResponseError(error)
                })
            },

        },
        created(){
            this.loading=true
            this.check_unogenerator_server()
            this.update_pies()
            this.get_report_data()
        }
    }
</script>