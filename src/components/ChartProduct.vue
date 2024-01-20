
<template>
    <div>
        <v-card class="ma-4 pa-4">
            <div ref="chart" style="width:100%;height:600px;"  ></div>
         </v-card>
    </div>

</template>
<script>
    import * as echarts from 'echarts'
    export default {
        props:{
            ohcls:{
                required:true,
            },
            product:{   // Must be an object
                required:true
            }
        },
        data(){ 
            return{
                loading:false,
                tuple_closes:[],

            }
        },
        methods: {
            chart_option(){
                return {
                    legend: {
                        data: [this.product.name],
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
                            start: 0,
                            end: 100,
                    }],
                    series: this.series()
                }
            },
            series(){
                var r=[]
                r.push({
                    type: 'line',
                    name: this.product.name,
                    data: this.tuple_closes,
                    showSymbol:false, 
                })
                // //SMAS SERIES
                // this.prdata.smas.forEach(sma=> r.push({
                //         type:"line",
                //         name:sma.name,
                //         data: sma.data, 
                //         smooth:true,
                //         showSymbol:false, 
                //         lineStyle:{
                //             width:1
                //         }
                //     })
                // )
                // // RANGE LINES
                // var dates=[] // TO SPEED UP
                // for (var n = 0; n < this.prdata.ohcl.length; n++) {
                //     if (n %10==0){
                //         dates.push(this.prdata.ohcl[n][0])
                //     }
                // }
                // var num=this.prdata.ohcl.length
                // dates.push(this.prdata.ohcl[num-1][0])



                // for (var i = 0; i < this.prdata.pr.length; i++) {
                //     // Create line with same values
                //     var dat=[]
                //     var value=this.prdata.pr[i].value
                //     dates.forEach(d => dat.push([d,value]))
                //     r.push({
                //         type:"line",
                //         data: dat,
                //         tooltip: {
                //             show:false,
                //         },
                //         showSymbol:false, 
                //         itemStyle: (this.prdata.pr[i].recomendation_invest==true) ? {color: 'rgba(255, 213, 213, 0.4)'} :  {color: 'rgba(217, 217, 217, 0.4)'},
                //     })
                // }
                return r
            },
        },
        created(){
            this.ohcls.forEach(o => this.tuple_closes.push([new Date(o.date),o.close]))
        },
        mounted(){

            this.chart = echarts.init(this.$refs.chart);
            this.chart.setOption(this.chart_option())
        }
    }


</script>

