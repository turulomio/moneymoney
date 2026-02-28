
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
        watch: {
            prdata: {
                handler(){
                    this.updateChart()
                },
                deep: true
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

                var orders = []
                if (this.prdata.orders && this.prdata.orders.length > 0) {
                    orders = this.prdata.orders
                } else if (this.prdata.pr) {
                    this.prdata.pr.forEach(range => {
                        if (range.orders_inside) {
                            orders = orders.concat(range.orders_inside)
                        }
                    })
                }

                var normal_orders = []
                var up_orders = []
                var down_orders = []

                orders.forEach(o => {
                    var item = [o.date, parseFloat(o.price), o.name]
                    if (o.type === 'Up') {
                        up_orders.push(item)
                    } else if (o.type === 'Down') {
                        down_orders.push(item)
                    } else {
                        normal_orders.push(item)
                    }
                })

                var aspa = 'path://M3.5,3.5L20.5,20.5M3.5,20.5L20.5,3.5'

                if (normal_orders.length > 0) {
                    r.push({ type: 'scatter', name: 'Orders', data: normal_orders, itemStyle: { color: 'grey' }, symbol: 'circle', symbolSize: 8, tooltip: { formatter: (params) => { return params.data[2] } } })
                }

                if (up_orders.length > 0) {
                    r.push({ type: 'scatter', name: 'Up Orders', data: up_orders, itemStyle: { color: 'green' }, symbol: aspa, symbolSize: 10, tooltip: { formatter: (params) => { return params.data[2] } } })
                }

                if (down_orders.length > 0) {
                    r.push({ type: 'scatter', name: 'Down Orders', data: down_orders, itemStyle: { color: 'red' }, symbol: aspa, symbolSize: 10, tooltip: { formatter: (params) => { return params.data[2] } } })
                }

                var operations = []
                if (this.prdata.operations && this.prdata.operations.length > 0) {
                    operations = this.prdata.operations
                } else if (this.prdata.pr) {
                    this.prdata.pr.forEach(range => {
                        if (range.investments_inside) {
                            operations = operations.concat(range.investments_inside)
                        }
                    })
                }

                var normal_operations = []
                operations.forEach(o => {
                    var item = [o.date, parseFloat(o.price), o.name]
                    normal_operations.push(item)
                })

                if (normal_operations.length > 0) {
                    r.push({ type: 'scatter', name: 'Operations', data: normal_operations, itemStyle: { color: 'blue' }, symbol: 'diamond', symbolSize: 10, tooltip: { formatter: (params) => { return params.data[2] } } })
                }

                return r
            },
            updateChart(){
                if (!this.prdata || !this.prdata.dataframe) return
                this.indicators=Object.keys(this.prdata.dataframe[0]).filter(key => !["date", "open", "high", "low", "products_id"].includes(key))
                this.legends=Object.keys(this.prdata.dataframe[0]).filter(key => !["date", "open", "high", "low", "products_id"].includes(key))
                this.legends[0]=this.prdata.product.name
                if (!this.chart) {
                    this.chart = echarts.init(this.$refs.chart);
                }
                this.chart.setOption(this.chart_option(), true)
                this.loading=false
            }
        },
        mounted(){
            this.updateChart()
        }
    }


</script>
