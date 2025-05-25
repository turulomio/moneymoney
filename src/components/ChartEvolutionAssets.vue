<template>
    <div ref="div" :style="hidden? 'visibility: hidden': ''">
        <h1>{{ $t("Evolution assets chart")}}</h1>
        <div class="d-flex justify-center mb-4 mt-4" >
            <v-card width="30%" variant="flat">
                <v-select class="pa-4" :disabled="loading" :loading="loading" :label="$t('Select the year from which to display the report')" v-model="from" :items="years()" />
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
    import { parseResponseError, myheaders } from '@/functions'
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
                chart: null, // ECharts instance
                chartReadyPromise: null, // Promise for chart initialization
                finished:false, // Flag for rendering completion
                balance:[],
                accounts:[],
                investments:[],
                invested:[],
                zerorisk:[],
                from: new Date().getFullYear()-3,
            }
        },        
        watch:{
            from() {
                this.refreshChart()
            },
        },
        methods: {
            useStore,
            parseResponseError,
            myheaders,
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
            refreshChart() {
                this.loading = true;
                this.finished = false; // Reset finished flag for new rendering

                // Dispose previous chart instance if it exists
                if (this.chart) {
                    this.chart.dispose();
                    this.chart = null;
                }

                this.chartReadyPromise = new Promise((resolve, reject) => {
                    axios.get(`${this.useStore().apiroot}/reports/evolutionassets/chart/?from=${this.from}`, this.myheaders())
                    .then((response) => {
                        this.balance = [];
                        this.accounts = [];
                        this.investments = [];
                        this.invested = [];
                        this.zerorisk = [];
                        response.data.forEach(o => {
                            this.balance.push([o.datetime, o.total_user]);
                            this.accounts.push([o.datetime, o.accounts_user]);
                            this.investments.push([o.datetime, o.investments_user]);
                            this.invested.push([o.datetime, o.invested_user]);
                            this.zerorisk.push([o.datetime, o.zerorisk_user]);
                        });

                        if (!this.$refs.chart) {
                            console.error("Chart DOM element not found during refresh.");
                            this.loading = false;
                            reject(new Error("Chart DOM element not found"));
                            return;
                        }
                        
                        this.chart = echarts.init(this.$refs.chart);
                        this.chart.on('finished', this.on_finished);
                        this.chart.setOption(this.chart_option());
                        
                        this.loading = false;
                        console.log("Chart refreshed and options set. Instance:", this.chart);
                        resolve(this.chart);
                    }, (error) => {
                        this.parseResponseError(error);
                        this.loading = false;
                        reject(error);
                    });
                });
                return this.chartReadyPromise;
            },
            on_finished(){
                this.finished = true;
                console.log("ECharts 'finished' event fired. this.finished set to true.");
            },

            async downloadChart() {
                if (!this.chart && this.chartReadyPromise) {
                    try {
                        console.log("downloadChart: Chart not ready, awaiting chartReadyPromise...");
                        await this.chartReadyPromise;
                    } catch (error) {
                        console.error("downloadChart: Chart initialization failed.", error);
                        return null; // Or throw error
                    }
                }
                if (!this.chart) {
                    console.error("downloadChart: Chart instance is not available.");
                    return null; // Or throw error
                }

                if (!this.finished) {
                    console.log("downloadChart: Chart rendering not finished, waiting...");
                    let attempts = 0;
                    const maxAttempts = 300; // Wait up to 30 seconds (300 * 100ms)
                    while (!this.finished && attempts < maxAttempts) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        attempts++;
                    }
                    if (!this.finished) {
                        console.warn("downloadChart: Timeout waiting for chart to finish rendering. Capturing current state.");
                    } else {
                        console.log("downloadChart: Chart finished rendering.");
                    }
                } else {
                    console.log("downloadChart: Chart already reported as finished.");
                }
                return this.chart.getDataURL({ pixelRatio: 6, backgroundColor: '#fff' });
            },
        },
        mounted(){

            this.refreshChart()

        }
    }


</script>
