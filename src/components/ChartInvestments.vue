
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
            ios:{
                required:true,
            },
            ohcl:{
                required:true
            }
        },
        data(){ 
            return{
                loading:true,
                closes:[],
                buys:[],
                sells:[],
                sellingprice:[],
                averageprice:[],
            }
        },
        methods: {
            arrayobjects_to_array,
            chart_option(){
                return {
                    legend: {
                        data: [this.ios.product.name, this.$t("Buys"), this.$t("Sells"), this.$t("Selling price"), this.$t("Average price")],
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
                    name: this.ios.product.name, 
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

                //SELLING PRICE

                if (this.sellingprice!=null && this.sellingprice>0){
                    r.push({
                        type: 'line',
                        name: this.$t("Selling price"),
                        data: this.sellingprice,
                        showSymbol:false,
                            color: "pink",
                    })
                }
                //AVERAGE PRICE

                r.push({
                    type: 'line',
                    name: this.$t("Average price"),
                    data: this.averageprice,
                    showSymbol:false,
                        color: "orange",
                })
                return r
            },
        },
        mounted(){
             this.loading=false
             this.ohcl.forEach(o=> {
                this.closes.push([new Date(o.date), o.close])
                this.sellingprice.push([new Date(o.date), this.ios.investment.selling_price])
                this.averageprice.push([new Date(o.date), this.ios.investment.average_price_investment])
             })
             console.log("AQUIN")
             this.ios.io.forEach(o=> {
                if (o.shares>=0){
                    this.buys.push([o.datetime,o.price])
                } else {
                    this.sells.push([o.datetime, o.price])
                }
             })

        }
    }


</script>

