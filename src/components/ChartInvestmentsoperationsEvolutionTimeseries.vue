
<template>
    <div>    
        <h1>{{ $t(`'${investment.name}' evolution`) }}</h1>
        <v-card outlined class="ma-4 pa-4"  :style="styleheight()">
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
                data:null,
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
            axios.get(`${this.$store.state.apiroot}/investmentsoperations/evolutionchart/?investment=${this.investment.id}`, this.myheaders())
            .then((response) => {
                console.log(response.data)
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
                console.log(this.invested)
            }, (error) => {
                this.parseResponseError(error)
            });
        }
    }


</script>

