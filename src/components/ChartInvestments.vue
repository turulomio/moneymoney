
<template>
    <div>
        <v-card outlined class="ma-4 pa-4" height="600">
            <div ref="chart" style="width:100%;height:600px;" ></div>
         </v-card>
    </div>

</template>
<script>
    import * as echarts from 'echarts'
    import { getMapObjectById } from '@/functions'
    export default {
        props:{
            data:{ //empty_investments_chart
                required:true,
            },
        },
        data(){ 
            return{
                loading:true,
                closes:[],
                buys:[],
                sells:[],
                limitlines:[], //Array of lines n%3==0 buy, n%3==1 average n%3==2  sell
            }
        },
        computed:{
            product: function(){
                return this.getMapObjectById("products",this.data.ios_id.data.products_id)
            }
        },
        methods: {
            getMapObjectById,
            chart_option(){
                var legends= [
                            this.product.fullname, 
                            this.$t("Buys"), 
                            this.$t("Sells"), 
                    ]
                for (var i = 0; i < this.data.limitlines.length; i++) {
                    legends.push(this.limitlines_series_name(i*3+0))
                    legends.push(this.limitlines_series_name(i*3+1))
                    legends.push(this.limitlines_series_name(i*3+2))
                }
                return {
                    legend: {
                        data: legends,
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
                    name: this.product.fullname, 
                    data: this.closes,
                    showSymbol:false,
                })
                //BUYS
                r.push({
                        name: this.$t("Buys"),
                        type: 'scatter',
                        data: this.buys, 
                        smooth:true,
                        showSymbol:true,
                        symbolSize:10, 
                        color: "#00FF00",
                })
                //SELLS
                r.push({
                        name: this.$t("Sells"),
                        type: 'scatter',
                        data: this.sells, 
                        smooth:true,
                        showSymbol:true,
                        symbolSize:10, 
                        color: "#FF0000",
                })

                //LIMIT LINES
                for (var pos = 0; pos < this.data.limitlines.length; pos++) {
                    r.push({
                        type: 'line',
                        name: this.limitlines_series_name(pos*3+0),
                        data: this.limitlines[pos*3+0],
                        showSymbol:false,
                        color: this.limitlines_series_color(pos*3+0),
                        lineStyle: {
                            width: 4,
                            type: 'dashed'
                        },
                    })
                    r.push({
                        type: 'line',
                        name: this.limitlines_series_name(pos*3+1),
                        data: this.limitlines[pos*3+1],
                        showSymbol:false,
                        color: this.limitlines_series_color(pos*3+1),
                        lineStyle: {
                            width: 4,
                        },
                    })
                    r.push({
                        type: 'line',
                        name: this.limitlines_series_name(pos*3+2),
                        data: this.limitlines[pos*3+2],
                        showSymbol:false,
                            color: this.limitlines_series_color(pos*3+2),
                        lineStyle: {
                            width: 4,
                            type: 'dotted'
                        },
                    })
                }

                return r
            },
            limitlines_series_name(position){
                var num = ~~(position / 3); //Division integer
                if(position % 3==0){
                    return `${'Buy price'} ${num}`
                } else if (position % 3==1){
                    return `${'Average price'} ${num}`
                } else if (position % 3==2){
                    return `${'Sell price'} ${num}`
                }
            },
            limitlines_series_color(position){
                var colors=['pink','gray','yellow','orange']
                var num = ~~(position / 3); //Division integer
                return colors[num]
            },
        },
        created(){
             this.loading=false
             this.data.ohcls.forEach(o=> {
                this.closes.push([new Date(o.date), o.close])
             })
            this.data.limitlines.forEach(ll=>{ //0 buy,1 average,2 sell
                var buy=[]
                var avg=[]
                var sell=[]
                this.data.ohcls.forEach(ohcl=> {
                    buy.push([new Date(ohcl.date),ll.buy])
                    avg.push([new Date(ohcl.date),ll.average])
                    sell.push([new Date(ohcl.date),ll.sell])
                })
                this.limitlines.push(buy)
                this.limitlines.push(avg)
                this.limitlines.push(sell)
            })
             this.data.ios_id.io.forEach(o=> {
                if (o.shares>=0){
                    this.buys.push([o.datetime,o.price])
                } else {
                    this.sells.push([o.datetime, o.price])
                }
             })

            this.chart = echarts.init(this.$refs.chart);
            this.chart.setOption(this.chart_option())
        }
    }


</script>

