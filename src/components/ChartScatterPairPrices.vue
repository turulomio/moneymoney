
<template>
    <div>
        <h1 v-if="!notitle">{{ $t("Pair price scatter chart")}}</h1>
        <v-card outlined class="ma-4 pa-4" height="500">
            <v-chart
                :option="chart_option()"
                autoresize
                :loading="loading"
            />
         </v-card>
    </div>

</template>
<script>
    export default {
        props:{
            data:{// empty_chart_scatter_pair_prices
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
                return {   
                    dataset: [
                        {
                            source: this.data.prices
                        },
                        {
                            transform: {
                                type: 'ecStat:regression',
                                // 'linear' by default.
                                //config: { method: 'linear', formulaOn: 'end'}
                            }
                        }
                    ],
                    xAxis: {
                        name:this.data.product_a.name,
                        nameLocation: 'middle',
                        nameGap: 50,
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    yAxis: {
                        name:this.data.product_b.name,
                        nameLocation: 'middle',
                        nameGap: 50,
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },

                    legend: {
                        top: 5
                    },

                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },

                    series: [
                        {
                            symbolSize: 10,
                            data: this.data.prices,
                            type: 'scatter',
                            name: this.$t('Scatter')
                        },
                        {
                            name: this.$t('Linear regression'),
                            type: 'line',
                            datasetIndex: 1,
                            symbolSize: 0.1,
                            symbol: 'circle',
                            label: { show: true, fontSize: 16 },
                            labelLayout: { dx: -20 },
                            encode: { label: 2, tooltip: 1 }
                        }
                    ]
                };
            }
        },
        created(){
            console.log(this.data)
        }
    }


</script>

