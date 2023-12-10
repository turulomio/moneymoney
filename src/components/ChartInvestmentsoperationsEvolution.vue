<template>
    <div>    
        <h1>{{ f($t("'[0]' evolution"), [investment.name]) }}</h1>
        <v-card outlined class="ma-4 pa-4" :style="styleheight()" v-if="loading==false">
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
            investment:{ //Object must have id and name
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
                        type: 'category',
                        data: this.datetimes,
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
                this.datetimes=response.data.datetimes
                this.dividends=response.data.dividends
                this.gains_dividends=response.data.gains_dividends
                this.gains=response.data.gains
                this.invested=response.data.invested
                this.balance=response.data.balance
                this.loading=false
            }, (error) => {
                this.parseResponseError(error)
            });
        }
    }


</script>

