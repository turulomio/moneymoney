
<template>
    <div>
        <h1>{{ $t("Evolution assets chart")}}</h1>
        <div class="d-flex justify-center mb-4 mt-4">
            <v-card width="30%">
             <v-select class="pa-4" width="10%" dense label="Select the year from which to display the report" v-model="from" :items="years()" @change="change_year()"></v-select>       
             </v-card>
        </div>
        <v-card outlined class="ma-4 pa-4" height="650">
            <v-chart
                ref="chart"
                :option="chart_option()"
                autoresize
                :loading="loading"
                @finished="on_finished"
            />
         </v-card>
    </div>

</template>
<script>
    import axios from 'axios'
    import {arrayobjects_to_array} from '../functions.js'
    export default {
        props: {
            save_prefix:{
                required:false,
            },
        },
        data(){ 
            return{
                loading:false,
                balance:[],
                accounts:[],
                investments:[],
                invested:[],
                from: new Date().getFullYear()-3,

            }
        },
        methods: {
            arrayobjects_to_array,
            chart_option(){
                // var this_=this
                return {
                    legend: {
                        data: [this.$t("Balance"),this.$t("Accounts"),this.$t("Investments"),this.$t("Invested")],
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
                                params[3].marker + params[3].seriesName + ": " + this.localcurrency_string(params[3].data[1]) 
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
                        textStyle: {
                            color: '#8392A5'
                        },
                        handleIcon: 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        dataBackground: {
                            areaStyle: {
                                color: '#8392A5'
                            },
                            lineStyle: {
                                opacity: 0.8,
                                color: '#8392A5'
                            }
                        },
                        brushSelect: true
                    }, {
                        type: 'inside'
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
                axios.get(`${this.$store.state.apiroot}/reports/evolutionassets/chart/?from=${this.from}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.balance=[]
                    this.accounts=[]
                    this.investments=[]
                    this.invested=[]
                    response.data.forEach(o => {
                        this.balance.push([o.datetime, o.total_user])
                        this.accounts.push([o.datetime, o.accounts_user])
                        this.investments.push([o.datetime, o.investments_user])
                        this.invested.push([o.datetime, o.invested_user])

                    })
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_finished(){
                if (this.save_prefix!=null){
                    var filename=this.save_prefix
                    axios.post(`${this.$store.state.apiroot}/echarts/to/file/`, {filename:filename,data:this.$refs.chart.getDataURL(),}, this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
                
            }
        },
        mounted(){
            this.refreshChart()

        }
    }


</script>

