
<template>
    <div>
        <h1 v-if="!notitle">{{ $t("Pair price scatter chart")}}</h1>
        <v-card outlined class="ma-4 pa-4" height="650">
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
                    xAxis: {},
                    yAxis: {},
                    series: [
                        {
                        symbolSize: 10,
                        data: this.data.prices,
                        type: 'scatter'
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

