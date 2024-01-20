
<template>
    <div>
        <h1 v-if="!notitle">{{ $t("Price ratio chart")}}</h1>

            <v-card class="ma-4 pa-4">
            <div ref="chart" style="width:100%;height:600px;"  ></div>
         </v-card>
    </div>

</template>
<script>
import * as echarts from 'echarts'
    export default {
        props:{
            product_a:{
                required:true,
            },
            product_b:{
                required:true,
            },
            data:{
                required:true,
            },
            notitle:{
                type: Boolean,
                required: false,
                default: false
            }
        },
        data(){ 
            return{
                loading:false,
            }
        },
        methods: {
            chart_option(){
                // var =this
                return {
                    legend: {
                        data: [this.$t("Price ratio")],
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
                            name: this.$t("Price ratio"),
                            data: this.data, 
                            smooth:true,
                            showSymbol:false, 
                            lineStyle:{
                                width:1
                            }
                        },
                    ]
                }
            },
        },
        mounted(){
            this.chart = echarts.init(this.$refs.chart);
            this.chart.setOption(this.chart_option())
        }
    }


</script>

