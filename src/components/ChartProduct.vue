
<template>
    <div>
        <v-card outlined class="ma-4 pa-4" height="500" width="100%">
            <v-chart
                ref="chart"
                :option="chart_option()"
                autoresize
                :loading="loading"
            />
         </v-card>
    </div>

</template>
<script>
    import {arrayobjects_to_array} from '../functions.js'
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
            arrayobjects_to_array,
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
        }
    }


</script>

