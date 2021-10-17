
<template>
    <div>
        <v-card outlined class="ma-4 pa-4" height="600">
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
        methods: {
            arrayobjects_to_array,
            chart_option(){
                var legends= [
                            this.data.io_object.product.name, 
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
                    name: this.data.io_object.product.name, 
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
        mounted(){
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
             console.log(this.limitlines)
             this.data.io_object.io.forEach(o=> {
                if (o.shares>=0){
                    this.buys.push([o.datetime,o.price])
                } else {
                    this.sells.push([o.datetime, o.price])
                }
             })

        }
    }


</script>

