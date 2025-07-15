
<template>
    <div>

        <v-card class="ma-4 pa-4">
            <div ref="chart" style="width:100%;height:600px;"  ></div>
         </v-card>
    </div>

</template>
<script>
    import * as echarts from 'echarts'
    import { arrayobjects_to_array } from '@/functions' 

    export default {
        props:{
            prdata:{
                required:true,
            },
        },
        data(){ 
            return{
                loading:true,

            }
        },
        methods: {
            arrayobjects_to_array,
            chart_option(){
                return {
                    legend: {
                        data: this.legends,
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
                            start: 90,
                            end: 100,
                    }],
                    series: this.series()
                }
            },
            series(){
                var r=[]
                this.indicators.forEach(indicator=>r.push({
                        type:"line",
                        name: (indicator=="close")? this.prdata.product.name : indicator,
                        data: this.prdata.dataframe.map(o=>[o.date,o[indicator]]), 
                        smooth:true,
                        showSymbol:false, 
                        lineStyle:{
                            width:3
                        }
                    })
                )

                for (var i = 0; i < this.prdata.pr.length; i++) {
                    // Create line with same values
                    var dat=[]
                    var value=this.prdata.pr[i].value
                    this.prdata.dataframe.forEach(d => dat.push([d.date, value]))
                    r.push({
                        type:"line",
                        data: dat,
                        tooltip: {
                            show:false,
                        },
                        showSymbol:false, 
                        itemStyle: (this.prdata.pr[i].recomendation_invest==true) ? {color: 'rgba(255, 213, 213, 0.4)'} :  {color: 'rgba(217, 217, 217, 0.4)'},
                    })
                }
                return r
            },
        },
        mounted(){
            this.indicators=Object.keys(this.prdata.dataframe[0]).filter(key => !["date", "open", "high", "low", "products_id"].includes(key))
            this.legends=Object.keys(this.prdata.dataframe[0]).filter(key => !["date", "open", "high", "low", "products_id"].includes(key))
            console.log(this.indicators)
            this.legends[0]=this.prdata.product.name
            console.log(this.legends)
            this.chart = echarts.init(this.$refs.chart);
            this.chart.setOption(this.chart_option())
            this.loading=false
        }
    }


</script>

