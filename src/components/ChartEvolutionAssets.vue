
<template>
    <div ref="div">
        <h1>{{ $t("Evolution assets chart")}}</h1>
        <div class="d-flex justify-center mb-4 mt-4" >
            <v-card width="30%" variant="flat">
                <v-select class="pa-4" density="compact" :label="$t('Select the year from which to display the report')" v-model="from" :items="years()" @change="change_year()"></v-select>       
            </v-card>
        </div>
        <v-card class="ma-4 pa-4" >
            <div ref="chart" style="width:100%;height:600px;"  ></div>
         </v-card>
    </div>

</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import * as echarts from 'echarts'
    export default {
        props: {
            hidden:{
                type: Boolean,
                required:false,
                default:false,
            }
        },
        data(){ 
            return{
                loading:false,
                balance:[],
                accounts:[],
                investments:[],
                invested:[],
                zerorisk:[],
                from: new Date().getFullYear()-3,

            }
        },
        methods: {
            useStore,
            chart_option(){
                // var =this
                return {
                    legend: {
                        data: [this.$t("Balance"),this.$t("Accounts"),this.$t("Investments"),this.$t("Invested"),this.$t("Zero risk")],
                        inactiveColor: '#777',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false,
                            type: 'cross',
                            lineStyle: {
                                color: '#376df4',
                                width: 2,
                                opacity: 1
                            }
                        },
                        formatter: (params) => {
                            return params[0].axisValueLabel + "<br>" +
                                params[0].marker + params[0].seriesName + ": " + this.localcurrency_string(params[0].data[1])  + "<br>"  + 
                                params[1].marker + params[1].seriesName + ": " + this.localcurrency_string(params[1].data[1])  + "<br>"  + 
                                params[2].marker + params[2].seriesName + ": " + this.localcurrency_string(params[2].data[1])  + "<br>"  + 
                                params[3].marker + params[3].seriesName + ": " + this.localcurrency_string(params[3].data[1])  + "<br>"  + 
                                params[4].marker + params[4].seriesName + ": " + this.localcurrency_string(params[4].data[1]) 
                        }
                    },
                    xAxis: {
                        type: 'time',
                        axisLine: { lineStyle: { color: '#8392A5' } }
                    },
                    yAxis: {
                        scale: true,
                        axisLine: { lineStyle: { color: '#8392A5' } },
                        splitLine: { show: false }
                    },
                    grid: {
                        bottom: 80, 
                        left:80
                    },
                    dataZoom: [{
                            type: 'slider',
                            start: 0,
                            end: 100,
                    }],
                    series: [
                        {
                            type:"line",
                            name: this.$t("Balance"),
                            data: this.balance, 
                            smooth:true,
                            showSymbol:false, 
                            lineStyle:{
                                width:1
                            }
                        },
                        {
                            type:"line",
                            name: this.$t("Accounts"),
                            data: this.accounts, 
                            smooth:true,
                            showSymbol:false, 
                            lineStyle:{
                                width:1
                            }
                        },
                        {
                            type:"line",
                            name: this.$t("Invested"),
                            data: this.invested, 
                            smooth:true,
                            showSymbol:false, 
                            lineStyle:{
                                width:1
                            }
                        },
                        {
                            type:"line",
                            name: this.$t("Investments"),
                            data: this.investments, 
                            smooth:true,
                            showSymbol:false, 
                            lineStyle:{
                                width:1
                            }
                        },
                        {
                            type:"line",
                            name: this.$t("Zero risk"),
                            data: this.zerorisk, 
                            smooth:true,
                            showSymbol:false, 
                            lineStyle:{
                                width:1
                            }
                        },
                    ]
                }
            },
            years(){
                var start=1990
                var end=new Date().getFullYear()
                return Array(end - start + 1).fill().map((_, idx) => start + idx)
            },
            change_year(){
                this.refreshChart()
            },
            refreshChart(){
                this.loading=true
                axios.get(`${this.useStore().apiroot}/reports/evolutionassets/chart/?from=${this.from}`, this.myheaders())
                .then((response) => {
                    this.balance=[]
                    this.accounts=[]
                    this.investments=[]
                    this.invested=[]
                    this.zerorisk
                    response.data.forEach(o => {
                        this.balance.push([o.datetime, o.total_user])
                        this.accounts.push([o.datetime, o.accounts_user])
                        this.investments.push([o.datetime, o.investments_user])
                        this.invested.push([o.datetime, o.invested_user])
                        this.zerorisk.push([o.datetime, o.zerorisk_user])

                    })
                    if (this.hidden){
                        this.$refs.div.style.visibility="hidden"
                    } 

                    this.chart = echarts.init(this.$refs.chart);
                    this.chart.on('finished', this.on_finished);
                    this.chart.setOption(this.chart_option())
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_finished(){
                this.$emit("finished", "chart_assets", this.chart.getDataURL({pixelRatio: 6, backgroundColor: '#fff', excludeComponents:['dataZoom']}))
            },
        },
        mounted(){

            this.refreshChart()

        }
    }


</script>

