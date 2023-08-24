
<template>
    <div>    
        <h1>{{ $t("'[0]' evolution").format(investment.name) }}</h1>
        <v-card outlined class="ma-4 pa-4"  :style="styleheight()" v-if="loading==false">
            <v-chart
                :option="chart_option()"
                autoresize
                :loading="loading"
            />
         </v-card>
    </div>

</template>
<script>
    import axios from 'axios'
    export default {
        props:{
            investment:{
                required:true,
            },
            height: {
                type: Number,
                required: false,
                default:600
            },
        },
        data(){ 
            return{
                balance: [],
                datetimes:[],
                invested:[],
                gains:[],
                gains_dividends:[],
                dividends:[],
                loading:true,

            }
        },
        methods: {
            chart_option(){
                return  {
                    legend: {
                        data: [ this.$t("Invested"), this.$t("Balance"), this.$t("Gains and dividends"),  this.$t("Gains"),  this.$t("Dividends")],
                        inactiveColor: '#777',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false,
                            type: 'cross',
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
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            saveAsImage: {}
                        }
                    },
                    dataZoom: [{
                            type: 'slider',
                            start: 0,
                            end: 100,
                    }],
                    series: [
                        {
                            type: 'line',
                            name: this.$t("Invested"),
                            data: this.invested,
                        },                

                        {
                            type: 'line',
                            name: this.$t("Balance"),
                            data: this.balance,
                        },             
                        {
                            type: 'line',
                            name: this.$t("Gains and dividends"),
                            data: this.gains_dividends,
                        },             
                        {
                            type: 'line',
                            name: this.$t("Gains"),
                            data: this.gains,
                        },             
                        {
                            type: 'line',
                            name: this.$t("Dividends"),
                            data: this.dividends,
                        },                
                    ]
                }
            },
            styleheight: function(){
                return `height: ${this.height}px`
            },
        },
        mounted(){

            axios.get(`${this.investment.url}operations_evolution_chart/`, this.myheaders())
            .then((response) => {
                this.invested=[]    
                this.dividends=[]
                this.gains=[]
                this.gains_dividends=[]   
                this.balance=[]  
                for (var i = 0; i < response.data.datetimes.length; i++) {
                    this.invested.push([response.data.datetimes[i],response.data.invested[i]])
                    this.dividends.push([response.data.datetimes[i],response.data.dividends[i]])
                    this.gains.push([response.data.datetimes[i],response.data.gains[i]])
                    this.gains_dividends.push([response.data.datetimes[i],response.data.gains_dividends[i]])
                    this.balance.push([response.data.datetimes[i],response.data.balance[i]])
                }
                this.loading=false
            }, (error) => {
                this.parseResponseError(error)
            });
        }
    }


</script>

